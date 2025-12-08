import { Animated, Easing } from 'react-native';

/**
 * Configuração segura de animação padrão usando Animated API
 * Evita problemas com Reanimated interpoladores complexos
 */
export const screenOptionsAnimacaoSegura = {
  animationEnabled: true,
  cardStyle: { backgroundColor: '#ffffff' },
  headerShown: false,
  presentation: 'card' as const,
  gestureEnabled: true,
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      },
    },
  },
};

/**
 * Transição padrão do stack: Fade + Zoom
 * Cria um efeito elegante de entrada/saída com opacity e scale
 */
export const transicaoStackPadrao = {
  cardStyleInterpolator: ({
    current,
    next,
    layouts,
  }: {
    current: { progress: Animated.Value };
    next?: { progress: Animated.Value };
    layouts: { screen: { width: number; height: number } };
  }) => {
    const progress = Animated.add(
      current.progress,
      next ? next.progress : 0
    );

    const opacity = progress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.7, 0.85, 1],
    });

    const scale = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.95, 1],
    });

    return {
      cardStyle: {
        opacity,
        transform: [{ scale }],
      },
    };
  },
};

/**
 * Transição simples de fade
 * Usada para transições mais sutis entre telas
 */
export const transicaoFadeSimples = {
  cardStyleInterpolator: ({
    current,
  }: {
    current: { progress: Animated.Value };
    next?: { progress: Animated.Value };
    layouts: { screen: { width: number; height: number } };
  }) => {
    const opacity = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.7, 1],
    });

    return {
      cardStyle: {
        opacity,
      },
    };
  },
};

/**
 * Transição com slide horizontal
 * Para efeito de navegação lateral
 */
export const transicaoSlideHorizontal = {
  cardStyleInterpolator: ({
    current,
    layouts,
  }: {
    current: { progress: Animated.Value };
    next?: { progress: Animated.Value };
    layouts: { screen: { width: number; height: number } };
  }) => {
    const progress = current.progress;
    const screenWidth = layouts.screen.width;

    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [screenWidth, 0],
    });

    return {
      cardStyle: {
        transform: [{ translateX }],
      },
    };
  },
};

/**
 * Configuração completa para aplicar ao App.tsx
 * Combina transição padrão com opções de segurança
 */
export const animacaoAppCompleta = {
  ...screenOptionsAnimacaoSegura,
  ...transicaoStackPadrao,
};
