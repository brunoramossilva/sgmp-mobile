import { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  RefreshControl,
  BackHandler,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAutenticacao } from "../../contexto/ContextoAutenticacao";
import { CarrosselIntroducao } from "../../components/introducao";
import { obterSlidesIntroducao } from "../../utils/conteudoIntroducao";
import {
  getOrdens,
  updateOrdem,
  OrdemServicoApi,
} from "../../services/ordemServico";
import { OrdemServicoUI, mapApiToUI } from "./types";
import CardOrdemPendente from "./CardOrdemPendente";
import ModalDetalhes from "./ModalDetalhes";
import ModalFinalizacao from "./ModalFinalizacao";
import SkeletonOrdem from "./SkeletonOrdem";
import { IconeLucide } from "../../components/icones";
import SkeletonBloco from "../../components/SkeletonBloco";

// --- TIPOS E INTERFACES ---

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

interface StatusCardProps {
  title: string;
  value: string;
  iconId: "servicos" | "confirmar" | "alerta";
  iconColor: string;
  bgColorClass: string;
  valueColorClass: string;
  onPress: () => void;
}

interface DashboardData {
  ordensAguardando: number;
  ordensAceitas: number;
  ordensFinalizadas: number;
}

// --- COMPONENTES AUXILIARES ---

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, style, textStyle }) => (
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
    className={`${bgColorClass} rounded-xl p-3 shadow-sm border border-slate-200 flex-1 mx-1`}
  >
    <View className="items-center">
      <View className="w-10 h-10 items-center justify-center mb-2">
        <IconeLucide id={iconId} tamanho={24} cor={iconColor} />
      </View>
      <Text className={`text-2xl font-bold ${valueColorClass} mb-1`}>{value}</Text>
      <Text className="text-xs text-gray-600 font-medium text-center">{title}</Text>
    </View>
  </TouchableOpacity>
);

// --- HOOK CUSTOMIZADO PARA DASHBOARD ---

const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    ordensAguardando: 0,
    ordensAceitas: 0,
    ordensFinalizadas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const response = await getOrdens();
      const ordensUI = response.map(mapApiToUI);

      setData({
        ordensAguardando: ordensUI.filter((o) => o.status === "Pendente").length,
        ordensAceitas: ordensUI.filter((o) => o.status === "Aceita").length,
        ordensFinalizadas: ordensUI.filter((o) => o.status === "Finalizada").length,
      });
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dashboard");
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

  return { data, loading, error, refreshing, refetch };
};

// --- COMPONENTE PRINCIPAL ---

export default function TelaInicial() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { usuario, desautenticar } = useAutenticacao();
  const { data, loading: dashboardLoading, error, refreshing, refetch } = useDashboardData();

  const [ordens, setOrdens] = useState<OrdemServicoUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [exibirIntroducao, setExibirIntroducao] = useState(false);
  const [deveExibirIntroducao, setDeveExibirIntroducao] = useState(false);
  const [carregandoIntroducao, setCarregandoIntroducao] = useState(true);
  const [modalDetalhesVisivel, setModalDetalhesVisivel] = useState(false);
  const [modalFinalizacaoVisivel, setModalFinalizacaoVisivel] = useState(false);
  const [ordemSelecionada, setOrdemSelecionada] = useState<OrdemServicoUI | null>(null);
  const [abaSelecionada, setAbaSelecionada] = useState<"pendentes" | "aceitas" | "finalizadas">("pendentes");

  // Refetch ao focar na tela
  useFocusEffect(
    useCallback(() => {
      refetch();
      carregarOrdens();
    }, [refetch])
  );

  const carregarOrdens = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOrdens();
      setOrdens(response.map(mapApiToUI));
    } catch (err) {
      console.error("Erro ao carregar ordens:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarOrdens();
  }, [carregarOrdens]);

  const handleLogout = () => {
    Alert.alert(
      "Desconectar",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", onPress: () => {}, style: "cancel" },
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
      ]
    );
  };

  const abrirDetalhes = (ordem: OrdemServicoUI) => {
    setOrdemSelecionada(ordem);
    setModalDetalhesVisivel(true);
  };

  const aceitarOS = async (ordem: OrdemServicoUI) => {
    try {
      await updateOrdem(ordem.id, { 
        status: "EM_EXECUCAO",
        aprovado: true,
        cpf_funcionario: usuario?.cpf || null
      });
      await carregarOrdens();
      refetch();
      Alert.alert("Sucesso", "Ordem aceita com sucesso!");
    } catch (err) {
      Alert.alert("Erro", "Não foi possível aceitar a ordem");
      console.error(err);
    }
  };

  const recusarOS = async (ordem: OrdemServicoUI) => {
    Alert.alert(
      "Confirmar Recusa",
      "Tem certeza que deseja recusar esta ordem?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Recusar",
          style: "destructive",
          onPress: async () => {
            try {
              await updateOrdem(ordem.id, { status: "RECUSADA" });
              await carregarOrdens();
              refetch();
              Alert.alert("Sucesso", "Ordem recusada");
            } catch (err) {
              Alert.alert("Erro", "Não foi possível recusar a ordem");
              console.error(err);
            }
          },
        },
      ]
    );
  };

  const abrirFinalizacao = (ordem: OrdemServicoUI) => {
    setOrdemSelecionada(ordem);
    setModalFinalizacaoVisivel(true);
  };

  const finalizarOS = async () => {
    if (!ordemSelecionada) return;
    try {
      await updateOrdem(ordemSelecionada.id, { 
        status: "FINALIZADA",
        dataConclusao: new Date().toISOString()
      });
      await carregarOrdens();
      refetch();
      setModalFinalizacaoVisivel(false);
      setOrdemSelecionada(null);
      Alert.alert("Sucesso", "Ordem finalizada com sucesso!");
    } catch (err) {
      Alert.alert("Erro", "Não foi possível finalizar a ordem");
      console.error(err);
    }
  };

  // Dados filtrados por abas
  const ordensAgrupadas = useMemo(() => {
    return {
      pendentes: ordens.filter((o) => o.status === "Pendente"),
      aceitas: ordens.filter((o) => o.status === "Aceita"),
      finalizadas: ordens.filter((o) => o.status === "Finalizada"),
    };
  }, [ordens]);

  const ordensExibidas = useMemo(() => {
    switch (abaSelecionada) {
      case "pendentes":
        return ordensAgrupadas.pendentes;
      case "aceitas":
        return ordensAgrupadas.aceitas;
      case "finalizadas":
        return ordensAgrupadas.finalizadas;
      default:
        return [];
    }
  }, [abaSelecionada, ordensAgrupadas]);

  const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
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
    abaSelecionada: {
      borderBottomWidth: 3,
      borderBottomColor: "#dc2626",
    },
    abaInativa: {
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
    },
  });

  // Mostrar introdução se necessário
  if (exibirIntroducao && usuario) {
    const slidesIntroducao = obterSlidesIntroducao(usuario.papel);
    return (
      <CarrosselIntroducao
        slides={slidesIntroducao}
        aoConcluir={async () => {
          setExibirIntroducao(false);
        }}
        nomePapel={usuario.papel}
      />
    );
  }

  // Loading state
  if (dashboardLoading) {
    return (
      <View style={styles.screenContainer} className="bg-white">
        <View className="bg-red-600 p-4 pt-16 flex-row items-center justify-between">
          <View className="w-10">
            <IconeLucide id="servicos" tamanho={32} cor="#ffffff" />
          </View>
          <View className="flex-1 items-center justify-center">
            <Text className="text-white text-xl font-bold">Técnico</Text>
          </View>
          <View className="w-10 items-end">
            <IconeLucide id="logout" tamanho={28} cor="#ffffff" />
          </View>
        </View>
        <View className="p-4 pt-8">
          {[1, 2, 3].map((i) => (
            <SkeletonBloco key={i} height={90} style={{ marginBottom: 12 }} />
          ))}
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.screenContainer} className="bg-white">
        <View className="bg-red-600 p-4 pt-16 flex-row items-center justify-between">
          <View className="w-10">
            <IconeLucide id="servicos" tamanho={32} cor="#ffffff" />
          </View>
          <View className="flex-1 items-center justify-center">
            <Text className="text-white text-xl font-bold">Técnico</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} className="w-10 items-end">
            <IconeLucide id="logout" tamanho={28} cor="#ffffff" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center px-4">
          <IconeLucide id="alerta" tamanho={56} cor="#ef4444" />
          <Text className="text-gray-800 text-lg font-semibold mt-4 text-center">
            Erro ao Carregar Dados
          </Text>
          <Text className="text-gray-600 mt-2 text-center">{error}</Text>
          <TouchableOpacity
            onPress={refetch}
            className="mt-6 bg-red-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer} className="bg-white">
      {/* Header Fixo */}
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

      {/* Seção de Informações do Usuário - Fixo */}
      <View className="bg-red-600 px-4 pb-4 flex-row items-center">
        <View className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4">
          <Text className="text-red-600 text-2xl font-bold">
            {usuario?.nome ? usuario.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() : 'TC'}
          </Text>
        </View>
        <View>
          <Text className="text-white text-xl font-semibold">Olá, {usuario?.nome || "Técnico"}</Text>
          <Text className="text-sm text-white font-bold">Técnico Condominial</Text>
        </View>
      </View>

      {/* Cards de Status - Fixo */}
      <View className="bg-white px-4 py-4 border-b border-slate-200">
        <Text className="text-lg font-bold text-gray-800 mb-3">Visão Geral</Text>
        <View className="flex-row">
          <StatusCard
            title="Aguardando"
            value={data.ordensAguardando.toString()}
            iconId="comunicacao"
            iconColor="#ef4444"
            bgColorClass="bg-red-100"
            valueColorClass="text-red-600"
            onPress={() => setAbaSelecionada("pendentes")}
          />

          <StatusCard
            title="Aceitas"
            value={data.ordensAceitas.toString()}
            iconId="progresso"
            iconColor="#3b82f6"
            bgColorClass="bg-blue-100"
            valueColorClass="text-blue-600"
            onPress={() => setAbaSelecionada("aceitas")}
          />

          <StatusCard
            title="Finalizadas"
            value={data.ordensFinalizadas.toString()}
            iconId="verificado"
            iconColor="#10b981"
            bgColorClass="bg-green-100"
            valueColorClass="text-green-600"
            onPress={() => setAbaSelecionada("finalizadas")}
          />
        </View>
      </View>

      {/* Abas de Filtro - Fixo */}
      <View className="bg-white flex-row border-b border-slate-200">
        <TouchableOpacity
          onPress={() => setAbaSelecionada("pendentes")}
          style={[abaSelecionada === "pendentes" ? styles.abaSelecionada : styles.abaInativa]}
          className="flex-1 py-3 items-center"
        >
          <Text
            className={`font-semibold text-sm ${
              abaSelecionada === "pendentes" ? "text-red-600" : "text-gray-600"
            }`}
          >
            Pendentes ({ordensAgrupadas.pendentes.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setAbaSelecionada("aceitas")}
          style={[abaSelecionada === "aceitas" ? styles.abaSelecionada : styles.abaInativa]}
          className="flex-1 py-3 items-center"
        >
          <Text
            className={`font-semibold text-sm ${
              abaSelecionada === "aceitas" ? "text-red-600" : "text-gray-600"
            }`}
          >
            Aceitas ({ordensAgrupadas.aceitas.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setAbaSelecionada("finalizadas")}
          style={[abaSelecionada === "finalizadas" ? styles.abaSelecionada : styles.abaInativa]}
          className="flex-1 py-3 items-center"
        >
          <Text
            className={`font-semibold text-sm ${
              abaSelecionada === "finalizadas" ? "text-red-600" : "text-gray-600"
            }`}
          >
            Finalizadas ({ordensAgrupadas.finalizadas.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* ScrollView apenas para Lista de Ordens */}
      <ScrollView
        className="flex-1 bg-white"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            colors={["#dc2626"]}
            tintColor="#dc2626"
          />
        }
      >
        {/* Lista de Ordens */}
        <View className="px-4 mb-4">
          {loading ? (
            <View className="py-2">
              {[1, 2, 3].map((i) => (
                <SkeletonOrdem key={i} />
              ))}
            </View>
          ) : ordensExibidas.length === 0 ? (
            <View className="bg-slate-50 p-6 rounded-xl border border-slate-200 items-center justify-center">
              <IconeLucide
                id={
                  abaSelecionada === "pendentes"
                    ? "alerta"
                    : abaSelecionada === "aceitas"
                    ? "servicos"
                    : "confirmar"
                }
                tamanho={48}
                cor={
                  abaSelecionada === "pendentes"
                    ? "#ef4444"
                    : abaSelecionada === "aceitas"
                    ? "#3b82f6"
                    : "#10b981"
                }
              />
              <Text className="text-slate-600 text-center mt-3 font-medium">
                {abaSelecionada === "pendentes"
                  ? "Nenhuma ordem aguardando"
                  : abaSelecionada === "aceitas"
                  ? "Nenhuma ordem aceita"
                  : "Nenhuma ordem finalizada"}
              </Text>
              <Text className="text-slate-500 text-center text-sm mt-1">
                {abaSelecionada === "pendentes"
                  ? "Você está em dia com suas tarefas!"
                  : abaSelecionada === "aceitas"
                  ? "Aceite novas ordens para começar"
                  : "Suas ordens finalizadas aparecerão aqui"}
              </Text>
            </View>
          ) : (
            ordensExibidas.map((ordem) => (
              <CardOrdemPendente
                key={ordem.id}
                ordem={ordem}
                onDetalhes={() => abrirDetalhes(ordem)}
                onAceitar={
                  abaSelecionada === "pendentes"
                    ? () => aceitarOS(ordem)
                    : undefined
                }
                onRecusar={
                  abaSelecionada === "pendentes"
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
