import AsyncStorage from "@react-native-async-storage/async-storage";

export const CheckAuth = async (navigation) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    navigation.navigate("Login");
  }
};
