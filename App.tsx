import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50">
      <Text className="text-3xl font-bold text-blue-600 mb-4">SGMP Mobile</Text>
      <Text className="text-lg text-gray-600">
        Sistema de SGMP - Configurado!
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
