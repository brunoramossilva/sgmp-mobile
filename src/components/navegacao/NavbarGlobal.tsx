import React, { useCallback, useEffect } from "react";
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
} from "@react-navigation/native";
import { useAutenticacao } from "../../contexto/ContextoAutenticacao";
import { IconeLucide } from "../icones";
import { IdIcone } from "../../utils/iconesLucide";

/**
 * Interface para definir um item de navegação
 */
interface NavItem {
  id: IdIcone;
  label: string;
  routeName: string | null;
  disabled?: boolean;
}

/**
 * Props para o componente NavbarGlobal
 */
interface NavbarGlobalProps {
  /**
   * Callback customizado para o comportamento do botão voltar do Android
   * Retorna true se o evento foi tratado, false caso contrário
   */
  onBackPress?: () => boolean;
}

/**
 * Obtém os itens de navegação baseado no papel do usuário
 * @param papel - Papel do usuário (MORADOR, FUNCIONARIO, SINDICO)
 * @returns Array de itens de navegação
 */
function getNavItemsByRole(
  papel: "MORADOR" | "FUNCIONARIO" | "SINDICO"
): NavItem[] {
  switch (papel) {
    case "MORADOR":
      return [
        { id: "home", label: "Início", routeName: "InicialMorador" },
        { id: "criar-os", label: "Criar OS", routeName: "CriacaoOsMorador" },
        {
          id: "historico",
          label: "Histórico",
          routeName: null,
          disabled: true,
        },
      ];

    case "FUNCIONARIO":
      return [
        { id: "home", label: "Início", routeName: "InicialTecnico" },
        { id: "progresso", label: "Pendentes", routeName: "InicialTecnico" },
        { id: "confirmar", label: "Aceitas", routeName: "OsAceitasTecnico" },
      ];

    case "SINDICO":
      return [
        { id: "home", label: "Início", routeName: "InicialSindico" },
        { id: "servicos", label: "Serviços", routeName: "ServicosSindico" },
        {
          id: "financeiro",
          label: "Financeiro",
          routeName: null,
          disabled: true,
        },
        { id: "reservas", label: "Reservas", routeName: null, disabled: true },
      ];

    default:
      return [];
  }
}

/**
 * Obtém o nome da rota inicial baseado no papel do usuário
 */
function getInitialRouteByRole(
  papel: "MORADOR" | "FUNCIONARIO" | "SINDICO"
): string {
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

/**
 * Componente de navegação global que se adapta ao papel do usuário
 * Substitui footers locais em todas as telas principais
 */
const NavbarGlobal: React.FC<NavbarGlobalProps> = React.memo(
  ({ onBackPress }) => {
    const navigation = useNavigation<NavigationProp<any>>();
    const route = useRoute();
    const { usuario, desautenticar } = useAutenticacao();

    // Obtém os itens de navegação baseado no papel do usuário
    const navItems = usuario?.papel ? getNavItemsByRole(usuario.papel) : [];
    const initialRoute = usuario?.papel
      ? getInitialRouteByRole(usuario.papel)
      : "Login";

    /**
     * Handler para navegação de itens
     * Só navega se o item pertence ao perfil atual do usuário
     */
    const handleNavigation = useCallback(
      (item: NavItem) => {
        if (item.disabled) {
          Alert.alert(
            "Em Desenvolvimento",
            `A funcionalidade "${item.label}" estará disponível em breve.`,
            [{ text: "OK", style: "default" }]
          );
          return;
        }

        // Valida que a rota pertence ao perfil atual
        const rotasValidas = navItems
          .filter((i) => i.routeName)
          .map((i) => i.routeName);

        if (item.routeName && rotasValidas.includes(item.routeName)) {
          navigation.navigate(item.routeName as never);
        } else if (!item.routeName) {
          Alert.alert("Navegação", `Navegando para ${item.label}`);
        }
      },
      [navigation, navItems]
    );

    /**
     * Handler para o botão voltar do Android
     */
    const handleBackPress = useCallback(() => {
      // Se há um handler customizado, usa ele primeiro
      if (onBackPress && onBackPress()) {
        return true;
      }

      // Se está na tela inicial do papel, confirma logout
      if (route.name === initialRoute) {
        Alert.alert(
          "Sair",
          "Deseja realmente sair do aplicativo?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Sair",
              style: "destructive",
              onPress: () => {
                desautenticar();
                navigation.navigate("Login");
              },
            },
          ],
          { cancelable: true }
        );
        return true;
      }

      return false;
    }, [route.name, initialRoute, onBackPress, desautenticar, navigation]);

    /**
     * Configura o BackHandler para Android
     */
    useEffect(() => {
      if (Platform.OS !== "android") return;

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );

      return () => backHandler.remove();
    }, [handleBackPress]);

    // Se não há usuário ou papel, não renderiza nada
    if (!usuario || !usuario.papel) {
      return null;
    }

    return (
      <View className="absolute bottom-4 inset-x-4 bg-red-600 py-3 px-2 rounded-2xl shadow-xl">
        <View className="flex-row justify-around items-center">
          {navItems.map((item) => {
            // Verifica se está focado comparando a rota atual com a rota do item
            const isFocused = item.routeName
              ? route.name === item.routeName
              : false;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleNavigation(item)}
                className="items-center justify-center p-1"
                accessibilityRole="button"
                accessibilityLabel={`Navegar para ${item.label}`}
                accessibilityState={{
                  disabled: item.disabled,
                  selected: isFocused,
                }}
                disabled={item.disabled}
                style={{ opacity: item.disabled ? 0.5 : 1 }}
              >
                <IconeLucide
                  id={item.id}
                  tamanho={24}
                  cor={isFocused ? "#ffffff" : "#d1d5db"}
                />
                <Text
                  className={`text-xs mt-1 ${
                    isFocused ? "text-white" : "text-gray-300"
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
