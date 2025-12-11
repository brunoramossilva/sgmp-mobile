import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getOrdens } from "../../services/ordemServico";
import { mapApiToUI, OrdemServicoUI } from "../../utils/mapeadores";
import { NAVBAR_HEIGHT } from "../../utils/responsividade";
import { IconeLucide } from "../../components/icones";
import { BotaoVoltar } from "../../components/navegacao";

const CardOrdemRecusada = ({
  ordem,
  onDetalhes,
}: {
  ordem: OrdemServicoUI;
  onDetalhes: () => void;
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

      {/* Status Recusada */}
      <View className="mb-2">
        <View className="bg-red-100 px-2.5 py-1 rounded-full self-start">
          <Text className="text-xs font-bold text-red-700">RECUSADA</Text>
        </View>
      </View>

      {/* Descrição do serviço */}
      <Text className="text-sm font-semibold text-slate-800" numberOfLines={2}>
        {ordem.descricao}
      </Text>
      <Text className="text-xs text-slate-500 mt-1">
        Recusada em {ordem.dataConclusao || ordem.dataAbertura}
      </Text>

      {/* Datas */}
      <View className="flex-row gap-3 mt-3 mb-3">
        <View className="flex-row items-center gap-1">
          <IconeLucide id="calendario" tamanho={14} cor="#64748b" />
          <Text className="text-xs text-slate-600">{ordem.dataAbertura}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <IconeLucide id="relogio" tamanho={14} cor="#64748b" />
          <Text className="text-xs text-slate-600">
            {ordem.diasEmAberto}d desde abertura
          </Text>
        </View>
      </View>

      {/* Botão de detalhes */}
      <View className="pt-3 border-t border-slate-100">
        <TouchableOpacity
          onPress={onDetalhes}
          className="py-3 rounded-xl bg-slate-600 justify-center items-center"
        >
          <Text className="text-white font-semibold text-sm">Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

type OrdensRecusadasProps = NativeStackScreenProps<any>;

export default function OrdensRecusadas({ navigation }: OrdensRecusadasProps) {
  const [ordensRecusadas, setOrdensRecusadas] = useState<OrdemServicoUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarOrdensRecusadas = useCallback(async () => {
    try {
      setLoading(true);
      const ordens = await getOrdens();
      const ordensUI = ordens.map(mapApiToUI);

      // Filtra apenas as recusadas e ordena por data mais recente
      const recusadas = ordensUI
        .filter((o) => o.statusApi?.toUpperCase() === "RECUSADA")
        .sort((a, b) => {
          const dataA = new Date(a.dataAbertura.split('/').reverse().join('-'));
          const dataB = new Date(b.dataAbertura.split('/').reverse().join('-'));
          return dataB.getTime() - dataA.getTime();
        });

      setOrdensRecusadas(recusadas);
    } catch (erro) {
      console.error("Erro ao carregar ordens recusadas:", erro);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarOrdensRecusadas();
    }, [carregarOrdensRecusadas])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    carregarOrdensRecusadas();
  }, [carregarOrdensRecusadas]);

  const abrirDetalhes = useCallback(
    (ordem: OrdemServicoUI) => {
      navigation.navigate("DetalhesOs", { ordem, readOnly: true });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: OrdemServicoUI }) => (
      <CardOrdemRecusada ordem={item} onDetalhes={() => abrirDetalhes(item)} />
    ),
    [abrirDetalhes]
  );

  const renderEmpty = useCallback(
    () => (
      <View className="items-center justify-center py-20">
        <View className="w-20 h-20 rounded-full bg-green-50 items-center justify-center mb-4">
          <IconeLucide id="verificado" tamanho={40} cor="#10b981" />
        </View>
        <Text className="text-slate-800 text-lg font-bold mb-2">
          Nenhuma OS recusada
        </Text>
        <Text className="text-slate-500 text-sm text-center px-8">
          Não há ordens de serviço recusadas no momento
        </Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-slate-200">
        <View className="flex-row items-center">
          <View className="mr-3">
            <BotaoVoltar cor="#334155" />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-slate-800">
              Ordens Recusadas
            </Text>
            <Text className="text-sm text-slate-500">
              {ordensRecusadas.length}{" "}
              {ordensRecusadas.length === 1 ? "ordem" : "ordens"}
            </Text>
          </View>
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={ordensRecusadas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: NAVBAR_HEIGHT + 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#dc2626"
          />
        }
        ListEmptyComponent={!loading ? renderEmpty : null}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
