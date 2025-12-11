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
  const prioridadeConfig = {
    Alta: { color: "#dc2626", bg: "#fee2e2", icon: "alerta" },
    Média: { color: "#f59e0b", bg: "#fef3c7", icon: "alerta" },
    Baixa: { color: "#10b981", bg: "#d1fae5", icon: "verificado" },
  };

  const config = prioridadeConfig[ordem.prioridade] || prioridadeConfig.Média;

  return (
    <View className="bg-white rounded-2xl mb-4 overflow-hidden shadow-sm border border-slate-100">
      {/* Header com prioridade */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <View className="flex-row items-center flex-1">
          <View
            className="w-10 h-10 rounded-xl items-center justify-center mr-3"
            style={{ backgroundColor: config.bg }}
          >
            <IconeLucide id="servicos" tamanho={20} cor={config.color} />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-slate-500 font-medium mb-0.5">
              Ordem de Serviço #{ordem.id}
            </Text>
            <View className="flex-row items-center">
              <View
                className="w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: config.color }}
              />
              <Text
                className="text-xs font-bold uppercase"
                style={{ color: config.color }}
              >
                {ordem.prioridade}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Descrição */}
      <View className="px-4 pb-3">
        <Text
          className="text-slate-800 font-semibold text-[15px] leading-5"
          numberOfLines={2}
        >
          {ordem.descricao}
        </Text>
      </View>

      {/* Info */}
      <View className="px-4 pb-4">
        <View className="flex-row items-center bg-slate-50 rounded-xl p-3">
          <View className="flex-row items-center flex-1">
            <IconeLucide id="predio" tamanho={16} cor="#64748b" />
            <Text
              className="text-slate-600 text-xs font-medium ml-2"
              numberOfLines={1}
            >
              {ordem.local}
            </Text>
          </View>
          <View className="w-px h-4 bg-slate-200 mx-3" />
          <View className="flex-row items-center">
            <IconeLucide id="calendario" tamanho={16} cor="#64748b" />
            <Text className="text-slate-600 text-xs font-medium ml-2">
              {ordem.data}
            </Text>
          </View>
        </View>
      </View>

      {/* Ações */}
      {(onAceitar || onRecusar) && (
        <View className="border-t border-slate-100 px-4 py-3">
          <View className="flex-row gap-2">
            {onRecusar && (
              <TouchableOpacity
                onPress={onRecusar}
                className="flex-1 bg-slate-100 py-3 rounded-xl flex-row items-center justify-center"
                activeOpacity={0.7}
              >
                <IconeLucide id="cancelar" tamanho={18} cor="#475569" />
                <Text className="text-slate-700 font-bold text-sm ml-2">
                  Recusar
                </Text>
              </TouchableOpacity>
            )}
            {onAceitar && (
              <TouchableOpacity
                onPress={onAceitar}
                className="flex-1 bg-red-600 py-3 rounded-xl flex-row items-center justify-center shadow-sm"
                activeOpacity={0.7}
              >
                <IconeLucide id="confirmar" tamanho={18} cor="#ffffff" />
                <Text className="text-white font-bold text-sm ml-2">
                  Aceitar Tarefa
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
