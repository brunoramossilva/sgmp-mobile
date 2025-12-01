import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { OrdemServico } from "../types/ordemServico";

// Dados simulados para demonstração
const ordemExemplo: OrdemServico = {
  id: 1,
  titulo: "Vazamento no Banheiro",
  descricao:
    "Há um vazamento na torneira do banheiro do apartamento 101. O morador relatou que o problema começou há cerca de 3 dias e está piorando progressivamente. A água está vazando mesmo com a torneira fechada.",
  local: "Bloco A - Apt 101",
  solicitante: "João Silva",
  data: "28/11/2024",
  prioridade: "Alta",
  status: "Aceita",
};

export default function DetalhesOS() {
  const navigation = useNavigation();
  const [ordem, setOrdem] = useState<OrdemServico>(ordemExemplo);
  const [modalFinalizacaoVisivel, setModalFinalizacaoVisivel] = useState(false);
  const [comentarioFinalizacao, setComentarioFinalizacao] = useState("");

  // Função para aceitar a OS
  const aceitarOS = () => {
    setOrdem((prev) => ({ ...prev, status: "Aceita" }));
  };

  // Função para recusar a OS
  const recusarOS = () => {
    setOrdem((prev) => ({ ...prev, status: "Recusada" }));
  };

  // Função para finalizar a OS
  const finalizarOS = () => {
    if (!comentarioFinalizacao.trim()) {
      Alert.alert(
        "Campo obrigatório",
        "Por favor, adicione um comentário sobre como a OS foi resolvida."
      );
      return;
    }
    setOrdem((prev) => ({
      ...prev,
      status: "Finalizada",
      comentarioResolucao: comentarioFinalizacao,
    }));
    setModalFinalizacaoVisivel(false);
    setComentarioFinalizacao("");
  };

  // Função para obter a cor da prioridade
  const corPrioridade = (prioridade: string) => {
    switch (prioridade) {
      case "Alta":
        return "bg-red-100 text-red-700";
      case "Média":
        return "bg-yellow-100 text-yellow-700";
      case "Baixa":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Função para obter a cor do status
  const corStatus = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-orange-100 text-orange-700";
      case "Aceita":
        return "bg-blue-100 text-blue-700";
      case "Recusada":
        return "bg-red-100 text-red-700";
      case "Finalizada":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <View className="flex-1 bg-slate-100">
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Cabeçalho */}
        <View className="bg-white p-4 rounded-2xl mb-4 border border-slate-200 shadow-sm">
          <View className="flex-row justify-between items-start mb-3">
            <Text className="text-2xl font-bold text-red-700 flex-1">
              📋 {ordem.titulo}
            </Text>
          </View>
          <View className="flex-row space-x-2">
            <View
              className={`px-3 py-1 rounded-full ${corPrioridade(ordem.prioridade)}`}
            >
              <Text className="text-sm font-medium">
                Prioridade: {ordem.prioridade}
              </Text>
            </View>
            <View
              className={`px-3 py-1 rounded-full ${corStatus(ordem.status)}`}
            >
              <Text className="text-sm font-medium">{ordem.status}</Text>
            </View>
          </View>
        </View>

        {/* Detalhes da OS */}
        <View className="bg-white p-4 rounded-2xl mb-4 border border-slate-200 shadow-sm">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            📝 Descrição do Problema
          </Text>
          <Text className="text-base text-slate-700 leading-6">
            {ordem.descricao}
          </Text>
        </View>

        {/* Informações Adicionais */}
        <View className="bg-white p-4 rounded-2xl mb-4 border border-slate-200 shadow-sm">
          <Text className="text-lg font-bold text-slate-800 mb-3">
            ℹ️ Informações
          </Text>

          <View className="mb-3">
            <Text className="text-sm font-semibold text-slate-500 mb-1">
              📍 Local
            </Text>
            <Text className="text-base text-slate-700">{ordem.local}</Text>
          </View>

          <View className="mb-3">
            <Text className="text-sm font-semibold text-slate-500 mb-1">
              👤 Solicitante
            </Text>
            <Text className="text-base text-slate-700">{ordem.solicitante}</Text>
          </View>

          <View className="mb-3">
            <Text className="text-sm font-semibold text-slate-500 mb-1">
              📅 Data da Solicitação
            </Text>
            <Text className="text-base text-slate-700">{ordem.data}</Text>
          </View>

          <View>
            <Text className="text-sm font-semibold text-slate-500 mb-1">
              🔢 Número da OS
            </Text>
            <Text className="text-base text-slate-700">#{ordem.id}</Text>
          </View>
        </View>

        {/* Comentário de Resolução (se finalizada) */}
        {ordem.status === "Finalizada" && ordem.comentarioResolucao && (
          <View className="bg-green-50 p-4 rounded-2xl mb-4 border border-green-200 shadow-sm">
            <Text className="text-lg font-bold text-green-700 mb-3">
              ✅ Resolução
            </Text>
            <Text className="text-base text-green-800 leading-6">
              {ordem.comentarioResolucao}
            </Text>
          </View>
        )}

        {/* Botões de Ação */}
        <View className="mb-6">
          {/* Botões para OS Pendente */}
          {ordem.status === "Pendente" && (
            <View className="flex-row space-x-2 mb-3">
              <TouchableOpacity
                onPress={aceitarOS}
                className="flex-1 bg-green-600 p-4 rounded-xl mr-2"
              >
                <Text className="text-white text-center font-semibold">
                  ✓ Aceitar OS
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={recusarOS}
                className="flex-1 bg-red-600 p-4 rounded-xl"
              >
                <Text className="text-white text-center font-semibold">
                  ✕ Recusar OS
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Botão para OS Aceita */}
          {ordem.status === "Aceita" && (
            <TouchableOpacity
              onPress={() => setModalFinalizacaoVisivel(true)}
              className="bg-green-600 p-4 rounded-xl mb-3"
            >
              <Text className="text-white text-center font-semibold">
                ✓ Finalizar OS
              </Text>
            </TouchableOpacity>
          )}

          {/* Botão Voltar */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-red-600 p-4 rounded-2xl"
          >
            <Text className="text-white text-center font-semibold">Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Finalização */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalFinalizacaoVisivel}
        onRequestClose={() => setModalFinalizacaoVisivel(false)}
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
            <Text className="text-sm font-semibold text-slate-500 mb-2">
              Como o problema foi resolvido? *
            </Text>
            <TextInput
              value={comentarioFinalizacao}
              onChangeText={setComentarioFinalizacao}
              placeholder="Descreva como você resolveu o problema..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="bg-slate-100 p-4 rounded-xl border border-slate-200 mb-4 min-h-[120px]"
            />
            <TouchableOpacity
              onPress={finalizarOS}
              className="bg-green-600 p-4 rounded-xl mb-2"
            >
              <Text className="text-white text-center font-semibold">
                ✓ Confirmar Finalização
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalFinalizacaoVisivel(false);
                setComentarioFinalizacao("");
              }}
              className="bg-slate-500 p-4 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}