import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function DevTecnico() {
  const navigation = useNavigation();
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold mb-4">Tela para Técnico e Síndico</Text>
      <Text className="text-slate-600 mb-8 text-center">
        Espaço para desenvolvimento da tela onde os técnicos e os síndicos verão uma OS especificamente com mais detalhes.
      </Text>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="bg-red-600 px-6 py-3 rounded-2xl"
      >
        <Text className="text-white">Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}
