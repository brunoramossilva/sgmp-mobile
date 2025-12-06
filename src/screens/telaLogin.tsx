import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAutenticacao } from "../contexto/ContextoAutenticacao";

/**
 * Tela de Login
 * Integrada com contexto de autenticação para capturar dados do usuário
 * Os dados são salvos e disponibilizados via useAutenticacao() em outras telas
 */
export default function TelaLogin() {
  const [perfil, setPerfil] = useState<"morador" | "funcionario" | "sindico">(
    "morador"
  );
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigation = useNavigation();
  const { autenticar } = useAutenticacao();

  // Dados simulados para testes (em produção, viria da API)
  const usuariosMock = {
    morador: {
      cpf: "12345678901",
      nome: "João Silva",
      telefone: "11987654321",
    },
    funcionario: {
      cpf: "98765432109",
      nome: "Maria Santos",
      telefone: "11987654322",
    },
    sindico: {
      cpf: "11122233344",
      nome: "Carlos Oliveira",
      telefone: "11987654323",
    },
  };

  const handleLogin = async () => {
    if (!matricula || !senha) {
      Alert.alert("Validação", "Por favor, preencha todos os campos");
      return;
    }

    setCarregando(true);

    try {
      // Simular chamada de API (será integrado futuramente)
      // const resposta = await fazerLogin(matricula, senha, perfil);
      
      // Por enquanto, usar dados simulados
      const dadosUsuario = usuariosMock[perfil];

      if (matricula === "123" && senha === "123") {
        // Autenticar via contexto
        autenticar({
          cpf: dadosUsuario.cpf,
          nome: dadosUsuario.nome,
          telefone: dadosUsuario.telefone,
          papel: perfil.toUpperCase() as 'MORADOR' | 'FUNCIONARIO' | 'SINDICO',
        });

        navigation.navigate("Inicial" as never);
      } else {
        Alert.alert("Erro", "Matrícula ou senha inválida. Use 123/123 para teste.");
      }
    } catch (erro) {
      Alert.alert("Erro de Login", "Não foi possível realizar o login. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-100 items-center justify-center px-8">
      <StatusBar style="dark" />

      <Image
        source={require("../../assets/sgmp-sem-fundo.png")}
        className="w-72 h-72"
        accessibilityLabel="Logo SGMP"
      />

      <Text className="text-center text-3xl font-bold text-red-700 mb-2">
        Bem-vindo(a) ao SGMP Mobile
      </Text>
      <Text className="text-slate-500 mb-8 text-center">
        Sistema de Gestão e Manutenção Predial
      </Text>

      {/* Seleção de perfil */}
      <View className="flex-row w-full justify-between mb-6">
        <TouchableOpacity
          onPress={() => setPerfil("morador")}
          className={`flex-1 p-3 mr-2 rounded-2xl border ${
            perfil === "morador"
              ? "bg-red-600 border-red-600"
              : "bg-white border-slate-300"
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              perfil === "morador" ? "text-white" : "text-slate-600"
            }`}
          >
            Morador
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setPerfil("funcionario")}
          className={`flex-1 p-3 ml-2 rounded-2xl border ${
            perfil === "funcionario"
              ? "bg-red-600 border-red-600"
              : "bg-white border-slate-300"
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              perfil === "funcionario" ? "text-white" : "text-slate-600"
            }`}
          >
            Funcionário
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setPerfil("sindico")}
          className={`flex-1 p-3 ml-2 rounded-2xl border ${
            perfil === "sindico"
              ? "bg-red-600 border-red-600"
              : "bg-white border-slate-300"
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              perfil === "sindico" ? "text-white" : "text-slate-600"
            }`}
          >
            Síndico
          </Text>
        </TouchableOpacity>
      </View>
      {/* Campo Matrícula */}
      <View className="w-full mb-4">
        <TextInput
          value={matricula}
          onChangeText={setMatricula}
          placeholder="Matrícula (teste: 123)"
          placeholderTextColor="#94a3b8"
          className="bg-white w-full p-4 rounded-2xl shadow-sm border border-slate-200"
        />
      </View>

      {/* Campo Senha */}
      <View className="w-full mb-6">
        <TextInput
          value={senha}
          onChangeText={setSenha}
          placeholder="Senha (teste: 123)"
          secureTextEntry
          placeholderTextColor="#94a3b8"
          className="bg-white w-full p-4 rounded-2xl shadow-sm border border-slate-200"
        />
      </View>

      {/* Botão Entrar */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={carregando}
        className={`w-full p-4 rounded-2xl shadow-md ${
          carregando ? 'bg-slate-400' : 'bg-red-600 active:bg-red-700'
        }`}
      >
        <Text className="text-center text-white text-lg font-semibold">
          {carregando ? 'Entrando...' : 'Entrar'}
        </Text>
      </TouchableOpacity>
      <View>
        <Text className="mt-6 text-slate-500 mb-8 text-center">
          Developed by: Ágata Giovanna, Bruno Ramos, Diogo Rodrigues, Flávia
          Vitória, Gryghor Camonni e Lucas Cabral.
        </Text>
      </View>
    </View>
  );
}
