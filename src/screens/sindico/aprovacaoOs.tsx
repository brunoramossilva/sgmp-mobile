/**
 * Tela de aprovação de ordens de serviço
 * Síndico visualiza e aprova/recusa ordens pendentes
 */

import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFetchOrdensSindico } from "../../hooks/useFetchOrdensSindico";
import { ConfirmacaoModal } from "../../components/ConfirmacaoModal";
import { NAVBAR_HEIGHT } from "../../utils/responsividade";
import { IconeLucide } from "../../components/icones";
import { BotaoVoltar } from "../../components/navegacao";
import { useAutenticacao } from "../../contexto/ContextoAutenticacao";
import { OrdemServicoUI } from "../../utils/mapeadores";

const CardOrdemPendente = ({
  ordem,
  onAceitar,
  onRecusar,
  onDetalhes,
  showApprovalButtons = true,
}: {
  ordem: OrdemServicoUI;
  onAceitar: () => void;
  onRecusar: () => void;
  onDetalhes: () => void;
  showApprovalButtons?: boolean;
}) => {
  const prioridadeCores = {
    Alta: { bg: "bg-red-100", text: "text-red-700" },
    Média: { bg: "bg-yellow-100", text: "text-yellow-700" },
    Baixa: { bg: "bg-green-100", text: "text-green-700" },
  } as const;

  const cores = prioridadeCores[ordem.prioridade] ?? prioridadeCores.Baixa;

  return (
    <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
      {/* Header: Prioridade + Solicitante */}
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-base font-semibold text-slate-900 flex-1 mr-3">
          {ordem.solicitante}
        </Text>
        <View className={`px-2.5 py-1 rounded-full ${cores.bg}`}>
          <Text className={`text-xs font-bold ${cores.text}`}>
            {ordem.prioridade}
          </Text>
        </View>
      </View>

      {/* Descrição do serviço */}
      <Text className="text-sm font-semibold text-slate-800" numberOfLines={2}>
        {ordem.descricao}
      </Text>
      <Text className="text-xs text-slate-500 mt-1">
        Aguardando aprovação há {ordem.diasEmAberto}d
      </Text>

      {/* Data de abertura */}
      <View className="flex-row gap-3 mt-3 mb-3">
        <View className="flex-row items-center gap-1">
          <IconeLucide id="calendario" tamanho={14} cor="#64748b" />
          <Text className="text-xs text-slate-600">{ordem.dataAbertura}</Text>
        </View>
      </View>

      {/* Botões de ação */}
      {showApprovalButtons && (
        <View className="pt-3 border-t border-slate-100">
          <View className="flex-row gap-3 mb-3">
            <TouchableOpacity
              onPress={onRecusar}
              className="flex-1 py-3 rounded-xl bg-red-600 justify-center items-center"
            >
              <Text className="text-white font-semibold text-sm">Recusar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onAceitar}
              className="flex-1 py-3 rounded-xl bg-green-600 justify-center items-center"
            >
              <Text className="text-white font-semibold text-sm">Aprovar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={onDetalhes}
            className="py-3 rounded-xl bg-blue-600 justify-center items-center"
          >
            <Text className="text-white font-semibold text-sm">
              Ver Detalhes
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

type AprovacaoOsProps = NativeStackScreenProps<any>;

export default function AprovacaoOs({ navigation }: AprovacaoOsProps) {
  const { usuario } = useAutenticacao();
  const { ordensPendentes, loading, error, refetch, atualizar, limparErro } =
    useFetchOrdensSindico();

  // Estados locais para modal
  const [ordemSelecionada, setOrdemSelecionada] =
    useState<OrdemServicoUI | null>(null);
  const [acaoModal, setAcaoModal] = useState<"aprovar" | "recusar" | null>(
    null
  );
  const [carregandoModal, setCarregandoModal] = useState(false);
  const [erroModal, setErroModal] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Abre modal de aprovação
  const abrirAprovacao = useCallback((ordem: OrdemServicoUI) => {
    setOrdemSelecionada(ordem);
    setAcaoModal("aprovar");
    setErroModal(null);
  }, []);

  // Abre modal de rejeição
  const abrirRejeicao = useCallback((ordem: OrdemServicoUI) => {
    setOrdemSelecionada(ordem);
    setAcaoModal("recusar");
    setErroModal(null);
  }, []);

  // Abre detalhes da ordem
  const abrirDetalhes = useCallback(
    (ordem: OrdemServicoUI) => {
      navigation.navigate("DetalhesOs", { ordem, readOnly: true });
    },
    [navigation]
  );

  // Confirma ação (aprovar ou recusar)
  const confirmarAcao = useCallback(async () => {
    if (!ordemSelecionada || !acaoModal) return;

    try {
      setCarregandoModal(true);
      setErroModal(null);

      // Preparar payload com status correto
      const isAprovar = acaoModal === "aprovar";
      const dados = {
        status: isAprovar ? "AGUARDANDO_EXECUCAO" : "RECUSADA",
        cpf_sindico: usuario?.cpf || "",
      };

      await atualizar(ordemSelecionada.id, dados);

      // Fecha modal e limpa
      setOrdemSelecionada(null);
      setAcaoModal(null);
    } catch (erro) {
      const mensagem =
        erro instanceof Error
          ? erro.message
          : `Erro ao ${acaoModal === "aprovar" ? "aprovar" : "recusar"} ordem`;
      setErroModal(mensagem);
    } finally {
      setCarregandoModal(false);
    }
  }, [ordemSelecionada, acaoModal, usuario?.cpf, atualizar]);

  // Cancelar modal
  const cancelarModal = useCallback(() => {
    setOrdemSelecionada(null);
    setAcaoModal(null);
    setErroModal(null);
  }, []);

  // Ordenar por data mais recente primeiro
  const ordensOrdenadas = useMemo(() => {
    return [...ordensPendentes].sort((a, b) => {
      const dataA = new Date(a.dataAbertura.split("/").reverse().join("-"));
      const dataB = new Date(b.dataAbertura.split("/").reverse().join("-"));
      return dataB.getTime() - dataA.getTime();
    });
  }, [ordensPendentes]);

  // Renderiza item
  const renderItem = useCallback(
    ({ item }: { item: OrdemServicoUI }) => (
      <CardOrdemPendente
        ordem={item}
        onAceitar={() => abrirAprovacao(item)}
        onRecusar={() => abrirRejeicao(item)}
        onDetalhes={() => abrirDetalhes(item)}
        showApprovalButtons={true}
      />
    ),
    [abrirAprovacao, abrirRejeicao, abrirDetalhes]
  );

  // KeyExtractor
  const keyExtractor = useCallback((item: OrdemServicoUI) => `${item.id}`, []);

  // Título do modal
  const tituloModal = useMemo(() => {
    if (acaoModal === "aprovar") {
      return "Aprovar Ordem de Serviço?";
    }
    return "Recusar Ordem de Serviço?";
  }, [acaoModal]);

  // Descrição do modal
  const descricaoModal = useMemo(() => {
    if (!ordemSelecionada) return "";

    if (acaoModal === "aprovar") {
      return `Aprovar a ordem "${ordemSelecionada.titulo}" de ${ordemSelecionada.solicitante}?`;
    }
    return `Recusar a ordem "${ordemSelecionada.titulo}" de ${ordemSelecionada.solicitante}?`;
  }, [ordemSelecionada, acaoModal]);

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#dc2626" />

      {/* Fundo principal */}
      <View className="flex-1 bg-slate-50">
        {/* Hero/Header brand */}
        <View className="bg-red-600 px-4 pb-4 pt-5">
          <View className="flex-row items-center justify-between">
            <BotaoVoltar />
            <Text className="text-white text-xl font-bold">
              Aprovação de Ordens
            </Text>
            <View className="w-10" />
          </View>
          <View className="flex-row justify-center mt-3">
            <View className="bg-white/10 rounded-lg px-3 py-2 min-w-[120] items-center">
              <Text className="text-[11px] text-white/80 font-semibold">
                PENDENTES
              </Text>
              <Text className="text-lg font-bold text-white">
                {ordensPendentes.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Conteúdo */}
        {loading && !ordensPendentes.length ? (
          <View className="flex-1 justify-center items-center bg-slate-50">
            <ActivityIndicator size="large" color="#dc2626" />
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center px-4 bg-slate-50">
            <IconeLucide id="alerta" tamanho={48} cor="#dc2626" />
            <Text className="text-lg font-bold text-slate-900 mt-4">
              Erro ao carregar
            </Text>
            <Text className="text-sm text-slate-600 text-center mt-2">
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => {
                limparErro();
                refetch();
              }}
              className="mt-6 bg-red-600 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : ordensPendentes.length === 0 ? (
          <View className="flex-1 justify-center items-center px-4 bg-slate-50">
            <IconeLucide id="verificado" tamanho={48} cor="#10b981" />
            <Text className="text-lg font-bold text-slate-900 mt-4">
              Sem Ordens Pendentes
            </Text>
            <Text className="text-sm text-slate-600 text-center mt-2">
              Todas as ordens foram aprovadas ou recusadas
            </Text>
          </View>
        ) : (
          <FlatList
            data={ordensPendentes}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            scrollEnabled
            removeClippedSubviews
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: NAVBAR_HEIGHT + 16,
            }}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={refetch}
                tintColor="#dc2626"
                colors={["#dc2626"]}
              />
            }
          />
        )}

        {/* Modal de Confirmação */}
        <ConfirmacaoModal
          visible={acaoModal !== null}
          titulo={tituloModal}
          descricao={descricaoModal}
          acao={acaoModal || "aprovar"}
          onConfirmar={confirmarAcao}
          onCancelar={cancelarModal}
          carregando={carregandoModal}
          erro={erroModal}
        />
      </View>
    </SafeAreaView>
  );
}
