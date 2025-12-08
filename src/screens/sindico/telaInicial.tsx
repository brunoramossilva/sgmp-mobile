// React
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";

// React Native
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  RefreshControl,
  BackHandler,
  Platform,
} from "react-native";

// Navigation
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Context
import { useAutenticacao } from "../../contexto/ContextoAutenticacao";

// Services
import { getOrdens, OrdemServicoApi } from "../../services/ordemServico";

// Components
import { IconeLucide } from "../../components/icones";
import SkeletonBloco from "../../components/SkeletonBloco";
import { NavbarGlobal } from "../../components/navegacao";

// Utils
import { IdIcone } from "../../utils/iconesLucide";
import { NAVBAR_HEIGHT } from "../../utils/responsividade";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

interface StatusCardProps {
  title: string;
  value: string;
  iconId: IdIcone;
  iconColor: string;
  bgColorClass: string;
  valueColorClass: string;
  onPress: () => void;
}

// --- Interfaces ---
/**
 * Dados do dashboard do síndico
 */
interface DashboardData {
  ocorrenciasPendentes: number;
  ordensEmExecucao: number;
  /**
   * TODO: Integrar com endpoint /faturas quando disponível no backend
   * Atualmente usando valor mockado
   */
  faturasAtrasadasTotal: number;
  moradoresAtivos: number;
}

// Constantes para filtros de status
const STATUS_FINALIZADA = ["FINALIZADA", "REJEITADA", "CANCELADA"];
const CARD_WIDTH = 176; // largura do card (160) + espaçamento (16)

// --- Componentes auxiliares tipados ---

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
}) => (
  <TouchableOpacity onPress={onPress} style={style} className="p-2 rounded-lg">
    <Text style={textStyle} className="text-white font-semibold">
      {title}
    </Text>
  </TouchableOpacity>
);

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  iconId,
  iconColor,
  bgColorClass,
  valueColorClass,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`bg-white p-4 rounded-lg shadow-md border border-slate-200 w-40 mr-4 items-start justify-between`}
    accessibilityRole="button"
    accessibilityLabel={`${title}: ${value}`}
  >
    <View className="flex-row justify-between w-full items-center mb-2">
      <View
        className={`w-10 h-10 ${bgColorClass} rounded-full flex items-center justify-center`}
      >
        <IconeLucide id={iconId} tamanho={20} cor={iconColor} />
      </View>
    </View>
    <Text className="text-sm font-medium text-gray-700 mb-1">{title}</Text>
    <Text className={`text-xl font-bold ${valueColorClass}`}>{value}</Text>
  </TouchableOpacity>
);

/**
 * Custom hook para gerenciar dados do dashboard
 */
const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const ordens = await getOrdens();

      // Calcular métricas do dashboard
      const ocorrenciasPendentes = ordens.filter((o) => !o.aprovado).length;

      const ordensEmExecucao = ordens.filter(
        (o) =>
          o.aprovado && !STATUS_FINALIZADA.includes(o.status?.toUpperCase())
      ).length;

      const moradoresAtivos = new Set(ordens.map((o) => o.cpf_morador)).size;

      setData({
        ocorrenciasPendentes,
        ordensEmExecucao,
        faturasAtrasadasTotal: 3450.5, // TODO: Integrar endpoint faturas
        moradoresAtivos,
      });
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
      setError("Não foi possível carregar os dados do dashboard");
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
    let isMounted = true;

    if (isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  return { data, loading, error, refreshing, refetch };
};

// --- Componente Principal --- //

const TelaInicial = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { usuario, desautenticar } = useAutenticacao();
  const { data, loading, error, refreshing, refetch } = useDashboardData();
  const statusScrollRef = useRef<ScrollView | null>(null);
  const scrollOffset = useRef(0);
  const layoutWidthRef = useRef(0);
  const [hasScroll, setHasScroll] = useState(false);
  const [nearStart, setNearStart] = useState(true);
  const [nearEnd, setNearEnd] = useState(false);

  const handleArrowPress = (direction: "left" | "right") => {
    const delta = direction === "right" ? CARD_WIDTH : -CARD_WIDTH;
    const nextOffset = Math.max(0, scrollOffset.current + delta);
    statusScrollRef.current?.scrollTo({ x: nextOffset, animated: true });
    scrollOffset.current = nextOffset;
  };

  // Nome do síndico com fallback
  const sindicoName = usuario?.nome?.trim() ? usuario.nome : "Síndico(a)";

  // Refetch automático ao focar na tela (após voltar de AprovacaoOs ou OrdensSindicoExecucao)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    scrollContent: {
      paddingBottom: NAVBAR_HEIGHT + 20,
      backgroundColor: "#ffffff",
    },
    redButton: {
      backgroundColor: "#EF4444",
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    whiteText: {
      color: "#FFFFFF",
      fontSize: 14,
    },
  });

  // Renderizar loading state
  if (loading) {
    return (
      <View style={styles.screenContainer} className="bg-white">
        <View className="bg-red-600 p-4 pt-16">
          <Text className="text-white text-xl font-bold text-center">
            CINOVA
          </Text>
        </View>
        <View className="p-4 pt-8">
          {[1, 2, 3].map((i) => (
            <SkeletonBloco key={i} height={90} style={{ marginBottom: 12 }} />
          ))}
        </View>
        <NavbarGlobal />
      </View>
    );
  }

  // Renderizar error state
  if (error || !data) {
    return (
      <View style={styles.screenContainer} className="bg-white">
        <View className="bg-red-600 p-4 pt-16">
          <Text className="text-white text-xl font-bold text-center">
            CINOVA
          </Text>
        </View>
        <View className="flex-1 items-center justify-center px-4">
          <IconeLucide id="alerta" tamanho={56} cor="#ef4444" />
          <Text className="text-gray-800 text-lg font-semibold mt-4 text-center">
            Erro ao Carregar Dados
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            {error || "Não foi possível carregar os dados do dashboard"}
          </Text>
          <TouchableOpacity
            onPress={refetch}
            className="mt-6 bg-red-600 px-6 py-3 rounded-lg"
            accessibilityRole="button"
            accessibilityLabel="Tentar novamente"
          >
            <Text className="text-white font-semibold">Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
        <NavbarGlobal />
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert("Desconectar", "Tem certeza que deseja sair?", [
      {
        text: "Cancelar",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Sair",
        onPress: () => {
          desautenticar();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" as never }],
          });
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.screenContainer} className="bg-white">
      {/* Header - Parte Superior */}
      <View className="bg-red-600 p-4 pt-16 flex-row items-center justify-between">
        <View className="w-10">
          <IconeLucide id="predio" tamanho={32} cor="#ffffff" />
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-xl font-bold">CINOVA</Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="w-10 items-end"
          accessibilityRole="button"
          accessibilityLabel="Logout"
        >
          <IconeLucide id="logout" tamanho={28} cor="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Seção de Olá, Síndico(a) */}
      <View className="bg-red-700 px-4 py-6 flex-row items-center">
        <View className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4">
          <Text className="text-red-600 text-2xl font-bold">
            {sindicoName
              ? sindicoName
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "SD"}
          </Text>
        </View>
        <View>
          <Text className="text-white text-xl font-semibold">
            Olá, {sindicoName}
          </Text>
          <Text className="text-sm text-white font-bold">Síndico(a)</Text>
        </View>
      </View>

      {/* ScrollView para o conteúdo principal */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        className="bg-white pt-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            colors={["#dc2626"]}
            tintColor="#dc2626"
            progressViewOffset={0}
          />
        }
      >
        {/* Status Gerenciais Section */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-bold text-gray-800">
              Visão Geral da Gestão
            </Text>
            <CustomButton
              title="Ver Relatórios"
              onPress={() =>
                Alert.alert("Gestão", "Navegar para Relatórios Gerenciais")
              }
              style={styles.redButton}
              textStyle={styles.whiteText}
            />
          </View>

          {/* Cartões de Status Horizontal */}
          <View className="relative">
            {/* Fades condicionais */}
            {!nearStart && (
              <View
                className="absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
                style={{
                  backgroundColor: "rgba(255,255,255,0)",
                  shadowColor: "#000",
                  shadowOpacity: 0.12,
                  shadowRadius: 8,
                  shadowOffset: { width: 6, height: 0 },
                }}
              />
            )}
            {!nearEnd && (
              <View
                className="absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
                style={{
                  backgroundColor: "rgba(255,255,255,0)",
                  shadowColor: "#000",
                  shadowOpacity: 0.12,
                  shadowRadius: 8,
                  shadowOffset: { width: -6, height: 0 },
                }}
              />
            )}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="py-2"
              contentContainerStyle={{ paddingLeft: 16, paddingRight: 32 }}
              ref={statusScrollRef}
              snapToInterval={CARD_WIDTH}
              snapToAlignment="start"
              decelerationRate="fast"
              disableIntervalMomentum
              onLayout={(e) => {
                layoutWidthRef.current = e.nativeEvent.layout.width;
              }}
              onScroll={(e) => {
                const { x } = e.nativeEvent.contentOffset;
                const { width: layoutWidth } = e.nativeEvent.layoutMeasurement;
                const { width: contentWidth } = e.nativeEvent.contentSize;
                const maxOffset = Math.max(0, contentWidth - layoutWidth);

                scrollOffset.current = x;
                setHasScroll(maxOffset > 8);
                setNearStart(x <= 10);
                setNearEnd(x >= maxOffset - 10);
              }}
              scrollEventThrottle={16}
              onContentSizeChange={(w) => {
                const maxOffset = Math.max(0, w - layoutWidthRef.current);
                setHasScroll(maxOffset > 8);
                setNearEnd(false);
                setNearStart(true);
              }}
            >
              <StatusCard
                title="Ocorrências p/ Aprovar"
                value={data.ocorrenciasPendentes.toString()}
                iconId="alerta"
                iconColor="#ef4444"
                bgColorClass="bg-red-100"
                valueColorClass="text-red-600"
                onPress={() => navigation.navigate("AprovacaoOs" as never)}
              />

              <StatusCard
                title="Ordens em Execução"
                value={data.ordensEmExecucao.toString()}
                iconId="servicos"
                iconColor="#3b82f6"
                bgColorClass="bg-blue-100"
                valueColorClass="text-blue-600"
                onPress={() =>
                  navigation.navigate("OrdensSindicoExecucao" as never)
                }
              />

              <StatusCard
                title="Faturas em Atraso"
                value={`R$ ${data.faturasAtrasadasTotal
                  .toFixed(2)
                  .replace(".", ",")}`}
                iconId="financeiro"
                iconColor="#eab308"
                bgColorClass="bg-yellow-100"
                valueColorClass="text-yellow-700"
                onPress={() =>
                  Alert.alert(
                    "Status",
                    "Ver Faturas em Atraso e emitir segunda via"
                  )
                }
              />

              <StatusCard
                title="Moradores Ativos"
                value={data.moradoresAtivos.toString()}
                iconId="moradores"
                iconColor="#10b981"
                bgColorClass="bg-green-100"
                valueColorClass="text-green-600"
                onPress={() =>
                  Alert.alert("Status", "Ver lista completa de Moradores")
                }
              />
            </ScrollView>
            {hasScroll && !nearEnd && (
              <TouchableOpacity
                onPress={() => handleArrowPress("right")}
                accessibilityRole="button"
                accessibilityLabel="Avançar cards"
                className="absolute right-2 top-1/2 -mt-3 z-20 bg-red-500 rounded-full p-1.5 shadow"
              >
                <IconeLucide id="proximo" tamanho={14} cor="#ffffff" />
              </TouchableOpacity>
            )}

            {hasScroll && !nearStart && (
              <TouchableOpacity
                onPress={() => handleArrowPress("left")}
                accessibilityRole="button"
                accessibilityLabel="Voltar cards"
                className="absolute left-2 top-1/2 -mt-3 z-20 bg-red-500 rounded-full p-1.5 shadow"
              >
                <IconeLucide id="anterior" tamanho={14} cor="#ffffff" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Ações Rápidas */}
        <View className="px-4 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-bold text-gray-800">
              Ações de Gestão Rápida
            </Text>
            <CustomButton
              title="Ver Tudo"
              onPress={() =>
                Alert.alert("Ações", "Abrir menu de ações completas")
              }
              style={styles.redButton}
              textStyle={styles.whiteText}
            />
          </View>
          <View className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
            {/* Ação 1: Publicar Novo Comunicado */}
            <TouchableOpacity
              onPress={() => Alert.alert("Ação", "Criar Novo Comunicado")}
              className="flex-row items-center p-2 border-b border-gray-100"
              accessibilityRole="button"
              accessibilityLabel="Publicar Novo Comunicado"
            >
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                <IconeLucide id="comunicacao" tamanho={20} cor="#a855f7" />
              </View>
              <Text className="text-base text-gray-800 font-medium flex-1">
                Publicar Novo Comunicado
              </Text>
              <IconeLucide id="proximo" tamanho={20} cor="#9ca3af" />
            </TouchableOpacity>

            {/* Ação 2: Aprovar Ordens */}
            <TouchableOpacity
              onPress={() => Alert.alert("Ação", "Revisar e Aprovar Ordens")}
              className="flex-row items-center p-2 border-b border-gray-100"
              accessibilityRole="button"
              accessibilityLabel={`Revisar ${data.ocorrenciasPendentes} ordens pendentes`}
            >
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                <IconeLucide id="aprovar" tamanho={20} cor="#10b981" />
              </View>
              <Text className="text-base text-gray-800 font-medium flex-1">
                Revisar Ordens Pendentes ({data.ocorrenciasPendentes})
              </Text>
              <IconeLucide id="proximo" tamanho={20} cor="#9ca3af" />
            </TouchableOpacity>

            {/* Ação 3: Relatório Financeiro */}
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Ação", "Visualizar Prestação de Contas")
              }
              className="flex-row items-center p-2"
              accessibilityRole="button"
              accessibilityLabel="Prestação de Contas Mensal"
            >
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <IconeLucide id="historico" tamanho={20} cor="#3b82f6" />
              </View>
              <Text className="text-base text-gray-800 font-medium flex-1">
                Prestação de Contas (Mensal)
              </Text>
              <IconeLucide id="proximo" tamanho={20} cor="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="h-10" />
      </ScrollView>

      {/* Navbar Global */}
      <NavbarGlobal />
    </View>
  );
};

export default TelaInicial;
