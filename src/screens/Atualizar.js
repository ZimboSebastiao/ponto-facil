import * as React from "react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { Avatar, List } from "react-native-paper";
import {
  AlignLeft,
  User,
  UserPlus,
  UserCog,
  UserMinus,
  UserRoundPen,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckAuth } from "../components/CheckAuth";

export default function Atualizar({ navigation }) {
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

  const data = new Date(usuario.data_criacao);
  // Opções para formatar a data
  const opcoes = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  // Formata a data
  const dataFormatada = data.toLocaleDateString("pt-BR", opcoes);

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
            <Text style={estilos.menuTexto}>Editar Perfil</Text>
            <View style={estilos.avatarPerfil}>
              <Avatar.Image
                size={40}
                source={image ? { uri: image } : null}
                alt="Foto do perfil"
                style={estilos.avatarImage}
              />
            </View>
          </View>

          <View style={estilos.imagem}>
            <TouchableOpacity onPress={pickImage}>
              <View style={estilos.avatarContainer}>
                {image ? (
                  <Avatar.Image
                    size={150}
                    source={{ uri: image }}
                    alt="Foto do perfil"
                  />
                ) : (
                  <Avatar.Image
                    source={require("./../../assets/images/icon.png")}
                    alt="Foto do perfil padrão"
                    style={estilos.avatarImage}
                  />
                )}
              </View>
            </TouchableOpacity>
            <Text style={{ color: "white", fontSize: 16 }}>
              @{usuario ? usuario.tipo : "Desconhecido"}
            </Text>
          </View>
        </View>

        <View style={estilos.linhaHorizontal} />

        <ScrollView contentContainerStyle={estilos.scrollContainer}>
          <View style={estilos.viewInfo}>
            <View style={estilos.viewDados}>
              <Text style={estilos.textoInfo}>Nome Completo</Text>
              <TextInput style={estilos.input} value={usuario.nome} />
            </View>

            <View style={estilos.viewDados}>
              <Text style={estilos.textoInfo}>Endereço de E-mail</Text>
              <TextInput style={estilos.input} value={usuario.email} />
            </View>

            <View style={estilos.viewDados}>
              <Text style={estilos.textoInfo}>Celular</Text>
              <TextInput style={estilos.input} value={usuario.celular} />
            </View>

            <View style={estilos.viewDados}>
              <Text style={estilos.textoInfo}>Senha</Text>
              <TextInput
                style={estilos.input}
                value={usuario.senha}
                secureTextEntry={true}
                maxLength={15}
              />
            </View>

            <View style={estilos.viewDados}>
              <Text style={estilos.textoInfo}>Data de Nascimento</Text>
              <TextInput
                style={estilos.input}
                value={usuario.data_nascimento}
              />
            </View>

            <View style={estilos.viewDados}>
              <Text style={estilos.textoInfo}>Nacionalidade</Text>
              <TextInput style={estilos.input} value={usuario.nacionalidade} />
            </View>

            <View style={estilos.viewDados}>
              <Text style={estilos.textoInfo}>Empresa</Text>
              <TextInput
                style={estilos.input}
                value={usuario.empresa}
                editable={false}
              />
            </View>

            <View style={estilos.viewDados}>
              <Text style={estilos.textoInfo}>Cargo</Text>
              <TextInput
                style={estilos.input}
                value={usuario.funcao}
                editable={false}
              />
            </View>

            <View style={estilos.viewDados}>
              <Pressable style={estilos.botao}>
                <Text style={estilos.textoBotao}>Atualizar</Text>
              </Pressable>
            </View>
          </View>

          <View style={estilos.viewCriacao}>
            <Text style={estilos.criacao}>Ingressou {dataFormatada}</Text>
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
    padding: 25,
    width: "100%",
    backgroundColor: "#ff7938",
    paddingBottom: "0%",
    marginBottom: "6%",
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
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 85,
    overflow: "hidden",
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
});
