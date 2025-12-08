import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { OrdemServicoUI } from "./types";
import { corPrioridade, corStatus } from "./types";
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

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-4">
        <View className="bg-white w-full rounded-2xl p-6 max-h-[80%]">
          <Text className="text-2xl font-bold text-red-700 mb-4 text-center">
            Detalhes da OS
          </Text>

          <ScrollView>
            <View className="mb-4">
              <Text className="text-sm font-semibold text-slate-500 mb-1">
                Descrição
              </Text>
              <Text className="text-lg text-slate-800">{ordem.descricao}</Text>
            </View>

            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-sm font-semibold text-slate-500 mb-1">
                  Local
                </Text>
                <Text className="text-base text-slate-700">{ordem.local}</Text>
              </View>

              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-500 mb-1">
                  Data
                </Text>
                <Text className="text-base text-slate-700">{ordem.data}</Text>
              </View>
            </View>

            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-sm font-semibold text-slate-500 mb-1">
                  Solicitante
                </Text>
                <Text className="text-base text-slate-700">
                  {ordem.solicitante}
                </Text>
              </View>

              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-500 mb-1">
                  Prioridade
                </Text>
                <View
                  className={`px-3 py-1 rounded-full self-start ${corPrioridade(
                    ordem.prioridade
                  )}`}
                >
                  <Text className="text-sm font-medium">
                    {ordem.prioridade}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-slate-500 mb-1">
                Status
              </Text>
              <View
                className={`px-3 py-1 rounded-full self-start ${corStatus(
                  ordem.status
                )}`}
              >
                <Text className="text-sm font-medium">{ordem.status}</Text>
              </View>
            </View>

            {ordem.status === "Pendente" && onAceitar && onRecusar && (
              <View className="flex-row mt-4 space-x-2">
                <TouchableOpacity
                  onPress={onAceitar}
                  className="flex-1 bg-green-600 p-3 rounded-xl mr-2 flex-row items-center justify-center"
                >
                  <IconeLucide id="confirmar" tamanho={18} cor="#ffffff" />
                  <Text className="text-white font-semibold ml-2">
                    Aceitar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onRecusar}
                  className="flex-1 bg-red-600 p-3 rounded-xl flex-row items-center justify-center"
                >
                  <IconeLucide id="cancelar" tamanho={18} cor="#ffffff" />
                  <Text className="text-white font-semibold ml-2">
                    Recusar
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {ordem.status === "Aceita" && onFinalizar && (
              <TouchableOpacity
                onPress={onFinalizar}
                className="bg-green-600 p-3 rounded-xl mt-4 flex-row items-center justify-center"
              >
                <IconeLucide id="verificado" tamanho={18} cor="#ffffff" />
                <Text className="text-white font-semibold ml-2">
                  Finalizar OS
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onClose}
              className="bg-slate-500 p-3 rounded-xl mt-3 flex-row items-center justify-center"
            >
              <IconeLucide id="cancelar" tamanho={18} cor="#ffffff" />
              <Text className="text-white font-semibold ml-2">
                Fechar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
