import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import Login from "./src/screens/Login";
import Home from "./src/screens/Home";
import Perfil from "./src/screens/Perfil";
import UsuarioAvatar from "./src/screens/UsuarioAvatar";
import Relatorio from "./src/screens/Relatorio";
import Atualizar from "./src/screens/Atualizar";
import Logout from "./src/components/Logout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CircleFadingPlus,
  FileClock,
  LogOut,
  House,
  UserRound,
  GitPullRequest,
  Bell,
  HelpCircle,
} from "lucide-react-native";
import Funcionarios from "./src/screens/Funcionarios";
import Adicionar from "./src/screens/Adicionar";
import Deletar from "./src/screens/Deletar";
import Dados from "./src/screens/Dados";
import Solicitacao from "./src/screens/Solicitacao";
import Atividade from "./src/screens/Atividade";
import Duvidas from "./src/screens/Duvidas";
import Notificacao from "./src/screens/Notificacao";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <UsuarioAvatar />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function HomeScreen() {
  return (
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
          drawerIcon: () => <House color="#ff7938" m="$0" w="$8" h="$6" />,
        }}
      />
      <Drawer.Screen
        name="Pontos Registrados"
        component={Relatorio}
        options={{
          headerShown: false,
          drawerIcon: () => <FileClock color="#ff7938" m="$0" w="$8" h="$6" />,
        }}
      />
      <Drawer.Screen
        name="Notificações"
        component={Notificacao}
        options={{
          headerShown: false,
          drawerIcon: () => <Bell color="#ff7938" m="$0" w="$8" h="$6" />,
        }}
      />
      <Drawer.Screen
        name="Solicitações"
        component={Solicitacao}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <GitPullRequest color="#ff7938" m="$0" w="$8" h="$6" />
          ),
        }}
      />
      <Drawer.Screen
        name="Atividades"
        component={Atividade}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <CircleFadingPlus color="#ff7938" m="$0" w="$8" h="$6" />
          ),
        }}
      />
      <Drawer.Screen
        name="Dúvidas Frequentes"
        component={Duvidas}
        options={{
          headerShown: false,
          drawerIcon: () => <HelpCircle color="#ff7938" m="$0" w="$8" h="$6" />,
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={Perfil}
        options={{
          headerShown: false,
          drawerIcon: () => <UserRound color="#ff7938" m="$0" w="$8" h="$6" />,
        }}
      />

      <Drawer.Screen
        name="Atualizar"
        component={Atualizar}
        options={{
          headerShown: false,
          drawerIcon: () => <UserRound color="#ff7938" m="$0" w="$8" h="$6" />,
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="Funcionarios"
        component={Funcionarios}
        options={{
          headerShown: false,
          drawerIcon: () => <UserRound color="#ff7938" m="$0" w="$8" h="$6" />,
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="Adicionar"
        component={Adicionar}
        options={{
          headerShown: false,
          drawerIcon: () => <UserRound color="#ff7938" m="$0" w="$8" h="$6" />,
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="Deletar"
        component={Deletar}
        options={{
          headerShown: false,
          drawerIcon: () => <UserRound color="#ff7938" m="$0" w="$8" h="$6" />,
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="Dados"
        component={Dados}
        options={{
          headerShown: false,
          drawerIcon: () => <UserRound color="#ff7938" m="$0" w="$8" h="$6" />,
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name="Sair"
        component={Logout}
        options={{
          headerShown: false,
          drawerIcon: () => <LogOut color="#ff7938" m="$0" w="$8" h="$6" />,
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: "#1D1D1D" },
          headerTintColor: "white",
        }}
      >
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#ffff",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveTab: {},
});
