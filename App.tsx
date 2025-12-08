import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProvedorAutenticacao } from "./src/contexto/ContextoAutenticacao";
import LoginScreen from "./src/screens/telaLogin";
import TelaInicial from "./src/screens/telaInicial";
import InicialMorador from "./src/screens/morador/telaInicial";
import InicialTecnico from "./src/screens/tecnico/telaInicial";
import InicialSindico from "./src/screens/sindico/telaInicial";
import CriacaoOS from "./src/screens/morador/criacaoOs";
import OsAceitasTecnico from "./src/screens/tecnico/osAceitasTecnico";
import DetalhesOs from "./src/screens/detalhesOs";
import AprovacaoOs from "./src/screens/sindico/aprovacaoOs";
import OrdensSindicoExecucao from "./src/screens/sindico/ordensSindicoExecucao";
import ServicosSindico from "./src/screens/sindico/servicosSindico";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ProvedorAutenticacao>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            animation: "none",
            gestureEnabled: false,
            headerShown: false,
          }}
        >
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
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="InicialTecnico"
            component={InicialTecnico}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="InicialSindico"
            component={InicialSindico}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CriacaoOsMorador"
            component={CriacaoOS}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OsAceitasTecnico"
            component={OsAceitasTecnico}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DetalhesOs"
            component={DetalhesOs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AprovacaoOs"
            component={AprovacaoOs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OrdensSindicoExecucao"
            component={OrdensSindicoExecucao}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ServicosSindico"
            component={ServicosSindico}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ProvedorAutenticacao>
  );
}
