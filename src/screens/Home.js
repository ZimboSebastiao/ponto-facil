import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, View, Text, Pressable } from "react-native";
// import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Calendar from "expo-calendar";
import { Card, Divider} from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Home({ navigation }) {
  const [minhaLocalizacao, setMinhaLocalizacao] = useState(null);
  const [dataFormatada, setDataFormatada] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [dataAtualizada, setDataAtualizada] = useState("");
  const [diaAtual, setDiaAtual] = useState("");
  const [intervalo, setIntervalo] = useState("");
  const [fimIntervalo, setFimIntervalo] = useState("");
  const [saida, setSaida] = useState("");
  const [endereco, setEndereco] = useState("");



  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(!showActionsheet);


  useEffect(() => {
    async function obterLocalizacao() {
      const { status } = await Location.requestForegroundPermissionsAsync();
  
      if (status !== "granted") {
        Alert.alert("Ops!", "Você não autorizou o uso de geolocalização");
        return;
      }
  
      const { status: statusCalendario } =
        await Calendar.requestCalendarPermissionsAsync();
      if (statusCalendario === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
      }
  
      let localizacaoAtual = await Location.getCurrentPositionAsync({});
      setMinhaLocalizacao(localizacaoAtual);
      setLocalizacao({
        latitude: localizacaoAtual.coords.latitude,
        longitude: localizacaoAtual.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
  
      // Converter coordenadas em endereço
      const enderecoReverso = await Location.reverseGeocodeAsync({
        latitude: localizacaoAtual.coords.latitude,
        longitude: localizacaoAtual.coords.longitude,
      });
  
      // Verificar a estrutura do objeto de endereço retornado
      console.log(enderecoReverso);
  
       // Construir o endereço a partir das informações retornadas
    let enderecoFormatado = "";
    if (enderecoReverso && enderecoReverso.length > 0) {
      const enderecoInfo = enderecoReverso[0];
      const {
        street,
        name,
        streetNumber,
        city,
        district,
        region,
        postalCode,
        isoCountryCode,
      } = enderecoInfo;
      const numero = streetNumber ? streetNumber : "";
      const cep = postalCode ? postalCode : "CEP desconhecido";
      const estado = region ? region : "estado desconhecido";
      let cidade = city ? city : district ? district : "cidade desconhecida";
      enderecoFormatado = `${street || name}, ${numero} ${cidade} - ${estado} - CEP: ${cep}`;
    }
      setEndereco(enderecoFormatado);
    }
    obterLocalizacao();
  }, []);
  

  // console.log(endereco);

  const [localizacao, setLocalizacao] = useState(null);

  const regiaoInicialMapa = {
    latitude: -23.533773,
    longitude: -46.65529,
    latitudeDelta: 40,
    longitudeDelta: 40,
  };

  const marcarPonto = () => {
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, "0");
    const minutos = String(agora.getMinutes()).padStart(2, "0");
    const horaAtual = `${horas}:${minutos}`;

    if (!dataFormatada) {
      const dia = String(agora.getDate()).padStart(2, "0");
      const mes = String(agora.getMonth() + 1).padStart(2, "0"); // Janeiro é 0!
      const ano = agora.getFullYear();
      const data = `${dia}/${mes}/${ano}`;

      Alert.alert(
        "Registro",
        `Ponto de entrada marcado com sucesso: ${horaAtual} - ${data}`,
        [
          {
            text: "OK",
            onPress: () => {
              setDataFormatada(horaAtual);
              setData(data);
            },
          },
        ]
      );
    } else if (!intervalo) {
      Alert.alert("Confirmação", "Tem certeza que deseja marcar o intervalo?", [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancelado"),
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            const dia = String(agora.getDate()).padStart(2, "0");
            const mes = String(agora.getMonth() + 1).padStart(2, "0"); // Janeiro é 0!
            const ano = agora.getFullYear();
            const data = `${dia}/${mes}/${ano}`;

            Alert.alert(
              "Registro",
              `Intervalo marcado com sucesso: ${horaAtual} - ${data}`,
              [
                {
                  text: "OK",
                  onPress: () => setIntervalo(horaAtual),
                },
              ]
            );
          },
        },
      ]);
    } else if (!fimIntervalo) {
      Alert.alert(
        "Confirmação",
        "Tem certeza que deseja marcar o fim do intervalo?",
        [
          {
            text: "Cancelar",
            onPress: () => console.log("Cancelado"),
            style: "cancel",
          },
          {
            text: "Confirmar",
            onPress: () => {
              const dia = String(agora.getDate()).padStart(2, "0");
              const mes = String(agora.getMonth() + 1).padStart(2, "0"); // Janeiro é 0!
              const ano = agora.getFullYear();
              const data = `${dia}/${mes}/${ano}`;

              Alert.alert(
                "Registro",
                `Fim do intervalo marcado com sucesso: ${horaAtual} - ${data}`,
                [
                  {
                    text: "OK",
                    onPress: () => setFimIntervalo(horaAtual),
                  },
                ]
              );
            },
          },
        ]
      );
    } else {
      Alert.alert("Confirmação", "Tem certeza que deseja marcar a saída?", [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancelado"),
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            const dia = String(agora.getDate()).padStart(2, "0");
            const mes = String(agora.getMonth() + 1).padStart(2, "0"); // Janeiro é 0!
            const ano = agora.getFullYear();
            const data = `${dia}/${mes}/${ano}`;

            Alert.alert(
              "Registro",
              `Saída marcada com sucesso: ${horaAtual} - ${data}`,
              [
                {
                  text: "OK",
                  onPress: () => setSaida(horaAtual),
                },
              ]
            );
          },
        },
      ]);
    }
  };

  const atualizarHora = () => {
    const agora = new Date();
    const diaSemanaArray = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];
    const diaSemana = diaSemanaArray[agora.getDay()];
    const dia = String(agora.getDate()).padStart(2, "0");
    const mes = String(agora.getMonth() + 1).padStart(2, "0"); // Janeiro é 0!
    const ano = agora.getFullYear();
    const horas = String(agora.getHours()).padStart(2, "0");
    const minutos = String(agora.getMinutes()).padStart(2, "0");
    const segundos = String(agora.getSeconds()).padStart(2, "0");

    const hora = `${horas}:${minutos}:${segundos}`;
    const dataAtual = ` ${dia}/${mes}/${ano}`;
    const diaAtual = `${diaSemana}`;
    setHora(hora);
    setDataAtualizada(dataAtual);
    setDiaAtual(diaAtual);
  };

  useEffect(() => {
    const intervalId = setInterval(atualizarHora, 1000);
    return () => clearInterval(intervalId);
  }, []);

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

  return (
    <>
      <StatusBar />
        <ScrollView style={estilos.container}>
          <View style={estilos.viewMenu} >
            <View style={estilos.menu}>
              <Text
                onPress={() => navigation.openDrawer()}
                m="$3"
                w="$10"
                h="$6"
                color="white"
              />
              <Text style={estilos.menuTexto}>Olá</Text>
              
            </View>

              <View style={{flexDirection: "row", alignItems: "center", marginTop: 5}}>

                {/* <MapPin 
                  color="white"
                  size={16}
                  padding="20"
                  style={{ marginTop: 23}}
                  
                  /> */}
              <View style={{justifyContent: "space-between", alignItems: "flex-start", padding: 6, margin: 6,}}> 
              <Text style={{ color: "#DEDEBF", fontSize: 13, marginBottom: 10}}>Localização atual</Text>
             
                <Text style={estilos.textoMenu}>{endereco}</Text>
                
              </View>

            </View>
          </View>

          <View style={estilos.viewInfo}>
            <Card style={estilos.cardInfo}>
              <Text style={estilos.cardTitulo}>
                Registros de hoje 
              </Text>
              <Card.Content> 
               
              
                <View style={estilos.cardConteudo}>
                  <View>
                    <Text style={estilos.cardTexto} variant="titleMedium"> {diaAtual}</Text>
                    <Text style={estilos.cardTexto} variant="titleMedium">{dataAtualizada}</Text>
                  </View>
                  <View style={estilos.cardIcon}>
                  
                    <Text style={estilos.cardHora} variant="titleMedium"> {hora}</Text>
                  </View>
                </View>

                <Divider 
                  orientation="vertical"  
                  width="100%" 
                  my="$2"
                  />

                <View style={estilos.viewInfoHora}>
                  <View style={{width: "100%"}}> 

                    <View style={estilos.viewRegistros}>
                      <Text style={estilos.texto} variant="titleMedium">1º Registro - Entrada</Text>
                      <Text style={estilos.textoRegistros}>{dataFormatada}</Text>
                    </View>

                    <Divider 
                      orientation="vertical"  
                      width="100%" 
                      h="auto" 
                      my="$2"
                      />

                    <View style={estilos.viewRegistros}>
                      <Text style={estilos.texto} variant="titleMedium">2º Registro - Intervalo</Text>
                      <Text style={estilos.textoRegistros}>{intervalo}</Text>
                    </View>

                    <Divider 
                      orientation="vertical"  
                      width="100%" 
                      h="auto" 
                      my="$2"
                      />

                    <View style={estilos.viewRegistros}>
                      <Text style={estilos.texto} variant="titleMedium">3º Registro - Fim do Intervalo</Text>
                      <Text style={estilos.textoRegistros}>{fimIntervalo}</Text>
                    </View>

                    <Divider 
                      orientation="vertical"  
                      width="100%" 
                      h="auto" 
                      my="$2"
                      />

                    <View style={estilos.viewRegistros}>                   
                      <Text style={estilos.texto} variant="titleMedium">4º Registro - Saída</Text>
                      <Text style={estilos.textoRegistros}>{saida}</Text>
                    </View>

                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>
        
          <View>
            <Pressable style={estilos.viewBotao} onPress={marcarPonto}>
             
              <Text> Marcar Ponto </Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              onPress={handleClose}
              $_text-color="black"
              style={estilos.viewRelatorio}
            >
              <Text>Requisição Manual</Text>
            </Pressable>
          </View>
          <View>

          </View>
        </ScrollView>
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
  },
  viewMenu: {
    padding: 20,
    backgroundColor: "#ff7938",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  menuTexto: {
    fontSize: 14,
    color: "white",
  },
  textoMenu:{
    color: "white",
    fontSize: 12,
  },
  menuAvatar: {
    marginTop: 60,
  },
  menuAvatarConteudo: { alignItems: "center" },
  menuNaveg: {
    alignItems: "flex-start",
  },
  menuBotao: {
    width: "100%",
    marginBottom: "6%",
    backgroundColor: "rgba(0, 0, 0, 0)",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  mapa: { width: "100%", height: "100%" },
  viewMapa: {
    width: "80%",
    height: "40%",
    marginVertical: 30,
    marginLeft: "auto",
    marginRight: "auto",

    borderWidth: 2,
  },
  viewBotao: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "6%",
    
    backgroundColor: "#ff7938"
  },
  viewRelatorio: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "6%",
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderColor: "#ff7938",
    borderWidth: 1,
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
  cardTexto: { 
    color: "#6F6F6F", 
    marginBottom: 10, 
    fontWeight: "bold",
    fontSize: 14
  },
  cardHora: 
  { 
    color: "#ff7938", 
    marginBottom: 10, 
    fontWeight: "bold" 
  },
  cardTitulo: {
    color: "#ff7938",
    fontSize: 17,
    fontWeight: "bold",
    justifyContent: "space-between",
    marginBottom: 12,
    backgroundColor: "#ffe9dd",
    alignItems: "center",
    paddingLeft: 20
  },
  bancoTitulo: {
    color: "#ff7938",
    fontSize: 18,
    fontWeight: "bold",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
    textAlign: "center"
  },
  viewHeader:{
    justifyContent: "space-between",
  },
  cardIcon: { flexDirection: "row" },
  viewInfo: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10",
  },
  texto: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#6F6F6F",
    marginBottom: 5,
    marginTop: 20,
  },

  cardInfo: {
    textDecorationColor: "black",
    color: "black",
    marginVertical: 40,
    marginBottom: 20,
  },
  cardConteudo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

  },
  cardInfoText: {
    textAlign: "center",
    backgroundColor: "red",
    textDecorationColor: "white",
  },
  modal: {
    position: "relative",
    width: "100%",
    backgroundColor: "#CBDAF0",
    bottom: "-65%",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },

  viewInfoHora: {
    alignItems: "center",
    width: "100%",    
  },
  navigationContainer: {
    backgroundColor: "#ecf0f1",
  },
  viewRegistros: {
    marginBottom:20,
  },
  textoRegistros: {
    color: "black",
    fontWeight: "bold",
    fontSize: 22,
    paddingLeft: 6
  }
});
