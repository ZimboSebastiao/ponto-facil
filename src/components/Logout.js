import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Logout({ navigation }) {
  useEffect(() => {
    const logout = async () => {
      try {
        await AsyncStorage.removeItem('usuario');
        navigation.navigate("Login");
        // navigation.navigate('AuthStack', { screen: 'Login' });
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
      }
    };

    logout();
  }, []);

  return null; // não renderiza nada
}

export default Logout;
