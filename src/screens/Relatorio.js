import * as React from "react";
import { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View, TouchableOpacity, Text, SafeAreaView  } from "react-native";
import { Avatar, SegmentedButtons, Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { AlignLeft } from "lucide-react-native";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';





export default function Relatorio({ navigation }) {
  const [image, setImage] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [value, setValue] = React.useState('');

  const pickImage = async () => {
    console.log("Selecionando imagem...");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    console.log("Resultado:", result);
  
    if (!result.cancelled && result.assets && result.assets.length > 0 && result.assets[0].uri) {
      console.log("Imagem selecionada:", result.assets[0].uri);
      setImage(result.assets[0].uri);
      // Armazena a URI da imagem selecionada no AsyncStorage
      try {
        await AsyncStorage.setItem('profileImageUri', result.assets[0].uri);
      } catch (error) {
        console.log('Erro ao salvar a URI da imagem no AsyncStorage:', error);
      }
    } else {
      console.log("URI da imagem é inválida.");
    }
    
    
  };
  
  useEffect(() => {
    const loadProfileImageUri = async () => {
      try {
        const uri = await AsyncStorage.getItem('profileImageUri');
        if (uri !== null) {
          setImage(uri);
        }
      } catch (error) {
        console.log('Erro ao carregar a URI da imagem do AsyncStorage:', error);
      }
    };
  
    loadProfileImageUri();
  }, []);
  
  // função ObterUsuario
  useEffect(() => {
    const obterUsuario = async () => {
      const usuarioJSON = await AsyncStorage.getItem('usuario');
      if (usuarioJSON) {
        const usuarioData = JSON.parse(usuarioJSON);
        console.log('Dados do usuário recuperados:', usuarioData); // Logar os dados do usuário recuperados
        setUsuario(usuarioData);
      } else {
        console.log('Nenhum dado de usuário encontrado no AsyncStorage');
      }
    };
  
    obterUsuario();
  }, []);
  
//   console.log(usuario);

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'green',  
    secondaryContainer: 'rgba(255, 121, 56, 0.8)', 
  },
};
  
  return (
    <>
      <SafeAreaView style={estilos.container}>

        <View >
          <View style={estilos.menu}>
            <AlignLeft
              onPress={() => navigation.openDrawer()}
              m="$3"
              w="$10"
              h="$6"
              color="white"
            />
            <Text style={estilos.menuTexto}>Seus registros</Text>
              <Avatar.Image size={40} source={image ? { uri: image } : null} alt="Foto do perfil" />
            
          </View>


        </View>
        <PaperProvider theme={theme}>
        <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 'walk',
            label: 'Histórico',
            style: estilos.buttonStyle,
            checkedColor: 'white'
          },
          {
            value: 'train',
            label: 'Pendentes',
            style: estilos.buttonStyle,
            checkedColor: 'white'
          },
         
        ]}
      />
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


  imagem: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  selecao: {
    justifyContent: "center",
    width: "85%",
    borderColor: "#ff7938",
    marginBottom: 30,
  },
  selecaoEspaco: {
    justifyContent: "center",
    alignItems: "center",
  },
  viewCard: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "6%",
  },
  cardColor: {
    backgroundColor: "#f2f9ff",
  },
  texto: {
    fontWeight: "bold",
    fontSize: 16,
  },
  viewInfoHora: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  viewPeriodo: {
    width: "90%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  viewPeriodoBotao: {
    width: "84%",
    marginBottom: "6%",
    borderRadius: 40,
    backgroundColor: "#ff7938",
    borderColor: "#ff7938",
    borderWidth: 1,
  },
  viewInfo: {
    alignItems: "center",
    marginTop: 10,
  },
  avatarContainer: {
    width: 190,
    height: 190,
    borderWidth: 5,
    borderColor: '#ff7938',
    borderRadius: 95, // metade do tamanho da view para garantir que a borda seja redonda
    overflow: 'hidden', // garantir que o conteúdo da view se ajuste dentro da borda arredondada
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    borderRadius: 87, // metade do tamanho da imagem
  },
  buttonStyle: {
    borderRadius: 0,  
    borderWidth: 1,  
    borderColor: 'white', 
    
  },
});
