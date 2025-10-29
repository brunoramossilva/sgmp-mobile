import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/loginScreen";
import HomeScreen from "./src/screens/homeScreen";
import InicialMorador from "./src/screens/morador/telaInicialMorador";
import InicialTecnico from "./src/screens/tecnico/telaInicialTecnico";
import InicialSindico from "./src/screens/sindico/telaInicialSindico";
import CriacaoOsMorador from "./src/screens/morador/criacaoOsMorador";
import OsAceitaPeloTecnico from "./src/screens/tecnico/osAceitarPorMimTecnico";
import DetalhesOs from "./src/screens/visualizarDetalhesOs";

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
