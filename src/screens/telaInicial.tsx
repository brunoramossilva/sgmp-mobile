import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function TelaInicial() {
  const navigation = useNavigation();
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-red-600 mb-6 text-center">
        Bem-vindo ao SGMP! Escolha a tela que você deseja programar:
      </Text>

      <View className="w-full space-y-4">
        <TouchableOpacity
          onPress={() => navigation.navigate("InicialMorador" as never)}
          className="bg-red-600 p-4 rounded-2xl"
        >
          <Text className="text-white text-center font-semibold">
            Tela Inicial do Morador
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("InicialTecnico" as never)}
          className="bg-red-600 p-4 rounded-2xl"
        >
          <Text className="text-white text-center font-semibold">
            Tela Inicial do Técnico
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("InicialSindico" as never)}
          className="bg-red-600 p-4 rounded-2xl"
        >
          <Text className="text-white text-center font-semibold">
            Tela Inicial do Síndico
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("CriacaoOsMorador" as never)}
          className="bg-red-600 p-4 rounded-2xl"
        >
          <Text className="text-white text-center font-semibold">
            Tela de Criação de OS do Morador
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("OsAceitaPeloTecnico" as never)}
          className="bg-red-600 p-4 rounded-2xl"
        >
          <Text className="text-white text-center font-semibold">
            Tela de OS Aceitas pelo Técnico
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("DetalhesOs" as never)}
          className="bg-red-600 p-4 rounded-2xl"
        >
          <Text className="text-white text-center font-semibold">
            Tela de Detalhes da OS
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
