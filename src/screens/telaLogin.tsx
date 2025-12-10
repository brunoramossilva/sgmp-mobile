import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAutenticacao } from "../contexto/ContextoAutenticacao";
import { fazerLogin, buscarDadosUsuario } from "../services/autenticacao";

export default function TelaLogin() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [focoCpf, setFocoCpf] = useState(false);
  const [focoSenha, setFocoSenha] = useState(false);

  const [tecladoVisivel, setTecladoVisivel] = useState(false);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { autenticar } = useAutenticacao();

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setTecladoVisivel(true)
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setTecladoVisivel(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const formatarCpf = (valor: string): string => {
    const apenasNumeros = valor.replace(/\D/g, "");
    const limitado = apenasNumeros.slice(0, 11);
    if (limitado.length <= 3) return limitado;
    if (limitado.length <= 6)
      return `${limitado.slice(0, 3)}.${limitado.slice(3)}`;
    if (limitado.length <= 9)
      return `${limitado.slice(0, 3)}.${limitado.slice(3, 6)}.${limitado.slice(
        6
      )}`;
    return `${limitado.slice(0, 3)}.${limitado.slice(3, 6)}.${limitado.slice(
      6,
      9
    )}-${limitado.slice(9)}`;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!cpf || !senha) {
      Alert.alert("Validação", "Por favor, preencha todos os campos");
      return;
    }
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) {
      Alert.alert("Validação", "CPF deve conter 11 dígitos");
      return;
    }

    setCarregando(true);
    try {
      const loginResponse = await fazerLogin(cpfLimpo, senha);
      const dadosUsuario = await buscarDadosUsuario(
        loginResponse.usuario.cpf,
        loginResponse.usuario.papel
      );

      autenticar({
        cpf: dadosUsuario.cpf,
        nome: dadosUsuario.nome,
        telefone: dadosUsuario.telefone,
        papel: loginResponse.usuario.papel,
      });

      const rotasIniciais: Record<string, string> = {
        MORADOR: "InicialMorador",
        FUNCIONARIO: "InicialTecnico",
        SINDICO: "InicialSindico",
      };

      const rotaInicial =
        rotasIniciais[loginResponse.usuario.papel] || "Inicial";
      navigation.navigate(rotaInicial as never);
    } catch (erro: any) {
      console.error("Erro ao realizar login:", erro);
      const mensagemErro =
        erro.response?.data?.error || "Verifique suas credenciais.";
      Alert.alert("Erro de Login", mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    // MUDANÇA: A View principal agora tem fundo BRANCO (bg-white)
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          // MUDANÇA: A View interna (que contém o logo e o início do card) agora tem o fundo VERMELHO (bg-red-600)
          className="flex-1 justify-end bg-red-600"
          style={{ paddingTop: insets.top }}
        >
          {/* ÁREA SUPERIOR (Logo) */}
          {!tecladoVisivel && (
            <View className="items-center justify-center flex-1 py-4">
              <View className="bg-red-50 rounded-full p-4 mb-2 shadow-md">
                <Image
                  source={require("../../assets/sgmp-sem-fundo.png")}
                  style={{ width: 100, height: 100 }}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-white text-2xl font-bold text-center">
                SGMP Mobile
              </Text>
            </View>
          )}

          {/* ÁREA INFERIOR (Card Branco) */}
          <View
            className="bg-white rounded-t-[32px] px-6 shadow-2xl w-full"
            style={{
              paddingTop: 32,
              paddingBottom: tecladoVisivel
                ? 20
                : Math.max(insets.bottom, 20) + 10,
              flex: tecladoVisivel ? 1 : 0,
              marginTop: tecladoVisivel ? 20 : 0,
            }}
          >
            <Text className="text-xl font-bold text-slate-800 mb-1">
              Entrar
            </Text>
            <Text className="text-slate-500 mb-6 text-sm">
              Entre com seus dados de acesso
            </Text>

            {/* Inputs */}
            <View className="space-y-4">
              <View>
                <Text className="text-slate-700 font-semibold mb-1 ml-1 text-sm">
                  CPF
                </Text>
                <View
                  className={`bg-slate-50 rounded-xl border-2 ${
                    focoCpf ? "border-red-600" : "border-slate-200"
                  }`}
                >
                  <TextInput
                    value={cpf}
                    onChangeText={(t) => setCpf(formatarCpf(t))}
                    placeholder="000.000.000-00"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    maxLength={14}
                    onFocus={() => setFocoCpf(true)}
                    onBlur={() => setFocoCpf(false)}
                    className="px-4 py-3 text-slate-800 text-base"
                  />
                </View>
              </View>

              <View>
                <Text className="text-slate-700 font-semibold mb-1 ml-1 text-sm">
                  Senha
                </Text>
                <View
                  className={`bg-slate-50 rounded-xl border-2 ${
                    focoSenha ? "border-red-600" : "border-slate-200"
                  }`}
                >
                  <TextInput
                    value={senha}
                    onChangeText={setSenha}
                    placeholder="Senha"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry
                    onFocus={() => setFocoSenha(true)}
                    onBlur={() => setFocoSenha(false)}
                    onSubmitEditing={handleLogin}
                    className="px-4 py-3 text-slate-800 text-base"
                  />
                </View>
              </View>
            </View>

            {/* Botão */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={carregando}
              className={`w-full py-3.5 rounded-xl shadow-lg mt-6 ${
                carregando ? "bg-slate-400" : "bg-red-600 active:bg-red-700"
              }`}
            >
              <Text className="text-center text-white text-base font-bold">
                {carregando ? "Aguarde..." : "Acessar Sistema"}
              </Text>
            </TouchableOpacity>

            {/* Créditos */}
            {!tecladoVisivel && (
              <View className="mt-6 pt-4 border-t border-slate-100">
                <Text className="text-slate-400 text-[10px] text-center leading-4">
                  Time de Desenvolvimento:{"\n"}
                  <Text className="text-slate-600 font-medium">
                    Ágata Giovanna, Bruno Ramos, Diogo Rodrigues, Flávia
                    Vitória, Gryghor Camonni e Lucas Cabral
                  </Text>
                </Text>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
      {/* MUDANÇA: Adicionada uma View branca vazia no final para garantir que qualquer espaço extra na parte inferior seja branco */}
      <View className="bg-white" style={{ height: insets.bottom }} />
    </View>
  );
}
