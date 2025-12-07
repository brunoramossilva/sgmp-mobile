import React, { useEffect } from "react";
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

// --- DEFINIÇÃO DAS INTERFACES (TIPOS) ---

// Tipos para o componente CustomButton
interface CustomButtonProps {
  title: string;
  onPress: () => void;
  // StyleProp é o tipo recomendado para estilos em React Native
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

// Tipos para o componente NavItem
interface NavItemProps {
  iconName: "home" | "services" | "financial" | "reservations"; // Definindo opções válidas
  label: string;
  isFocused: boolean; // O erro estava aqui, pois faltava tipar e garantir a propriedade
  onPress: () => void;
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

const NavItem: React.FC<NavItemProps> = ({
  iconName,
  label,
  isFocused,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="items-center justify-center p-1"
  >
    <Text className={`text-xl ${isFocused ? "text-white" : "text-gray-300"}`}>
      {iconName === "home"
        ? "🏠"
        : iconName === "services"
        ? "🔧"
        : iconName === "financial"
        ? "💰"
        : "📆"}
    </Text>
    <Text
      className={`text-xs ${isFocused ? "text-white" : "text-gray-300"} mt-1`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

// --- COMPONENTE PRINCIPAL ---

const TelaInicial = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { usuario, desautenticar } = useAutenticacao();

  useEffect(() => {
    console.log("TelaInicial do Morador renderizada");

    // Interceptar botão voltar do Android
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleLogout();
        return true; // Previne o comportamento padrão
      }
    );

    return () => backHandler.remove();
  }, []);

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

  // Definição de estilos usando StyleSheet para melhor performance e tipagem
  const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: "#FDF7F5",
    },
    scrollContent: {
      paddingBottom: 120 + insets.bottom, // Adiciona espaço extra baseado na área segura
      backgroundColor: "#FDF7F5",
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
    <View style={styles.screenContainer} className="bg-orange-50">
      {/* Header */}
      <View className="bg-red-600">
        <View
          className="px-4 flex-row items-center justify-between"
          style={{ paddingTop: (insets.top || 0) + 8, paddingBottom: 12 }}
        >
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">CINOVA SGMP</Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-700 px-3 py-2 rounded-lg"
          >
            <Text className="text-white text-sm font-semibold">Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Seção de informações do usuário com fundo mais claro */}
      <View className="bg-red-700 px-4 pb-4 pt-6">
        <View className="flex-row items-center">
          <View className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4 shadow-md">
            <Text className="text-red-600 text-2xl font-bold">
              {usuario?.nome?.charAt(0).toUpperCase() || "M"}
            </Text>
          </View>
          <View>
            <Text className="text-white text-xl font-semibold">
              Olá, {usuario?.nome || "Morador"}
            </Text>
            <Text className="text-sm text-white opacity-90">Morador</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        className="bg-orange-50 pt-4"
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
          <View className="bg-white p-4 rounded-lg shadow-sm">
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
            <View className="bg-white p-4 rounded-lg shadow-sm w-64 mr-4">
              <View className="flex-row justify-between items-center mb-2">
                <View className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Text className="text-red-600 text-lg">🏦</Text>
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

            <View className="bg-white p-4 rounded-lg shadow-sm w-64 mr-4">
              <View className="flex-row justify-between items-center mb-2">
                <View className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Text className="text-green-600 text-lg">✅</Text>
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

      <View
        className="absolute inset-x-4 bg-red-600 py-3 px-2 rounded-2xl shadow-xl"
        style={{
          bottom: Math.max(insets.bottom + 8, 24), // Garante que fique acima dos botões do sistema
        }}
      >
        <View className="flex-row justify-around items-center">
          <NavItem
            iconName="home"
            label="Início"
            isFocused={true}
            onPress={() => Alert.alert("Navegação", "Início!")}
          />
          <NavItem
            iconName="services"
            label="Serviços"
            isFocused={false}
            onPress={() => navigation.navigate("CriacaoOsMorador" as never)}
          />
          <NavItem
            iconName="financial"
            label="Financeiro"
            isFocused={false}
            onPress={() => Alert.alert("Navegação", "Financeiro!")}
          />
          <NavItem
            iconName="reservations"
            label="Reservas"
            isFocused={false}
            onPress={() => Alert.alert("Navegação", "Reservas!")}
          />
        </View>
      </View>
    </View>
  );
};

export default TelaInicial;
