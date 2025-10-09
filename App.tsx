import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";

export default function App() {
  const [perfil, setPerfil] = useState<"morador" | "funcionario">("morador");

  return (
    <View className="flex-1 bg-slate-100 items-center justify-center px-8">
      <StatusBar style="dark" />

      {/* Logo */}
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/295/295128.png",
        }}
        className="w-20 h-20 mb-6"
      />

      {/* Título */}
      <Text className="text-center text-3xl font-bold text-blue-700 mb-2">
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
              ? "bg-blue-600 border-blue-600"
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
              ? "bg-blue-600 border-blue-600"
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
      </View>
      {/* Campo Matrícula */}
      <View className="w-full mb-4">
        <TextInput
          placeholder="Matrícula"
          placeholderTextColor="#94a3b8"
          className="bg-white w-full p-4 rounded-2xl shadow-sm border border-slate-200"
        />
      </View>

      {/* Campo Senha */}
      <View className="w-full mb-6">
        <TextInput
          placeholder="Senha"
          secureTextEntry
          placeholderTextColor="#94a3b8"
          className="bg-white w-full p-4 rounded-2xl shadow-sm border border-slate-200"
        />
      </View>

      {/* Botão Entrar */}
      <TouchableOpacity className="bg-blue-600 w-full p-4 rounded-2xl shadow-md active:bg-blue-700">
        <Text className="text-center text-white text-lg font-semibold">
          Entrar como {perfil === "morador" ? "Morador" : "Funcionário"}
        </Text>
      </TouchableOpacity>
      <View>
        <Text className="mt-6 text-slate-500 mb-8 text-center">
          Developed by: Ágata Giovanna, Bruno Ramos, Diogo Rodrigues, Flávia
          Vitória, Gryghor Camonni e Lucas Cabral
        </Text>
      </View>
    </View>
  );
}
