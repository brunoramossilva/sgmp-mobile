import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function DevMorador() {
  const navigation = useNavigation();
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold mb-4">Tela de Morador</Text>
      <Text className="text-slate-600 mb-8 text-center">
        Espaço para desenvolvimento da tela inicial do morador.
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
