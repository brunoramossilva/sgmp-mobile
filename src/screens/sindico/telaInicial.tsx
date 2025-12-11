import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAutenticacao } from "../../contexto/ContextoAutenticacao";
import { getOrdens } from "../../services/ordemServico";
import { IconeLucide } from "../../components/icones";
import SkeletonBloco from "../../components/SkeletonBloco";
import { NavbarGlobal } from "../../components/navegacao";
import { IdIcone } from "../../utils/iconesLucide";
import { NAVBAR_HEIGHT } from "../../utils/responsividade";

// --- Interfaces ---
interface DashboardData {
  ocorrenciasPendentes: number;
  ordensEmExecucao: number;
  faturasAtrasadasTotal: number;
  moradoresAtivos: number;
}

const STATUS_FINALIZADA = ["FINALIZADA", "REJEITADA", "CANCELADA"];

// --- Componentes Visuais ---
const MetricCard = ({
  label,
  value,
  icon,
  color,
  onPress,
}: {
  label: string;
  value: string | number;
  icon: IdIcone;
  color: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className="bg-white p-4 rounded-2xl mr-3 w-36 shadow-sm border border-slate-100 justify-between h-36"
    style={{ elevation: 2 }}
  >
    <View className="flex-row justify-between items-start">
      <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center">
        <IconeLucide id={icon} tamanho={20} cor={color} />
      </View>
      <IconeLucide id="proximo" tamanho={14} cor="#cbd5e1" />
    </View>
    <View>
      <Text className="text-2xl font-bold text-slate-800 tracking-tight">
        {value}
      </Text>
      <Text className="text-xs font-medium text-slate-500 mt-1 leading-4">
        {label}
      </Text>
    </View>
  </TouchableOpacity>
);

const ActionCard = ({
  label,
  subLabel,
  icon,
  onPress,
}: {
  label: string;
  subLabel: string;
  icon: IdIcone;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className="bg-white p-4 rounded-2xl mr-3 w-40 shadow-sm border border-slate-100 h-40 justify-center items-center"
    style={{ elevation: 2 }}
  >
    <View className="w-14 h-14 rounded-2xl bg-red-50 items-center justify-center mb-3">
      <IconeLucide id={icon} tamanho={28} cor="#dc2626" />
    </View>
    <Text className="text-sm font-bold text-slate-800 text-center">
      {label}
    </Text>
    <Text className="text-[10px] text-slate-400 text-center mt-1">
      {subLabel}
    </Text>
  </TouchableOpacity>
);

const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const ordens = await getOrdens();
      const ocorrenciasPendentes = ordens.filter((o) => !o.aprovado).length;
      const ordensEmExecucao = ordens.filter(
        (o) =>
          o.aprovado && !STATUS_FINALIZADA.includes(o.status?.toUpperCase())
      ).length;
      const moradoresAtivos = new Set(ordens.map((o) => o.cpf_morador)).size;

      setData({
        ocorrenciasPendentes,
        ordensEmExecucao,
        faturasAtrasadasTotal: 3450.5,
        moradoresAtivos,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refetch = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refreshing, refetch };
};

const TelaInicial = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { usuario, desautenticar } = useAutenticacao();
  const { data, loading, refreshing, refetch } = useDashboardData();

  const sindicoName = usuario?.nome?.trim()
    ? usuario.nome.split(" ")[0]
    : "Síndico";

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
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

  if (loading) {
    return (
      <View className="flex-1 bg-white pt-20 px-4">
        <SkeletonBloco
          height={120}
          style={{ marginBottom: 20, borderRadius: 20 }}
        />
        <View className="flex-row">
          <SkeletonBloco
            height={140}
            width={150}
            style={{ marginRight: 10, borderRadius: 16 }}
          />
          <SkeletonBloco
            height={140}
            width={150}
            style={{ borderRadius: 16 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="#dc2626" />

      {/* HEADER UNIFICADO */}
      <View
        className="bg-red-600 px-6 pb-10 shadow-lg z-10"
        style={{
          paddingTop: (insets.top || 0) + 20,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <View className="flex-row justify-between items-center mb-6">
          {/* LOGO E NOME PADRÃO */}
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

        {/* SAUDAÇÃO + BADGE DE SÍNDICO */}
        <View>
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-red-100 text-base font-medium">
              Olá,
            </Text>

            {/* BADGE ESPECÍFICA DO SÍNDICO */}
            <View className="bg-white/20 px-2 py-0.5 rounded-md border border-white/10">
              <Text className="text-white text-[9px] font-bold uppercase tracking-wider">
                Síndico
              </Text>
            </View>
          </View>
          <Text className="text-white text-3xl font-bold">{sindicoName}</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 -mt-6"
        contentContainerStyle={{ paddingBottom: NAVBAR_HEIGHT + 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            tintColor="#dc2626"
          />
        }
      >
        {/* CARROSSEL 1: MÉTRICAS */}
        <View>
          <Text className="px-6 text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">
            Visão Geral
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 24, paddingRight: 10 }}
            className="pb-4"
          >
            <MetricCard
              label="Aprovações Pendentes"
              value={data?.ocorrenciasPendentes || 0}
              icon="alerta"
              color={data?.ocorrenciasPendentes ? "#ef4444" : "#10b981"}
              onPress={() => navigation.navigate("AprovacaoOs" as never)}
            />
            <MetricCard
              label="Ordens em Execução"
              value={data?.ordensEmExecucao || 0}
              icon="servicos"
              color="#3b82f6"
              onPress={() =>
                navigation.navigate("OrdensSindicoExecucao" as never)
              }
            />
            <MetricCard
              label="Faturas em Atraso"
              value={`R$ ${(data?.faturasAtrasadasTotal || 0).toLocaleString(
                "pt-BR"
              )}`}
              icon="financeiro"
              color="#eab308"
              onPress={() => navigation.navigate("FinanceiroSindico" as never)}
            />
            <MetricCard
              label="Moradores Ativos"
              value={data?.moradoresAtivos || 0}
              icon="moradores"
              color="#6366f1"
              onPress={() => Alert.alert("Moradores", "Lista de moradores")}
            />
          </ScrollView>
        </View>

        {/* CARROSSEL 2: AÇÕES RÁPIDAS */}
        <View className="mt-4">
          <View className="px-6 flex-row justify-between items-center mb-3">
            <Text className="text-sm font-bold text-slate-600 uppercase tracking-wider">
              Ações Rápidas
            </Text>
            <TouchableOpacity>
              <Text className="text-xs font-bold text-red-600">Ver todas</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 24, paddingRight: 10 }}
            className="pb-4"
          >
            <ActionCard
              label="Novo Comunicado"
              subLabel="Enviar aviso geral"
              icon="comunicacao"
              onPress={() => Alert.alert("Novo Comunicado", "Abrir editor")}
            />
            <ActionCard
              label="Aprovar Ordens"
              subLabel="Revisar solicitações"
              icon="aprovar"
              onPress={() => navigation.navigate("AprovacaoOs" as never)}
            />
            <ActionCard
              label="Prestação de Contas"
              subLabel="Relatório Mensal"
              icon="financeiro"
              onPress={() => navigation.navigate("FinanceiroSindico" as never)}
            />
            <ActionCard
              label="Agenda Áreas"
              subLabel="Verificar reservas"
              icon="calendario"
              onPress={() => navigation.navigate("ReservasSindico" as never)}
            />
          </ScrollView>
        </View>
      </ScrollView>

      <NavbarGlobal telaAtiva="Inicio" />
    </View>
  );
};

export default TelaInicial;
