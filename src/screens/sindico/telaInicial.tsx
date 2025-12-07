import { View, Text, TouchableOpacity, Alert, BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAutenticacao } from "../../contexto/ContextoAutenticacao";
import { useEffect } from "react";

export default function TelaInicial() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { usuario, desautenticar } = useAutenticacao();

  useEffect(() => {
    // Interceptar botão voltar do Android
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleLogout();
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente fazer logout?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          desautenticar();
          navigation.navigate("Login" as never);
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-slate-100">
      {/* Header */}
      <View className="bg-red-600">
        <View
          className="px-4 flex-row items-center justify-between"
          style={{ paddingTop: (insets.top || 0) + 8, paddingBottom: 12 }}
        >
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">Síndico</Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-700 px-3 py-2 rounded-lg"
          >
            <Text className="text-white text-sm font-semibold">Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Seção de informações do usuário com fundo mais claro */}
      <View className="bg-red-700 px-4 pb-4 pt-6">
        <View className="flex-row items-center">
          <View className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4 shadow-md">
            <Text className="text-red-600 text-2xl font-bold">
              {usuario?.nome?.charAt(0).toUpperCase() || "S"}
            </Text>
          </View>
          <View>
            <Text className="text-white text-xl font-semibold">
              Olá, {usuario?.nome || "Síndico"}
            </Text>
            <Text className="text-sm text-white opacity-90">Síndico</Text>
          </View>
        </View>
      </View>

      {/* Conteúdo */}
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-bold mb-4 text-slate-800">
          Tela do Síndico
        </Text>
        <Text className="text-slate-600 mb-8 text-center">
          Espaço para desenvolvimento da tela inicial do síndico.
        </Text>
      </View>
    </View>
  );
}
