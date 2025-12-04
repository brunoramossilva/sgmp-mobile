import { View, Text, TouchableOpacity } from "react-native";
import { OrdemServicoUI } from "./types";
import { corPrioridade } from "./types";

type Props = {
  ordem: OrdemServicoUI;
  onDetalhes: () => void;
  onAceitar: () => void;
  onRecusar: () => void;
};

export default function CardOrdemPendente({
  ordem,
  onDetalhes,
  onAceitar,
  onRecusar,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onDetalhes}
      className="bg-white p-4 rounded-2xl mb-3 border border-slate-200 shadow-sm"
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-slate-800 flex-1">
          {ordem.titulo}
        </Text>
        <View
          className={`px-2 py-1 rounded-full ${corPrioridade(
            ordem.prioridade
          )}`}
        >
          <Text className="text-xs font-medium">{ordem.prioridade}</Text>
        </View>
      </View>

      <Text className="text-slate-600 text-sm mb-2" numberOfLines={2}>
        {ordem.descricao}
      </Text>

      <View className="flex-row justify-between items-center">
        <Text className="text-slate-500 text-xs">📍 {ordem.local}</Text>
        <Text className="text-slate-500 text-xs">📅 {ordem.data}</Text>
      </View>

      <View className="flex-row mt-3 space-x-2">
        <TouchableOpacity
          onPress={onAceitar}
          className="flex-1 bg-green-600 p-2 rounded-xl mr-2"
        >
          <Text className="text-white text-center font-semibold text-sm">
            ✓ Aceitar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onRecusar}
          className="flex-1 bg-red-600 p-2 rounded-xl"
        >
          <Text className="text-white text-center font-semibold text-sm">
            ✕ Recusar
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
