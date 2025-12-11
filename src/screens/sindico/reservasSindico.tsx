import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { IconeLucide } from "../../components/icones";
import { BotaoVoltar } from "../../components/navegacao";
import NavbarGlobal from "../../components/navegacao/NavbarGlobal";

// Dados
import { RESERVAS_LISTA_MOCK, ReservaGestao } from "../../utils/dadosMock";

export default function ReservasSindico() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [dataFiltro, setDataFiltro] = useState<string>(
    new Date().toLocaleDateString("pt-BR")
  );

  //  GERADOR DE CALENDÁRIO
  const calendarioDias = useMemo(() => {
    const dias = [];
    const hoje = new Date();

    for (let i = 0; i < 14; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      const dataFormatada = data.toLocaleDateString("pt-BR"); // DD/MM/AAAA

      // Verifica se há reservas neste dia
      const temReserva = RESERVAS_LISTA_MOCK.some(
        (r) => r.data === dataFormatada
      );
      const qtdReservas = RESERVAS_LISTA_MOCK.filter(
        (r) => r.data === dataFormatada
      ).length;

      dias.push({
        id: i,
        diaNum: data.getDate(),
        diaSemana: data
          .toLocaleDateString("pt-BR", { weekday: "short" })
          .replace(".", "")
          .toUpperCase(),
        dataCompleta: dataFormatada,
        temReserva,
        qtdReservas,
      });
    }
    return dias;
  }, []);

  // Filtrar a lista com base na data selecionada
  const reservasFiltradas = useMemo(() => {
    return RESERVAS_LISTA_MOCK.filter((r) => r.data === dataFiltro);
  }, [dataFiltro]);

  // Renderização do Card de Reserva
  const renderReservaItem = ({ item }: { item: ReservaGestao }) => {
    let corStatus = "bg-gray-100 text-gray-600";
    let iconStatus = "financeiro"; // default

    switch (item.status) {
      case "aprovada":
        corStatus = "bg-green-100 text-green-700";
        iconStatus = "verificado"; // ou um check
        break;
      case "pendente":
        corStatus = "bg-orange-100 text-orange-700";
        iconStatus = "alerta";
        break;
      case "recusada":
        corStatus = "bg-red-100 text-red-700";
        iconStatus = "financeiro"; // x
        break;
    }

    return (
      <View className="bg-white p-4 rounded-2xl border border-slate-200 mb-3 shadow-sm">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center mr-2">
              <IconeLucide id="moradores" tamanho={16} cor="#64748b" />
            </View>
            <View>
              <Text className="text-sm font-bold text-slate-800">
                {item.morador}
              </Text>
              <Text className="text-xs text-slate-500">
                Unidade: {item.unidade}
              </Text>
            </View>
          </View>
          <View className={`px-2 py-1 rounded-md ${corStatus.split(" ")[0]}`}>
            <Text
              className={`text-[10px] font-bold uppercase ${
                corStatus.split(" ")[1]
              }`}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <View className="bg-slate-50 p-3 rounded-xl mb-3">
          <Text className="text-slate-800 font-semibold text-sm mb-1">
            {item.area}
          </Text>
          <View className="flex-row gap-4">
            <View className="flex-row items-center">
              <IconeLucide id="calendario" tamanho={14} cor="#64748b" />
              <Text className="text-xs text-slate-500 ml-1">{item.data}</Text>
            </View>
            <View className="flex-row items-center">
              <IconeLucide id="relogio" tamanho={14} cor="#64748b" />
              <Text className="text-xs text-slate-500 ml-1">
                {item.horario}
              </Text>
            </View>
          </View>
        </View>

        {/* Ações (Só mostra se estiver pendente) */}
        {item.status === "pendente" && (
          <View className="flex-row gap-3 mt-1">
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Aprovar", "Deseja aprovar esta reserva?", [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Aprovar",
                    style: "default",
                    onPress: () => console.log("Reserva aprovada"),
                  },
                ])
              }
              className="flex-1 bg-green-600 py-2 rounded-lg items-center"
            >
              <Text className="text-white font-bold text-xs">Aprovar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Recusar", "Deseja recusar esta reserva?", [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Recusar",
                    style: "destructive",
                    onPress: () => console.log("Reserva recusada"),
                  },
                ])
              }
              className="flex-1 bg-red-50 py-2 rounded-lg items-center border border-red-100"
            >
              <Text className="text-red-600 font-bold text-xs">Recusar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
          <View className="flex-row items-center flex-1">
            <View className="mr-3">
              <BotaoVoltar />
            </View>
            <View>
              <Text className="text-white text-lg font-bold">
                Gestão de Reservas
              </Text>
              <Text className="text-white/80 text-xs">
                Calendário de ocupação
              </Text>
            </View>
          </View>
          <View className="bg-red-700 p-2 rounded-lg opacity-80">
            <IconeLucide id="reservas" tamanho={20} cor="#fff" />
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* CALENDÁRIO HORIZONTAL  */}
        <View className="pt-6 pb-2">
          <Text className="px-4 text-slate-700 font-bold mb-3 text-sm">
            Calendário (Próximos 14 dias)
          </Text>
          <FlatList
            data={calendarioDias}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isSelected = dataFiltro === item.dataCompleta;
              return (
                <TouchableOpacity
                  onPress={() => setDataFiltro(item.dataCompleta)}
                  className={`mr-3 items-center justify-center w-14 h-20 rounded-2xl border relative ${
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
                    {item.diaNum}
                  </Text>

                  {/* Indicador de Reserva (Bolinha) */}
                  {item.temReserva && (
                    <View
                      className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${
                        isSelected ? "bg-red-500" : "bg-red-500"
                      }`}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* 2. LISTA DE RESERVAS DO DIA */}
        <View className="px-4 mt-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-slate-700 font-bold text-sm">
              Reservas para{" "}
              {dataFiltro === new Date().toLocaleDateString("pt-BR")
                ? "Hoje"
                : dataFiltro}
            </Text>
            {reservasFiltradas.length > 0 && (
              <View className="bg-slate-200 px-2 py-0.5 rounded-full">
                <Text className="text-xs font-bold text-slate-600">
                  {reservasFiltradas.length}
                </Text>
              </View>
            )}
          </View>

          {reservasFiltradas.length === 0 ? (
            <View className="bg-white p-8 rounded-2xl border border-slate-100 items-center justify-center border-dashed">
              <IconeLucide id="calendario" tamanho={48} cor="#64748b" />
              <Text className="text-slate-500 font-medium mt-2">
                Nenhuma reserva para este dia
              </Text>
              <Text className="text-slate-400 text-xs text-center mt-1">
                As áreas comuns estão livres.
              </Text>
            </View>
          ) : (
            reservasFiltradas.map((reserva) => (
              <View key={reserva.id}>
                {renderReservaItem({ item: reserva })}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <NavbarGlobal telaAtiva="Reservas" />
    </View>
  );
}
