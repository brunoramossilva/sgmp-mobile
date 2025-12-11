import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAutenticacao } from "../../contexto/ContextoAutenticacao";
import { NavbarGlobal } from "../../components/navegacao";
import { IconeLucide } from "../../components/icones";
import SkeletonBloco from "../../components/SkeletonBloco";
import { NAVBAR_HEIGHT } from "../../utils/responsividade";
import { CarrosselIntroducao } from "../../components/introducao";
import { obterSlidesIntroducao } from "../../utils/conteudoIntroducao";
import { useIntroducaoUsuario } from "../../hooks/useIntroducaoUsuario";

// Importação dos dados centralizados
import { FATURAS_MOCK, formatarMoeda, Fatura } from "../../utils/dadosMock";

// --- MOCK LOCAL PARA SERVIÇOS E RESERVAS ---
const SERVICOS_MOCK = [
  { id: "1", titulo: "Lâmpada queimada", data: "10/12", status: "pendente" },
  { id: "2", titulo: "Vazamento Pia", data: "05/12", status: "em_execucao" },
  { id: "3", titulo: "Interfone mudo", data: "01/12", status: "concluida" },
];

const RESERVAS_MOCK_MORADOR = [
  {
    id: "1",
    local: "Salão de Festas",
    data: "20/12",
    hora: "18:00",
    status: "aprovada",
  },
  {
    id: "2",
    local: "Churrasqueira",
    data: "15/01",
    hora: "12:00",
    status: "pendente",
  },
];

const InicialMorador = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { usuario, desautenticar } = useAutenticacao();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCarrossel, setShowCarrossel] = useState(true);
  const jaExibiuNaSessao = React.useRef(false);

  const cpf = usuario?.cpf || "";
  const { deveExibirIntroducao, marcarComoVisto, carregando } =
    useIntroducaoUsuario(cpf, "MORADOR");

  const handleFecharCarrossel = () => {
    setShowCarrossel(false);
    jaExibiuNaSessao.current = true;
    marcarComoVisto();
  };

  React.useEffect(() => {
    // Se já exibiu nesta sessão, não mostrar novamente
    if (jaExibiuNaSessao.current) {
      setShowCarrossel(false);
    }
  }, []);

  const moradorName = usuario?.nome?.trim()
    ? usuario.nome.split(" ")[0]
    : "Morador";

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

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

  // Card de Faturas
  const renderCardFatura = (fatura: Fatura) => {
    let corIcone = "#64748b";
    let bgIcone = "bg-slate-100";
    let statusColor = "text-slate-500";
    let statusBg = "bg-slate-100";
    let iconeId = "financeiro";

    switch (fatura.status) {
      case "pago":
        corIcone = "#15803d";
        bgIcone = "bg-green-50";
        statusColor = "text-green-700";
        statusBg = "bg-green-100";
        iconeId = "confirmar";
        break;
      case "pendente":
        corIcone = "#c2410c";
        bgIcone = "bg-orange-50";
        statusColor = "text-orange-700";
        statusBg = "bg-orange-100";
        iconeId = "financeiro";
        break;
      case "atrasado":
        corIcone = "#dc2626";
        bgIcone = "bg-red-50";
        statusColor = "text-red-700";
        statusBg = "bg-red-100";
        iconeId = "alerta";
        break;
    }

    return (
      <View
        key={fatura.id}
        className="bg-white p-3 rounded-3xl mr-3 w-44 h-44 shadow-sm border border-slate-100 justify-between"
        style={{ elevation: 2 }}
      >
        <View className="flex-row justify-between items-start">
          <View
            className={`w-10 h-10 ${bgIcone} rounded-full items-center justify-center`}
          >
            <IconeLucide id={iconeId as any} tamanho={20} cor={corIcone} />
          </View>
          <View className={`${statusBg} px-2 py-1 rounded-lg`}>
            <Text className={`text-[9px] font-bold uppercase ${statusColor}`}>
              {fatura.status}
            </Text>
          </View>
        </View>

        {/* Meio: Valor */}
        <View>
          <Text
            className="text-xs text-slate-400 font-medium mb-0.5"
            numberOfLines={1}
          >
            {fatura.titulo}
          </Text>
          <Text
            className="text-xl font-bold text-slate-800 tracking-tight"
            numberOfLines={1}
          >
            {formatarMoeda(fatura.valor)}
          </Text>
        </View>

        {/* Rodapé: Data */}
        <Text className="text-[10px] text-slate-400">
          Vence em: {fatura.vencimento}
        </Text>
      </View>
    );
  };

  // 2. Card de Serviços
  const renderCardServico = (item: any) => {
    let badgeBg = "bg-slate-100";
    let badgeColor = "text-slate-600";
    let iconColor = "#64748b";
    let label = "Pendente";

    if (item.status === "pendente") {
      badgeBg = "bg-orange-100";
      badgeColor = "text-orange-700";
      iconColor = "#f97316";
      label = "Análise";
    } else if (item.status === "em_execucao") {
      badgeBg = "bg-blue-100";
      badgeColor = "text-blue-700";
      iconColor = "#3b82f6";
      label = "Execução";
    } else if (item.status === "concluida") {
      badgeBg = "bg-green-100";
      badgeColor = "text-green-700";
      iconColor = "#10b981";
      label = "Concluída";
    }

    return (
      <View
        key={item.id}
        className="bg-white p-3 rounded-3xl mr-3 w-44 h-44 shadow-sm border border-slate-100 justify-between"
        style={{ elevation: 2 }}
      >
        <View className="flex-row justify-between items-start">
          <View className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center">
            <IconeLucide id="servicos" tamanho={20} cor={iconColor} />
          </View>
          <View className={`px-2 py-1 rounded-lg ${badgeBg}`}>
            <Text className={`text-[9px] font-bold uppercase ${badgeColor}`}>
              {label}
            </Text>
          </View>
        </View>

        <View>
          <Text
            className="text-sm font-bold text-slate-800 leading-4"
            numberOfLines={2}
          >
            {item.titulo}
          </Text>
        </View>

        <View className="flex-row items-center">
          <IconeLucide id="calendario" tamanho={12} cor="#94a3b8" />
          <Text className="text-[10px] text-slate-400 ml-1">
            Aberto em: {item.data}
          </Text>
        </View>
      </View>
    );
  };

  // 3. Card de Reservas (Quadrado)
  const renderCardReserva = (item: any) => {
    return (
      <View
        key={item.id}
        className="bg-white p-3 rounded-3xl mr-3 w-44 h-44 shadow-sm border border-slate-100 justify-between"
        style={{ elevation: 2 }}
      >
        <View className="flex-row justify-between items-start">
          {/* Data Block */}
          <View className="bg-purple-50 rounded-xl px-2.5 py-1.5 items-center">
            <Text className="text-purple-600 font-bold text-base">
              {item.data.split("/")[0]}
            </Text>
            <Text className="text-purple-400 text-[8px] uppercase font-bold">
              {item.data.split("/")[1] === "12" ? "DEZ" : "JAN"}
            </Text>
          </View>
          {/* Status Badge */}
          <View
            className={`px-2 py-1 rounded-lg ${
              item.status === "aprovada" ? "bg-green-100" : "bg-orange-100"
            }`}
          >
            <Text
              className={`text-[9px] font-bold uppercase ${
                item.status === "aprovada"
                  ? "text-green-700"
                  : "text-orange-700"
              }`}
            >
              {item.status === "aprovada" ? "OK" : "..."}
            </Text>
          </View>
        </View>

        <View>
          <Text
            className="text-sm font-bold text-slate-800 leading-4"
            numberOfLines={2}
          >
            {item.local}
          </Text>
        </View>

        <View className="flex-row items-center">
          <IconeLucide id="relogio" tamanho={12} cor="#94a3b8" />
          <Text className="text-[10px] text-slate-400 ml-1">{item.hora}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white pt-20 px-4">
        <SkeletonBloco
          height={120}
          style={{ marginBottom: 20, borderRadius: 20 }}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="#dc2626" />

      {/* Carrossel de Introdução */}
      {showCarrossel && (
        <CarrosselIntroducao
          slides={obterSlidesIntroducao("MORADOR")}
          aoConcluir={handleFecharCarrossel}
          nomePapel="MORADOR"
        />
      )}

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
            <Text className="text-red-100 text-base font-medium">Olá,</Text>
            <View className="bg-white/20 px-2 py-0.5 rounded-md border border-white/10">
              <Text className="text-white text-[9px] font-bold uppercase tracking-wider">
                Morador
              </Text>
            </View>
          </View>
          <Text className="text-white text-3xl font-bold">{moradorName}</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 -mt-6"
        contentContainerStyle={{ paddingBottom: NAVBAR_HEIGHT + 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#dc2626"
          />
        }
      >
        {/* COMUNICADOS */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-3 px-2">
            <Text className="text-sm font-bold text-slate-600 uppercase tracking-wider">
              Comunicados
            </Text>
            <TouchableOpacity
              onPress={() => Alert.alert("Comunicados", "Ver lista")}
            >
              <Text className="text-xs font-bold text-red-600">Ver todos</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100"
            style={{ elevation: 2 }}
          >
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                <Text className="text-base font-bold text-slate-800">
                  Queremos ouvir você!
                </Text>
              </View>
              <Text className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                Hoje
              </Text>
            </View>
            <Text
              className="text-sm text-slate-500 leading-5 mb-4"
              numberOfLines={3}
            >
              Estamos realizando uma pesquisa de satisfação para entender como
              podemos melhorar...
            </Text>
            <View className="flex-row items-center">
              <Text className="text-red-600 text-xs font-bold mr-2">
                Ler completo
              </Text>
              <IconeLucide id="proximo" tamanho={12} cor="#dc2626" />
            </View>
          </TouchableOpacity>
        </View>

        {/* MEUS SERVIÇOS */}
        <View className="mb-6">
          <View className="px-6 flex-row justify-between items-center mb-3">
            <Text className="text-sm font-bold text-slate-600 uppercase tracking-wider">
              Meus Serviços
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("CriacaoOsMorador" as never)}
            >
              <Text className="text-xs font-bold text-red-600">Nova OS</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 24, paddingRight: 10 }}
            className="pb-2"
          >
            {SERVICOS_MOCK.map((item) => renderCardServico(item))}
          </ScrollView>
        </View>

        {/* MINHAS RESERVAS */}
        <View className="mb-6">
          <View className="px-6 flex-row justify-between items-center mb-3">
            <Text className="text-sm font-bold text-slate-600 uppercase tracking-wider">
              Minhas Reservas
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("ReservasMorador" as never)}
            >
              <Text className="text-xs font-bold text-red-600">Agendar</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 24, paddingRight: 10 }}
            className="pb-2"
          >
            {RESERVAS_MOCK_MORADOR.map((item) => renderCardReserva(item))}
          </ScrollView>
        </View>

        {/* FATURAS */}
        <View>
          <View className="px-6 flex-row justify-between items-center mb-3">
            <Text className="text-sm font-bold text-slate-600 uppercase tracking-wider">
              Suas Contas
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("FinanceiroMorador" as never)}
            >
              <Text className="text-xs font-bold text-red-600">Histórico</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 24, paddingRight: 10 }}
            className="pb-4"
          >
            {FATURAS_MOCK.slice(0, 5).map((fatura) => renderCardFatura(fatura))}
          </ScrollView>
        </View>

        <View className="h-4" />
      </ScrollView>

      <NavbarGlobal telaAtiva="Inicio" />
    </View>
  );
};

export default InicialMorador;
