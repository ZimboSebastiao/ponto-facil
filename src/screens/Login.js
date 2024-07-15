import {
  Alert,
  Button,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Text,
} from "react-native";
import backgroundImage from "../../assets/images/login.png";
import { Image } from "react-native";

// Importando os recursos de autenticação
import axios from 'axios';


import { useState } from "react";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const login = async () => {
    if (!email || !senha) {
      Alert.alert("Atenção!", "Preencha e-mail e senha!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/usuarios', {
        email: email,
        senha: senha,
      });

      if (response.status === 200) {
        navigation.navigate("Pontos");
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
        <View style={estilos.estiloImagem}>
          <Image source={backgroundImage} style={{ ...estilos.background }} />
        </View>
        <View style={estilos.formulario}>
          <TextInput
            onChangeText={(valor) => setEmail(valor)}
            placeholder="Nº de Utilizador"
            style={estilos.input}
          />
          <TextInput
            onChangeText={(valor) => setSenha(valor)}
            placeholder="Senha"
            style={estilos.input}
            secureTextEntry
          />
          <View>
            <Pressable style={estilos.botaoRecuperar} >
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
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  formulario: {
    padding: 23,
    paddingTop: 70,
    backgroundColor: "#ff7938",
  
    
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
    borderWidth: 1,
    padding: 15,
    borderColor: "white",
    borderRadius: 10,
    marginVertical: 20,
    backgroundColor: "white",
    alignItems: "center",
  },
  botaoRecuperar: {
    padding: 0,
    marginVertical: 4,
    alignItems: "flex-end",
  },
  textoBotao: {
    fontSize: 19,
    fontWeight: "bold",
    color: "black",
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
});
