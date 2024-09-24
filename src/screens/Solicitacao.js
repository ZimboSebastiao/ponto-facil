import * as React from "react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { Avatar, List } from "react-native-paper";
import {
  AlignLeft,
  UserPlus,
  UserMinus,
  ChevronRight,
  Users,
  User,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckAuth } from "../components/CheckAuth";

export default function Solicitacao({ navigation }) {
  const [image, setImage] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const pickImage = async () => {
    console.log("Selecionando imagem...");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Resultado:", result);

    if (
      !result.cancelled &&
      result.assets &&
      result.assets.length > 0 &&
      result.assets[0].uri
    ) {
      console.log("Imagem selecionada:", result.assets[0].uri);
      setImage(result.assets[0].uri);
      // Armazena a URI da imagem selecionada no AsyncStorage
      try {
        await AsyncStorage.setItem("profileImageUri", result.assets[0].uri);
      } catch (error) {
        console.log("Erro ao salvar a URI da imagem no AsyncStorage:", error);
      }
    } else {
      console.log("URI da imagem é inválida.");
    }
  };

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

  useEffect(() => {
    const obterUsuario = async () => {
      setLoading(true);
      const usuarioJSON = await AsyncStorage.getItem("usuario");
      if (usuarioJSON) {
        const usuarioData = JSON.parse(usuarioJSON);
        console.log("Dados do usuário recuperados:", usuarioData); // Logar os dados do usuário recuperados
        setUsuario(usuarioData);
      } else {
        console.log("Nenhum dado de usuário encontrado no AsyncStorage");
      }
      setLoading(false);
    };

    obterUsuario();
  }, []);

  if (loading) {
    return (
      <View style={estilos.loadingContainer}>
        <ActivityIndicator size="large" color="#ff7938" />
      </View>
    );
  }

  return (
    <>
      <View style={estilos.container}>
        <View style={estilos.menu}>
          <View style={estilos.cabecalho}>
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
        </View>

        <View style={estilos.viewDados}>
          <ScrollView
            contentContainerStyle={estilos.scrollContainer}
          ></ScrollView>
        </View>
      </View>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff7938",
  },
  menu: {
    marginRight: 10,
    padding: 25,
    width: "100%",
    backgroundColor: "#ff7938",
    paddingBottom: "0%",
    marginBottom: "0%",
    marginTop: "4%",
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    margin: 0,
  },
  menuTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  imagem: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  texto: {
    fontWeight: "bold",
    fontSize: 16,
  },

  viewInfo: {
    alignItems: "flex-start",

    borderRadius: 10,
    padding: 6,
    marginBottom: "5%",
  },

  avatarContainer: {
    width: 130,
    height: 130,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 85, // metade do tamanho da view para garantir que a borda seja redonda
    overflow: "hidden", // garantir que o conteúdo da view se ajuste dentro da borda arredondada
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "5%",
  },
  avatarImage: {
    borderRadius: 47, // metade do tamanho da imagem
  },
  avatarPerfil: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 65,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  botao: {
    marginTop: 16,
    backgroundColor: "#ff7938",
    padding: 10,
    borderRadius: 20,
    borderWidth: 0.8,
    borderColor: "white",
    width: "45%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  textoEditar: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewDados: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "#f8f8f8",
    margin: "0%",
    padding: "0%",
  },
  lista: {
    borderBottomWidth: 1,
    borderColor: "#c2bbba",
    backgroundColor: "#f8f8f8",
  },

  infoPessoais: {
    margin: "0%",
    padding: "0%",
    paddingLeft: 0,
    paddingRight: 0,
  },

  seccao: {
    flexDirection: "row",

    justifyContent: "space-between",
  },

  input: {
    borderWidth: 1,
    padding: 8,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    width: "70%",
  },
  botoes: {
    width: "70%",
    padding: 8,
    borderRadius: 8,
    marginVertical: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
  },
  textoBotao: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  viewInputs: {
    width: "100%",
    alignContent: "flex-start",
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  listItem: {
    margin: "0%",
    padding: "0%",
    paddingLeft: 0,
    paddingRight: 0,
  },
  scrollContainer: {
    backgroundColor: "#f8f8f8",
  },
  viewOpcoes: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botaoOpcoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "91%",
  },
  linhahorizontal: {
    margin: 11,
    height: 0.7,
    backgroundColor: "gray",
    marginVertical: 6,
  },
});
