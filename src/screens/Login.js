import {
  Alert,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
} from "react-native";
import axios from 'axios';
import { useState } from "react";
import backgroundImage from "../../assets/images/login.png";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");   
  const [senha, setSenha] = useState("");

  const login = async () => {
    if (!email || !senha) {
      Alert.alert("Atenção!", "Preencha e-mail e senha!");
      return;
    }

    try {
      const response = await axios.post('http://192.168.15.11:8080/login', {
        email: email,
        senha: senha,
      });

      if (response.status === 200) {
        const usuario = response.data.usuario;
        console.log('Usuário autenticado:', usuario); // Logar os dados do usuário autenticado
        await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
        navigation.navigate("Home");
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
  }

  return (
    <>
      <View style={estilos.container}>
        <Image source={backgroundImage} style={estilos.background} />
        <View style={estilos.formulario}>
          <TextInput
            onChangeText={(valor) => setEmail(valor)}
            placeholder="Email"
            style={estilos.input}
          />
          <TextInput
            onChangeText={(valor) => setSenha(valor)}
            placeholder="Senha"
            style={estilos.input}
            secureTextEntry
          />
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
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
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
});
