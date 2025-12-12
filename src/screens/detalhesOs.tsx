import { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconeLucide } from "../components/icones";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BotaoVoltar } from "../components/navegacao";
import { OrdemServicoUI } from "../utils/mapeadores";

// Fallback local para uso offline/demonstrativo
const ordemFallback: OrdemServicoUI = {
  id: 1,
  titulo: "Vazamento no Banheiro",
  descricao:
    "Há um vazamento na torneira do banheiro do apartamento 101. O morador relatou que o problema começou há cerca de 3 dias e está piorando progressivamente. A água está vazando mesmo com a torneira fechada.",
  solicitante: "João Silva",
  dataAbertura: "28/11/2024",
  data: "28/11/2024",
  diasEmAberto: 3,
  prioridade: "Alta",
  status: "Aceita",
  local: "Condomínio Vista Verde",
  cpf_morador: "00000000000",
};

type RouteParams = {
  ordem?: OrdemServicoUI;
  readOnly?: boolean;
};

// View-model interno para manter a tela agnóstica da API
type OrdemDetalheView = {
  id: number;
  titulo: string;
  descricao: string;
  local: string;
  solicitante: string;
  data: string;
  prioridade: OrdemServicoUI["prioridade"];
  status: OrdemServicoUI["status"];
  comentarioResolucao?: string;
  dataConclusao?: string;
};

export default function DetalhesOS() {
  const navigation = useNavigation();
  const route = useRoute();
  const { ordem: ordemParam, readOnly } = (route.params as RouteParams) || {};

  const ordemInicial = useMemo(() => ordemParam ?? ordemFallback, [ordemParam]);

  const [ordem, setOrdem] = useState<OrdemDetalheView>(() => {
    let dataConclusao = ordemInicial.dataConclusao;
    // Se a ordem já está finalizada mas não tem dataConclusao, usa a data atual como fallback
    if (ordemInicial.status === "Finalizada" && !dataConclusao) {
      const hoje = new Date();
      const dia = String(hoje.getDate()).padStart(2, "0");
      const mes = String(hoje.getMonth() + 1).padStart(2, "0");
      const ano = hoje.getFullYear();
      dataConclusao = `${dia}/${mes}/${ano}`;
    }
    return {
      id: ordemInicial.id,
      titulo: ordemInicial.titulo,
      descricao: ordemInicial.descricao,
      local: "Condomínio Vista Verde",
      solicitante: ordemInicial.solicitante,
      data: ordemInicial.dataAbertura,
      prioridade: ordemInicial.prioridade,
      status: ordemInicial.status,
      // comentarioResolucao só é preenchido ao finalizar na tela
      dataConclusao,
    };
  });
  const [modalFinalizacaoVisivel, setModalFinalizacaoVisivel] = useState(false);
  const [comentarioFinalizacao, setComentarioFinalizacao] = useState("");

  // Função para aceitar a OS
  const aceitarOS = () => {
    if (readOnly) return;
    setOrdem((prev) => ({ ...prev, status: "Aceita" }));
  };

  // Função para recusar a OS
  const recusarOS = () => {
    if (readOnly) return;
    setOrdem((prev) => ({ ...prev, status: "Recusada" }));
  };

  // Mapper para enviar para API (quando técnico/síndico atualizar status)
  const prepararPayloadAtualizacao = (
    novoStatus: OrdemServicoUI["status"]
  ): Partial<OrdemServicoUI> => {
    return {
      status: novoStatus,
      statusApi:
        novoStatus === "Finalizada"
          ? "CONCLUIDA"
          : novoStatus === "Aceita"
          ? "EM_EXECUCAO"
          : novoStatus === "Recusada"
          ? "RECUSADA"
          : "PENDENTE_APROVACAO",
    };
  };

  // Função para finalizar a OS
  const finalizarOS = () => {
    if (readOnly) return;
    if (!comentarioFinalizacao.trim()) {
      Alert.alert(
        "Campo obrigatório",
        "Por favor, adicione um comentário sobre como a OS foi resolvida."
      );
      return;
    }
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();
    const dataConclusao = `${dia}/${mes}/${ano}`;
    setOrdem((prev) => ({
      ...prev,
      status: "Finalizada",
      comentarioResolucao: comentarioFinalizacao,
      dataConclusao,
    }));
    setModalFinalizacaoVisivel(false);
    setComentarioFinalizacao("");
  };

  // Função para obter cores e configuração da prioridade
  const corPrioridade = (prioridade: string) => {
    switch (prioridade) {
      case "Alta":
        return { bg: "bg-red-100", text: "text-red-700" };
      case "Média":
        return { bg: "bg-yellow-100", text: "text-yellow-700" };
      case "Baixa":
        return { bg: "bg-green-100", text: "text-green-700" };
      default:
        return { bg: "bg-slate-100", text: "text-slate-700" };
    }
  };

  // Função para obter cores e configuração do status
  const corStatus = (status: string) => {
    switch (status) {
      case "Pendente":
        return { bg: "bg-orange-100", text: "text-orange-700" };
      case "Aceita":
        return { bg: "bg-blue-100", text: "text-blue-700" };
      case "Recusada":
        return { bg: "bg-red-100", text: "text-red-700" };
      case "Finalizada":
        return { bg: "bg-green-100", text: "text-green-700" };
      default:
        return { bg: "bg-slate-100", text: "text-slate-700" };
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#dc2626" />

      <View className="flex-1 bg-white">
        {/* Hero/Header brand */}
        <View className="bg-red-600 px-4 pb-4 pt-5">
          <View className="flex-row items-center justify-between">
            <BotaoVoltar />
            <Text className="text-white text-xl font-bold">
              Detalhes da Ordem
            </Text>
            <View className="w-10" />
          </View>
        </View>

        <ScrollView
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {/* Cabeçalho com Prioridade e Status */}
          <View className="bg-white p-4 rounded-2xl mb-4 border border-slate-200 shadow-sm">
            <Text className="text-xl font-bold text-slate-800 mb-1">
              Ordem de Serviço #{ordem.id}
            </Text>
            <Text className="text-sm text-slate-500 mb-3">
              Solicitado por {ordem.solicitante} em {ordem.data}
            </Text>
            <View className="flex-row gap-2 items-center">
              <View
                className={`px-3 py-1.5 rounded-full ${
                  corPrioridade(ordem.prioridade).bg
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    corPrioridade(ordem.prioridade).text
                  }`}
                >
                  Prioridade: {ordem.prioridade}
                </Text>
              </View>
              <View
                className={`px-3 py-1.5 rounded-full ${
                  corStatus(ordem.status).bg
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    corStatus(ordem.status).text
                  }`}
                >
                  {ordem.status}
                </Text>
              </View>
            </View>
          </View>

          {/* Descrição do Problema */}
          <View className="bg-white p-4 rounded-2xl mb-4 border border-slate-200 shadow-sm">
            <View className="flex-row items-center gap-2 mb-3">
              <IconeLucide id="criar-os" tamanho={24} cor="#1f2937" />
              <Text className="text-lg font-bold text-slate-800">
                Descrição
              </Text>
            </View>
            <Text className="text-base text-slate-700 leading-6">
              {ordem.descricao}
            </Text>
          </View>

          {/* Informações Adicionais */}
          <View className="bg-white p-4 rounded-2xl mb-4 border border-slate-200 shadow-sm">
            <Text className="text-lg font-bold text-slate-800 mb-4">
              Informações
            </Text>

            <View className="mb-4">
              <View className="flex-row items-center gap-2 mb-1">
                <IconeLucide id="servicos" tamanho={16} cor="#64748b" />
                <Text className="text-sm font-semibold text-slate-500">
                  Local
                </Text>
              </View>
              <Text className="text-base text-slate-700">{ordem.local}</Text>
            </View>

            <View className="mb-4">
              <View className="flex-row items-center gap-2 mb-1">
                <IconeLucide id="moradores" tamanho={16} cor="#64748b" />
                <Text className="text-sm font-semibold text-slate-500">
                  Solicitante
                </Text>
              </View>
              <Text className="text-base text-slate-700">
                {ordem.solicitante}
              </Text>
            </View>

            <View className="mb-4">
              <View className="flex-row items-center gap-2 mb-1">
                <IconeLucide id="calendario" tamanho={16} cor="#64748b" />
                <Text className="text-sm font-semibold text-slate-500">
                  Data da Solicitação
                </Text>
              </View>
              <Text className="text-base text-slate-700">{ordem.data}</Text>
            </View>

            <View>
              <View className="flex-row items-center gap-2 mb-1">
                <IconeLucide id="alerta" tamanho={16} cor="#64748b" />
                <Text className="text-sm font-semibold text-slate-500">
                  Número da OS
                </Text>
              </View>
              <Text className="text-base text-slate-700">#{ordem.id}</Text>
            </View>
          </View>

          {/* Data de conclusão (se finalizada) - acima do botão Voltar */}
          {ordem.status === "Finalizada" && ordem.dataConclusao && (
            <View className="flex-row items-center justify-center mb-4 mt-2">
              <IconeLucide id="calendario" tamanho={16} cor="#15803d" />
              <Text className="text-green-700 text-xs font-semibold ml-1">
                Concluída em {ordem.dataConclusao}
              </Text>
            </View>
          )}

          {/* Botões de Ação (apenas se não for leitura) */}
          {!readOnly && (
            <View className="mb-6">
              {/* Botões para OS Pendente */}
              {ordem.status === "Pendente" && (
                <View className="flex-row space-x-2 mb-3">
                  <TouchableOpacity
                    onPress={aceitarOS}
                    className="flex-1 bg-green-600 p-4 rounded-xl mr-2"
                  >
                    <View className="flex-row items-center justify-center">
                      <IconeLucide id="confirmar" tamanho={18} cor="#ffffff" />
                      <Text className="text-white text-center font-semibold ml-2">
                        Aceitar OS
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={recusarOS}
                    className="flex-1 bg-red-600 p-4 rounded-xl"
                  >
                    <View className="flex-row items-center justify-center">
                      <IconeLucide id="cancelar" tamanho={18} cor="#ffffff" />
                      <Text className="text-white text-center font-semibold ml-2">
                        Recusar OS
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {/* Botão para OS Aceita */}
              {ordem.status === "Aceita" && (
                <TouchableOpacity
                  onPress={() => setModalFinalizacaoVisivel(true)}
                  className="bg-green-600 p-4 rounded-xl mb-3"
                >
                  <View className="flex-row items-center justify-center">
                    <IconeLucide id="confirmar" tamanho={18} cor="#ffffff" />
                    <Text className="text-white text-center font-semibold ml-2">
                      Finalizar OS
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Botão Voltar */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-red-600 p-4 rounded-2xl mb-6"
          >
            <Text className="text-white text-center font-semibold">Voltar</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal de Finalização */}
        {!readOnly && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalFinalizacaoVisivel}
            onRequestClose={() => setModalFinalizacaoVisivel(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50 px-4">
              <View className="bg-white w-full rounded-2xl p-6">
                <View className="flex-row items-center justify-center mb-4">
                  <IconeLucide id="confirmar" tamanho={24} cor="#b91c1c" />
                  <Text className="text-2xl font-bold text-red-700 ml-2 text-center">
                    Finalizar Ordem de Serviço
                  </Text>
                </View>
                <View className="bg-slate-100 p-3 rounded-xl mb-4">
                  <Text className="text-lg font-semibold text-slate-800">
                    {ordem.titulo}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-2">
                    <IconeLucide id="servicos" tamanho={14} cor="#64748b" />
                    <Text className="text-slate-600 text-sm">
                      {ordem.local}
                    </Text>
                  </View>
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
                  <View className="flex-row items-center justify-center">
                    <IconeLucide id="confirmar" tamanho={18} cor="#ffffff" />
                    <Text className="text-white text-center font-semibold ml-2">
                      Confirmar Finalização
                    </Text>
                  </View>
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
        )}
      </View>
    </SafeAreaView>
  );
}
