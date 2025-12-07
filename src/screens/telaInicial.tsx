import { View, BackHandler, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAutenticacao } from "../contexto/ContextoAutenticacao";
import { useEffect } from "react";

/**
 * Tela Inicial - Redirecionamento automático baseado no papel do usuário
 * - MORADOR -> Tela Inicial do Morador
 * - FUNCIONARIO -> Tela Inicial do Técnico
 * - SINDICO -> Tela Inicial do Síndico
 */
export default function TelaInicial() {
  const navigation = useNavigation();
  const { usuario, desautenticar } = useAutenticacao();

  useEffect(() => {
    if (!usuario) {
      // Se não houver usuário autenticado, redirecionar para login
      navigation.navigate("Login" as never);
      return;
    }

    // Redirecionar baseado no papel do usuário
    switch (usuario.papel) {
      case "MORADOR":
        navigation.navigate("InicialMorador" as never);
        break;
      case "FUNCIONARIO":
        navigation.navigate("InicialTecnico" as never);
        break;
      case "SINDICO":
        navigation.navigate("InicialSindico" as never);
        break;
      default:
        navigation.navigate("Login" as never);
    }

    // Interceptar botão voltar
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Alert.alert("Sair", "Deseja fazer logout?", [
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
        return true;
      }
    );

    return () => backHandler.remove();
  }, [usuario, navigation]);

  return <View className="flex-1 bg-white" />;
}
