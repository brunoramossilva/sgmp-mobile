import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  BackHandler,
  Platform,
} from "react-native";
import {
  useNavigation,
  useRoute,
  NavigationProp,
  useFocusEffect, // Essencial para gerenciar o foco da tela
} from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAutenticacao } from "../../contexto/ContextoAutenticacao";
import { IconeLucide } from "../icones";
import { IdIcone } from "../../utils/iconesLucide";

/**
 * IDs lógicos para os itens da Navbar
 */
export type NavbarItemType =
  | "Inicio"
  | "Servicos"
  | "Financeiro"
  | "Reservas"
  | "Pendentes"
  | "Aceitas";

interface NavItem {
  id: IdIcone;
  label: string;
  type: NavbarItemType;
  routeName: string | null;
  disabled?: boolean;
}

interface NavbarGlobalProps {
  telaAtiva?: NavbarItemType;
  onBackPress?: () => boolean;
}

/**
 * Configuração dos itens por perfil
 */
function getNavItemsByRole(
  papel: "MORADOR" | "FUNCIONARIO" | "SINDICO"
): NavItem[] {
  switch (papel) {
    case "MORADOR":
      return [
        {
          id: "home",
          label: "Início",
          type: "Inicio",
          routeName: "InicialMorador",
        },
        {
          id: "servicos",
          label: "Serviços",
          type: "Servicos",
          routeName: "CriacaoOsMorador",
        },
        {
          id: "financeiro",
          label: "Financeiro",
          type: "Financeiro",
          routeName: "FinanceiroMorador",
          disabled: false,
        },
        {
          id: "reservas",
          label: "Reservas",
          type: "Reservas",
          routeName: "ReservasMorador",
          disabled: false,
        },
      ];

    case "FUNCIONARIO":
      return [
        {
          id: "home",
          label: "Início",
          type: "Inicio",
          routeName: "InicialTecnico",
        },
        {
          id: "progresso",
          label: "Pendentes",
          type: "Pendentes",
          routeName: "InicialTecnico",
        },
        {
          id: "confirmar",
          label: "Aceitas",
          type: "Aceitas",
          routeName: "OsAceitasTecnico",
        },
      ];

    case "SINDICO":
      return [
        {
          id: "home",
          label: "Início",
          type: "Inicio",
          routeName: "InicialSindico",
        },
        {
          id: "servicos",
          label: "Serviços",
          type: "Servicos",
          routeName: "ServicosSindico",
        },
        {
          id: "financeiro",
          label: "Financeiro",
          type: "Financeiro",
          routeName: "FinanceiroSindico",
          disabled: false,
        },
        {
          id: "reservas",
          label: "Reservas",
          type: "Reservas",
          routeName: "ReservasSindico",
          disabled: false,
        },
      ];

    default:
      return [];
  }
}

function getInitialRouteByRole(papel: string): string {
  switch (papel) {
    case "MORADOR":
      return "InicialMorador";
    case "FUNCIONARIO":
      return "InicialTecnico";
    case "SINDICO":
      return "InicialSindico";
    default:
      return "Login";
  }
}

const NavbarGlobal: React.FC<NavbarGlobalProps> = React.memo(
  ({ onBackPress, telaAtiva }) => {
    const navigation = useNavigation<NavigationProp<any>>();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const { usuario, desautenticar } = useAutenticacao();

    const navItems = usuario?.papel ? getNavItemsByRole(usuario.papel) : [];
    const initialRoute = usuario?.papel
      ? getInitialRouteByRole(usuario.papel)
      : "Login";

    const handleNavigation = useCallback(
      (item: NavItem) => {
        if (item.disabled) {
          Alert.alert(
            "Em Breve",
            `O módulo "${item.label}" está em desenvolvimento.`
          );
          return;
        }

        if (item.routeName) {
          navigation.navigate(item.routeName as never);
        } else {
          Alert.alert("Navegação", `Rota para ${item.label} não definida.`);
        }
      },
      [navigation]
    );

    // Lógica do botão de voltar 
    useFocusEffect(
      useCallback(() => {
        const onBack = () => {
          if (onBackPress && onBackPress()) return true;
          if (route.name === initialRoute) {
            Alert.alert("Sair", "Deseja realmente sair do aplicativo?", [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Sair",
                style: "destructive",
                onPress: () => {
                  desautenticar();
                  navigation.navigate("Login");
                },
              },
            ]);
            return true; 
          }
          if (navigation.canGoBack()) {
            navigation.goBack();
            return true; 
          }
          return false;
        };

        let subscription: any;

        if (Platform.OS === "android") {
          subscription = BackHandler.addEventListener(
            "hardwareBackPress",
            onBack
          );
        }

        return () => {
          if (subscription) {
            subscription.remove();
          }
        };
      }, [route.name, initialRoute, onBackPress, desautenticar, navigation])
    );

    if (!usuario || !usuario.papel) return null;

    return (
      <View
        className="absolute left-4 right-4 bg-red-600 rounded-2xl shadow-xl z-20"
        style={{
          bottom: Math.max(insets.bottom, 24),
          paddingVertical: 12,
          paddingHorizontal: 8,
        }}
      >
        <View className="flex-row justify-between items-center px-2">
          {navItems.map((item) => {
            const isFocused = telaAtiva
              ? telaAtiva === item.type
              : route.name === item.routeName;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleNavigation(item)}
                className="items-center justify-center flex-1"
                activeOpacity={0.7}
                disabled={item.disabled}
                style={{ opacity: item.disabled ? 0.5 : 1 }}
              >
                <IconeLucide
                  id={item.id}
                  tamanho={24}
                  cor={isFocused ? "#ffffff" : "#fca5a5"}
                />
                <Text
                  numberOfLines={1}
                  className={`text-[10px] mt-1 text-center ${
                    isFocused ? "text-white font-bold" : "text-red-200"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
);

NavbarGlobal.displayName = "NavbarGlobal";

export default NavbarGlobal;