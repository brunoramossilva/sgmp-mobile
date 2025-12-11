import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { OrdemServicoUI } from "./types";
import { IconeLucide } from "../../components/icones";

type Props = {
  visible: boolean;
  ordem: OrdemServicoUI | null;
  onClose: () => void;
  onConfirmar: (solucao: string) => void;
};

export default function ModalFinalizacao({
  visible,
  ordem,
  onClose,
  onConfirmar,
}: Props) {
  const [solucao, setSolucao] = useState("");

  const handleConfirmar = () => {
    onConfirmar(solucao);
    setSolucao("");
  };

  const handleClose = () => {
    setSolucao("");
    onClose();
  };

  if (!ordem) return null;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center items-center bg-black/50 px-5"
      >
        <View className="bg-white rounded-3xl w-full max-h-[75%] overflow-hidden">
          {/* Header Verde */}
          <View className="bg-green-600 px-5 pt-5 pb-4">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center flex-1">
                <View className="w-11 h-11 bg-white/20 rounded-xl items-center justify-center mr-3">
                  <IconeLucide id="confirmar" tamanho={24} cor="#ffffff" />
                </View>
                <Text className="text-white text-xl font-bold">
                  Finalizar Ordem
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                className="w-8 h-8 bg-white/20 rounded-full items-center justify-center"
                activeOpacity={0.7}
              >
                <Text
                  className="text-white text-2xl font-bold"
                  style={{ marginTop: -2 }}
                >
                  ×
                </Text>
              </TouchableOpacity>
            </View>
            <Text className="text-white/90 text-sm font-medium">
              Ordem de Serviço #{ordem.id}
            </Text>
          </View>

          {/* Info da Ordem */}
          <View className="bg-slate-50 rounded-2xl p-4 mx-5 mt-5 mb-3 border-2 border-slate-200">
            <View className="flex-row items-start mb-3 pb-3 border-b border-slate-200">
              <IconeLucide id="servicos" tamanho={18} cor="#64748b" />
              <Text className="text-slate-700 text-[15px] font-semibold ml-2.5 flex-1 leading-5">
                {ordem.descricao}
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="flex-row items-center flex-1">
                <IconeLucide id="predio" tamanho={14} cor="#64748b" />
                <Text className="text-slate-600 text-xs font-medium ml-1.5">
                  {ordem.local}
                </Text>
              </View>
              <View className="w-px h-3.5 bg-slate-300 mx-3" />
              <View className="flex-row items-center">
                <IconeLucide id="calendario" tamanho={14} cor="#64748b" />
                <Text className="text-slate-600 text-xs font-medium ml-1.5">
                  {ordem.data}
                </Text>
              </View>
            </View>
          </View>

          {/* Campo de Solução */}
          <View className="px-5 mb-5">
            <Text className="text-slate-700 font-bold text-[15px] mb-2.5">
              Solução Realizada
            </Text>
            <TextInput
              value={solucao}
              onChangeText={setSolucao}
              placeholder="Descreva o serviço realizado (opcional)..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              className="bg-gray-50 border-2 border-slate-300 rounded-xl p-3.5 text-slate-800 text-sm"
              style={{ minHeight: 120 }}
            />
            <Text className="text-slate-400 text-xs mt-2 italic">
              Campo opcional. Você pode deixar em branco.
            </Text>
          </View>

          {/* Botões */}
          <View className="px-5 pb-6 gap-3">
            <TouchableOpacity
              onPress={handleConfirmar}
              className="bg-green-600 py-4 rounded-xl flex-row items-center justify-center shadow-lg"
              activeOpacity={0.8}
            >
              <IconeLucide id="confirmar" tamanho={20} cor="#ffffff" />
              <Text className="text-white font-bold text-base ml-2">
                Confirmar Finalização
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleClose}
              className="bg-slate-100 py-4 rounded-xl"
              activeOpacity={0.7}
            >
              <Text className="text-slate-700 font-semibold text-base text-center">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
