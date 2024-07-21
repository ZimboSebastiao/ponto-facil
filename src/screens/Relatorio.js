import React, { useEffect, useState } from "react";
import {
  StatusBar,
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
import { AlignLeft, Clock, MapPinned } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

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

export default function Relatorio({ navigation }) {
  const [image, setImage] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [value, setValue] = useState("historico");
  const [histo, setHisto] = useState("sete");
  const [registros, setRegistros] = useState([]);

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
      const usuarioJSON = await AsyncStorage.getItem("usuario");
      if (usuarioJSON) {
        const usuarioData = JSON.parse(usuarioJSON);
        setUsuario(usuarioData);
      }
    };

    obterUsuario();
  }, []);

  // Buscar registros dos últimos 7 dias
  useEffect(() => {
    if (histo === "sete" && usuario) {
      const fetchRegistros = async () => {
        try {
          const data = await fetchWithToken(
            `${API_URL}/registros/ultimos-7-dias`,
            {}
          );
          setRegistros(data);
        } catch (error) {
          console.error("Erro ao buscar registros:", error.message);
        }
      };

      fetchRegistros();
    }
  }, [histo, usuario]);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "green",
      secondaryContainer: "rgba(255, 121, 56, 0.8)",
    },
  };

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

        <Text style={estilos.menuTexto}>Seus registros</Text>
        <View style={estilos.avatarContainer}>
          <Avatar.Image
            size={40}
            source={image ? { uri: image } : null}
            alt="Foto do perfil"
            style={estilos.avatarImage}
          />
        </View>
      </View>

      <PaperProvider theme={theme}>
        <SegmentedButtons
          value={value}
          onValueChange={(newValue) => setValue(newValue)}
          buttons={[
            {
              value: "historico",
              label: "Histórico",
              style: estilos.buttonStyle,
              checkedColor: "white",
              uncheckedColor: "#C8C8C8",
            },
            {
              value: "pendentes",
              label: "Pendentes",
              style: estilos.buttonStyle,
              checkedColor: "white",
              uncheckedColor: "#C8C8C8",
            },
          ]}
        />
        {value === "historico" && (
          <>
            <SegmentedButtons
              value={histo}
              onValueChange={setHisto}
              style={estilos.informacoes}
              buttons={[
                {
                  value: "sete",
                  label: "7 dias",
                  style: estilos.botoesHisto,
                  checkedColor: "white",
                  uncheckedColor: "#ff7938",
                },
                {
                  value: "quinze",
                  label: "15 dias",
                  style: estilos.botoesHisto,
                  checkedColor: "white",
                  uncheckedColor: "#ff7938",
                },
                {
                  value: "personalizado",
                  label: "Personalizado",
                  style: estilos.botoesHisto,
                  checkedColor: "white",
                  uncheckedColor: "#ff7938",
                  disabled: true,
                },
              ]}
            />
            {histo === "sete" && (
              <ScrollView style={estilos.scrollView}>
                <View style={estilos.informacoes}>
                  {registros.length > 0 ? (
                    registros.map((item) => (
                      <Card key={item.id} style={estilos.card}>
                        <Card.Content>
                          <View style={estilos.viewEntrada}>
                            <Text style={estilos.viewTipo}>
                              {item.tipo_registro}
                            </Text>
                            <Text style={estilos.viewTipo}>
                              {new Date(item.data_hora).toLocaleDateString()}
                            </Text>
                          </View>
                          <Text style={estilos.viewData}>
                            <Clock size={13} color="#818582" />{" "}
                            {new Date(item.data_hora).toLocaleTimeString(
                              "pt-BR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              }
                            )}
                          </Text>

                          <Text style={estilos.viewLoc}>
                            <MapPinned size={13} color="#818582" />{" "}
                            {item.localizacao}
                          </Text>
                        </Card.Content>
                      </Card>
                    ))
                  ) : (
                    <Text style={estilos.noDataText}>
                      Nenhum registro encontrado.
                    </Text>
                  )}
                </View>
              </ScrollView>
            )}
            {histo === "quinze" && (
              <View style={estilos.informacoes}>
                <Text>Informações dos últimos 15 dias</Text>
              </View>
            )}
            {histo === "personalizado" && (
              <View style={estilos.informacoes}>
                <Text>Informações personalizadas</Text>
              </View>
            )}
          </>
        )}

        {value === "pendentes" && (
          <View style={estilos.informacoes}>
            <Text>Informações Pendentes</Text>
          </View>
        )}
      </PaperProvider>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 10,
    padding: 30,
    width: "100%",
    backgroundColor: "#ff7938",
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
  botoesHisto: {
    borderColor: "#ff7938",
    borderBottomWidth: 3,
    marginTop: 20,
    marginBottom: 15,
  },
  card: {
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#f5f7f7",
  },
  scrollView: {
    flex: 1,
  },
  viewTipo: {
    fontSize: 15,
    color: "#ff7938",
    fontWeight: "bold",
    marginBottom: 6,
  },
  viewEntrada: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  viewData: {
    color: "#818582",
  },
  viewLoc: {
    color: "#818582",
    marginTop: 6,
  },
});
