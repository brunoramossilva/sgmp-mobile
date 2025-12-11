import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Platform,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAutenticacao } from "../../contexto/ContextoAutenticacao";
// NavbarGlobal removida conforme solicitado
import { IconeLucide } from "../../components/icones";
import SkeletonBloco from "../../components/SkeletonBloco";
import { NAVBAR_HEIGHT } from "../../utils/responsividade";
import { CarrosselIntroducao } from "../../components/introducao";
import { obterSlidesIntroducao } from "../../utils/conteudoIntroducao";
import { useIntroducaoUsuario } from "../../hooks/useIntroducaoUsuario";

// Services e Types
import { getOrdens, updateOrdem } from "../../services/ordemServico";
import { OrdemServicoUI, mapApiToUI } from "./types";
import CardOrdemPendente from "./CardOrdemPendente";
import CardOrdemAceita from "./CardOrdemAceita";
import ModalDetalhes from "./ModalDetalhes";
import ModalFinalizacao from "./ModalFinalizacao";
import SkeletonOrdem from "./SkeletonOrdem";

// --- HOOK DE DASHBOARD ---
const useDashboardData = () => {
  const [data, setData] = useState({
    pendentes: 0,
    aprovadas: 0,
    finalizadas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await getOrdens();

      // Contar apenas OSs relevantes para o técnico
      const pendentes = response.filter(
        (o) => o.status?.toUpperCase() === "AGUARDANDO_EXECUCAO"
      ).length;
      const emExecucao = response.filter(
        (o) => o.status?.toUpperCase() === "EM_EXECUCAO"
      ).length;
      const finalizadas = response.filter((o) => {
        const statusUpper = o.status?.toUpperCase();
        return statusUpper === "FINALIZADA" || statusUpper === "CONCLUIDA";
      }).length;

      setData({
        pendentes,
        aprovadas: emExecucao,
        finalizadas,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refreshing, refetch };
};

// --- COMPONENTE PRINCIPAL ---
export default function InicialTecnico() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { usuario, desautenticar } = useAutenticacao();

  const cpf = usuario?.cpf || "";
  const { deveExibirIntroducao, marcarComoVisto, carregando } =
    useIntroducaoUsuario(cpf, "FUNCIONARIO");

  // Estados de Dados
  const {
    data: stats,
    loading: dashboardLoading,
    refreshing,
    refetch,
  } = useDashboardData();
  const [ordens, setOrdens] = useState<OrdemServicoUI[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // Estados de UI/Filtro
  const [abaSelecionada, setAbaSelecionada] = useState<
    "Pendentes" | "Em Execução" | "Finalizadas"
  >("Pendentes");

  const [modalDetalhesVisivel, setModalDetalhesVisivel] = useState(false);
  const [modalFinalizacaoVisivel, setModalFinalizacaoVisivel] = useState(false);
  const [ordemSelecionada, setOrdemSelecionada] =
    useState<OrdemServicoUI | null>(null);

  const tecnicoName = usuario?.nome?.trim()
    ? usuario.nome.split(" ")[0]
    : "Colaborador";

  // Carregar lista completa
  const carregarOrdens = useCallback(async () => {
    try {
      setLoadingList(true);
      const response = await getOrdens();

      // Filtrar apenas OSs que o técnico deve ver
      const ordensTecnico = response.filter((o) => {
        const statusUpper = o.status?.toUpperCase();
        return (
          statusUpper === "AGUARDANDO_EXECUCAO" ||
          statusUpper === "EM_EXECUCAO" ||
          statusUpper === "CONCLUIDA" ||
          statusUpper === "FINALIZADA"
        );
      });

      // Ordenar por data mais recente primeiro
      const ordensOrdenadas = ordensTecnico.map(mapApiToUI).sort((a, b) => {
        const dataA = new Date(a.data.split("/").reverse().join("-"));
        const dataB = new Date(b.data.split("/").reverse().join("-"));
        return dataB.getTime() - dataA.getTime();
      });
      setOrdens(ordensOrdenadas);
    } catch (err) {
      console.error("Erro ao carregar ordens:", err);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetch();
      carregarOrdens();
    }, [refetch, carregarOrdens])
  );

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja desconectar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          desautenticar();
          navigation.reset({ index: 0, routes: [{ name: "Login" as never }] });
        },
      },
    ]);
  };

  // --- AÇÕES ---
  const abrirDetalhes = (ordem: OrdemServicoUI) => {
    setOrdemSelecionada(ordem);
    setModalDetalhesVisivel(true);
  };

  const abrirFinalizacao = (ordem: OrdemServicoUI) => {
    setOrdemSelecionada(ordem);
    setModalFinalizacaoVisivel(true);
  };

  const aceitarOS = async (ordem: OrdemServicoUI) => {
    try {
      await updateOrdem(ordem.id, {
        status: "EM_EXECUCAO",
        cpf_funcionario: usuario?.cpf || null,
      });
      await carregarOrdens();
      refetch();
      Alert.alert("Sucesso", "Ordem aceita!");
    } catch (err) {
      Alert.alert("Erro", "Falha ao aceitar ordem");
    }
  };

  const recusarOS = async (ordem: OrdemServicoUI) => {
    Alert.alert("Confirmar Recusa", "Deseja recusar esta ordem?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Recusar",
        style: "destructive",
        onPress: async () => {
          try {
            await updateOrdem(ordem.id, { status: "RECUSADA" });
            await carregarOrdens();
            refetch();
          } catch (err) {
            Alert.alert("Erro", "Falha ao recusar ordem");
          }
        },
      },
    ]);
  };

  const finalizarOS = async (solucao: string) => {
    if (!ordemSelecionada) return;
    try {
      await updateOrdem(ordemSelecionada.id, {
        status: "CONCLUIDA",
        dataConclusao: new Date().toISOString(),
      });
      await carregarOrdens();
      refetch();
      setModalFinalizacaoVisivel(false);
      setOrdemSelecionada(null);
      Alert.alert("Sucesso", "Ordem finalizada!");
    } catch (err) {
      Alert.alert("Erro", "Falha ao finalizar ordem");
    }
  };

  const ordensExibidas = useMemo(() => {
    let filtradas: OrdemServicoUI[] = [];

    if (abaSelecionada === "Pendentes") {
      filtradas = ordens.filter(
        (o) => o.raw?.status?.toUpperCase() === "AGUARDANDO_EXECUCAO"
      );
    } else if (abaSelecionada === "Em Execução") {
      filtradas = ordens.filter(
        (o) => o.raw?.status?.toUpperCase() === "EM_EXECUCAO"
      );
    } else if (abaSelecionada === "Finalizadas") {
      filtradas = ordens.filter((o) => {
        const statusUpper = o.raw?.status?.toUpperCase();
        return statusUpper === "FINALIZADA" || statusUpper === "CONCLUIDA";
      });
    }

    // Ordenar por data mais recente primeiro
    return filtradas.sort((a, b) => {
      const dataA = new Date(a.data.split("/").reverse().join("-"));
      const dataB = new Date(b.data.split("/").reverse().join("-"));
      return dataB.getTime() - dataA.getTime();
    });
  }, [ordens, abaSelecionada]);

  if (dashboardLoading) {
    return (
      <View className="flex-1 bg-white pt-20 px-4">
        <SkeletonBloco
          height={120}
          style={{ marginBottom: 20, borderRadius: 20 }}
        />
        <View className="flex-row gap-3">
          <SkeletonBloco height={100} style={{ flex: 1, borderRadius: 16 }} />
          <SkeletonBloco height={100} style={{ flex: 1, borderRadius: 16 }} />
          <SkeletonBloco height={100} style={{ flex: 1, borderRadius: 16 }} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="#dc2626" />

      {/* Carrossel de Introdução */}
      {!carregando && deveExibirIntroducao && (
        <CarrosselIntroducao
          slides={obterSlidesIntroducao("FUNCIONARIO")}
          aoConcluir={marcarComoVisto}
          nomePapel="FUNCIONARIO"
        />
      )}

      {/* HEADER UNIFICADO (CURVO - CINOVA) */}
      <View
        className="bg-red-600 px-6 pb-12 shadow-lg z-10" // Aumentei pb-12 para dar mais espaço
        style={{
          paddingTop: (insets.top || 0) + 20,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center bg-red-700/50 py-1 px-3 rounded-full">
            <IconeLucide id="predio" tamanho={16} cor="#fff" />
            <Text className="text-white text-xs font-bold ml-2 tracking-widest">
              CINOVA GESTÃO
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <IconeLucide id="logout" tamanho={20} cor="#fff" />
          </TouchableOpacity>
        </View>

        <View>
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-red-100 text-base font-medium">
              Bom trabalho,
            </Text>

            {/* BADGE PADRONIZADA (BRANCO TRANSLÚCIDO) */}
            <View className="bg-white/20 px-2 py-0.5 rounded-md border border-white/10">
              <Text className="text-white text-[9px] font-bold uppercase tracking-wider">
                Funcionário
              </Text>
            </View>
          </View>
          <Text className="text-white text-3xl font-bold">{tecnicoName}</Text>
        </View>

        {/* Cards de Estatísticas */}
        <View className="flex-row justify-between mt-6">
          <View className="bg-white/10 px-4 py-3 rounded-xl flex-1 mr-2">
            <Text className="text-white/70 text-xs font-medium">Pendentes</Text>
            <Text className="text-white text-2xl font-bold">
              {stats.pendentes}
            </Text>
          </View>
          <View className="bg-white/10 px-4 py-3 rounded-xl flex-1 mx-1">
            <Text className="text-white/70 text-xs font-medium">
              Em Execução
            </Text>
            <Text className="text-white text-2xl font-bold">
              {stats.aprovadas}
            </Text>
          </View>
          <View className="bg-white/10 px-4 py-3 rounded-xl flex-1 ml-2">
            <Text className="text-white/70 text-xs font-medium">
              Finalizadas
            </Text>
            <Text className="text-white text-2xl font-bold">
              {stats.finalizadas}
            </Text>
          </View>
        </View>
      </View>

      {/* Filtros em formato de Tabs */}
      <View className="px-6 pt-4 pb-2 bg-white border-b border-slate-100">
        <View className="flex-row bg-slate-100 rounded-xl p-1">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setAbaSelecionada("Pendentes")}
            className={`flex-1 py-2.5 rounded-lg ${
              abaSelecionada === "Pendentes" ? "bg-red-600" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-center text-sm font-bold ${
                abaSelecionada === "Pendentes" ? "text-white" : "text-slate-600"
              }`}
            >
              Pendentes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setAbaSelecionada("Em Execução")}
            className={`flex-1 py-2.5 rounded-lg ${
              abaSelecionada === "Em Execução" ? "bg-red-600" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-center text-sm font-bold ${
                abaSelecionada === "Em Execução"
                  ? "text-white"
                  : "text-slate-600"
              }`}
            >
              Em Execução
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setAbaSelecionada("Finalizadas")}
            className={`flex-1 py-2.5 rounded-lg ${
              abaSelecionada === "Finalizadas" ? "bg-red-600" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-center text-sm font-bold ${
                abaSelecionada === "Finalizadas"
                  ? "text-white"
                  : "text-slate-600"
              }`}
            >
              Finalizadas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            tintColor="#dc2626"
          />
        }
      >
        {/* TÍTULO DA LISTA */}
        <View className="px-6 mb-3 mt-2">
          <Text className="text-sm font-bold text-slate-600 uppercase tracking-wider">
            {abaSelecionada === "Pendentes"
              ? "Novas Solicitações"
              : abaSelecionada === "Em Execução"
              ? "Em Andamento"
              : "Histórico Completo"}
          </Text>
        </View>

        {/* LISTA DE ORDENS */}
        <View className="px-4">
          {loadingList ? (
            [1, 2].map((i) => <SkeletonOrdem key={i} />)
          ) : ordensExibidas.length === 0 ? (
            <View className="items-center justify-center py-16">
              <View className="w-20 h-20 bg-slate-100 rounded-full items-center justify-center mb-4">
                <IconeLucide
                  id={
                    abaSelecionada === "Pendentes"
                      ? "verificado"
                      : abaSelecionada === "Em Execução"
                      ? "servicos"
                      : "confirmar"
                  }
                  tamanho={36}
                  cor="#94a3b8"
                />
              </View>
              <Text className="text-slate-700 font-bold text-lg">
                {abaSelecionada === "Pendentes"
                  ? "Tudo em dia!"
                  : abaSelecionada === "Em Execução"
                  ? "Nada em andamento"
                  : "Sem histórico"}
              </Text>
              <Text className="text-slate-500 text-sm text-center mt-2 px-8">
                {abaSelecionada === "Pendentes"
                  ? "Nenhuma nova solicitação no momento"
                  : abaSelecionada === "Em Execução"
                  ? "Você não tem ordens em execução"
                  : "Nenhuma ordem finalizada ainda"}
              </Text>
            </View>
          ) : (
            ordensExibidas.map((ordem) => {
              // Usar card diferente dependendo da aba
              if (abaSelecionada === "Em Execução") {
                return (
                  <CardOrdemAceita
                    key={ordem.id}
                    ordem={ordem}
                    onDetalhes={() => abrirDetalhes(ordem)}
                    onFinalizar={() => abrirFinalizacao(ordem)}
                  />
                );
              } else if (abaSelecionada === "Finalizadas") {
                return (
                  <CardOrdemPendente
                    key={ordem.id}
                    ordem={ordem}
                    onDetalhes={() => abrirDetalhes(ordem)}
                  />
                );
              } else {
                // Pendentes
                return (
                  <CardOrdemPendente
                    key={ordem.id}
                    ordem={ordem}
                    onDetalhes={() => abrirDetalhes(ordem)}
                    onAceitar={() => aceitarOS(ordem)}
                    onRecusar={() => recusarOS(ordem)}
                  />
                );
              }
            })
          )}
        </View>
      </ScrollView>

      {/* Modais */}
      <ModalDetalhes
        visible={modalDetalhesVisivel}
        ordem={ordemSelecionada}
        onClose={() => setModalDetalhesVisivel(false)}
        onAceitar={() => {
          ordemSelecionada && aceitarOS(ordemSelecionada);
          setModalDetalhesVisivel(false);
        }}
        onRecusar={() => {
          setModalDetalhesVisivel(false);
          ordemSelecionada && recusarOS(ordemSelecionada);
        }}
        onFinalizar={() => {
          setModalDetalhesVisivel(false);
          ordemSelecionada && abrirFinalizacao(ordemSelecionada);
        }}
      />

      <ModalFinalizacao
        visible={modalFinalizacaoVisivel}
        ordem={ordemSelecionada}
        onClose={() => setModalFinalizacaoVisivel(false)}
        onConfirmar={finalizarOS}
      />
    </View>
  );
}
