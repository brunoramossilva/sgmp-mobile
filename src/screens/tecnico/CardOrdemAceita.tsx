import { View, Text, TouchableOpacity } from "react-native";
import { OrdemServicoUI, corStatus } from "../../utils/mapeadores";
import { IconeLucide } from "../../components/icones";

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
    <View className="bg-white rounded-2xl mb-4 overflow-hidden shadow-sm border border-slate-100">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-blue-50">
            <IconeLucide id="servicos" tamanho={20} cor="#3b82f6" />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-slate-500 font-medium mb-0.5">
              Ordem de Serviço #{ordem.id}
            </Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full mr-1.5 bg-blue-500" />
              <Text className="text-xs font-bold uppercase text-blue-600">
                Em Execução
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
      <View className="border-t border-slate-100 px-4 py-3">
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={onDetalhes}
            className="flex-1 bg-slate-100 py-3 rounded-xl flex-row items-center justify-center"
            activeOpacity={0.7}
          >
            <IconeLucide id="criar-os" tamanho={18} cor="#475569" />
            <Text className="text-slate-700 font-bold text-sm ml-2">
              Ver Detalhes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onFinalizar}
            className="flex-1 bg-green-600 py-3 rounded-xl flex-row items-center justify-center shadow-sm"
            activeOpacity={0.7}
          >
            <IconeLucide id="confirmar" tamanho={18} cor="#ffffff" />
            <Text className="text-white font-bold text-sm ml-2">Finalizar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
