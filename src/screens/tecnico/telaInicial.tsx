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
import {
  getOrdens,
  updateOrdem,
  OrdemServicoApi,
} from "../../services/ordemServico";
import { OrdemServicoUI, mapApiToUI } from "./types";
import CardOrdemPendente from "./CardOrdemPendente";
import CardOrdemAceita from "./CardOrdemAceita";
import ModalDetalhes from "./ModalDetalhes";
import ModalFinalizacao from "./ModalFinalizacao";

export default function TelaInicial() {
  const navigation = useNavigation();

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

      // Filtra apenas ordens aprovadas pelo síndico (aprovado = true)
      // e exclui ordens com status EM_EXECUCAO
      const ordensAprovadas = lista.filter(
        (o) =>
          o.aprovado === true &&
          o.status?.toUpperCase() !== "EM_EXECUCAO" &&
          o.status?.toUpperCase() !== "IN_PROGRESS"
      );

      const mapped = ordensAprovadas.map(mapApiToUI);
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

  const aceitarOS = (ordem: OrdemServicoUI) => {
    atualizarStatus(ordem, { status: "ACEITA" }, "Aceita");
    setModalDetalhesVisivel(false);
  };

  const recusarOS = (ordem: OrdemServicoUI) => {
    atualizarStatus(ordem, { status: "RECUSADA" }, "Recusada");
    setModalDetalhesVisivel(false);
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

  const ordensPendentes = ordens.filter((o) => o.status === "Pendente");
  const ordensAceitas = ordens.filter((o) => o.status === "Aceita");

  return (
    <View className="flex-1 bg-slate-100">
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="mb-6">
          <Text className="text-xl font-bold text-red-700 mb-3 text-center">
            Ordens de Serviço em Aberto
          </Text>

          {loading ? (
            <View className="items-center py-10">
              <ActivityIndicator size="large" />
            </View>
          ) : ordensPendentes.length === 0 ? (
            <View className="bg-white p-4 rounded-2xl border border-slate-200">
              <Text className="text-slate-500 text-center">
                Nenhuma ordem pendente.
              </Text>
            </View>
          ) : (
            ordensPendentes.map((ordem) => (
              <CardOrdemPendente
                key={ordem.id}
                ordem={ordem}
                onDetalhes={() => abrirDetalhes(ordem)}
                onAceitar={() => aceitarOS(ordem)}
                onRecusar={() => recusarOS(ordem)}
              />
            ))
          )}
        </View>
        <View className="mb-6">
          <Text className="text-xl font-bold text-red-700 mb-3 text-center">
            Ordens de Serviço Aceitas
          </Text>

          {ordensAceitas.length === 0 ? (
            <View className="bg-white p-4 rounded-2xl border border-slate-200">
              <Text className="text-slate-500 text-center">
                Nenhuma ordem aceita
              </Text>
            </View>
          ) : (
            ordensAceitas.map((ordem) => (
              <CardOrdemAceita
                key={ordem.id}
                ordem={ordem}
                onDetalhes={() => abrirDetalhes(ordem)}
                onFinalizar={() => abrirFinalizacao(ordem)}
              />
            ))
          )}
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-red-600 p-4 rounded-2xl mb-14"
        >
          <Text className="text-white text-center font-semibold">Voltar</Text>
        </TouchableOpacity>
      </ScrollView>

      <ModalDetalhes
        visible={modalDetalhesVisivel}
        ordem={ordemSelecionada}
        onClose={() => setModalDetalhesVisivel(false)}
        onAceitar={() => ordemSelecionada && aceitarOS(ordemSelecionada)}
        onRecusar={() => ordemSelecionada && recusarOS(ordemSelecionada)}
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
