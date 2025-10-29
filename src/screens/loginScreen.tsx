import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const [perfil, setPerfil] = useState<"morador" | "funcionario" | "sindico">("morador");
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");

  const navigation = useNavigation();

  const handleLogin = () => {
    if (!matricula || !senha) {
      alert("Por favor, preencha todos os campos");
      return;
    }
    navigation.navigate("Home" as never);
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
          placeholder="Matrícula"
          placeholderTextColor="#94a3b8"
          className="bg-white w-full p-4 rounded-2xl shadow-sm border border-slate-200"
        />
      </View>

      {/* Campo Senha */}
      <View className="w-full mb-6">
        <TextInput
          value={senha}
          onChangeText={setSenha}
          placeholder="Senha"
          secureTextEntry
          placeholderTextColor="#94a3b8"
          className="bg-white w-full p-4 rounded-2xl shadow-sm border border-slate-200"
        />
      </View>

      {/* Botão Entrar */}
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-red-600 w-full p-4 rounded-2xl shadow-md active:bg-red-700"
      >
        <Text className="text-center text-white text-lg font-semibold">
          Entrar
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
