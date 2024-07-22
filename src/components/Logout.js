import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const Logout = ({ navigation }) => {
  useEffect(() => {
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
        Alert.alert(
          "Erro",
          "Houve um erro ao realizar logout. Tente novamente."
        );
      }
    };

    logout();
  }, [navigation]);

  return null; // não renderiza nada
};

export default Logout;
