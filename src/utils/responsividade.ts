import { Dimensions, useWindowDimensions } from 'react-native';

/**
 * ========================================
 * 📐 UTILITÁRIOS DE RESPONSIVIDADE
 * ========================================
 * 
 * Arquivo: src/utils/responsividade.ts
 * 
 * Fornece funções para lidar com diferentes tamanhos de tela
 * e garantir que o layout se adapte bem em todos os dispositivos
 */

// Breakpoints padrão para mobile
export const BREAKPOINTS = {
  XS: 0,      // Extra small (< 320px)
  SM: 320,    // Small (>= 320px)
  MD: 375,    // Medium (>= 375px)
  LG: 414,    // Large (>= 414px)
  XL: 480,    // Extra large (>= 480px)
} as const;

/**
 * Obter dimensões da tela e informações de tamanho
 */
export const useResponsividade = () => {
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 414;
  const isLargeScreen = width >= 414;
  
  const isSmallHeight = height < 667;
  const isLargeHeight = height >= 812;

  const aspectRatio = width / height;
  const isPortrait = height > width;
  const isLandscape = width > height;

  return {
    width,
    height,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isSmallHeight,
    isLargeHeight,
    aspectRatio,
    isPortrait,
    isLandscape,
  };
};

/**
 * Escalar valores com base na largura da tela
 * Útil para manter proporções em diferentes devices
 */
export const escalarPorLargura = (valor: number, larguraPadrao: number = 375): number => {
  const { width } = Dimensions.get('window');
  return (valor / larguraPadrao) * width;
};

/**
 * Escalar valores com base na altura da tela
 */
export const escalarPorAltura = (valor: number, alturaPadrao: number = 667): number => {
  const { height } = Dimensions.get('window');
  return (valor / alturaPadrao) * height;
};

/**
 * Obter padding/margin responsivo
 * Reduz espaçamento em telas pequenas
 */
export const obterEspacamento = (tamanho: 'xs' | 'sm' | 'md' | 'lg' | 'xl'): number => {
  const { isSmallScreen } = useResponsividade();
  
  const mapeamento = {
    xs: isSmallScreen ? 8 : 12,
    sm: isSmallScreen ? 12 : 16,
    md: isSmallScreen ? 16 : 20,
    lg: isSmallScreen ? 20 : 24,
    xl: isSmallScreen ? 24 : 32,
  };

  return mapeamento[tamanho];
};

/**
 * Obter tamanho de fonte responsivo
 * Reduz tamanho em telas pequenas para melhor legibilidade
 */
export const obterTamanhoFonte = (tamanho: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'): number => {
  const { isSmallScreen } = useResponsividade();
  
  const mapeamento = {
    xs: 10,
    sm: isSmallScreen ? 11 : 12,
    base: isSmallScreen ? 13 : 14,
    lg: isSmallScreen ? 15 : 16,
    xl: isSmallScreen ? 17 : 18,
    '2xl': isSmallScreen ? 19 : 20,
    '3xl': isSmallScreen ? 23 : 24,
  };

  return mapeamento[tamanho];
};

/**
 * Obter padding responsivo para container
 * Maior em telas grandes, menor em telas pequenas
 */
export const obterPaddingContainer = (): { horizontal: number; vertical: number } => {
  const { isSmallScreen } = useResponsividade();
  
  return {
    horizontal: isSmallScreen ? 12 : 16,
    vertical: isSmallScreen ? 16 : 24,
  };
};

/**
 * Obter altura mínima responsiva para textarea
 * Evita problemas com texto muito pequeno ou muito grande
 */
export const obterAlturaMinimaMimeType = (numeroLinhas: number): number => {
  const lineHeight = 20; // altura de linha padrão
  const padding = 16; // padding vertical
  const border = 2; // border
  
  return numeroLinhas * lineHeight + padding + border;
};

/**
 * Determinar número de colunas para layout grid responsivo
 */
export const obterNumeroColunasGrid = (): number => {
  const { width } = Dimensions.get('window');
  
  if (width < 375) return 1;
  if (width < 480) return 1;
  return 2;
};

/**
 * Obter margem inferior segura para telas com notch
 * (considerar SafeAreaView também)
 */
export const obterMargemSegura = (): number => {
  const { height } = Dimensions.get('window');
  
  // Telas com notch (iPhone X+) têm aspecto ratio > 2
  if (height / Dimensions.get('window').width > 2) {
    return 34; // Bottom safe area para notch
  }
  
  return 0;
};

export default {
  BREAKPOINTS,
  useResponsividade,
  escalarPorLargura,
  escalarPorAltura,
  obterEspacamento,
  obterTamanhoFonte,
  obterPaddingContainer,
  obterAlturaMinimaMimeType,
  obterNumeroColunasGrid,
  obterMargemSegura,
};
