import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

function Logout({ navigation }) {
  useEffect(() => {
    const logout = async () => {
      try {
        await AsyncStorage.removeItem("usuario");
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("refreshToken");
        await AsyncStorage.removeItem("tokenExpiration");

        Alert.alert("Sessão Terminada", "Você foi desconectado com sucesso.");
        navigation.navigate("Login"); // Substitua "Login" pelo nome da sua tela de login
      } catch (error) {
        console.error("Erro ao realizar logout:", error);
        Alert.alert(
          "Erro",
          "Houve um erro ao realizar logout. Tente novamente."
        );
      }
    };

    logout();
  }, []);

  return null; // não renderiza nada
}

export default Logout;
