  import { useRef, useEffect, useState } from "react";
  import { StyleSheet, View, Text} from "react-native";

  import { Avatar } from "react-native-paper";
  import * as ImagePicker from 'expo-image-picker';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  export default function UsuarioAvatar() {
    const [usuario, setUsuario] = useState(null);
    const [image, setImage] = useState(null);
    
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

    useEffect(() => {
        const obterUsuario = async () => {
          const usuarioJSON = await AsyncStorage.getItem('usuario');
          if (usuarioJSON) {
            setUsuario(JSON.parse(usuarioJSON));
          }
        };
    
        obterUsuario();
      }, []);
  
    return (
    <View style={estilos.container}>

        <View style={estilos.imagem}>
            <View style={estilos.avatarContainer}>
                <Avatar.Image 
                size={120}
                source={image ? { uri: image } : null} 
                style={estilos.avatarImage}
                alt="Foto do perfil"          
                />
            </View>

            <View>
                <Text size="sm">{usuario ? usuario.nome : 'Visitante'}</Text>
                <Text size="sm">Developer</Text>
            </View>

        </View>        
    </View>
    );
  }
  
  const estilos = StyleSheet.create({
    container: {
      padding: 8,
      marginVertical: 50,
    },
    avatarContainer: {
        width: 125,
        height: 125,
        borderWidth: 3,
        borderColor: '#ff7938',
        borderRadius: 65, 
        overflow: 'hidden', 
        alignItems: 'center',
        justifyContent: 'center',
      },
      avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60, 
      },
      imagem: {
        justifyContent: "center",
        alignItems: "center",

      },
  });
  