import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { IconeLucide } from '../icones';

interface PropriedadesMensagemErro {
  mensagem: string;
  tipo?: 'erro' | 'sucesso' | 'informacao' | 'aviso';
  mostrarÍcone?: boolean;
  podeDescartar?: boolean;
}

/**
 * Componente reutilizável para exibição de mensagens de feedback
 * 
 * Features:
 * - 4 tipos de mensagem com cores distintas
 * - Responsivo (ajusta tamanho de fonte)
 * - Ícones visuais opcionais
 * - Design system: cores de feedback suaves
 * - Acessibilidade: contraste adequado
 * 
 * @param tipo - 'erro' | 'sucesso' | 'informacao' | 'aviso' (default: 'erro')
 * @param mostrarÍcone - Exibir ícone ao lado (default: true)
 */
export const MensagemErro: React.FC<PropriedadesMensagemErro> = ({
  mensagem,
  tipo = 'erro',
  mostrarÍcone = true,
}) => {
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 375;

  const estilos = {
    erro: {
      container: 'bg-red-50 border-l-4 border-red-600',
      texto: 'text-red-700',
      iconeId: 'cancelar' as const,
      iconeCor: '#dc2626',
    },
    sucesso: {
      container: 'bg-green-50 border-l-4 border-green-600',
      texto: 'text-green-700',
      iconeId: 'confirmar' as const,
      iconeCor: '#15803d',
    },
    informacao: {
      container: 'bg-blue-50 border-l-4 border-blue-600',
      texto: 'text-blue-700',
      iconeId: 'home' as const,
      iconeCor: '#1d4ed8',
    },
    aviso: {
      container: 'bg-orange-50 border-l-4 border-orange-600',
      texto: 'text-orange-700',
      iconeId: 'adicionar' as const,
      iconeCor: '#ea580c',
    },
  };

  const estiloAtual = estilos[tipo];
  const fontSize = isSmallScreen ? 12 : 13;

  return (
    <View
      className={`p-4 rounded-lg flex-row items-flex-start ${estiloAtual.container}`}
      role="alert"
      accessibilityLiveRegion="polite"
    >
      {mostrarÍcone && (
        <IconeLucide
          id={estiloAtual.iconeId}
          tamanho={20}
          cor={estiloAtual.iconeCor}
          className="mr-3"
        />
      )}
      <Text
        className={`flex-1 font-medium ${estiloAtual.texto}`}
        style={{ fontSize }}
      >
        {mensagem}
      </Text>
    </View>
  );
};
