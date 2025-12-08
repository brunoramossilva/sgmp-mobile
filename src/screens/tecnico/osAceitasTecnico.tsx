import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAutenticacao } from "../../contexto/ContextoAutenticacao";
import {
  getOrdens,
  updateOrdem,
  OrdemServicoApi,
} from "../../services/ordemServico";
import { OrdemServicoUI, mapApiToUI } from "./types";
import CardOrdemAceita from "./CardOrdemAceita";
import ModalDetalhes from "./ModalDetalhes";
import ModalFinalizacao from "./ModalFinalizacao";
import SkeletonOrdem from "./SkeletonOrdem";
import { NavbarGlobal } from "../../components/navegacao";
import { NAVBAR_HEIGHT } from "../../utils/responsividade";

export default function OsAceitasTecnico() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { desautenticar } = useAutenticacao();

  const [ordens, setOrdens] = useState<OrdemServicoUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [modalDetalhesVisivel, setModalDetalhesVisivel] = useState(false);
  const [modalFinalizacaoVisivel, setModalFinalizacaoVisivel] = useState(false);

  const [ordemSelecionada, setOrdemSelecionada] =
    useState<OrdemServicoUI | null>(null);

  useEffect(() => {
    fetchOrdens();
  }, []);

  const fetchOrdens = async () => {
    try {
      setLoading(true);

      const lista = await getOrdens();

      if (!lista || !Array.isArray(lista)) {
        console.warn("getOrdens() retornou algo inesperado:", lista);
        setOrdens([]);
        return;
      }

      // Filtra ordens aceitas pelo técnico ou em execução
      const ordensAceitas = lista.filter(
        (o) =>
          o.aprovado === true &&
          (o.status?.toUpperCase() === "ACEITA" ||
            o.status?.toUpperCase() === "EM_EXECUCAO")
      );

      const mapped = ordensAceitas.map(mapApiToUI);
      setOrdens(mapped);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível carregar ordens.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrdens();
  };

  const atualizarStatus = async (
    ordem: OrdemServicoUI,
    novoStatusBackend: Partial<OrdemServicoApi>,
    novoStatusUI: OrdemServicoUI["status"]
  ) => {
    try {
      await updateOrdem(ordem.id, novoStatusBackend);

      setOrdens((prev) =>
        prev.map((o) =>
          o.id === ordem.id ? { ...o, status: novoStatusUI } : o
        )
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível atualizar a OS.");
    }
  };

  const abrirDetalhes = (ordem: OrdemServicoUI) => {
    setOrdemSelecionada(ordem);
    setModalDetalhesVisivel(true);
  };

  const abrirFinalizacao = (ordem: OrdemServicoUI) => {
    setOrdemSelecionada(ordem);
    setModalFinalizacaoVisivel(true);
  };

  const finalizarOS = async () => {
    if (!ordemSelecionada) return;

    await atualizarStatus(
      ordemSelecionada,
      {
        status: "FINALIZADA",
        dataConclusao: new Date().toISOString(),
      },
      "Finalizada"
    );

    setModalFinalizacaoVisivel(false);
    setOrdemSelecionada(null);
  };

  return (
    <View className="flex-1 bg-slate-100">
      {/* Header simples com logout */}
      <View
        className="bg-red-600 px-4 py-3 flex-row items-center justify-between"
        style={{ paddingTop: (insets.top || 0) + 12 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-row items-center"
          style={{ gap: 8 }}
        >
          <Text
            className="text-white text-base font-semibold"
            style={{ lineHeight: 10 }}
          >
            Voltar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Sair", "Deseja fazer logout?", [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Sair",
                style: "destructive",
                onPress: () => {
                  desautenticar();
                  navigation.navigate("Login" as never);
                },
              },
            ]);
          }}
          className="bg-red-700 px-3 py-2 rounded-lg"
        >
          <Text className="text-white text-sm font-semibold">Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="mb-6">
          <Text className="text-xl font-bold text-red-700 mb-3 text-center">
            Ordens de Serviço Aceitas
          </Text>

          {loading ? (
            <View className="py-2">
              {[1, 2, 3].map((i) => (
                <SkeletonOrdem key={i} />
              ))}
            </View>
          ) : ordens.length === 0 ? (
            <View className="bg-white p-4 rounded-2xl border border-slate-200">
              <Text className="text-slate-500 text-center">
                Nenhuma ordem aceita
              </Text>
            </View>
          ) : (
            ordens.map((ordem) => (
              <CardOrdemAceita
                key={ordem.id}
                ordem={ordem}
                onDetalhes={() => abrirDetalhes(ordem)}
                onFinalizar={() => abrirFinalizacao(ordem)}
              />
            ))
          )}
        </View>
        <View style={{ marginBottom: NAVBAR_HEIGHT }} />
      </ScrollView>

      <ModalDetalhes
        visible={modalDetalhesVisivel}
        ordem={ordemSelecionada}
        onClose={() => setModalDetalhesVisivel(false)}
        onAceitar={() => {}}
        onRecusar={() => {}}
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

      <NavbarGlobal />
    </View>
  );
}
