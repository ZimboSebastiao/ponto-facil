import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Logout({ navigation }) {
  useEffect(() => {
    const logout = async () => {
      try {
        await AsyncStorage.removeItem('usuario');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
      }
    };

    logout();
  }, [navigation]);

  return null; // não renderiza nada
}

export default Logout;
