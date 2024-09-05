import {
  Alert,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
} from "react-native";
import axios from "axios";
import { useState } from "react";
import backgroundImage from "../../assets/images/img-login.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const login = async () => {
    if (!email || !senha) {
      Alert.alert("Atenção!", "Preencha e-mail e senha!");
      return;
    }

    try {
      const response = await axios.post("http://192.168.15.11:8080/login", {
        email: email,
        senha: senha,
      });
      const { token, refreshToken, expiresIn } = response.data;

      if (response.status === 200) {
        const usuario = response.data.usuario;
        console.log("Usuário autenticado:", usuario);

        await AsyncStorage.setItem("usuario", JSON.stringify(usuario));
        await AsyncStorage.setItem("token", token);

        if (refreshToken) {
          await AsyncStorage.setItem("refreshToken", refreshToken);
        } else {
          console.warn("Refresh token não disponível.");
        }

        // Calcular a data de expiração do token
        const expirationDate = new Date();
        expirationDate.setSeconds(
          expirationDate.getSeconds() + (expiresIn || 3600)
        ); // Valor padrão de 3600 segundos se expiresIn não estiver definido
        await AsyncStorage.setItem(
          "tokenExpiration",
          expirationDate.toISOString()
        );

        console.log("Token salvo:", token);
        console.log("Refresh Token salvo:", refreshToken);
        console.log(
          "Data de expiração do token:",
          expirationDate.toISOString()
        );

        navigation.navigate("HomeScreen", { screen: "Home" });
      } else {
        Alert.alert("Ops!", "Erro ao realizar login, tente novamente.");
      }
    } catch (error) {
      console.error("Erro de login:", error);
      let mensagem;
      if (error.response && error.response.status === 401) {
        mensagem = "Credenciais inválidas!";
      } else {
        mensagem = "Houve um erro, tente mais tarde!";
      }
      Alert.alert("Ops!", mensagem);
    }
  };

  return (
    <>
      <View style={estilos.container}>
        <Image source={backgroundImage} style={estilos.background} />
        <View style={estilos.formulario}>
          <View>
            <Text style={estilos.textoInput}>Usuário</Text>
            <TextInput
              onChangeText={(valor) => setEmail(valor)}
              placeholder="E-mail"
              style={estilos.input}
            />
          </View>
          <View style={estilos.viewInputs}>
            <Text style={estilos.textoInput}>Palavra-Passe</Text>
            <TextInput
              onChangeText={(valor) => setSenha(valor)}
              placeholder="Senha"
              style={estilos.input}
              secureTextEntry
              returnKeyType="send"
              onSubmitEditing={login}
            />
          </View>
          <View>
            <Pressable style={estilos.botaoRecuperar}>
              <Text style={estilos.textoBotaoRecuperar}></Text>
            </Pressable>
            <Pressable style={estilos.botoes} onPress={login}>
              <Text style={estilos.textoBotao}>Entrar</Text>
            </Pressable>
          </View>
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
  background: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: "auto",
    height: "20%",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  formulario: {
    padding: 23,
    marginTop: 90,
  },
  input: {
    borderWidth: 1,
    padding: 15,
    borderColor: "white",
    borderRadius: 10,
    marginVertical: 20,
    backgroundColor: "white",
  },
  botoes: {
    borderWidth: 2,
    padding: 15,
    borderColor: "white",
    borderRadius: 10,
    marginVertical: 20,
    backgroundColor: "#ff7938",
    alignItems: "center",
    elevation: 10,
  },
  botaoRecuperar: {
    padding: 0,
    marginVertical: 55,
    alignItems: "flex-end",
  },
  textoBotao: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  textoBotaoRecuperar: {
    fontSize: 15,
    fontWeight: "bold",
    color: "grey",
  },
  textoBotaoLogin: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#207FDE",
  },
  viewInputs: {
    paddingTop: 15,
  },
  textoInput: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    padding: 4,
  },
});
