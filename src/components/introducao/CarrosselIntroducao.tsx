import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  Modal,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SlideIntroducao } from '../../utils/conteudoIntroducao';
import { IconeLucide } from '../icones';

interface PropriedadesCarrosselIntroducao {
  slides: SlideIntroducao[];
  aoConcluir: () => void;
  nomePapel: string;
}

/**
 * Componente de carrossel de introdução
 * 
 * Features:
 * - FlatList para navegação suave entre slides
 * - Pagination dots indicando progresso
 * - Botões "Anterior" e "Próximo"
 * - Botão "Começar" no último slide
 * - Design system: cores red-600, slate-100, animações suaves
 * - Fullscreen modal com overlay semi-transparente
 * - TypeScript com tipagem completa
 * 
 * @param slides - Array de slides a exibir
 * @param aoConcluir - Callback executado ao clicar "Começar"
 * @param nomePapel - Nome do papel (MORADOR, FUNCIONARIO, SINDICO) para personalização
 */
export const CarrosselIntroducao: React.FC<PropriedadesCarrosselIntroducao> = ({
  slides,
  aoConcluir,
  nomePapel,
}) => {
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');
  
  const [indexAtual, setIndexAtual] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animação de entrada
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [indexAtual, fadeAnim]);

  const handleScroll = (evento: NativeSyntheticEvent<NativeScrollEvent>) => {
    const posicaoX = evento.nativeEvent.contentOffset.x;
    const indiceCalculado = Math.round(posicaoX / width);
    setIndexAtual(indiceCalculado);
  };

  const irParaSlide = (indice: number) => {
    if (indice >= 0 && indice < slides.length) {
      flatListRef.current?.scrollToIndex({
        index: indice,
        animated: true,
      });
      setIndexAtual(indice);
    }
  };

  const avancar = () => {
    if (indexAtual < slides.length - 1) {
      irParaSlide(indexAtual + 1);
    }
  };

  const retroceder = () => {
    if (indexAtual > 0) {
      irParaSlide(indexAtual - 1);
    }
  };

  const percentualProgresso = ((indexAtual + 1) / slides.length) * 100;
  const slideAtual = slides[indexAtual];
  const éUltimoSlide = indexAtual === slides.length - 1;

  return (
    <Modal visible={true} transparent={true} animationType="fade">
      {/* Fundo escuro semi-transparente */}
      <View className="flex-1 bg-black/50" />

      {/* Container do carrossel */}
      <View
        className="absolute inset-0 flex-1 justify-end"
        style={{
          height: height * 0.9,
          bottom: 0,
        }}
      >
        {/* Card branco com conteúdo */}
        <View
          className="bg-white rounded-t-3xl flex-1"
          style={{
            paddingTop: 20,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
        >
          {/* Header com indicador de progresso */}
          <View className="px-4 pb-4 border-b border-slate-200">
            <View className="mb-3">
              <Text className="text-xs font-semibold text-slate-500">
                Slide {indexAtual + 1} de {slides.length}
              </Text>
            </View>

            {/* Barra de progresso */}
            <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-red-600"
                style={{
                  width: `${percentualProgresso}%`,
                }}
              />
            </View>
          </View>

          {/* Carrossel FlatList */}
          <FlatList
            ref={flatListRef}
            data={slides}
            keyExtractor={(_, indice) => indice.toString()}
            horizontal
            pagingEnabled
            scrollEventThrottle={16}
            onScroll={handleScroll}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Animated.View
                style={{
                  width,
                  opacity: fadeAnim,
                }}
                className="flex-1 px-6 justify-center items-center py-8"
              >
                {/* Ícone do slide */}
                <View
                  className={`${item.cor} w-20 h-20 rounded-full flex items-center justify-center mb-6`}
                >
                  <IconeLucide id={item.idIcone} tamanho={48} />
                </View>

                {/* Título */}
                <Text className="text-2xl font-bold text-slate-800 text-center mb-4">
                  {item.titulo}
                </Text>

                {/* Descrição */}
                <Text className="text-base text-slate-600 text-center leading-6">
                  {item.descricao}
                </Text>
              </Animated.View>
            )}
          />

          {/* Pagination dots */}
          <View className="flex-row justify-center gap-2 px-4 py-4">
            {slides.map((_, indice) => (
              <TouchableOpacity
                key={indice}
                onPress={() => irParaSlide(indice)}
                className={`rounded-full transition-all ${
                  indice === indexAtual ? 'bg-red-600 w-8 h-2' : 'bg-slate-300 w-2 h-2'
                }`}
              />
            ))}
          </View>

          {/* Botões de ação */}
          <View className="px-4 pb-6 gap-3">
            {/* Botão Retroceder/Cancelar */}
            {indexAtual > 0 ? (
              <TouchableOpacity
                onPress={retroceder}
                className="py-3 border-2 border-slate-300 rounded-xl items-center justify-center"
              >
                <Text className="text-slate-700 font-semibold text-base">
                  Anterior
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={aoConcluir}
                className="py-3 border-2 border-slate-300 rounded-xl items-center justify-center"
              >
                <Text className="text-slate-700 font-semibold text-base">
                  Pular Introdução
                </Text>
              </TouchableOpacity>
            )}

            {/* Botão Avançar/Começar */}
            <TouchableOpacity
              onPress={éUltimoSlide ? aoConcluir : avancar}
              className="py-3 bg-red-600 rounded-xl items-center justify-center"
            >
              <Text className="text-white font-semibold text-base">
                {éUltimoSlide ? 'Começar' : 'Próximo'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
