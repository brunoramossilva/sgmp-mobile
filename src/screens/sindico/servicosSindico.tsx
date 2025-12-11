import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFetchOrdensSindico } from "../../hooks/useFetchOrdensSindico";
import { NAVBAR_HEIGHT } from "../../utils/responsividade";
import { IconeLucide } from "../../components/icones";
import { OrdemServicoUI } from "../../utils/mapeadores";
import SkeletonBloco from "../../components/SkeletonBloco";
import { NavbarGlobal } from "../../components/navegacao";
import { BotaoVoltar } from "../../components/navegacao";

type FiltroStatus =
  | "TODAS"
  | "PENDENTES"
  | "ACEITAS"
  | "EM_EXECUCAO"
  | "FINALIZADAS"
  | "RECUSADAS";

// Card unificado para exibir ordens de qualquer status
const CardOrdemServico = ({
  ordem,
  onDetalhes,
}: {
  ordem: OrdemServicoUI;
  onDetalhes: () => void;
}) => {
  // Mapeamento de status para estilo visual
  const statusMap = {
    Pendente: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "Pendente",
    },
    Aceita: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      label: "Aguardando Execução",
    },
    "Em Execução": {
      bg: "bg-purple-100",
      text: "text-purple-700",
      label: "Em Execução",
    },
    Finalizada: {
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Finalizada",
    },
    Recusada: {
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Recusada",
    },
  };

  const cores = statusMap[ordem.status as keyof typeof statusMap] ?? {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: ordem.status,
  };

  return (
    <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
      {/* Header: Status + Badge */}
      <View className="flex-row justify-between items-start mb-2">
        <Text
          className="text-base font-semibold text-slate-900 flex-1 mr-3"
          numberOfLines={1}
        >
          {ordem.solicitante}
        </Text>
        <View className={`px-2.5 py-1 rounded-full ${cores.bg}`}>
          <Text className={`text-xs font-bold ${cores.text}`}>
            {cores.label}
          </Text>
        </View>
      </View>

      {/* Descrição do serviço */}
      <Text className="text-sm font-semibold text-slate-800" numberOfLines={2}>
        {ordem.descricao}
      </Text>
      <Text className="text-xs text-slate-500 mt-1">
        Solicitado em {ordem.dataAbertura}
      </Text>

      {/* Informações: Prioridade */}
      <View className="flex-row gap-3 mt-3 mb-3">
        <View className="flex-row items-center gap-1">
          <IconeLucide
            id="alerta"
            tamanho={14}
            cor={ordem.prioridade === "Alta" ? "#ef4444" : "#64748b"}
          />
          <Text className="text-xs text-slate-600">{ordem.prioridade}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <IconeLucide id="relogio" tamanho={14} cor="#64748b" />
          <Text className="text-xs text-slate-600">{ordem.diasEmAberto}d</Text>
        </View>
      </View>

      {/* Botão de detalhes */}
      <TouchableOpacity
        onPress={onDetalhes}
        className="bg-red-600 py-3 rounded-xl justify-center items-center"
      >
        <Text className="text-white font-semibold text-sm">Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );
};

type ServicosSindicoProps = NativeStackScreenProps<any>;

export default function ServicosSindico({ navigation }: ServicosSindicoProps) {
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroStatus>("TODAS");

  const { ordensPendentes, ordensEmExecucao, loading, error, refetch } =
    useFetchOrdensSindico();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Combina todas as ordens
  const todasOrdens = useMemo(() => {
    return [...ordensPendentes, ...ordensEmExecucao];
  }, [ordensPendentes, ordensEmExecucao]);

  // Aplica filtro e ordena por data mais recente
  const ordensFiltradas = useMemo(() => {
    let ordens: OrdemServicoUI[];
    switch (filtroAtivo) {
      case "PENDENTES":
        ordens = ordensPendentes;
        break;
      case "ACEITAS":
        ordens = ordensEmExecucao.filter((o) => o.status === "Aceita");
        break;
      case "EM_EXECUCAO":
        ordens = ordensEmExecucao.filter((o) => o.status === "Em Execução");
        break;
      case "FINALIZADAS":
        ordens = ordensEmExecucao.filter(
          (o) => o.status === "Finalizada" || o.status === "Recusada"
        );
        break;
      case "RECUSADAS":
        ordens = ordensEmExecucao.filter((o) => o.status === "Recusada");
        break;
      case "TODAS":
      default:
        ordens = todasOrdens;
    }
    // Ordenar por data mais recente primeiro
    return [...ordens].sort((a, b) => {
      const dataA = new Date(a.dataAbertura.split("/").reverse().join("-"));
      const dataB = new Date(b.dataAbertura.split("/").reverse().join("-"));
      return dataB.getTime() - dataA.getTime();
    });
  }, [filtroAtivo, ordensPendentes, ordensEmExecucao, todasOrdens]);

  // Abre detalhes de uma ordem
  const abrirDetalhes = useCallback(
    (ordem: OrdemServicoUI) => {
      const readOnly = ordem.status !== "Pendente";
      navigation.navigate("DetalhesOs", { ordem, readOnly });
    },
    [navigation]
  );

  // Renderiza item
  const renderItem = useCallback(
    ({ item }: { item: OrdemServicoUI }) => (
      <CardOrdemServico ordem={item} onDetalhes={() => abrirDetalhes(item)} />
    ),
    [abrirDetalhes]
  );

  // KeyExtractor
  const keyExtractor = useCallback((item: OrdemServicoUI) => `${item.id}`, []);

  // Estatísticas
  const stats = useMemo(
    () => ({
      total: todasOrdens.length,
      pendentes: ordensPendentes.length,
      aceitas: ordensEmExecucao.filter((o) => o.status === "Aceita").length,
      emExecucao: ordensEmExecucao.filter((o) => o.status === "Em Execução")
        .length,
      finalizadas: ordensEmExecucao.filter(
        (o) => o.status === "Finalizada" || o.status === "Recusada"
      ).length,
      recusadas: ordensEmExecucao.filter((o) => o.status === "Recusada").length,
    }),
    [ordensPendentes, ordensEmExecucao, todasOrdens]
  );

  // Botão de filtro - padrão do design system
  const FiltroButton = ({
    label,
    valor,
    count,
  }: {
    label: string;
    valor: FiltroStatus;
    count: number;
  }) => {
    const ativo = filtroAtivo === valor;
    return (
      <TouchableOpacity
        onPress={() => setFiltroAtivo(valor)}
        className={`px-4 py-2.5 rounded-lg ${
          ativo ? "bg-red-600" : "bg-slate-100"
        }`}
        style={!ativo ? { borderWidth: 1, borderColor: "#e2e8f0" } : undefined}
        accessibilityRole="button"
        accessibilityLabel={`Filtrar por ${label}`}
      >
        <Text
          className={`text-sm font-semibold text-center ${
            ativo ? "text-white" : "text-slate-700"
          }`}
        >
          {label} ({count})
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#dc2626" />

      {/* Header - padrão do design system */}
      <View className="bg-red-600 px-4 pb-4 pt-16">
        <View className="flex-row items-center justify-between mb-4">
          <View className="w-10">
            <BotaoVoltar />
          </View>
          <Text className="text-white text-xl font-bold">
            Todos os Serviços
          </Text>
          <View className="w-10" />
        </View>

        {/* Estatísticas em linha - todas visíveis */}
        <View className="flex-row justify-between gap-2">
          <View className="bg-white/10 rounded-lg px-2 py-2 flex-1 items-center">
            <Text className="text-white text-2xl font-bold">{stats.total}</Text>
            <Text
              className="text-[8px] text-white/90 font-semibold uppercase"
              numberOfLines={1}
            >
              Total
            </Text>
          </View>
          <View className="bg-white/10 rounded-lg px-2 py-1.5 flex-1 items-center">
            <Text className="text-yellow-300 text-2xl font-bold">
              {stats.pendentes}
            </Text>
            <Text className="text-[6px] text-white/90 font-semibold uppercase text-center leading-tight">
              Pendentes{"\n"}Aprovação
            </Text>
          </View>
          <View className="bg-white/10 rounded-lg px-2 py-1.5 flex-1 items-center">
            <Text className="text-blue-300 text-2xl font-bold">
              {stats.aceitas}
            </Text>
            <Text className="text-[5.6px] text-white/90 font-semibold uppercase text-center leading-tight">
              Aguardando{"\n"}Execução
            </Text>
          </View>
          <View className="bg-white/10 rounded-lg px-2 py-1.5 flex-1 items-center">
            <Text className="text-purple-300 text-2xl font-bold">
              {stats.emExecucao}
            </Text>
            <Text className="text-[7px] text-white/90 font-semibold uppercase text-center leading-tight">
              Em{"\n"}Execução
            </Text>
          </View>
          <View className="bg-white/10 rounded-lg px-2 py-2 flex-1 items-center">
            <Text className="text-green-300 text-2xl font-bold">
              {stats.finalizadas}
            </Text>
            <Text
              className="text-[6px] text-white/90 font-semibold uppercase"
              numberOfLines={1}
            >
              Concluídas
            </Text>
          </View>
          <View className="bg-white/10 rounded-lg px-2 py-2 flex-1 items-center">
            <Text className="text-red-300 text-2xl font-bold">
              {stats.recusadas}
            </Text>
            <Text
              className="text-[6px] text-white/90 font-semibold uppercase"
              numberOfLines={1}
            >
              Recusadas
            </Text>
          </View>
        </View>
      </View>

      {/* Filtros - alinhado ao padrão */}
      <View className="bg-white px-4 py-3 border-b border-slate-200">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: "row", gap: 8 }}
        >
          <FiltroButton label="Todas" valor="TODAS" count={stats.total} />
          <FiltroButton
            label="Pendentes Aprovação"
            valor="PENDENTES"
            count={stats.pendentes}
          />
          <FiltroButton
            label="Aguardando Execução"
            valor="ACEITAS"
            count={stats.aceitas}
          />
          <FiltroButton
            label="Em Execução"
            valor="EM_EXECUCAO"
            count={stats.emExecucao}
          />
          <FiltroButton
            label="Concluídas"
            valor="FINALIZADAS"
            count={stats.finalizadas}
          />
          <FiltroButton
            label="Recusadas"
            valor="RECUSADAS"
            count={stats.recusadas}
          />
        </ScrollView>
      </View>

      {/* Lista de ordens */}
      {loading ? (
        <View className="px-4 pt-4 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBloco key={i} height={160} style={{ marginBottom: 12 }} />
          ))}
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <IconeLucide id="alerta" tamanho={56} cor="#ef4444" />
          <Text className="text-gray-800 text-lg font-semibold mt-4 text-center">
            Erro ao Carregar Ordens
          </Text>
          <Text className="text-gray-600 mt-2 text-center">{error}</Text>
          <TouchableOpacity
            onPress={refetch}
            className="mt-6 bg-red-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : ordensFiltradas.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <IconeLucide id="servicos" tamanho={56} cor="#9ca3af" />
          <Text className="text-gray-800 text-lg font-semibold mt-4 text-center">
            Nenhuma Ordem Encontrada
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            Não há ordens de serviço nesta categoria no momento.
          </Text>
        </View>
      ) : (
        <FlatList
          data={ordensFiltradas}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: NAVBAR_HEIGHT + 24,
          }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              colors={["#dc2626"]}
              tintColor="#dc2626"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Navbar Global */}
      <NavbarGlobal />
    </View>
  );
}
