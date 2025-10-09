import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 bg-slate-50 items-center justify-center">
      <Text className="text-2xl font-bold text-blue-600 mb-4">SGMP Mobile</Text>
      <Text className="text-lg text-slate-500">Sistema de Gestãoo ✅</Text>
      <StatusBar style="auto" />
    </View>
  );
}
