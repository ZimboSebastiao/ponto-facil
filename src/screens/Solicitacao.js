import React, { useEffect, useState } from "react";
import { PieChart, ProgressChart } from "react-native-chart-kit";
import { Dimensions, Pressable } from "react-native";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  Avatar,
  SegmentedButtons,
  Provider as PaperProvider,
  DefaultTheme,
  Card,
  Text,
} from "react-native-paper";
import { AlignLeft, Clock } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CheckAuth } from "../components/CheckAuth";

const API_URL = "http://192.168.15.11:8080";

const getToken = async () => {
  const token = await AsyncStorage.getItem("token");
  const tokenExpiration = await AsyncStorage.getItem("tokenExpiration");
  const now = new Date();

  if (token && tokenExpiration && new Date(tokenExpiration) > now) {
    return token;
  } else {
    // Token expired or not present, handle refresh or redirect to login
    return null;
  }
};

const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available.");
    }

    const response = await axios.post(`${API_URL}/refresh-token`, {
      refreshToken,
    });
    const { token, expiresIn } = response.data;

    await AsyncStorage.setItem("token", token);
    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
    await AsyncStorage.setItem("tokenExpiration", expirationDate.toISOString());

    return token;
  } catch (error) {
    console.error("Erro ao atualizar o token:", error);
    // Redirecionar para a tela de login ou tratar a falha
    return null;
  }
};

const verifyStoredTokens = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    const tokenExpiration = await AsyncStorage.getItem("tokenExpiration");

    console.log("Token:", token);
    console.log("Refresh Token:", refreshToken);
    console.log("Token Expiration:", tokenExpiration);
  } catch (error) {
    console.error("Erro ao verificar tokens armazenados:", error);
  }
};

verifyStoredTokens();

const fetchWithToken = async (url, config) => {
  let token = await getToken();
  if (!token) {
    token = await refreshToken();
    if (!token) {
      // Redirecionar para a tela de login ou tratar a falha
      throw new Error("Não foi possível obter um token válido.");
    }
  }

  const response = await axios.get(url, {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export default function Solicitacao({ navigation }) {
  const [image, setImage] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [value, setValue] = useState("pendentes");
  const [loading, setLoading] = useState(true);

  // Função para selecionar a imagem
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (
      !result.cancelled &&
      result.assets &&
      result.assets.length > 0 &&
      result.assets[0].uri
    ) {
      setImage(result.assets[0].uri);
      try {
        await AsyncStorage.setItem("profileImageUri", result.assets[0].uri);
      } catch (error) {
        console.log("Erro ao salvar a URI da imagem no AsyncStorage:", error);
      }
    }
  };

  // Carregar a URI da imagem do perfil
  useEffect(() => {
    CheckAuth(navigation);

    const loadProfileImageUri = async () => {
      try {
        const uri = await AsyncStorage.getItem("profileImageUri");
        if (uri !== null) {
          setImage(uri);
        }
      } catch (error) {
        console.log("Erro ao carregar a URI da imagem do AsyncStorage:", error);
      }
    };

    loadProfileImageUri();
  }, []);

  // Obter dados do usuário
  useEffect(() => {
    const obterUsuario = async () => {
      setLoading(true);
      const usuarioJSON = await AsyncStorage.getItem("usuario");
      if (usuarioJSON) {
        const usuarioData = JSON.parse(usuarioJSON);
        console.log("Dados do usuário recuperados:", usuarioData);
        setUsuario(usuarioData);
      }
      setLoading(false);
    };

    obterUsuario();
  }, []);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "green",
      secondaryContainer: "rgba(255, 121, 56, 0.8)",
    },
  };

  if (loading) {
    return (
      <View style={estilos.loadingContainer}>
        <ActivityIndicator size="large" color="#ff7938" />
      </View>
    );
  }

  return (
    <SafeAreaView style={estilos.container}>
      <View style={estilos.menu}>
        <AlignLeft
          onPress={() => navigation.openDrawer()}
          m="$3"
          w="$10"
          h="$6"
          color="white"
        />

        <Text style={estilos.menuTexto}>Solicitações de Ajustes</Text>
        <View style={estilos.avatarPerfil}>
          {image ? (
            <Avatar.Image
              size={40}
              source={image ? { uri: image } : null}
              alt="Foto do perfil"
              style={estilos.avatarImage}
            />
          ) : (
            <Avatar.Image
              size={40}
              source={require("./../../assets/images/perfil.jpg")}
              alt="Foto do perfil padrão"
            />
          )}
        </View>
      </View>

      <PaperProvider theme={theme}>
        <SegmentedButtons
          value={value}
          onValueChange={(newValue) => setValue(newValue)}
          buttons={[
            {
              value: "pendentes",
              label: "Pendentes",
              style: estilos.buttonStyle,
              checkedColor: "white",
              uncheckedColor: "#C8C8C8",
            },
            {
              value: "aprovados",
              label: "Aprovados",
              style: estilos.buttonStyle,
              checkedColor: "white",
              uncheckedColor: "#C8C8C8",
            },
          ]}
        />
        {value === "pendentes" && (
          <ScrollView style={estilos.scrollView}>
            <View style={estilos.informacoes}>
              <View style={estilos.viewSolicitacao}>
                <Pressable style={estilos.botaoSolicitacao}>
                  <Clock color="#ffff" />
                  <Text style={estilos.textoSolicitacao}>Nova Solicitação</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        )}

        {value === "aprovados" && (
          <ScrollView style={estilos.scrollView}>
            <View style={estilos.informacoes}>
              <Text>Teste</Text>
            </View>
          </ScrollView>
        )}
      </PaperProvider>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  menu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 10,
    padding: 30,
    width: "100%",
    backgroundColor: "#ff7938",
    marginTop: "4%",
  },
  menuTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  buttonStyle: {
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "white",
    paddingBottom: 7,
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 65,
    overflow: "hidden",
    alignItems: "center",
  },
  avatarImage: {
    borderWidth: 1,
    borderColor: "white",
  },
  informacoes: {
    padding: 13,
  },

  scrollView: {
    flex: 1,
  },
  viewSolicitacao: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  botaoSolicitacao: {
    backgroundColor: "#ff7938",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "50%",
    borderRadius: 8,
  },
  textoSolicitacao: {
    color: "#ffff",
    fontSize: 15,
  },
});
