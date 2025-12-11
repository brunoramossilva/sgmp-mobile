import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { IconeLucide } from "../../components/icones";
import { BotaoVoltar } from "../../components/navegacao";
import { NavbarGlobal } from "../../components/navegacao";

// IMPORTAÇÃO DOS DADOS MOCKADOS
import {
  RESUMO_SINDICO,
  GRAFICO_FLUXO_MOCK,
  INADIMPLENCIA_MOCK,
  formatarMoeda,
  Inadimplente,
} from "../../utils/dadosMock";

// Componente Visual: Barra do Gráfico
const BarraGrafico = ({
  label,
  valor1,
  valor2,
  max,
}: {
  label: string;
  valor1: number;
  valor2: number;
  max: number;
}) => {
  // Evita divisão por zero
  const safeMax = max > 0 ? max : 1;
  const h1 = Math.min((valor1 / safeMax) * 100, 100);
  const h2 = Math.min((valor2 / safeMax) * 100, 100);

  return (
    <View className="items-center mx-2 flex-1">
      <View className="h-32 w-8 flex-row items-end justify-center space-x-1">
        {/* Barra Receita */}
        <View
          className="bg-green-500 w-3 rounded-t-sm"
          style={{ height: `${h1}%` }}
        />
        {/* Barra Despesa */}
        <View
          className="bg-red-400 w-3 rounded-t-sm"
          style={{ height: `${h2}%` }}
        />
      </View>
      <Text className="text-[10px] text-slate-500 mt-2 font-bold">{label}</Text>
    </View>
  );
};

export default function FinanceiroSindico() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Encontrar o maior valor para escalar o gráfico dinamicamente
  const maxValor =
    Math.max(
      ...GRAFICO_FLUXO_MOCK.map((d) => Math.max(d.receita, d.despesa)),
      1000
    ) * 1.1;

  const renderInadimplente = (item: Inadimplente) => (
    <View
      key={item.id}
      className="bg-white p-4 rounded-xl border border-slate-100 mb-3 flex-row items-center justify-between shadow-sm"
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center mr-3">
          <IconeLucide id="alerta" tamanho={20} cor="#dc2626" />
        </View>
        <View>
          <Text className="text-slate-800 font-bold text-sm">
            {item.unidade}
          </Text>
          <Text className="text-slate-500 text-xs">{item.nome}</Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-red-600 font-bold text-base">
          {formatarMoeda(item.valor)}
        </Text>
        <Text className="text-slate-400 text-[10px] uppercase font-bold">
          {item.mesesAtraso} meses atraso
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      {/* HEADER FIXO */}
      <View
        className="bg-red-600 px-4 pb-4 shadow-md z-10"
        style={{ paddingTop: (insets.top || 0) + 12 }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center flex-1">
            <View className="mr-3">
              <BotaoVoltar />
            </View>
            <View>
              <Text className="text-white text-lg font-bold">
                Gestão Financeira
              </Text>
              <Text className="text-white/80 text-xs">
                Visão geral do condomínio
              </Text>
            </View>
          </View>
          <View className="bg-red-700 p-2 rounded-lg opacity-80">
            <IconeLucide id="financeiro" tamanho={20} cor="#fff" />
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/*CARD DE SALDO PRINCIPAL */}
        <View className="px-4 pt-6">
          <View className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <Text className="text-slate-500 text-xs font-bold uppercase mb-1">
              Saldo em Caixa (Atual)
            </Text>
            <Text className="text-4xl font-extrabold text-slate-800 tracking-tight">
              {formatarMoeda(RESUMO_SINDICO.saldoAtual)}
            </Text>
            <View className="h-[1px] bg-slate-100 my-4" />
            <View className="flex-row justify-between">
              <View>
                <View className="flex-row items-center mb-1">
                  <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                  <Text className="text-slate-400 text-xs">Receita (Mês)</Text>
                </View>
                <Text className="text-green-600 font-bold text-base">
                  {formatarMoeda(RESUMO_SINDICO.receitaMes)}
                </Text>
              </View>
              <View>
                <View className="flex-row items-center mb-1">
                  <View className="w-2 h-2 rounded-full bg-red-400 mr-2" />
                  <Text className="text-slate-400 text-xs">Despesa (Mês)</Text>
                </View>
                <Text className="text-red-500 font-bold text-base">
                  {formatarMoeda(RESUMO_SINDICO.despesaMes)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/*GRÁFICO DE FLUXO */}
        <View className="px-4 mt-6">
          <Text className="text-slate-700 font-bold mb-3 text-sm">
            Fluxo de Caixa (Semestral)
          </Text>
          <View className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <View className="flex-row justify-between items-end h-40 pb-2">
              {GRAFICO_FLUXO_MOCK.map((d, index) => (
                <BarraGrafico
                  key={index}
                  label={d.mes}
                  valor1={d.receita}
                  valor2={d.despesa}
                  max={maxValor}
                />
              ))}
            </View>
            <View className="flex-row justify-center items-center mt-2 gap-4">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-500 rounded mr-1" />
                <Text className="text-[10px] text-slate-500">Entradas</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-red-400 rounded mr-1" />
                <Text className="text-[10px] text-slate-500">Saídas</Text>
              </View>
            </View>
          </View>
        </View>

        {/*LISTA DE INADIMPLÊNCIA */}
        <View className="px-4 mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-slate-700 font-bold text-sm">
              Inadimplência Recente
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Text className="text-red-600 text-xs font-bold">Ver todos</Text>
            </TouchableOpacity>
          </View>

          {/* Mapeamento manual pois estamos dentro de um ScrollView */}
          {INADIMPLENCIA_MOCK.map((item) => renderInadimplente(item))}
        </View>
      </ScrollView>

      <NavbarGlobal telaAtiva="Financeiro" />
    </View>
  );
}
