import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  Dimensions,
  Animated,
  useAnimatedValue,
} from "react-native";

interface PropriedadesBotaoCriar {
  titulo: string;
  aoPresionar: () => void;
  carregando?: boolean;
  desabilitado?: boolean;
  ícone?: React.ReactNode;
  tamanho?: "pequeno" | "medio" | "grande";
}

/**
 * Botão de submissão do formulário
 *
 * Features:
 * - Responsivo (adapta tamanho ao tela)
 * - Feedback visual (ícone loading)
 * - Estados desabilitado/carregando
 * - Animação de pressão
 * - Acessibilidade (opacidade reduzida)
 * - Design system: red-600 com hover/active states
 *
 * @param tamanho - Tamanho do botão (default: 'medio')
 */
export const BotaoCriar: React.FC<PropriedadesBotaoCriar> = ({
  titulo,
  aoPresionar,
  carregando = false,
  desabilitado = false,
  ícone,
  tamanho = "medio",
}) => {
  const { width } = Dimensions.get("window");
  const isSmallScreen = width < 375;

  // Valores responsivos
  const mapeamentoTamanho = {
    pequeno: {
      padding: isSmallScreen ? 10 : 12,
      fontSize: isSmallScreen ? 12 : 13,
    },
    medio: {
      padding: isSmallScreen ? 14 : 16,
      fontSize: isSmallScreen ? 13 : 14,
    },
    grande: {
      padding: isSmallScreen ? 16 : 20,
      fontSize: isSmallScreen ? 14 : 16,
    },
  };

  const tamanhoCurrent = mapeamentoTamanho[tamanho];
  const isDisabledOrLoading = carregando || desabilitado;

  return (
    <TouchableOpacity
      onPress={aoPresionar}
      disabled={isDisabledOrLoading}
      activeOpacity={isDisabledOrLoading ? 1 : 0.85}
      className={`rounded-2xl shadow-md overflow-hidden ${
        isDisabledOrLoading ? "bg-slate-400" : "bg-red-600 active:bg-red-700"
      }`}
      style={{
        padding: tamanhoCurrent.padding,
      }}
    >
      <View className="flex-row items-center justify-center">
        {carregando ? (
          <>
            <ActivityIndicator
              size="small"
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text
              className="text-white text-center font-semibold flex-1"
              style={{ fontSize: tamanhoCurrent.fontSize }}
              numberOfLines={1}
            >
              Processando...
            </Text>
          </>
        ) : (
          <>
            {ícone && <View style={{ marginRight: 8 }}>{ícone}</View>}
            <Text
              className="text-white text-center font-semibold flex-1"
              style={{ fontSize: tamanhoCurrent.fontSize }}
              numberOfLines={1}
            >
              {titulo}
            </Text>
          </>
        )}
      </View>

      {/* Feedback visual de desabilitado */}
      {desabilitado && !carregando && (
        <View
          className="absolute inset-0 bg-black/20 rounded-2xl"
          pointerEvents="none"
        />
      )}
    </TouchableOpacity>
  );
};
