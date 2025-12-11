import React from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { IconeLucide } from "../../components/icones";
import NavbarGlobal from "../../components/navegacao/NavbarGlobal";
import { BotaoVoltar } from "../../components/navegacao";

// IMPORTAÇÃO DOS DADOS CENTRALIZADOS (Financeiro apenas)
import { FATURAS_MOCK, formatarMoeda, Fatura } from "../../utils/dadosMock";

export default function FinanceiroMorador() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // CÁLCULO DINÂMICO DOS TOTAIS (Sincronizado com os dados)
  const totalPendente = FATURAS_MOCK.filter(
    (f) => f.status === "pendente" || f.status === "atrasado"
  ).reduce((acc, curr) => acc + curr.valor, 0);

  const totalPago = FATURAS_MOCK.filter((f) => f.status === "pago").reduce(
    (acc, curr) => acc + curr.valor,
    0
  );

  // Renderização de cada item da lista
  const renderItem = ({ item }: { item: Fatura }) => {
    // Definição de cores e ícones baseados no status
    let corStatus = "bg-gray-100 text-gray-600";
    let textoStatus = "Desconhecido";
    let icone = "financeiro";

    switch (item.status) {
      case "pago":
        corStatus = "bg-green-100 text-green-700";
        textoStatus = "Pago";
        break;
      case "pendente":
        corStatus = "bg-orange-100 text-orange-700";
        textoStatus = "Pendente";
        break;
      case "atrasado":
        corStatus = "bg-red-100 text-red-700";
        textoStatus = "Atrasado";
        break;
    }

    switch (item.tipo) {
      case "energia":
        icone = "alerta";
        break;
      case "agua":
        icone = "financeiro";
        break;
      default:
        icone = "financeiro";
        break;
    }

    return (
      <TouchableOpacity
        className="bg-white p-4 rounded-xl border border-slate-100 mb-3 flex-row items-center shadow-sm"
        activeOpacity={0.7}
        onPress={() =>
          Alert.alert(
            "Detalhes",
            `Fatura: ${item.titulo}\nValor: ${formatarMoeda(item.valor)}`
          )
        }
      >
        {/* Ícone Lateral */}
        <View className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center mr-3 border border-slate-200">
          <IconeLucide id={icone as any} tamanho={20} cor="#64748b" />
        </View>

        {/* Informações Centrais */}
        <View className="flex-1">
          <Text className="text-slate-800 font-bold text-sm">
            {item.titulo}
          </Text>
          <Text className="text-slate-500 text-xs">
            Vencimento: {item.vencimento}
          </Text>
        </View>

        {/* Valor e Status */}
        <View className="items-end">
          <Text className="text-slate-900 font-bold text-base">
            {formatarMoeda(item.valor)}
          </Text>
          <View
            className={`px-2 py-0.5 rounded-md mt-1 ${corStatus.split(" ")[0]}`}
          >
            <Text
              className={`text-[10px] font-bold uppercase ${
                corStatus.split(" ")[1]
              }`}
            >
              {textoStatus}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* HEADER FIXO */}
      <View
        className="bg-red-600 px-4 pb-4 shadow-md z-10"
        style={{ paddingTop: (insets.top || 0) + 12 }}
      >
        <View className="flex-row justify-between items-center">
          <BotaoVoltar />
          <View className="flex-1 mx-3">
            <Text className="text-white text-lg font-bold">Financeiro</Text>
            <Text className="text-white/80 text-xs">
              Acompanhe suas contas e faturas
            </Text>
          </View>
          {/* Botão de filtro simples (visual) */}
          <TouchableOpacity className="bg-red-700 p-2 rounded-lg opacity-90">
            <IconeLucide id="financeiro" tamanho={20} cor="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTEÚDO */}
      <View className="flex-1 px-4 pt-4">
        {/* CARDS DE RESUMO (Agora Dinâmicos) */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <Text className="text-slate-500 text-xs font-medium uppercase">
              A Pagar
            </Text>
            <Text className="text-red-600 text-lg font-bold">
              {formatarMoeda(totalPendente)}
            </Text>
          </View>
          <View className="flex-1 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <Text className="text-slate-500 text-xs font-medium uppercase">
              Pago (Mês)
            </Text>
            <Text className="text-green-600 text-lg font-bold">
              {formatarMoeda(totalPago)}
            </Text>
          </View>
        </View>

        <Text className="text-slate-700 font-bold mb-3 text-sm">
          Histórico de Lançamentos
        </Text>

        {/* LISTA DE FATURAS (Usando dados importados) */}
        <FlatList
          data={FATURAS_MOCK}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>

      {/* NAVBAR GLOBAL FIXA */}
      <NavbarGlobal telaAtiva="Financeiro" />
    </View>
  );
}
