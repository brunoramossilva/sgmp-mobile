import React, { useEffect, useState } from "react";
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
  Platform,
  BackHandler,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAutenticacao } from "../../contexto/ContextoAutenticacao";
import { CarrosselIntroducao } from "../../components/introducao";
import { obterSlidesIntroducao } from "../../utils/conteudoIntroducao";
import { IconeLucide } from "../../components/icones";
import SkeletonBloco from "../../components/SkeletonBloco";
import { NavbarGlobal } from "../../components/navegacao";
import { NAVBAR_HEIGHT } from "../../utils/responsividade";

// --- DEFINIÇÃO DAS INTERFACES (TIPOS) ---

// Tipos para o componente CustomButton
interface CustomButtonProps {
  title: string;
  onPress: () => void;
  // StyleProp é o tipo recomendado para estilos em React Native
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

// --- COMPONENTES AUXILIARES TIPADOS ---

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

// --- COMPONENTE PRINCIPAL ---

const TelaInicial = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { usuario, desautenticar } = useAutenticacao();

  const [exibirIntroducao, setExibirIntroducao] = useState(false);
  const [deveExibirIntroducao, setDeveExibirIntroducao] = useState(false);
  const [carregandoIntroducao, setCarregandoIntroducao] = useState(true);

  // Log para acompanhar mudanças do usuário
  useEffect(() => {
    console.log(`[Morador] Usuário atualizado:`, usuario);
  }, [usuario]);

  // Gerenciar estado de introdução do usuário - mover para useEffect
  useEffect(() => {
    if (!usuario?.cpf) {
      setCarregandoIntroducao(false);
      return;
    }

    const verificarIntroducao = async () => {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const chaveArmazenamento = `introducao_${usuario.cpf}_${usuario.papel}`;
        const jaVisualizado = await AsyncStorage.getItem(chaveArmazenamento);
        setDeveExibirIntroducao(jaVisualizado === null);
      } catch (erro) {
        console.error(`Erro ao verificar introdução: ${erro}`);
        setDeveExibirIntroducao(true);
      } finally {
        setCarregandoIntroducao(false);
      }
    };

    verificarIntroducao();
  }, [usuario?.cpf, usuario?.papel]);

  const marcarComoVisto = async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const chaveArmazenamento = `introducao_${usuario?.cpf}_${usuario?.papel}`;
      await AsyncStorage.setItem(chaveArmazenamento, 'true');
      setDeveExibirIntroducao(false);
    } catch (erro) {
      console.error(`Erro ao marcar introdução como visto: ${erro}`);
    }
  };

  useEffect(() => {
    console.log("TelaInicial do Morador renderizada");

    // Mostrar introdução apenas uma vez, após carregamento
    if (!carregandoIntroducao && deveExibirIntroducao && !exibirIntroducao) {
      setExibirIntroducao(true);
    }

    // Interceptar botão voltar do Android
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleLogout();
        return true; // Previne o comportamento padrão
      }
    );

    return () => backHandler.remove();
  }, [carregandoIntroducao, deveExibirIntroducao, exibirIntroducao]);

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente fazer logout?", [
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
  };

  const aoFinalizarIntroducao = async () => {
    await marcarComoVisto();
    setExibirIntroducao(false);
  };

  if (carregandoIntroducao) {
    return (
      <View className="flex-1 bg-white" style={{ paddingTop: (insets.top || 0) + 12 }}>
        <View className="px-4">
          <SkeletonBloco height={56} style={{ marginBottom: 12 }} />
          <SkeletonBloco height={140} style={{ marginBottom: 16 }} />
          {[1, 2, 3].map((i) => (
            <SkeletonBloco key={i} height={90} />
          ))}
        </View>
      </View>
    );
  }

  // Mostrar carrossel se necessário
  if (exibirIntroducao && usuario) {
    const slidesIntroducao = obterSlidesIntroducao(usuario.papel);
    return (
      <CarrosselIntroducao
        slides={slidesIntroducao}
        aoConcluir={aoFinalizarIntroducao}
        nomePapel={usuario.papel}
      />
    );
  }

  // Definição de estilos usando StyleSheet para melhor performance e tipagem
  const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    scrollContent: {
      paddingBottom: 120 + insets.bottom, // Adiciona espaço extra baseado na área segura
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

  return (
    <View style={styles.screenContainer} className="bg-white">
      {/* Header */}
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

      {/* Seção de informações do usuário */}
      <View className="bg-red-600 px-4 pb-4 flex-row items-center">
        <View className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4">
          <Text className="text-red-600 text-2xl font-bold">
            {usuario?.nome ? usuario.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() : 'MD'}
          </Text>
        </View>
        <View>
          <Text className="text-white text-xl font-semibold">Olá, {usuario?.nome || "Morador"}</Text>
          <Text className="text-sm text-white font-bold">Morador</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        className="bg-white pt-4"
      >
        <View className="px-4 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-bold text-gray-800">Comunicados</Text>
            <CustomButton
              title="Ver mais"
              onPress={() => Alert.alert("Comunicados", "Ver mais detalhes.")}
              style={styles.redButton}
              textStyle={styles.whiteText}
            />
          </View>
          <View className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-base font-semibold text-gray-800">
                Queremos ouvir você!
              </Text>
              <Text className="text-xs text-gray-500">Hoje</Text>
            </View>
            <Text className="text-sm text-gray-600">Equipe de Gestão</Text>
            <Text className="text-sm mt-2 text-gray-700" numberOfLines={3}>
              Estamos realizando uma pesquisa de satisfação para entender como
              podemos melhorar a gestão do condomínio e garantir que suas
              necessidades sejam atendidas de forma eficiente. Sua opinião é
              muito importante para nós.
            </Text>
          </View>
        </View>

        <View className="px-4 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-bold text-gray-800">
              Faturas recentes
            </Text>
            <CustomButton
              title="Ver mais"
              onPress={() =>
                Alert.alert("Faturas", "Ver mais detalhes sobre faturas.")
              }
              style={styles.redButton}
              textStyle={styles.whiteText}
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="py-2"
          >
            <View className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md w-64 mr-4">
              <View className="flex-row justify-between items-center mb-2">
                <View className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <IconeLucide id="financeiro" tamanho={20} cor="#dc2626" />
                </View>
                <View className="bg-red-100 px-3 py-1 rounded-full">
                  <Text className="text-red-600 text-xs font-semibold">
                    Pendente
                  </Text>
                </View>
              </View>
              <Text className="text-base text-gray-700">
                Taxa mensal do condomínio
              </Text>
              <View className="bg-orange-100 px-3 py-1 rounded-md self-start mt-2">
                <Text className="text-lg font-bold text-orange-700">
                  R$ 1200
                </Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Vencimento: 10/12/25
              </Text>
            </View>

            <View className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md w-64 mr-4">
              <View className="flex-row justify-between items-center mb-2">
                <View className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <IconeLucide id="confirmar" tamanho={20} cor="#15803d" />
                </View>
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-600 text-xs font-semibold">
                    Pago
                  </Text>
                </View>
              </View>
              <Text className="text-base text-gray-700">Fundo de reserva</Text>
              <View className="bg-green-100 px-3 py-1 rounded-md self-start mt-2">
                <Text className="text-lg font-bold text-green-700">R$ 300</Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Vencimento: 05/11/25
              </Text>
            </View>
          </ScrollView>
        </View>
        <View className="h-10"></View>
      </ScrollView>

      <NavbarGlobal />
    </View>
  );
};

export default TelaInicial;
