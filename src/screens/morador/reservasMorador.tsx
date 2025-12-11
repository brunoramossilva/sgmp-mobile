import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { IconeLucide } from "../../components/icones";
import NavbarGlobal from "../../components/navegacao/NavbarGlobal";
import { BotaoCriar } from "../../components/formulario"; 

// Dados
import { AREAS_COMUNS, HORARIOS_RESERVA_MOCK, AreaComum } from "../../utils/dadosMock";

export default function ReservasMorador() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Estados
  const [areaSelecionada, setAreaSelecionada] = useState<AreaComum>(
    AREAS_COMUNS[0]
  );
  const [dataSelecionada, setDataSelecionada] = useState<number | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  //CALENDÁRIO SIMPLES 
  const gerarDiasDoCalendario = () => {
    const dias = [];
    const hoje = new Date();

    for (let i = 0; i < 14; i++) {
      const dataFutura = new Date(hoje);
      dataFutura.setDate(hoje.getDate() + i);

      dias.push({
        id: i,
        dia: dataFutura.getDate(),
        diaSemana: dataFutura
          .toLocaleDateString("pt-BR", { weekday: "short" })
          .replace(".", "")
          .toUpperCase(),
        dataCompleta: dataFutura.toLocaleDateString("pt-BR"),
      });
    }
    return dias;
  };

  const diasCalendario = gerarDiasDoCalendario();

  // Ação de Reservar
  const handleReservar = () => {
    if (!dataSelecionada || !horarioSelecionado) return;

    setLoading(true);

    // Simulação de API
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Reserva Confirmada! 🎉",
        `Você reservou: ${areaSelecionada.titulo}\nData: ${diasCalendario[dataSelecionada].dataCompleta}\nHorário: ${horarioSelecionado}`,
        [
          {
            text: "OK",
            onPress: () => {
              // Reseta ou navega para inicio
              setDataSelecionada(null);
              setHorarioSelecionado(null);
            },
          },
        ]
      );
    }, 1500);
  };

  // Renderiza ícone baseado no tipo
  const getIconeArea = (tipo: string) => {
    if (tipo === "piscina") return "servicos"; // autalizar para ícone de água/sol se tiver
    if (tipo === "churrasqueira") return "financeiro"; // autalizar para fogo/comida se tiver
    return "home"; // Salão
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* HEADER */}
      <View
        className="bg-red-600 px-4 pb-4 shadow-md z-10"
        style={{ paddingTop: (insets.top || 0) + 12 }}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-lg font-bold">Reservas</Text>
            <Text className="text-white/80 text-xs">
              Agende seu momento de lazer
            </Text>
          </View>
          <View className="bg-red-700 p-2 rounded-lg opacity-80">
            <IconeLucide id="reservas" tamanho={20} cor="#fff" />
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* 1. SELEÇÃO DE LOCAL */}
        <View className="pt-6 pl-4">
          <Text className="text-slate-700 font-bold mb-3 text-sm">
            1. Escolha o Local
          </Text>
          <FlatList
            data={AREAS_COMUNS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isSelected = areaSelecionada.id === item.id;
              return (
                <TouchableOpacity
                  onPress={() => setAreaSelecionada(item)}
                  className={`mr-3 p-4 rounded-2xl w-36 h-32 justify-between border ${
                    isSelected
                      ? "bg-red-600 border-red-600"
                      : "bg-white border-slate-200"
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowRadius: 3,
                    elevation: 2,
                  }}
                >
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      isSelected ? "bg-white/20" : "bg-slate-100"
                    }`}
                  >
                    <IconeLucide
                      id={getIconeArea(item.tipo) as any}
                      tamanho={18}
                      cor={isSelected ? "#fff" : "#64748b"}
                    />
                  </View>
                  <View>
                    <Text
                      className={`font-bold ${
                        isSelected ? "text-white" : "text-slate-700"
                      }`}
                    >
                      {item.titulo}
                    </Text>
                    <Text
                      className={`text-[10px] mt-1 ${
                        isSelected ? "text-red-100" : "text-slate-400"
                      }`}
                    >
                      Capacidade: {item.capacidade}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* 2. CALENDÁRIO HORIZONTAL */}
        <View className="pt-6 pl-4">
          <Text className="text-slate-700 font-bold mb-3 text-sm">
            2. Escolha a Data
          </Text>
          <FlatList
            data={diasCalendario}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isSelected = dataSelecionada === item.id;
              return (
                <TouchableOpacity
                  onPress={() => setDataSelecionada(item.id)}
                  className={`mr-3 items-center justify-center w-14 h-20 rounded-2xl border ${
                    isSelected
                      ? "bg-slate-800 border-slate-800"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <Text
                    className={`text-[10px] font-bold uppercase mb-1 ${
                      isSelected ? "text-slate-400" : "text-slate-400"
                    }`}
                  >
                    {item.diaSemana}
                  </Text>
                  <Text
                    className={`text-xl font-bold ${
                      isSelected ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {item.dia}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* 3. HORÁRIOS */}
        <View className="pt-6 px-4">
          <Text className="text-slate-700 font-bold mb-3 text-sm">
            3. Escolha o Horário
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {HORARIOS_RESERVA_MOCK.map((horario) => {
              const isSelected = horarioSelecionado === horario;
              return (
                <TouchableOpacity
                  key={horario}
                  onPress={() => setHorarioSelecionado(horario)}
                  className={`px-4 py-3 rounded-xl border flex-grow items-center ${
                    isSelected
                      ? "bg-green-600 border-green-600"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <Text
                    className={`font-bold ${
                      isSelected ? "text-white" : "text-slate-600"
                    }`}
                  >
                    {horario}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* BOTÃO CONFIRMAR */}
        <View className="px-4 mt-8">
          <BotaoCriar
            titulo={loading ? "Reservando..." : "Confirmar Reserva"}
            aoPresionar={handleReservar}
            carregando={loading}
            desabilitado={!dataSelecionada || !horarioSelecionado || loading}
            tamanho="grande"
          />
          {!dataSelecionada && (
            <Text className="text-center text-slate-400 text-xs mt-3">
              Selecione uma data para continuar
            </Text>
          )}
        </View>
      </ScrollView>

      {/* NAVBAR */}
      <NavbarGlobal telaAtiva="Reservas" />
    </View>
  );
}
