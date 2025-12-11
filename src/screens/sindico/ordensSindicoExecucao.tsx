import React, { useCallback, useMemo } from "react";
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
import { NAVBAR_HEIGHT } from "../../utils/responsividade";
import { IconeLucide } from "../../components/icones";
import { OrdemServicoUI } from "../../utils/mapeadores";
import { BotaoVoltar } from "../../components/navegacao";

// Card alinhado ao design system (bordas 2xl, chips e CTA sólido)
const CardOrdemAceita = ({
  ordem,
  onDetalhes,
  showActionButtons = false,
}: {
  ordem: OrdemServicoUI;
  onDetalhes: () => void;
  showActionButtons?: boolean;
}) => {
  const statusMap = {
    Aceita: { bg: "bg-blue-100", text: "text-blue-700" },
    Finalizada: { bg: "bg-green-100", text: "text-green-700" },
    Recusada: { bg: "bg-red-100", text: "text-red-700" },
  } as const;

  const cores =
    statusMap[ordem.status as keyof typeof statusMap] ?? statusMap.Aceita;

  return (
    <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
      {/* Header: Status + Solicitante */}
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-base font-semibold text-slate-900 flex-1 mr-3">
          {ordem.solicitante}
        </Text>
        <View className={`px-2.5 py-1 rounded-full ${cores.bg}`}>
          <Text className={`text-xs font-bold ${cores.text}`}>
            {ordem.status}
          </Text>
        </View>
      </View>

      {/* Título + descrição */}
      <Text className="text-sm font-semibold text-slate-800" numberOfLines={1}>
        {ordem.titulo}
      </Text>
      <Text className="text-xs text-slate-600 mt-1" numberOfLines={2}>
        {ordem.descricao}
      </Text>

      {/* Informações: Data + Dias em aberto */}
      <View className="flex-row gap-3 mt-3 mb-3">
        <View className="flex-row items-center gap-1">
          <IconeLucide id="calendario" tamanho={14} cor="#64748b" />
          <Text className="text-xs text-slate-600">{ordem.dataAbertura}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <IconeLucide id="relogio" tamanho={14} cor="#64748b" />
          <Text className="text-xs text-slate-600">
            {ordem.diasEmAberto}d em execução
          </Text>
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

type OrdensSindicoExecucaoProps = NativeStackScreenProps<any>;

export default function OrdensSindicoExecucao({
  navigation,
}: OrdensSindicoExecucaoProps) {
  const { ordensEmExecucao, loading, error, refetch, limparErro } =
    useFetchOrdensSindico();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Abre detalhes de uma ordem
  const abrirDetalhes = useCallback(
    (ordem: OrdemServicoUI) => {
      navigation.navigate("DetalhesOs", { ordem, readOnly: true });
    },
    [navigation]
  );

  // Renderiza item
  const renderItem = useCallback(
    ({ item }: { item: OrdemServicoUI }) => (
      <CardOrdemAceita
        ordem={item}
        onDetalhes={() => abrirDetalhes(item)}
        showActionButtons={false}
      />
    ),
    [abrirDetalhes]
  );

  // KeyExtractor
  const keyExtractor = useCallback((item: OrdemServicoUI) => `${item.id}`, []);

  // Statísticas
  const stats = useMemo(() => {
    const emExecucao = ordensEmExecucao.filter(
      (o) => o.statusApi?.toUpperCase() === "EM_EXECUCAO"
    ).length;
    const concluidas = ordensEmExecucao.filter(
      (o) => o.statusApi?.toUpperCase() === "CONCLUIDA"
    ).length;

    return { emExecucao, concluidas };
  }, [ordensEmExecucao]);

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#dc2626" />

      <View className="flex-1 bg-slate-50">
        {/* Hero/Header brand */}
        <View className="bg-red-600 px-4 pb-4 pt-5">
          <View className="flex-row items-center justify-between">
            <BotaoVoltar />
            <Text className="text-white text-xl font-bold">
              Ordens em Execução
            </Text>
            <View className="w-10" />
          </View>
          <View className="flex-row gap-3 mt-3 justify-center">
            <View className="bg-white/10 rounded-lg px-3 py-2 min-w-[110] items-center">
              <Text className="text-[11px] text-white/80 font-semibold">
                EM EXECUÇÃO
              </Text>
              <Text className="text-lg font-bold text-white">
                {stats.emExecucao}
              </Text>
            </View>
            <View className="bg-white/10 rounded-lg px-3 py-2 min-w-[110] items-center">
              <Text className="text-[11px] text-white/80 font-semibold">
                CONCLUÍDAS
              </Text>
              <Text className="text-lg font-bold text-white">
                {stats.concluidas}
              </Text>
            </View>
          </View>
        </View>

        {/* Conteúdo */}
        {loading && !ordensEmExecucao.length ? (
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
        ) : ordensEmExecucao.length === 0 ? (
          <View className="flex-1 justify-center items-center px-4 bg-slate-50">
            <IconeLucide id="verificado" tamanho={48} cor="#10b981" />
            <Text className="text-lg font-bold text-slate-900 mt-4">
              Nenhuma Ordem em Execução
            </Text>
            <Text className="text-sm text-slate-600 text-center mt-2">
              Aprove novas ordens para acompanhar o progresso
            </Text>
          </View>
        ) : (
          <FlatList
            data={ordensEmExecucao}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            scrollEnabled
            removeClippedSubviews
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 16,
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
      </View>
    </SafeAreaView>
  );
}
