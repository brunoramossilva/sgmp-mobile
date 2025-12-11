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

      setOrdens(ordensTecnico.map(mapApiToUI));
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

  const finalizarOS = async () => {
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
    if (abaSelecionada === "Pendentes")
      return ordens.filter(
        (o) => o.raw?.status?.toUpperCase() === "AGUARDANDO_EXECUCAO"
      );
    if (abaSelecionada === "Em Execução")
      return ordens.filter(
        (o) => o.raw?.status?.toUpperCase() === "EM_EXECUCAO"
      );
    if (abaSelecionada === "Finalizadas")
      return ordens.filter((o) => {
        const statusUpper = o.raw?.status?.toUpperCase();
        return statusUpper === "FINALIZADA" || statusUpper === "CONCLUIDA";
      });
    return [];
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
              CINOVA
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
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 20,
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
        {/* CARDS DE STATUS */}
        <View className="px-4 mb-6 -mt-8">
          <View className="flex-row justify-between">
            {/* Card PENDENTES */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setAbaSelecionada("Pendentes")}
              className={`p-3 rounded-2xl w-[31%] items-center shadow-sm border ${
                abaSelecionada === "Pendentes"
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-slate-100"
              }`}
              style={{ elevation: abaSelecionada === "Pendentes" ? 4 : 2 }}
            >
              <Text
                className={`text-2xl font-bold ${
                  abaSelecionada === "Pendentes"
                    ? "text-red-600"
                    : "text-slate-800"
                }`}
              >
                {stats.pendentes}
              </Text>
              <Text
                className={`text-[9px] font-bold uppercase mt-1 ${
                  abaSelecionada === "Pendentes"
                    ? "text-red-400"
                    : "text-slate-400"
                }`}
              >
                Pendentes
              </Text>
            </TouchableOpacity>

            {/* Card EM EXECUÇÃO */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setAbaSelecionada("Em Execução")}
              className={`p-3 rounded-2xl w-[31%] items-center shadow-sm border ${
                abaSelecionada === "Em Execução"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-slate-100"
              }`}
              style={{ elevation: abaSelecionada === "Em Execução" ? 4 : 2 }}
            >
              <Text
                className={`text-2xl font-bold ${
                  abaSelecionada === "Em Execução"
                    ? "text-blue-600"
                    : "text-slate-800"
                }`}
              >
                {stats.aprovadas}
              </Text>
              <Text
                className={`text-[9px] font-bold uppercase mt-1 ${
                  abaSelecionada === "Em Execução"
                    ? "text-blue-400"
                    : "text-slate-400"
                }`}
              >
                Em Execução
              </Text>
            </TouchableOpacity>

            {/* Card FINALIZADAS */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setAbaSelecionada("Finalizadas")}
              className={`p-3 rounded-2xl w-[31%] items-center shadow-sm border ${
                abaSelecionada === "Finalizadas"
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-slate-100"
              }`}
              style={{ elevation: abaSelecionada === "Finalizadas" ? 4 : 2 }}
            >
              <Text
                className={`text-2xl font-bold ${
                  abaSelecionada === "Finalizadas"
                    ? "text-green-600"
                    : "text-slate-800"
                }`}
              >
                {stats.finalizadas}
              </Text>
              <Text
                className={`text-[9px] font-bold uppercase mt-1 ${
                  abaSelecionada === "Finalizadas"
                    ? "text-green-400"
                    : "text-slate-400"
                }`}
              >
                Finalizadas
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TÍTULO DA LISTA */}
        <View className="px-6 mb-3 mt-2">
          <Text className="text-sm font-bold text-slate-600 uppercase tracking-wider">
            {abaSelecionada === "Pendentes"
              ? "Tarefas a Fazer"
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
            <View className="bg-white p-8 rounded-2xl border border-slate-100 items-center justify-center border-dashed mt-2">
              <IconeLucide
                id={abaSelecionada === "Pendentes" ? "verificado" : "alerta"}
                tamanho={40}
                cor="#cbd5e1"
              />
              <Text className="text-slate-500 font-medium mt-3">
                Nenhuma ordem aqui
              </Text>
              <Text className="text-slate-400 text-xs text-center mt-1">
                {abaSelecionada === "Pendentes"
                  ? "Você não tem pendências."
                  : "A lista está vazia."}
              </Text>
            </View>
          ) : (
            ordensExibidas.map((ordem) => (
              <CardOrdemPendente
                key={ordem.id}
                ordem={ordem}
                onDetalhes={() => abrirDetalhes(ordem)}
                onAceitar={
                  abaSelecionada === "Pendentes"
                    ? () => aceitarOS(ordem)
                    : undefined
                }
                onRecusar={
                  abaSelecionada === "Pendentes"
                    ? () => recusarOS(ordem)
                    : undefined
                }
              />
            ))
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
