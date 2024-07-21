import * as React from "react";
import { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import {
  Avatar,
  SegmentedButtons,
  Provider as PaperProvider,
  DefaultTheme,
  Card,
  Text,
} from "react-native-paper";
import { AlignLeft } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Relatorio({ navigation }) {
  const [image, setImage] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [value, setValue] = useState("historico");
  const [histo, setHisto] = useState("sete");

  const pickImage = async () => {
    console.log("Selecionando imagem...");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Resultado:", result);

    if (
      !result.cancelled &&
      result.assets &&
      result.assets.length > 0 &&
      result.assets[0].uri
    ) {
      console.log("Imagem selecionada:", result.assets[0].uri);
      setImage(result.assets[0].uri);
      // Armazena a URI da imagem selecionada no AsyncStorage
      try {
        await AsyncStorage.setItem("profileImageUri", result.assets[0].uri);
      } catch (error) {
        console.log("Erro ao salvar a URI da imagem no AsyncStorage:", error);
      }
    } else {
      console.log("URI da imagem é inválida.");
    }
  };

  // funçao para seleção de imagem
  useEffect(() => {
    const loadProfileImageUri = async () => {
      try {
        const uri = await AsyncStorage.getItem("profileImageUri");
        if (uri !== null) {
          setImage(uri);
        }
      } catch (error) {
        console.log("Erro ao carregar a URI da imagem do AsyncStorage:", error);
      }
    };

    loadProfileImageUri();
  }, []);

  // função ObterUsuario
  useEffect(() => {
    const obterUsuario = async () => {
      const usuarioJSON = await AsyncStorage.getItem("usuario");
      if (usuarioJSON) {
        const usuarioData = JSON.parse(usuarioJSON);
        console.log("Dados do usuário recuperados:", usuarioData); // Logar os dados do usuário recuperados
        setUsuario(usuarioData);
      } else {
        console.log("Nenhum dado de usuário encontrado no AsyncStorage");
      }
    };

    obterUsuario();
  }, []);

  //   console.log(usuario);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "green",
      secondaryContainer: "rgba(255, 121, 56, 0.8)",
    },
  };

  return (
    <>
      <SafeAreaView style={estilos.container}>
        <View style={estilos.menu}>
          <AlignLeft
            onPress={() => navigation.openDrawer()}
            m="$3"
            w="$10"
            h="$6"
            color="white"
          />

          <Text style={estilos.menuTexto}>Seus registros</Text>
          <View style={estilos.avatarContainer}>
            <Avatar.Image
              size={40}
              source={image ? { uri: image } : null}
              alt="Foto do perfil"
              style={estilos.avatarImage}
            />
          </View>
        </View>

        <PaperProvider theme={theme}>
          <SegmentedButtons
            value={value}
            onValueChange={(newValue) => setValue(newValue)}
            buttons={[
              {
                value: "historico",
                label: "Histórico",
                style: estilos.buttonStyle,
                checkedColor: "white",
                uncheckedColor: "#C8C8C8",
              },
              {
                value: "pendentes",
                label: "Pendentes",
                style: estilos.buttonStyle,
                checkedColor: "white",
                uncheckedColor: "#C8C8C8",
              },
            ]}
          />

          {/* BOTÃO HISTÓRICO -> Renderiza informações diferentes com base na seleção do botão */}
          {value === "historico" && (
            <View style={estilos.informacoes}>
              <SafeAreaView>
                <SegmentedButtons
                  value={histo}
                  onValueChange={setHisto}
                  buttons={[
                    {
                      value: "sete",
                      label: "7 dias",
                      style: estilos.botoesHisto,
                      checkedColor: "white",
                      uncheckedColor: "#ff7938",
                    },
                    {
                      value: "quinze",
                      label: "15 dias",
                      style: estilos.botoesHisto,
                      checkedColor: "white",
                      uncheckedColor: "#ff7938",
                    },
                    {
                      value: "personalizado",
                      label: "Personalizado",
                      style: estilos.botoesHisto,
                      checkedColor: "white",
                      uncheckedColor: "#ff7938",
                      disabled: true,
                    },
                  ]}
                />
                {histo === "sete" && (
                  <View style={estilos.informacoes}>
                    <Text
                      style={{ color: "#6f7571", fontSize: 18, padding: 6 }}
                    >
                      Hoje
                    </Text>
                    <Card>
                      <Card.Content>
                        <Text variant="titleLarge">Card title</Text>
                        <Text variant="bodyMedium">Card content</Text>
                      </Card.Content>
                    </Card>
                  </View>
                )}
                {histo === "quinze" && (
                  <View style={estilos.informacoes}>
                    <Text>Informações dos últimos 15 dias</Text>
                  </View>
                )}
                {histo === "personalizado" && (
                  <View style={estilos.informacoes}>
                    <Text>Informações personalizadas</Text>
                  </View>
                )}
              </SafeAreaView>
            </View>
          )}

          {/* BOTÃO PENDENTES -> Renderiza informações diferentes com base na seleção do botão */}
          {value === "pendentes" && (
            <View style={estilos.informacoes}>
              <Text>Informações Pendentes</Text>
              {/* Coloque aqui os dados específicos dos pendentes */}
            </View>
          )}
        </PaperProvider>
      </SafeAreaView>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 10,
    padding: 30,
    width: "100%",
    backgroundColor: "#ff7938",
  },
  menuTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  buttonStyle: {
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "white",
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 65,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  informacoes: {
    padding: 15,
  },
  botoesHisto: {
    borderWidth: 1,
    borderColor: "#ff7938",
    borderBottomWidth: 3,
  },
});
