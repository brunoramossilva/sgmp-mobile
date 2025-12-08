import { View, Text, TouchableOpacity } from "react-native";
import { OrdemServicoUI } from "./types";
import { corPrioridade } from "./types";
import { IconeLucide } from "../../components/icones";

type Props = {
  ordem: OrdemServicoUI;
  onDetalhes: () => void;
  onAceitar?: () => void;
  onRecusar?: () => void;
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

      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <IconeLucide id="predio" tamanho={14} cor="#64748b" />
          <Text className="text-slate-500 text-xs ml-1">{ordem.local}</Text>
        </View>
        <View className="flex-row items-center">
          <IconeLucide id="calendario" tamanho={14} cor="#64748b" />
          <Text className="text-slate-500 text-xs ml-1">{ordem.data}</Text>
        </View>
      </View>

      {(onAceitar || onRecusar) && (
        <View className="flex-row mt-2 space-x-2">
          {onAceitar && (
            <TouchableOpacity
              onPress={onAceitar}
              className="flex-1 bg-green-600 p-2 rounded-xl mr-2 flex-row items-center justify-center"
            >
              <IconeLucide id="confirmar" tamanho={16} cor="#ffffff" />
              <Text className="text-white font-semibold text-sm ml-1">
                Aceitar
              </Text>
            </TouchableOpacity>
          )}

          {onRecusar && (
            <TouchableOpacity
              onPress={onRecusar}
              className="flex-1 bg-red-600 p-2 rounded-xl flex-row items-center justify-center"
            >
              <IconeLucide id="cancelar" tamanho={16} cor="#ffffff" />
              <Text className="text-white font-semibold text-sm ml-1">
                Recusar
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
