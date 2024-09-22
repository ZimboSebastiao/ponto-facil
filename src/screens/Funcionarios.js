import * as React from "react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  ScrollView,
  Text,
} from "react-native";
import { Avatar, Searchbar } from "react-native-paper";
import { AlignLeft, UserRound, ChevronLeft } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckAuth } from "../components/CheckAuth";

export default function Funcionarios({ navigation }) {
  const [image, setImage] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [funcionarios, setFuncionarios] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

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

  useEffect(() => {
    fetchTodosFuncionarios();
  }, []);

  // Função para buscar todos os funcionários
  const fetchTodosFuncionarios = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://192.168.15.11:8080/funcionarios/listar",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setFuncionarios(data);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar funcionários pelo nome
  const fetchFuncionariosByName = async () => {
    setLoadingSearch(true);
    try {
      const response = await fetch(
        `http://192.168.15.11:8080/funcionarios/pesquisar?nome=${searchQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setFuncionarios(data);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
    if (query.length === 0) {
      fetchTodosFuncionarios(); // Volta para a lista inicial quando o campo é limpo
    } else {
      fetchFuncionariosByName(); // Realiza a pesquisa quando há texto
    }
  };

  if (loading) {
    return (
      <View style={estilos.loadingContainer}>
        <ActivityIndicator size="large" color="#ff7938" />
      </View>
    );
  }

  const data = new Date(usuario?.data_criacao);
  const opcoes = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const dataFormatada = data.toLocaleDateString("pt-BR", opcoes);

  return (
    <>
      <View style={estilos.container}>
        <View style={estilos.menu}>
          <View style={estilos.cabecalho}>
            <ChevronLeft
              onPress={() => navigation.navigate("Perfil")}
              color="white"
              size={30}
            />
            <Text style={estilos.menuTexto}>Funcionários</Text>
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
        <View style={estilos.pesquisar}>
          <Searchbar
            placeholder="Pesquisar funcionário"
            onChangeText={handleSearchQueryChange}
            value={searchQuery}
            loading={loadingSearch}
          />
        </View>

        <View style={estilos.linhaHorizontal} />

        <ScrollView contentContainerStyle={estilos.scrollContainer}>
          <View style={estilos.viewFuncionarios}>
            {funcionarios.length > 0 ? (
              funcionarios.map((funcionario) => (
                <View style={estilos.viewFuncionario} key={funcionario.id}>
                  <Text style={estilos.textoFuncionario} key={funcionario.id}>
                    {funcionario.nome}
                  </Text>
                  <UserRound size={23} color="#ff7938" />
                </View>
              ))
            ) : (
              <Text style={estilos.naoEncontrado}>
                Nenhum funcionário foi encontrado.
              </Text>
            )}
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
    marginTop: "8%",
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
  pesquisar: {
    padding: 20,
  },
  linhaHorizontal: {
    height: 2,
    backgroundColor: "white",
    marginVertical: 4,
  },
  scrollContainer: {
    backgroundColor: "#f8f8f8",
  },
  viewFuncionarios: {
    backgroundColor: "#ff7938",
  },
  viewFuncionario: {
    margin: 16,
    backgroundColor: "#e8eefc",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    marginBottom: 15,
  },
  textoFuncionario: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#636360",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  naoEncontrado: {
    padding: 20,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});
