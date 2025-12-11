/**
 * Tela de listagem de moradores ativos
 * Síndico visualiza todos os moradores do condomínio
 */

import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getMoradores } from "../../services/morador";
import { Morador } from "../../types/morador";
import { NAVBAR_HEIGHT } from "../../utils/responsividade";
import { IconeLucide } from "../../components/icones";
import { BotaoVoltar } from "../../components/navegacao";

type Props = NativeStackScreenProps<any, "MoradoresAtivos">;

const CardMorador = ({ morador }: { morador: Morador }) => {
  const [expanded, setExpanded] = useState(false);

  const formatarCPF = (cpf: string) => {
    if (!cpf) return "";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatarTelefone = (telefone: string) => {
    if (!telefone) return "";
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  return (
    <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-3 shadow-sm">
      {/* Header */}
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-3">
            <View className="flex-row items-center gap-2 mb-1">
              <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center">
                <IconeLucide id="moradores" tamanho={20} cor="#dc2626" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-base font-bold text-slate-900"
                  numberOfLines={1}
                >
                  {morador.nome}
                </Text>
                <Text className="text-xs text-slate-500">
                  CPF: {formatarCPF(morador.cpf)}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <View className="bg-green-100 px-2 py-1 rounded-full">
              <Text className="text-xs font-bold text-green-700">
                {morador.usuario?.papel || "MORADOR"}
              </Text>
            </View>
            <View
              className="items-center justify-center"
              style={{
                transform: [{ rotate: expanded ? "-90deg" : "90deg" }],
              }}
            >
              <IconeLucide id="proximo" tamanho={16} cor="#94a3b8" />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Detalhes expandidos */}
      {expanded && (
        <View className="mt-4 pt-4 border-t border-slate-100">
          {/* CPF */}
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-8 h-8 bg-slate-50 rounded-lg items-center justify-center">
              <IconeLucide id="moradores" tamanho={16} cor="#64748b" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-slate-500 mb-0.5">CPF</Text>
              <Text className="text-sm font-semibold text-slate-800">
                {formatarCPF(morador.cpf)}
              </Text>
            </View>
          </View>

          {/* Telefone */}
          {morador.telefone && (
            <View className="flex-row items-center gap-2 mb-3">
              <View className="w-8 h-8 bg-slate-50 rounded-lg items-center justify-center">
                <IconeLucide id="comunicacao" tamanho={16} cor="#64748b" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-500 mb-0.5">Telefone</Text>
                <Text className="text-sm font-semibold text-slate-800">
                  {formatarTelefone(morador.telefone)}
                </Text>
              </View>
            </View>
          )}

          {/* Papel do Usuário */}
          {morador.usuario?.papel && (
            <View className="flex-row items-center gap-2 mb-3">
              <View className="w-8 h-8 bg-slate-50 rounded-lg items-center justify-center">
                <IconeLucide id="moradores" tamanho={16} cor="#64748b" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-500 mb-0.5">Perfil</Text>
                <Text className="text-sm font-semibold text-slate-800">
                  {morador.usuario.papel}
                </Text>
              </View>
            </View>
          )}

          {/* Ações rápidas */}
          <View className="flex-row gap-2 mt-4">
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Ligação", `Ligar para ${morador.nome}`)
              }
              className="flex-1 py-2.5 rounded-xl bg-green-600 flex-row items-center justify-center gap-2"
            >
              <IconeLucide id="comunicacao" tamanho={16} cor="#fff" />
              <Text className="text-white font-semibold text-xs">Ligar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Alert.alert("WhatsApp", `Enviar mensagem para ${morador.nome}`)
              }
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 flex-row items-center justify-center gap-2"
            >
              <IconeLucide id="comunicacao" tamanho={16} cor="#fff" />
              <Text className="text-white font-semibold text-xs">WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const MoradoresAtivos: React.FC<Props> = ({ navigation }) => {
  const [moradores, setMoradores] = useState<Morador[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtro, setFiltro] = useState<string>("todos");

  const fetchMoradores = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMoradores();
      setMoradores(data);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível carregar a lista de moradores. Tente novamente."
      );
      console.error("Erro ao buscar moradores:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMoradores();
    }, [fetchMoradores])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMoradores();
  }, [fetchMoradores]);

  // Filtra por papel do usuário
  const moradoresFiltrados = moradores.filter((m) => {
    if (filtro === "todos") return true;
    return m.usuario?.papel === filtro;
  });

  // Estatísticas por papel
  const totalMoradores = moradores.length;
  const moradoresComuns = moradores.filter(
    (m) => m.usuario?.papel === "MORADOR"
  ).length;
  const sindicos = moradores.filter(
    (m) => m.usuario?.papel === "SINDICO"
  ).length;

  const renderHeader = () => (
    <View className="mb-4">
      {/* Título e Estatísticas */}
      <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-slate-200">
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="text-2xl font-bold text-slate-800">
              {totalMoradores}
            </Text>
            <Text className="text-xs text-slate-500 mt-1">Total</Text>
          </View>
          <View className="w-px bg-slate-200" />
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-600">
              {moradoresComuns}
            </Text>
            <Text className="text-xs text-slate-500 mt-1">Moradores</Text>
          </View>
          <View className="w-px bg-slate-200" />
          <View className="items-center">
            <Text className="text-2xl font-bold text-red-600">{sindicos}</Text>
            <Text className="text-xs text-slate-500 mt-1">Síndicos</Text>
          </View>
        </View>
      </View>

      {/* Filtros */}
      <View className="flex-row gap-2 mb-2">
        <TouchableOpacity
          onPress={() => setFiltro("todos")}
          className={`flex-1 py-3 rounded-xl ${
            filtro === "todos"
              ? "bg-red-600"
              : "bg-white border border-slate-200"
          }`}
        >
          <Text
            className={`text-center font-semibold text-sm ${
              filtro === "todos" ? "text-white" : "text-slate-600"
            }`}
          >
            Todos ({totalMoradores})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFiltro("MORADOR")}
          className={`flex-1 py-3 rounded-xl ${
            filtro === "MORADOR"
              ? "bg-red-600"
              : "bg-white border border-slate-200"
          }`}
        >
          <Text
            className={`text-center font-semibold text-sm ${
              filtro === "MORADOR" ? "text-white" : "text-slate-600"
            }`}
          >
            Moradores ({moradoresComuns})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFiltro("SINDICO")}
          className={`flex-1 py-3 rounded-xl ${
            filtro === "SINDICO"
              ? "bg-red-600"
              : "bg-white border border-slate-200"
          }`}
        >
          <Text
            className={`text-center font-semibold text-sm ${
              filtro === "SINDICO" ? "text-white" : "text-slate-600"
            }`}
          >
            Síndicos ({sindicos})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View className="items-center justify-center py-16">
      <View className="w-20 h-20 bg-slate-100 rounded-full items-center justify-center mb-4">
        <IconeLucide id="moradores" tamanho={40} cor="#94a3b8" />
      </View>
      <Text className="text-slate-600 font-semibold text-base mb-1">
        Nenhum usuário encontrado
      </Text>
      <Text className="text-slate-400 text-sm text-center px-8">
        {filtro === "todos"
          ? "Não há usuários cadastrados"
          : `Não há usuários com perfil ${filtro} cadastrados`}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <StatusBar barStyle="light-content" backgroundColor="#dc2626" />

        {/* Header fixo */}
        <View className="bg-red-600 px-4 pb-4 pt-5">
          <View className="flex-row items-center justify-between">
            <BotaoVoltar />
            <Text className="text-white text-xl font-bold">
              Moradores Ativos
            </Text>
            <View className="w-10" />
          </View>
        </View>

        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#dc2626" />
          <Text className="text-slate-500 mt-4">Carregando moradores...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#dc2626" />

      {/* Header fixo */}
      <View className="bg-red-600 px-4 pb-4 pt-5">
        <View className="flex-row items-center justify-between">
          <BotaoVoltar />
          <Text className="text-white text-xl font-bold">Moradores Ativos</Text>
          <View className="w-10" />
        </View>
      </View>

      {/* Lista */}
      <View className="flex-1 bg-slate-50">
        <FlatList
          data={moradoresFiltrados}
          keyExtractor={(item) => item.cpf}
          renderItem={({ item }) => <CardMorador morador={item} />}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 20,
            paddingBottom: NAVBAR_HEIGHT + 20,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#dc2626"
              colors={["#dc2626"]}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default MoradoresAtivos;
