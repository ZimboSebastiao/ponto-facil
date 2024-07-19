import './gesture-handler';
import { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/screens/Login";
import Home from "./src/screens/Home";
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import {
  FileText,
  LogOut,
  Settings,
  Clock,
  CircleX,
  House,
  UserRound,
} from "lucide-react-native";
import Perfil from './src/screens/Perfil';
import UsuarioAvatar from './src/screens/UsuarioAvatar';
import Relatorio from './src/screens/Relatorio';
import Logout from './src/components/Logout';

const Drawer = createDrawerNavigator();
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
     <UsuarioAvatar />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: "#1D1D1D" },
            headerTintColor: "white",
          }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >

          <Drawer.Screen
            name="Home"
            component={Home}
            options={{
            headerShown: false,
            drawerIcon: () => (
            <House  color="#ff7938" m="$0" w="$8" h="$6" />
              ),
              }}
          />  
          <Drawer.Screen
            name="Relatório"
            component={Relatorio}
            options={{
            headerShown: false,
            drawerIcon: () => (
            <FileText  color="#ff7938" m="$0" w="$8" h="$6" />
              ),
              }}
          />  
            <Drawer.Screen
              name="Perfil"
              component={Perfil}
              options={{
                headerShown: false,
                drawerIcon: () => (
                  <UserRound color="#ff7938" m="$0" w="$8" h="$6" />
                    ),
              }}
            />
            <Drawer.Screen
              name="Sair"
              component={Logout}
              options={{
                headerShown: false,
              }}
            />
            <Drawer.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: false,
              }}
            />

    </Drawer.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
