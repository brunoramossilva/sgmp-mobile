import { Modal, View, Text, TouchableOpacity } from "react-native";
import { OrdemServicoUI } from "./types";

type Props = {
  visible: boolean;
  ordem: OrdemServicoUI | null;
  onClose: () => void;
  onConfirmar: () => void;
};

export default function ModalFinalizacao({
  visible,
  ordem,
  onClose,
  onConfirmar,
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
        <View className="bg-white w-full rounded-2xl p-6">
          <Text className="text-2xl font-bold text-red-700 mb-4 text-center">
            ✓ Finalizar Ordem de Serviço
          </Text>

          <View className="bg-slate-100 p-3 rounded-xl mb-4">
            <Text className="text-lg font-semibold text-slate-800">
              {ordem.titulo}
            </Text>
            <Text className="text-slate-600 text-sm mt-1">
              📍 {ordem.local}
            </Text>
          </View>

          <Text className="text-slate-600 text-center mb-6">
            Tem certeza que deseja finalizar esta ordem de serviço?
          </Text>

          <TouchableOpacity
            onPress={onConfirmar}
            className="bg-green-600 p-4 rounded-xl mb-2"
          >
            <Text className="text-white text-center font-semibold">
              ✓ Confirmar Finalização
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="bg-slate-500 p-4 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
