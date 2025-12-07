import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAutenticacao } from "../contexto/ContextoAutenticacao";
import { fazerLogin, buscarDadosUsuario } from "../services/autenticacao";

/**
 * Tela de Login Premium
 * Design moderno, responsivo e profissional
 * Integrada com contexto de autenticação e API do backend
 */
export default function TelaLogin() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [focoCpf, setFocoCpf] = useState(false);
  const [focoSenha, setFocoSenha] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { autenticar } = useAutenticacao();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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

      navigation.navigate("Inicial" as never);
    } catch (erro: any) {
      console.error("Erro ao realizar login:", erro);

      const mensagemErro =
        erro.response?.data?.error ||
        "Não foi possível realizar o login. Verifique suas credenciais.";

      Alert.alert("Erro de Login", mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={{ flex: 1 }} className="flex-1 bg-red-600">
      <StatusBar style="light" />

      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEnabled={keyboardVisible}
        className="flex-1 bg-red-600"
      >
        <View
          className="bg-red-600"
          style={{ paddingTop: insets.top || 20, minHeight: "100%" }}
        >
          {/* Seção superior com logo - Fundo Vermelho */}
          <View className="bg-red-600 items-center pt-6 pb-6 px-6">
            <View className="bg-red-50 rounded-full p-6 mb-4 shadow-md">
              <Image
                source={require("../../assets/sgmp-sem-fundo.png")}
                style={{ width: 140, height: 140 }}
                resizeMode="contain"
                accessibilityLabel="Logo SGMP"
              />
            </View>

            <Text className="text-white text-3xl font-bold text-center mb-2">
              SGMP Mobile
            </Text>
            <Text className="text-white/90 text-base text-center px-6">
              Sistema de Gestão e Manutenção Predial
            </Text>
          </View>

          {/* Card de login com arco */}
          <View
            className="flex-1 bg-white rounded-t-[32px] px-6 pt-8 shadow-2xl"
            style={{ paddingBottom: Math.max(insets.bottom, 20) + 20 }}
          >
            <Text className="text-2xl font-bold text-slate-800 mb-2">
              Entrar
            </Text>
            <Text className="text-slate-500 mb-8">
              Acesse sua conta para continuar
            </Text>

            {/* Campo CPF com label */}
            <View className="mb-5">
              <Text className="text-slate-700 font-semibold mb-2 ml-1">
                CPF
              </Text>
              <View
                className={`bg-slate-50 rounded-xl border-2 ${
                  focoCpf ? "border-red-600" : "border-slate-200"
                }`}
              >
                <TextInput
                  value={cpf}
                  onChangeText={setCpf}
                  placeholder="000.000.000-00"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  maxLength={14}
                  onFocus={() => setFocoCpf(true)}
                  onBlur={() => setFocoCpf(false)}
                  className="px-4 py-4 text-slate-800 text-base"
                />
              </View>
            </View>

            {/* Campo Senha com label */}
            <View className="mb-6">
              <Text className="text-slate-700 font-semibold mb-2 ml-1">
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
                  placeholder="Digite sua senha"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry
                  onFocus={() => setFocoSenha(true)}
                  onBlur={() => setFocoSenha(false)}
                  onSubmitEditing={handleLogin}
                  returnKeyType="go"
                  className="px-4 py-4 text-slate-800 text-base"
                />
              </View>
            </View>

            {/* Botão Entrar Premium */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={carregando}
              className={`w-full py-4 rounded-xl shadow-lg mb-6 ${
                carregando ? "bg-slate-400" : "bg-red-600 active:bg-red-700"
              }`}
              style={{
                shadowColor: "#dc2626",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text className="text-center text-white text-lg font-bold">
                {carregando ? "Entrando..." : "Entrar"}
              </Text>
            </TouchableOpacity>

            {/* Créditos da equipe */}
            <View className="border-t border-slate-200 pt-4">
              <Text className="text-slate-400 text-xs text-center leading-5">
                Desenvolvido por{"\n"}
                <Text className="text-slate-600 font-semibold">
                  Ágata Giovanna, Bruno Ramos, Diogo Rodrigues,{"\n"}
                  Flávia Vitória, Gryghor Camonni e Lucas Cabral
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
