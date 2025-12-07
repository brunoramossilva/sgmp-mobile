import { View, Text, TouchableOpacity } from "react-native";
import { OrdemServicoUI } from "./types";
import { corStatus } from "./types";

type Props = {
  ordem: OrdemServicoUI;
  onDetalhes: () => void;
  onFinalizar: () => void;
};

export default function CardOrdemAceita({
  ordem,
  onDetalhes,
  onFinalizar,
}: Props) {
  return (
    <View className="bg-white p-4 rounded-2xl mb-3 border border-slate-200 shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-slate-800 flex-1">
          {ordem.titulo}
        </Text>
        <View className={`px-2 py-1 rounded-full ${corStatus(ordem.status)}`}>
          <Text className="text-xs font-medium">{ordem.status}</Text>
        </View>
      </View>

      <Text className="text-slate-600 text-sm mb-2" numberOfLines={2}>
        {ordem.descricao}
      </Text>

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-slate-500 text-xs">📍 {ordem.local}</Text>
        <Text className="text-slate-500 text-xs">📅 {ordem.data}</Text>
      </View>

      <View className="flex-row space-x-2">
        <TouchableOpacity
          onPress={onDetalhes}
          className="flex-1 bg-slate-600 p-2 rounded-xl mr-2"
        >
          <Text className="text-white text-center font-semibold text-sm">
            📄 Detalhes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onFinalizar}
          className="flex-1 bg-green-600 p-2 rounded-xl"
        >
          <Text className="text-white text-center font-semibold text-sm">
            ✓ Finalizar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
