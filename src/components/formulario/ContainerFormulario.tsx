import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';

interface Props {
  children: React.ReactNode;
  padronizarPadding?: boolean;
}

/**
 * Componente que encapsula a estrutura visual de um formulário
 * 
 * Features:
 * - SafeAreaView para evitar notches/home indicators
 * - Padding responsivo baseado no tamanho da tela
 * - Espaçamento consistente com design system
 * - Suporta diferentes orientações de tela
 * 
 * @param children - Conteúdo do formulário
 * @param padronizarPadding - Se true, padroniza padding para 16px (default: false - responsivo)
 */
export const ContainerFormulario: React.FC<Props> = ({ 
  children, 
  padronizarPadding = false 
}) => {
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');
  
  // Padding responsivo: reduz em telas pequenas
  const paddingHorizontal = padronizarPadding 
    ? 16 
    : width < 375 ? 12 : 16;
  
  const paddingVertical = padronizarPadding 
    ? 16 
    : height < 667 ? 8 : 12;
  
  // Padding interno do card - maior em telas grandes
  const innerPadding = width < 375 ? 16 : 20;
  
  return (
    <View
      className="flex-1 bg-slate-100"
      style={{
        paddingHorizontal,
        paddingVertical,
        paddingTop: Math.max(paddingVertical, insets.top),
        paddingBottom: Math.max(paddingVertical, insets.bottom),
      }}
    >
      <View
        className="bg-white rounded-2xl shadow-sm border border-slate-200"
        style={{
          padding: innerPadding,
          flex: 1,
        }}
      >
        {children}
      </View>
    </View>
  );
};
