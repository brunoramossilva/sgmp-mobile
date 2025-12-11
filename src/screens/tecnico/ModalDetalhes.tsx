import { Modal, View, Text, TouchableOpacity } from "react-native";
import { OrdemServicoUI } from "./types";
import { IconeLucide } from "../../components/icones";

type Props = {
  visible: boolean;
  ordem: OrdemServicoUI | null;
  onClose: () => void;
  onAceitar?: () => void;
  onRecusar?: () => void;
  onFinalizar?: () => void;
};

export default function ModalDetalhes({
  visible,
  ordem,
  onClose,
  onAceitar,
  onRecusar,
  onFinalizar,
}: Props) {
  if (!ordem) return null;

  const showActionButtons =
    ordem.status === "Pendente" && onAceitar && onRecusar;
  const showFinalizeButton = ordem.status === "Aceita" && onFinalizar;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-5">
        <View className="bg-white rounded-3xl w-full max-h-[85%] overflow-hidden shadow-lg">
          {/* Header Vermelho */}
          <View className="bg-red-600 px-5 pt-5 pb-4">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center flex-1">
                <View className="w-11 h-11 bg-white/20 rounded-xl items-center justify-center mr-3">
                  <IconeLucide id="criar-os" tamanho={24} cor="#ffffff" />
                </View>
                <Text className="text-xl font-bold text-white">
                  Detalhes da OS
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 bg-white/20 rounded-full items-center justify-center"
                activeOpacity={0.7}
              >
                <Text className="text-2xl text-white font-bold -mt-0.5">×</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-white/90 font-medium">
              Ordem de Serviço #{ordem.id}
            </Text>
          </View>

          <View className="p-5 pb-6">
            {/* Card Descrição */}
            <View className="bg-red-50 rounded-2xl p-4 mb-4 border-2 border-red-300">
              <View className="flex-row items-center mb-3 pb-3 border-b border-red-200">
                <IconeLucide id="servicos" tamanho={18} cor="#dc2626" />
                <Text className="text-base font-bold text-red-900 ml-2.5">
                  Descrição
                </Text>
              </View>
              <Text className="text-[15px] font-medium text-red-950 leading-5.5">
                {ordem.descricao}
              </Text>
            </View>

            {/* Card Informações */}
            <View className="bg-red-50 rounded-2xl p-4 mb-4 border-2 border-red-300">
              <View className="flex-row items-center mb-3 pb-3 border-b border-red-200">
                <IconeLucide id="predio" tamanho={18} cor="#dc2626" />
                <Text className="text-base font-bold text-red-900 ml-2.5">
                  Informações
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-red-900 mb-1 uppercase">
                    Local
                  </Text>
                  <Text className="text-sm font-semibold text-red-950">
                    {ordem.local}
                  </Text>
                </View>
                <View className="w-px h-[30px] bg-red-200 mx-3" />
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-red-900 mb-1 uppercase">
                    Data
                  </Text>
                  <Text className="text-sm font-semibold text-red-950">
                    {ordem.data}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center mt-3">
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-red-900 mb-1 uppercase">
                    Solicitante
                  </Text>
                  <Text className="text-sm font-semibold text-red-950">
                    {ordem.solicitante}
                  </Text>
                </View>
                <View className="w-px h-[30px] bg-red-200 mx-3" />
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-red-900 mb-1 uppercase">
                    Prioridade
                  </Text>
                  <View className="bg-red-100 px-2.5 py-1 rounded-lg self-start">
                    <Text className="text-[13px] font-bold text-red-900">
                      {ordem.prioridade}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mt-4 pt-4 border-t border-red-200">
                <Text className="text-xs font-semibold text-red-900 mb-1 uppercase">
                  Status
                </Text>
                <View className="bg-red-100 px-3 py-1.5 rounded-xl self-start mt-1.5">
                  <Text className="text-sm font-bold text-red-900">
                    {ordem.status}
                  </Text>
                </View>
              </View>
            </View>

            {/* Botões de Ação */}
            {showActionButtons && (
              <View className="flex-row gap-3 mt-2">
                <TouchableOpacity
                  onPress={onAceitar}
                  className="flex-1 bg-green-600 py-3.5 rounded-xl flex-row items-center justify-center shadow-md"
                  activeOpacity={0.8}
                >
                  <IconeLucide id="confirmar" tamanho={20} cor="#ffffff" />
                  <Text className="text-white text-[15px] font-bold ml-2">
                    Aceitar OS
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onRecusar}
                  className="flex-1 bg-red-600 py-3.5 rounded-xl flex-row items-center justify-center shadow-md"
                  activeOpacity={0.8}
                >
                  <IconeLucide id="cancelar" tamanho={20} cor="#ffffff" />
                  <Text className="text-white text-[15px] font-bold ml-2">
                    Recusar
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {showFinalizeButton && (
              <TouchableOpacity
                onPress={onFinalizar}
                className="bg-green-600 py-4 rounded-xl flex-row items-center justify-center mt-2 shadow-lg"
                activeOpacity={0.8}
              >
                <IconeLucide id="confirmar" tamanho={20} cor="#ffffff" />
                <Text className="text-white text-base font-bold ml-2">
                  Finalizar OS
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onClose}
              className="bg-slate-100 py-4 rounded-xl items-center justify-center mt-3"
              activeOpacity={0.7}
            >
              <Text className="text-slate-600 text-base font-semibold">
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
