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
} from "react-native";
import { Avatar, List, Button, MD3Colors } from "react-native-paper";
import {
  AlignLeft,
  User,
  UserPlus,
  UserCog,
  LogOut,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckAuth } from "../components/CheckAuth";

export default function Perfil({ navigation }) {
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

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "usuario",
        "token",
        "refreshToken",
        "tokenExpiration",
      ]);

      Alert.alert("Sessão Terminada", "Você foi desconectado com sucesso.", [
        {
          text: "OK",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
      Alert.alert("Erro", "Houve um erro ao realizar logout. Tente novamente.");
    }
  };

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
            <Text style={estilos.menuTexto}>Perfil do Usuário</Text>
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
            <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>
              {usuario ? usuario.nome : "Visitante"}
            </Text>

            <Text style={{ color: "white", fontSize: 14, marginTop: 4 }}>
              {usuario ? usuario.tipo : "Desconhecido"}
            </Text>
            <Text style={{ color: "white", fontSize: 15, marginTop: 4 }}>
              {usuario ? usuario.funcao : "Desconhecido"}
            </Text>
          </View>
        </View>

        <View style={estilos.viewDados}>
          <ScrollView contentContainerStyle={estilos.scrollContainer}>
            <View>
              <List.AccordionGroup>
                <List.Accordion
                  title="Informações Pessoais"
                  id="1"
                  style={estilos.lista}
                  left={(props) => <User {...props} />}
                >
                  <List.Section style={estilos.infoPessoais}>
                    <List.Section style={estilos.viewInputs}>
                      <List.Section>
                        <List.Item
                          title="Nome Completo"
                          style={estilos.label}
                        />
                        <List.Item
                          value={usuario.nome}
                          title={usuario.nome}
                          style={estilos.input}
                        />
                      </List.Section>

                      <List.Section>
                        <List.Item
                          title="Data Nascimento"
                          style={estilos.label}
                        />
                        <List.Item
                          value={usuario.data_nascimento}
                          title={usuario.data_nascimento}
                          style={estilos.input}
                        />
                      </List.Section>
                    </List.Section>

                    <List.Section style={estilos.viewInputs}>
                      <List.Section>
                        <List.Item
                          title="Nacionalidade"
                          style={estilos.label}
                        />
                        <List.Item
                          value={usuario.nacionalidade}
                          title={usuario.nacionalidade}
                        />
                      </List.Section>

                      <List.Section>
                        <List.Item title="Celular" style={estilos.label} />
                        <List.Item
                          value={usuario.celular}
                          title={usuario.celular}
                        />
                      </List.Section>
                    </List.Section>

                    <List.Section style={estilos.viewInputs}>
                      <List.Section>
                        <List.Item title="Empresa" style={estilos.label} />
                        <List.Item
                          value={usuario.empresa}
                          title={usuario.empresa}
                        />
                      </List.Section>

                      <List.Section>
                        <List.Item title="Cargo" style={estilos.label} />
                        <List.Item
                          value={usuario.funcao}
                          title={usuario.funcao}
                        />
                      </List.Section>
                    </List.Section>
                  </List.Section>
                </List.Accordion>
                <List.Accordion
                  title="Adicionar Usuário"
                  id="2"
                  left={(props) => <UserPlus {...props} />}
                  style={estilos.lista}
                >
                  <List.Item
                    title={usuario.nome}
                    value={usuario.nome}
                    style={estilos.listItem}
                  />
                </List.Accordion>
                <View>
                  <List.Accordion
                    title="Gestão de Usuários"
                    id="3"
                    style={estilos.lista}
                    left={(props) => <UserCog {...props} />}
                  >
                    <List.Item title="Item 3"></List.Item>
                  </List.Accordion>
                </View>
              </List.AccordionGroup>
            </View>

            <View style={estilos.viewInfo}>
              <Button
                icon={() => <LogOut color="#d95148" />}
                mode="text"
                onPress={logout}
                labelStyle={{ color: "#d95148", fontSize: 17 }}
              >
                LogOut
              </Button>
              {/* <Text style={{ color: "black", fontSize: 17 }}>
              {" "}
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Data de Cadastro:{" "}
              </Text>{" "}
              {usuario
                ? new Date(usuario.data_criacao).toLocaleDateString()
                : "Data Indisponível"}
            </Text> */}
            </View>
          </ScrollView>
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
    width: 150,
    height: 150,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewDados: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "#f8f8f8",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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

  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "black",
  },
  viewInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignContent: "flex-start",
    borderWidth: 1,
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});
