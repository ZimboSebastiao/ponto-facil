import React, { useEffect, useState } from "react";
import { PieChart, ProgressChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  Avatar,
  SegmentedButtons,
  Provider as PaperProvider,
  DefaultTheme,
  Card,
  Text,
} from "react-native-paper";
import {
  AlignLeft,
  Clock,
  MapPinned,
  BriefcaseBusiness,
  Target,
  Crosshair,
  ClockArrowUp,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CheckAuth } from "../components/CheckAuth";

const API_URL = "http://192.168.15.11:8080";

const getToken = async () => {
  const token = await AsyncStorage.getItem("token");
  const tokenExpiration = await AsyncStorage.getItem("tokenExpiration");
  const now = new Date();

  if (token && tokenExpiration && new Date(tokenExpiration) > now) {
    return token;
  } else {
    // Token expired or not present, handle refresh or redirect to login
    return null;
  }
};

const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available.");
    }

    const response = await axios.post(`${API_URL}/refresh-token`, {
      refreshToken,
    });
    const { token, expiresIn } = response.data;

    await AsyncStorage.setItem("token", token);
    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
    await AsyncStorage.setItem("tokenExpiration", expirationDate.toISOString());

    return token;
  } catch (error) {
    console.error("Erro ao atualizar o token:", error);
    // Redirecionar para a tela de login ou tratar a falha
    return null;
  }
};

const verifyStoredTokens = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    const tokenExpiration = await AsyncStorage.getItem("tokenExpiration");

    console.log("Token:", token);
    console.log("Refresh Token:", refreshToken);
    console.log("Token Expiration:", tokenExpiration);
  } catch (error) {
    console.error("Erro ao verificar tokens armazenados:", error);
  }
};

verifyStoredTokens();

const fetchWithToken = async (url, config) => {
  let token = await getToken();
  if (!token) {
    token = await refreshToken();
    if (!token) {
      // Redirecionar para a tela de login ou tratar a falha
      throw new Error("Não foi possível obter um token válido.");
    }
  }

  const response = await axios.get(url, {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export default function Relatorio({ navigation }) {
  const [image, setImage] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [value, setValue] = useState("historico");
  const [histo, setHisto] = useState("sete");
  const [registros, setRegistros] = useState([]);
  const [registrosQuinzeDias, setRegistrosQuinzeDias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [frequencia, setFrequencia] = useState(null);

  // Função para selecionar a imagem
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (
      !result.cancelled &&
      result.assets &&
      result.assets.length > 0 &&
      result.assets[0].uri
    ) {
      setImage(result.assets[0].uri);
      try {
        await AsyncStorage.setItem("profileImageUri", result.assets[0].uri);
      } catch (error) {
        console.log("Erro ao salvar a URI da imagem no AsyncStorage:", error);
      }
    }
  };

  // Carregar a URI da imagem do perfil
  useEffect(() => {
    CheckAuth(navigation);

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

  // Obter dados do usuário
  useEffect(() => {
    const obterUsuario = async () => {
      setLoading(true);
      const usuarioJSON = await AsyncStorage.getItem("usuario");
      if (usuarioJSON) {
        const usuarioData = JSON.parse(usuarioJSON);
        console.log("Dados do usuário recuperados:", usuarioData);
        setUsuario(usuarioData);
      }
      setLoading(false);
    };

    obterUsuario();
  }, []);

  // Buscar registros dos últimos 7 dias
  useEffect(() => {
    if (histo === "sete" && usuario) {
      const fetchRegistros = async () => {
        try {
          const data = await fetchWithToken(
            `${API_URL}/registros/ultimos-7-dias`,
            {}
          );
          setRegistros(data);
        } catch (error) {
          console.error("Erro ao buscar registros:", error.message);
        }
      };

      fetchRegistros();
    }
  }, [histo, usuario]);

  // Buscar registros dos últimos 15 dias
  useEffect(() => {
    if (histo === "quinze" && usuario) {
      const fetchRegistrosQuinzeDias = async () => {
        try {
          const data = await fetchWithToken(
            `${API_URL}/registros/ultimos-15-dias`,
            {}
          );
          console.log("Dados dos últimos 15 dias:", data); // Verifique os dados aqui
          setRegistrosQuinzeDias(data);
        } catch (error) {
          console.error("Erro ao buscar registros:", error.message);
        }
      };

      fetchRegistrosQuinzeDias();
    }
  }, [histo, usuario]);

  // Obter dados da frequência
  useEffect(() => {
    const obterFrequencia = async () => {
      try {
        const data = await fetchWithToken(`${API_URL}/frequencia`, {});
        setFrequencia(data);
        console.log("Dados da frequência:", data);
      } catch (error) {
        console.error("Erro ao buscar dados da frequência:", error.message);
      }
    };

    obterFrequencia();
  }, [usuario]);
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "green",
      secondaryContainer: "rgba(255, 121, 56, 0.8)",
    },
  };

  if (loading) {
    return (
      <View style={estilos.loadingContainer}>
        <ActivityIndicator size="large" color="#ff7938" />
      </View>
    );
  }

  return (
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
              label: "Frequência",
              style: estilos.buttonStyle,
              checkedColor: "white",
              uncheckedColor: "#C8C8C8",
            },
          ]}
        />
        {value === "historico" && (
          <>
            <SegmentedButtons
              value={histo}
              onValueChange={setHisto}
              style={estilos.informacoes}
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
              <ScrollView style={estilos.scrollView}>
                <View style={estilos.informacoes}>
                  {registros.length > 0 ? (
                    registros.map((item) => (
                      <Card key={item.id} style={estilos.card}>
                        <Card.Content>
                          <View style={estilos.viewEntrada}>
                            <Text style={estilos.viewTipo}>
                              {item.tipo_registro}
                            </Text>
                            <Text style={estilos.viewTipo}>
                              {new Date(item.data_hora).toLocaleDateString()}
                            </Text>
                          </View>
                          <Text style={estilos.viewData}>
                            <Clock size={13} color="#818582" />{" "}
                            {new Date(item.data_hora).toLocaleTimeString(
                              "pt-BR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              }
                            )}
                          </Text>

                          <Text style={estilos.viewLoc}>
                            <MapPinned size={13} color="#818582" />{" "}
                            {item.localizacao}
                          </Text>
                        </Card.Content>
                      </Card>
                    ))
                  ) : (
                    <Text style={estilos.noDataText}>
                      Nenhum registro encontrado.
                    </Text>
                  )}
                </View>
              </ScrollView>
            )}
            {histo === "quinze" && (
              <ScrollView style={estilos.scrollView}>
                <View style={estilos.informacoes}>
                  {registrosQuinzeDias.length > 0 ? (
                    registrosQuinzeDias.map((item) => (
                      <Card key={item.id} style={estilos.card}>
                        <Card.Content>
                          <View style={estilos.viewEntrada}>
                            <Text style={estilos.viewTipo}>
                              {item.tipo_registro}
                            </Text>
                            <Text style={estilos.viewTipo}>
                              {new Date(item.data_hora).toLocaleDateString()}
                            </Text>
                          </View>
                          <Text style={estilos.viewData}>
                            <Clock size={13} color="#818582" />{" "}
                            {new Date(item.data_hora).toLocaleTimeString(
                              "pt-BR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              }
                            )}
                          </Text>

                          <Text style={estilos.viewLoc}>
                            <MapPinned size={13} color="#818582" />{" "}
                            {item.localizacao}
                          </Text>
                        </Card.Content>
                      </Card>
                    ))
                  ) : (
                    <Text style={estilos.noDataText}>
                      Nenhum registro encontrado.
                    </Text>
                  )}
                </View>
              </ScrollView>
            )}
            {histo === "personalizado" && (
              <View style={estilos.informacoes}>
                <Text>Informações personalizadas</Text>
              </View>
            )}
          </>
        )}

        {value === "pendentes" && (
          <View style={estilos.informacoes}>
            <PieChart
              data={[
                {
                  name: "Mensal",
                  population: parseFloat(frequencia.totalMensal),
                  color: "#f415ac",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 12,
                },
                {
                  name: "Semanal",
                  population: parseFloat(frequencia.totalSemanal),
                  color: "#ff7c01",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 12,
                },
                {
                  name: "Horas Extras",
                  population: parseFloat(frequencia.totalHorasExtras),
                  color: "#ffffff",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 12,
                },
                {
                  name: "Dias Trabalhados",
                  population: frequencia.diasTrabalhados || 0,
                  color: "#1b0738",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 12,
                },
              ]}
              width={Dimensions.get("window").width - 16}
              height={220}
              chartConfig={{
                backgroundColor: "#1cc910",
                backgroundGradientFrom: "#eff3ff",
                backgroundGradientTo: "#efefef",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="0"
              // absolute //for the absolute number remove if you want percentage
            />
            <View style={estilos.resumo}>
              <Text style={estilos.resumoTitulo}>Resumo de Frequência</Text>
              {frequencia && (
                <View style={estilos.resumoItem}>
                  <View style={estilos.itens}>
                    <View style={estilos.textoItem}>
                      <Target color="#26aceb" />
                      <Text> Total Mensal</Text>
                    </View>
                    <Text>{frequencia.totalMensal}</Text>
                  </View>

                  <View style={estilos.itens}>
                    <View style={estilos.textoItem}>
                      <Crosshair color="#ffb60c" />
                      <Text> Total Semanal</Text>
                    </View>
                    <Text>{frequencia.totalSemanal}</Text>
                  </View>

                  <View style={estilos.itens}>
                    <View style={estilos.textoItem}>
                      <ClockArrowUp color="#6fc83b" />
                      <Text> Total Horas Extras</Text>
                    </View>
                    <Text>{frequencia.totalHorasExtras}</Text>
                  </View>
                  <View style={estilos.itens}>
                    <View style={estilos.textoItem}>
                      <BriefcaseBusiness color="#944cf5" />
                      <Text> Dias Trabalhados</Text>
                    </View>
                    <Text>{frequencia.diasTrabalhados} dias</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
      </PaperProvider>
    </SafeAreaView>
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
    paddingBottom: 7,
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 65,
    overflow: "hidden",
    alignItems: "center",
  },
  avatarImage: {
    borderWidth: 1,
    borderColor: "white",
  },
  informacoes: {
    padding: 13,
  },
  botoesHisto: {
    borderColor: "#ff7938",
    borderBottomWidth: 3,
    marginTop: 20,
    marginBottom: 15,
  },
  card: {
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#f5f7f7",
  },
  scrollView: {
    flex: 1,
  },
  viewTipo: {
    fontSize: 15,
    color: "#ff7938",
    fontWeight: "bold",
    marginBottom: 6,
  },
  viewEntrada: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  viewData: {
    color: "#818582",
  },
  viewLoc: {
    color: "#818582",
    marginTop: 6,
  },
  grafico: {
    marginVertical: 16,
  },
  resumo: {
    padding: 10,
    marginVertical: 50,
  },
  resumoTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1b0738",
  },
  resumoItem: {
    padding: 0,
    marginVertical: 20,
  },
  itens: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
  },
  textoItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
