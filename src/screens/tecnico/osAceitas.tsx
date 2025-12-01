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
import { OrdemServico } from "../../types/ordemServico";

// Dados simulados de Ordens de Serviço aceitas
const ordensIniciais: OrdemServico[] = [
  {
    id: 1,
    titulo: "Reparo na Tubulação",
    descricao:
      "Tubulação do bloco C apresentando vazamento. Necessário substituição de peça.",
    local: "Bloco C - Subsolo",
    solicitante: "Pedro Almeida",
    data: "25/11/2024",
    prioridade: "Alta",
    status: "Aceita",
  },
  {
    id: 2,
    titulo: "Manutenção do Elevador",
    descricao:
      "Elevador do bloco A fazendo barulho estranho durante funcionamento.",
    local: "Bloco A - Elevador Social",
    solicitante: "Ana Costa",
    data: "24/11/2024",
    prioridade: "Alta",
    status: "Aceita",
  },
  {
    id: 3,
    titulo: "Pintura da Garagem",
    descricao: "Paredes da garagem precisam de nova pintura nas faixas.",
    local: "Garagem - Nível 2",
    solicitante: "Roberto Lima",
    data: "23/11/2024",
    prioridade: "Baixa",
    status: "Aceita",
  },
];

export default function OSAceitas() {
  const navigation = useNavigation();
  const [ordens, setOrdens] = useState<OrdemServico[]>(ordensIniciais);
  const [modalDetalhesVisivel, setModalDetalhesVisivel] = useState(false);
  const [modalFinalizacaoVisivel, setModalFinalizacaoVisivel] = useState(false);
  const [ordemSelecionada, setOrdemSelecionada] = useState<OrdemServico | null>(
    null
  );
  const [comentarioFinalizacao, setComentarioFinalizacao] = useState("");

  // Função para abrir modal de detalhes
  const abrirDetalhes = (ordem: OrdemServico) => {
    setOrdemSelecionada(ordem);
    setModalDetalhesVisivel(true);
  };

  // Função para abrir modal de finalização
  const abrirFinalizacao = (ordem: OrdemServico) => {
    setOrdemSelecionada(ordem);
    setComentarioFinalizacao("");
    setModalFinalizacaoVisivel(true);
  };

  // Função para finalizar uma OS
  const finalizarOS = () => {
    if (!ordemSelecionada) return;
    if (!comentarioFinalizacao.trim()) {
      Alert.alert(
        "Campo obrigatório",
        "Por favor, adicione um comentário sobre como a OS foi resolvida."
      );
      return;
    }
    setOrdens((prev) =>
      prev.map((os) =>
        os.id === ordemSelecionada.id ? { ...os, status: "Finalizada" } : os
      )
    );
    setModalFinalizacaoVisivel(false);
    setComentarioFinalizacao("");
    setOrdemSelecionada(null);
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
      case "Aceita":
        return "bg-blue-100 text-blue-700";
      case "Finalizada":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Filtrar ordens aceitas e finalizadas
  const ordensAceitas = ordens.filter((os) => os.status === "Aceita");
  const ordensFinalizadas = ordens.filter((os) => os.status === "Finalizada");

  return (
    <View className="flex-1 bg-slate-100">
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Seção de Ordens Aceitas (Em Andamento) */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-red-700 mb-3">
            🔧 Ordens de Serviço em Andamento
          </Text>
          {ordensAceitas.length === 0 ? (
            <View className="bg-white p-4 rounded-2xl border border-slate-200">
              <Text className="text-slate-500 text-center">
                Nenhuma ordem de serviço em andamento.
              </Text>
            </View>
          ) : (
            ordensAceitas.map((ordem) => (
              <View
                key={ordem.id}
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
                    <Text className="text-xs font-medium">
                      {ordem.prioridade}
                    </Text>
                  </View>
                </View>
                <Text className="text-slate-600 text-sm mb-2" numberOfLines={2}>
                  {ordem.descricao}
                </Text>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-slate-500 text-xs">
                    📍 {ordem.local}
                  </Text>
                  <Text className="text-slate-500 text-xs">
                    📅 {ordem.data}
                  </Text>
                </View>
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={() => abrirDetalhes(ordem)}
                    className="flex-1 bg-slate-600 p-2 rounded-xl mr-2"
                  >
                    <Text className="text-white text-center font-semibold text-sm">
                      📄 Detalhes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => abrirFinalizacao(ordem)}
                    className="flex-1 bg-green-600 p-2 rounded-xl"
                  >
                    <Text className="text-white text-center font-semibold text-sm">
                      ✓ Finalizar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Seção de Ordens Finalizadas */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-red-700 mb-3">
            ✅ Ordens de Serviço Finalizadas
          </Text>
          {ordensFinalizadas.length === 0 ? (
            <View className="bg-white p-4 rounded-2xl border border-slate-200">
              <Text className="text-slate-500 text-center">
                Nenhuma ordem de serviço finalizada.
              </Text>
            </View>
          ) : (
            ordensFinalizadas.map((ordem) => (
              <TouchableOpacity
                key={ordem.id}
                onPress={() => abrirDetalhes(ordem)}
                className="bg-white p-4 rounded-2xl mb-3 border border-slate-200 shadow-sm opacity-70"
              >
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-lg font-semibold text-slate-800 flex-1">
                    {ordem.titulo}
                  </Text>
                  <View
                    className={`px-2 py-1 rounded-full ${corStatus(
                      ordem.status
                    )}`}
                  >
                    <Text className="text-xs font-medium">{ordem.status}</Text>
                  </View>
                </View>
                <Text className="text-slate-600 text-sm mb-2" numberOfLines={2}>
                  {ordem.descricao}
                </Text>
                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-500 text-xs">
                    📍 {ordem.local}
                  </Text>
                  <Text className="text-slate-500 text-xs">
                    📅 {ordem.data}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Botão Voltar */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-red-600 p-4 rounded-2xl mb-6"
        >
          <Text className="text-white text-center font-semibold">Voltar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Detalhes da Ordem de Serviço */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDetalhesVisivel}
        onRequestClose={() => setModalDetalhesVisivel(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white w-full rounded-2xl p-6 max-h-[80%]">
            <Text className="text-2xl font-bold text-red-700 mb-4 text-center">
              📋 Detalhes da OS
            </Text>
            {ordemSelecionada && (
              <ScrollView>
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-slate-500 mb-1">
                    Título
                  </Text>
                  <Text className="text-lg text-slate-800">
                    {ordemSelecionada.titulo}
                  </Text>
                </View>
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-slate-500 mb-1">
                    Descrição
                  </Text>
                  <Text className="text-base text-slate-700">
                    {ordemSelecionada.descricao}
                  </Text>
                </View>
                <View className="flex-row mb-4">
                  <View className="flex-1 mr-2">
                    <Text className="text-sm font-semibold text-slate-500 mb-1">
                      Local
                    </Text>
                    <Text className="text-base text-slate-700">
                      {ordemSelecionada.local}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-slate-500 mb-1">
                      Data
                    </Text>
                    <Text className="text-base text-slate-700">
                      {ordemSelecionada.data}
                    </Text>
                  </View>
                </View>
                <View className="flex-row mb-4">
                  <View className="flex-1 mr-2">
                    <Text className="text-sm font-semibold text-slate-500 mb-1">
                      Solicitante
                    </Text>
                    <Text className="text-base text-slate-700">
                      {ordemSelecionada.solicitante}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-slate-500 mb-1">
                      Prioridade
                    </Text>
                    <View
                      className={`px-3 py-1 rounded-full self-start ${corPrioridade(
                        ordemSelecionada.prioridade
                      )}`}
                    >
                      <Text className="text-sm font-medium">
                        {ordemSelecionada.prioridade}
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
                      ordemSelecionada.status
                    )}`}
                  >
                    <Text className="text-sm font-medium">
                      {ordemSelecionada.status}
                    </Text>
                  </View>
                </View>

                {/* Botão de finalizar para OS Aceitas */}
                {ordemSelecionada.status === "Aceita" && (
                  <TouchableOpacity
                    onPress={() => {
                      setModalDetalhesVisivel(false);
                      abrirFinalizacao(ordemSelecionada);
                    }}
                    className="bg-green-600 p-3 rounded-xl mt-4"
                  >
                    <Text className="text-white text-center font-semibold">
                      ✓ Finalizar OS
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => setModalDetalhesVisivel(false)}
                  className="bg-slate-500 p-3 rounded-xl mt-3"
                >
                  <Text className="text-white text-center font-semibold">
                    Fechar
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Finalização da Ordem de Serviço */}
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
            {ordemSelecionada && (
              <>
                <View className="bg-slate-100 p-3 rounded-xl mb-4">
                  <Text className="text-lg font-semibold text-slate-800">
                    {ordemSelecionada.titulo}
                  </Text>
                  <Text className="text-slate-600 text-sm mt-1">
                    📍 {ordemSelecionada.local}
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
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
