import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/telaLogin";
import TelaInicial from "./src/screens/telaInicial";
import InicialMorador from "./src/screens/morador/telaInicial";
import InicialTecnico from "./src/screens/tecnico/telaInicial";
import InicialSindico from "./src/screens/sindico/telaInicial";
import CriacaoOS from "./src/screens/morador/criacaoOs";
import OsAceitaPeloTecnico from "./src/screens/tecnico/osAceitas";
import DetalhesOs from "./src/screens/detalhesOs";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Inicial"
          component={TelaInicial}
          options={{ title: "Página Inicial" }}
        />
        <Stack.Screen
          name="InicialMorador"
          component={InicialMorador}
          options={{ title: "Tela Inicial do Morador" }}
        />
        <Stack.Screen
          name="InicialTecnico"
          component={InicialTecnico}
          options={{ title: "Tela Inicial do Técnico" }}
        />
        <Stack.Screen
          name="InicialSindico"
          component={InicialSindico}
          options={{ title: "Tela Inicial do Síndico" }}
        />
        <Stack.Screen
          name="CriacaoOsMorador"
          component={CriacaoOS}
          options={{ title: "Tela de Criação de OS" }}
        />
        <Stack.Screen
          name="OsAceitaPeloTecnico"
          component={OsAceitaPeloTecnico}
          options={{ title: "Ordens de Serviço Aceitas pelo Técnico" }}
        />
        <Stack.Screen
          name="DetalhesOs"
          component={DetalhesOs}
          options={{ title: "Detalhes da Ordem de Serviço" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}