import * as React from "react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Alert,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { Avatar } from "react-native-paper";
import { ChevronLeft } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckAuth } from "../components/CheckAuth";

export default function Adicionar({ navigation }) {
  const [image, setImage] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const [nome, setNome] = useState(""); // Estado para armazenar o nome
  const [email, setEmail] = useState(""); // Estado para armazenar o e-mail
  const [senha, setSenha] = useState(""); // Estado para armazenar a senha

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
        setUsuario(usuarioData);
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

  const validarFormulario = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    try {
      const response = await fetch("http://192.168.15.11:8080/funcionarios", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: senha,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        Alert.alert("Sucesso", "Funcionário adicionado com sucesso!");
        setNome("");
        setEmail("");
        setSenha("");
      } else {
        Alert.alert("Erro", data.error || "Erro ao adicionar funcionário");
        console.log("Erro ao adicionar funcionário:", data.error);
      }
    } catch (error) {
      console.log("Erro durante a requisição:", error);

      Alert.alert("Erro", "Ocorreu um erro ao tentar adicionar o funcionário.");
    }
  };

  return (
    <>
      <View style={estilos.container}>
        <View style={estilos.menu}>
          <View style={estilos.cabecalho}>
            <ChevronLeft
              onPress={() => navigation.navigate("Perfil")}
              size={30}
              color="white"
            />
            <Text style={estilos.menuTexto}>Adicionar Funcionário</Text>
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

        <ScrollView contentContainerStyle={estilos.scrollContainer}>
          <View style={estilos.viewInfo}>
            <View style={estilos.viewDados}>
              <Text style={estilos.textoInfo}>Nome Completo</Text>
              <TextInput
                placeholder="Nome Completo"
                style={estilos.input}
                value={nome}
                onChangeText={(text) => setNome(text)} // Atualiza o estado do nome
              />
            </View>

            <View style={estilos.viewDados}>
              <Text style={estilos.textoInfo}>Endereço de E-mail</Text>
              <TextInput
                placeholder="E-mail"
                style={estilos.input}
                value={email}
                onChangeText={(text) => setEmail(text)} // Atualiza o estado do e-mail
              />
            </View>

            <View style={estilos.viewDados}>
              <Text style={estilos.textoInfo}>Senha</Text>
              <TextInput
                placeholder="Senha"
                style={estilos.input}
                secureTextEntry={true}
                maxLength={10}
                value={senha}
                onChangeText={(text) => setSenha(text)} // Atualiza o estado da senha
              />
            </View>

            <View style={estilos.viewDados}>
              <Pressable style={estilos.botao} onPress={validarFormulario}>
                <Text style={estilos.textoBotao}>Adicionar</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
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
    padding: 15,
    width: "100%",
    backgroundColor: "#ff7938",
    paddingBottom: "0%",
    marginBottom: "6%",
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
    padding: 16,
    backgroundColor: "#ff7938",
  },

  avatarContainer: {
    width: 150,
    height: 150,
    borderColor: "white",
    borderRadius: 85,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "5%",
    position: "relative",
  },
  avatarContainer: {
    position: "relative",
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

  botao: {
    marginTop: 16,
    backgroundColor: "#ff7938",
    padding: 9,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#e8eefc",
    width: "100%",
    elevation: 3,
  },
  textoBotao: {
    color: "white",
    fontWeight: "bold",
    paddingBottom: 12,
    fontSize: 17,
    textAlign: "center",
  },
  textoInfo: {
    color: "white",
    fontWeight: "bold",
    padding: 6,
    paddingBottom: 12,
    fontSize: 17,
  },
  viewDados: {
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    borderWidth: 1,
    padding: 8,
    borderColor: "#e8eefc",
    borderRadius: 20,
    backgroundColor: "#e8eefc",
    width: "100%",
    color: "black",
  },
  viewCriacao: {
    backgroundColor: "#ff7938",
    paddingTop: 25,
    paddingBottom: 6,
  },
  criacao: {
    color: "white",
    fontSize: 10,
    padding: 6,
  },
  linhaHorizontal: {
    height: 2,
    backgroundColor: "white",
    marginVertical: 4,
  },
  scrollContainer: {
    backgroundColor: "#f8f8f8",
  },

  avatarImage: {},
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ffff",
    borderRadius: 20,
    padding: 5,
  },
});
