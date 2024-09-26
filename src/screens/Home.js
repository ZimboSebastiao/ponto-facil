import * as React from "react";
import { useRef, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import * as Calendar from "expo-calendar";
import { Card, Divider, Avatar, Drawer } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Circle, AlignLeft, Map, Clock } from "lucide-react-native";
import axios from "axios";
import { CheckAuth } from "../components/CheckAuth";

export default function Home({ navigation }) {
  const [minhaLocalizacao, setMinhaLocalizacao] = useState(null);
  const [dataFormatada, setDataFormatada] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [dataAtualizada, setDataAtualizada] = useState("");
  const [diaAtual, setDiaAtual] = useState("");
  const [endereco, setEndereco] = useState("");
  const [usuario, setUsuario] = useState(null);

  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(!showActionsheet);
  const [registros, setRegistros] = useState({
    entrada: null,
    intervalo: null,
    fimIntervalo: null,
    saida: null,
  });

  const [loading, setLoading] = useState(true);

  // Função Localização
  useEffect(() => {
    CheckAuth(navigation);
    async function obterLocalizacao() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Ops!", "Você não autorizou o uso de geolocalização");
        setLoading(false);
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
        enderecoFormatado = `${
          street || name
        }, ${numero} ${cidade} - ${estado} - CEP: ${cep}`;
      }
      setEndereco(enderecoFormatado);
      setLoading(false);
    }
    obterLocalizacao();
  }, []);

  // Função ObterUsuario
  useEffect(() => {
    const obterUsuario = async () => {
      setLoading(true);
      const usuarioJSON = await AsyncStorage.getItem("usuario");
      if (usuarioJSON) {
        const usuarioData = JSON.parse(usuarioJSON);
        console.log("Dados do usuário recuperados:", usuarioData); // Logar os dados do usuário recuperados
        setUsuario(usuarioData);
      } else {
        console.log("Nenhum dado de usuário encontrado no AsyncStorage");
      }
      setLoading(false);
    };

    obterUsuario();
  }, []);

  const [localizacao, setLocalizacao] = useState(null);

  // Função Mapa
  const regiaoInicialMapa = {
    latitude: -23.533773,
    longitude: -46.65529,
    latitudeDelta: 40,
    longitudeDelta: 40,
  };

  // Função Marcar Ponto
  const marcarPonto = async () => {
    setLoading(true);
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, "0");
    const minutos = String(agora.getMinutes()).padStart(2, "0");
    const segundos = String(agora.getSeconds()).padStart(2, "0");
    const horaAtual = `${horas}:${minutos}:${segundos}`;

    const dataLocal = `${agora.getFullYear()}-${String(
      agora.getMonth() + 1
    ).padStart(2, "0")}-${String(agora.getDate()).padStart(
      2,
      "0"
    )} ${horaAtual}`;

    if (!usuario) {
      Alert.alert("Erro", "Usuário não encontrado");
      setLoading(false);
      return;
    }

    try {
      // Recupera o token do AsyncStorage
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("Token não encontrado!");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Obter registros do dia atual
      const response = await axios.get(
        "http://192.168.15.11:8080/registros-dia-atual",
        config
      );

      if (response.status === 200) {
        const dados = response.data;
        const registrosDiaAtual = {
          entrada:
            dados.find((reg) => reg.tipo_registro === "entrada")?.data_hora ||
            null,
          intervalo:
            dados.find((reg) => reg.tipo_registro === "intervalo")?.data_hora ||
            null,
          fimIntervalo:
            dados.find((reg) => reg.tipo_registro === "fim_intervalo")
              ?.data_hora || null,
          saida:
            dados.find((reg) => reg.tipo_registro === "saida")?.data_hora ||
            null,
        };

        if (!registrosDiaAtual.entrada) {
          // Marcar ponto de entrada
          const response = await axios.post(
            "http://192.168.15.11:8080/registros",
            {
              usuario_id: usuario.id,
              tipo_registro: "entrada",
              data_hora: dataLocal,
              localizacao: endereco,
            },
            config
          );

          if (response.status === 201) {
            Alert.alert(
              "Registro",
              `Ponto de entrada marcado com sucesso: ${horaAtual}`
            );
            setDataFormatada(horaAtual);
            setData(
              `${agora.getDate().toString().padStart(2, "0")}/${(
                agora.getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}/${agora.getFullYear()}`
            );

            // Atualiza os registros após marcar ponto
            await obterRegistrosDiaAtual();
          }
        } else if (!registrosDiaAtual.intervalo) {
          // Marcar ponto de intervalo
          Alert.alert(
            "Confirmação",
            "Tem certeza que deseja marcar o intervalo?",
            [
              {
                text: "Cancelar",
                onPress: () => console.log("Cancelado"),
                style: "cancel",
              },
              {
                text: "Confirmar",
                onPress: async () => {
                  try {
                    const response = await axios.post(
                      "http://192.168.15.11:8080/registros",
                      {
                        usuario_id: usuario.id,
                        tipo_registro: "intervalo",
                        data_hora: dataLocal,
                        localizacao: endereco,
                      },
                      config
                    );

                    if (response.status === 201) {
                      Alert.alert(
                        "Registro",
                        `Intervalo marcado com sucesso: ${horaAtual}`
                      );

                      // Atualiza os registros após marcar ponto
                      await obterRegistrosDiaAtual();
                    }
                  } catch (error) {
                    if (error.response) {
                      Alert.alert(
                        "Erro",
                        `Erro ao marcar ponto de intervalo: ${error.response.data.message}`
                      );
                    } else {
                      console.log("Erro ao marcar ponto de intervalo:", error);
                    }
                  }
                },
              },
            ]
          );
        } else if (!registrosDiaAtual.fimIntervalo) {
          // Marcar fim do intervalo
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
                onPress: async () => {
                  try {
                    const response = await axios.post(
                      "http://192.168.15.11:8080/registros",
                      {
                        usuario_id: usuario.id,
                        tipo_registro: "fim_intervalo",
                        data_hora: dataLocal,
                        localizacao: endereco,
                      },
                      config
                    );

                    if (response.status === 201) {
                      Alert.alert(
                        "Registro",
                        `Fim de intervalo marcado com sucesso: ${horaAtual}`
                      );

                      // Atualiza os registros após marcar ponto
                      await obterRegistrosDiaAtual();
                    }
                  } catch (error) {
                    if (error.response) {
                      Alert.alert(
                        "Erro",
                        `Erro ao marcar ponto de fim de intervalo: ${error.response.data.message}`
                      );
                    } else {
                      console.log(
                        "Erro ao marcar ponto de fim de intervalo:",
                        error
                      );
                    }
                  }
                },
              },
            ]
          );
        } else if (!registrosDiaAtual.saida) {
          // Marcar ponto de saída
          Alert.alert(
            "Confirmação",
            "Tem certeza que deseja marcar o ponto de saída?",
            [
              {
                text: "Cancelar",
                onPress: () => console.log("Cancelado"),
                style: "cancel",
              },
              {
                text: "Confirmar",
                onPress: async () => {
                  try {
                    const response = await axios.post(
                      "http://192.168.15.11:8080/registros",
                      {
                        usuario_id: usuario.id,
                        tipo_registro: "saida",
                        data_hora: dataLocal,
                        localizacao: endereco,
                      },
                      config
                    );

                    if (response.status === 201) {
                      Alert.alert(
                        "Registro",
                        `Ponto de saída marcado com sucesso: ${horaAtual}`
                      );

                      // Atualiza os registros após marcar ponto
                      await obterRegistrosDiaAtual();
                    }
                  } catch (error) {
                    if (error.response) {
                      Alert.alert(
                        "Erro",
                        `Erro ao marcar ponto de saída: ${error.response.data.message}`
                      );
                    } else {
                      console.log("Erro ao marcar ponto de saída:", error);
                    }
                  }
                },
              },
            ]
          );
        } else {
          Alert.alert("Registro", "Todos os pontos já foram marcados hoje.");
        }
      }
    } catch (error) {
      if (error.response) {
        Alert.alert(
          "Erro",
          `Erro ao marcar ponto: ${error.response.data.message}`
        );
      } else {
        console.log("Erro ao marcar ponto:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Função atualizarHora
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

  // Função para carregar Imagem
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

  // Função para formatar a data r
  const formatarHora = (dataHora) => {
    if (!dataHora) return " ";
    return new Date(dataHora).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Função para obter registro do dia atual
  const obterRegistrosDiaAtual = async () => {
    try {
      // Recupera o token do AsyncStorage
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("Token não encontrado!");
        return;
      }

      console.log("Token recuperado:", token);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        "http://192.168.15.11:8080/registros-dia-atual",
        config
      );

      if (response.status === 200) {
        const dados = response.data;
        console.log("Dados recebidos:", dados);

        const novosRegistros = {
          entrada: formatarHora(
            dados.find((reg) => reg.tipo_registro === "entrada")?.data_hora
          ),
          intervalo: formatarHora(
            dados.find((reg) => reg.tipo_registro === "intervalo")?.data_hora
          ),
          fimIntervalo: formatarHora(
            dados.find((reg) => reg.tipo_registro === "fim_intervalo")
              ?.data_hora
          ),
          saida: formatarHora(
            dados.find((reg) => reg.tipo_registro === "saida")?.data_hora
          ),
        };

        setRegistros(novosRegistros);
      }
    } catch (error) {
      console.error("Erro ao obter registros do dia atual:", error);
    }
  };

  useEffect(() => {
    obterRegistrosDiaAtual();
  }, []);

  const obterSaudacao = () => {
    const horaAtual = new Date().getHours();
    if (horaAtual < 12) {
      return "Bom dia";
    } else if (horaAtual < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  };

  if (loading) {
    return (
      <View style={estilos.loadingContainer}>
        <ActivityIndicator size="large" color="#ff7938" />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={estilos.container}>
        <SafeAreaView>
          <View style={estilos.viewMenu}>
            <View style={estilos.menu}>
              <AlignLeft
                onPress={() => navigation.openDrawer()}
                m="$3"
                w="$10"
                h="$6"
                color="white"
              />
              <Text style={estilos.menuTexto}>
                {obterSaudacao()},{" "}
                {usuario ? usuario.nome.split(" ")[0] : "Visitante"}
              </Text>

              <View style={estilos.avatarPerfil}>
                {image ? (
                  <Avatar.Image
                    size={40}
                    source={image ? { uri: image } : null}
                    alt="Foto do perfil"
                    style={estilos.avatarImage}
                  />
                ) : (
                  <Avatar.Image
                    size={40}
                    source={require("./../../assets/images/perfil.jpg")}
                    alt="Foto do perfil padrão"
                  />
                )}
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <Map
                color="white"
                size={16}
                padding="20"
                style={{ marginTop: 23 }}
              />

              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: 6,
                  margin: 6,
                }}
              >
                <Text
                  style={{ color: "#DEDEBF", fontSize: 14, marginBottom: 10 }}
                >
                  Você está próximo a
                </Text>

                <Text style={estilos.textoMenu}>{endereco}</Text>
              </View>
            </View>
          </View>

          <View style={estilos.viewInfo}>
            <Card style={estilos.cardInfo}>
              <Text style={estilos.cardTitulo}>Registros de hoje</Text>
              <Card.Content>
                <View style={estilos.cardConteudo}>
                  <View>
                    <Text style={estilos.cardHora} variant="titleMedium">
                      {" "}
                      {diaAtual}
                    </Text>
                    <Text style={estilos.cardHora} variant="titleMedium">
                      {dataAtualizada}
                    </Text>
                  </View>
                  <View style={estilos.cardIcon}>
                    <Text style={estilos.cardHora}>
                      {" "}
                      <Clock size={14} color="#ff7938" /> {hora}{" "}
                    </Text>
                  </View>
                </View>

                <Divider orientation="vertical" width="100%" my="$2" />

                <View style={estilos.viewInfoHora}>
                  <View style={{ width: "100%" }}>
                    <View style={estilos.viewRegistros}>
                      <Text style={estilos.texto} variant="titleMedium">
                        1º Registro - Entrada
                      </Text>
                      <Text style={estilos.textoRegistros}>
                        {registros.entrada || " "}
                      </Text>
                    </View>

                    <Divider
                      orientation="vertical"
                      width="100%"
                      h="auto"
                      my="$2"
                    />

                    <View style={estilos.viewRegistros}>
                      <Text style={estilos.texto} variant="titleMedium">
                        2º Registro - Intervalo
                      </Text>
                      <Text style={estilos.textoRegistros}>
                        {registros.intervalo || " "}
                      </Text>
                    </View>

                    <Divider
                      orientation="vertical"
                      width="100%"
                      h="auto"
                      my="$2"
                    />

                    <View style={estilos.viewRegistros}>
                      <Text style={estilos.texto} variant="titleMedium">
                        3º Registro - Fim do Intervalo
                      </Text>
                      <Text style={estilos.textoRegistros}>
                        {registros.fimIntervalo || " "}
                      </Text>
                    </View>

                    <Divider
                      orientation="vertical"
                      width="100%"
                      h="auto"
                      my="$2"
                    />

                    <View style={estilos.viewRegistros}>
                      <Text style={estilos.texto} variant="titleMedium">
                        4º Registro - Saída
                      </Text>
                      <Text style={estilos.textoRegistros}>
                        {registros.saida || " "}
                      </Text>
                    </View>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>

          <View>
            <Pressable style={estilos.viewBotao} onPress={marcarPonto}>
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontSize: 16,
                  alignItems: "center",
                }}
              >
                <Circle size={14} padding="2" color="white" /> Marcar Ponto
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 13,
  },
  viewMenu: {
    padding: 20,
    backgroundColor: "#ff7938",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  menuTexto: {
    fontSize: 15,
    color: "white",
  },
  textoMenu: {
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
    marginBottom: "7%",
    padding: "2%",
    backgroundColor: "#ff7938",
    borderRadius: 10,
    borderColor: "#ff7938",
    borderWidth: 1,
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
    fontSize: 14,
  },
  cardHora: {
    color: "#ff7938",
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 15,
  },
  cardTitulo: {
    color: "#ff7938",
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "space-between",
    marginBottom: 12,
    backgroundColor: "#ffe9dd",
    textAlign: "center",
    padding: 10,
  },
  bancoTitulo: {
    color: "#ff7938",
    fontSize: 18,
    fontWeight: "bold",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
    textAlign: "center",
  },
  viewHeader: {
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
    marginBottom: 20,
  },
  textoRegistros: {
    color: "#4a4848",
    fontWeight: "bold",
    fontSize: 17,
    paddingLeft: 6,
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
});
