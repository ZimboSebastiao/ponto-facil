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
  House 
} from "lucide-react-native";
import Relatorio from './src/screens/Relatorio';
import UsuarioAvatar from './src/screens/UsuarioAvatar';

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
            <House  color="#828282" m="$0" w="$8" h="$6" />
              ),
              }}
          />  
            <Drawer.Screen
              name="Relátorios"
              component={Relatorio}
              options={{
                headerShown: false,
                drawerIcon: () => (
                  <FileText color="#828282" m="$0" w="$8" h="$6" />
                    ),
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
