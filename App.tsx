import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/loginScreen";
import HomeScreen from "./src/screens/telaInicial";
import InicialMorador from "./src/screens/morador/telaInicial";
import InicialTecnico from "./src/screens/tecnico/telaInicial";
import InicialSindico from "./src/screens/sindico/telaInicial";
import CriacaoOsMorador from "./src/screens/morador/criacaoOs";
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
          name="Home"
          component={HomeScreen}
          options={{ title: "Página Inicial" }}
        />
        <Stack.Screen
          name="InicialMorador"
          component={InicialMorador}
          options={{ title: "Morador" }}
        />
        <Stack.Screen
          name="InicialTecnico"
          component={InicialTecnico}
          options={{ title: "Técnico" }}
        />
        <Stack.Screen
          name="InicialSindico"
          component={InicialSindico}
          options={{ title: "Síndico" }}
        />
        <Stack.Screen
          name="CriacaoOsMorador"
          component={CriacaoOsMorador}
        />
        <Stack.Screen
          name="OsAceitaPeloTecnico"
          component={OsAceitaPeloTecnico}
        />
        <Stack.Screen
          name="DetalhesOs"
          component={DetalhesOs}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
