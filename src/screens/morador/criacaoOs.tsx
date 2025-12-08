import React, { useEffect, useRef, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAutenticacao } from "../../contexto/ContextoAutenticacao";
import { CriacaoOSFormulario, schemaCriacaoOS } from "../../types/ordemServico";
import {
  ContainerFormulario,
  CampoTextoArea,
  BotaoCriar,
  MensagemErro,
} from "../../components/formulario";
import { useCriacaoOS } from "../../../docs/morador/useCriacaoOS";
import { IconeLucide } from "../../components/icones";

/**
 * Tela de Criação de Ordem de Serviço
 *
 * MELHORIAS IMPLEMENTADAS:
 * - ✅ SafeAreaView para evitar notches
 * - ✅ KeyboardAvoidingView para melhor UX
 * - ✅ Responsividade em diferentes tamanhos de tela
 * - ✅ Otimizações de renderização (useMemo, useCallback)
 * - ✅ Melhor acessibilidade
 * - ✅ Estados de erro melhorados
 * - ✅ Loading states mais intuitivos
 *
 * Schema Prisma considerado:
 * - descricao: String (obrigatório) ✓
 * - cpf_morador: String (obtido de contexto) ✓
 * - dataAbertura: DateTime @default(now()) - backend
 * - status: String @default("ABERTA") - backend
 * - aprovado: Boolean @default(false) - backend
 */
export default function CriacaoOS() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { usuario } = useAutenticacao();
  const { carregando, erro, sucesso, executarCriacao, resetar } =
    useCriacaoOS();
  const descricaoInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width, height } = Dimensions.get("window");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [scrollInfo, setScrollInfo] = useState({
    contentHeight: 1,
    visibleHeight: 1,
    offset: 0,
  });

  // Valores responsivos calculados uma única vez
  const responsividade = useMemo(() => {
    const isSmallScreen = width < 375;
    const isSmallHeight = height < 667;

    return {
      isSmallScreen,
      isSmallHeight,
      fontSize: {
        titulo: isSmallScreen ? 24 : 28,
        subtitulo: isSmallScreen ? 12 : 13,
        label: isSmallScreen ? 13 : 14,
        corpo: isSmallScreen ? 12 : 13,
      },
      padding: {
        horizontal: isSmallScreen ? 12 : 16,
        vertical: isSmallScreen ? 8 : 12,
      },
      margens: {
        mb8: isSmallScreen ? 24 : 32,
        mb6: isSmallScreen ? 20 : 24,
        mb4: isSmallScreen ? 12 : 16,
      },
    };
  }, [width, height]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isValid },
  } = useForm<CriacaoOSFormulario>({
    resolver: zodResolver(schemaCriacaoOS),
    mode: "onChange",
    defaultValues: {
      descricao: "",
    },
  });

  // Observar mudanças no campo de descrição para o contador
  const descricaoValue = watch("descricao");

  /**
   * Gerenciar teclado para scroll automático
   */
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  /**
   * Validar autenticação na entrada da tela
   */
  useFocusEffect(
    React.useCallback(() => {
      if (!usuario || !usuario.autenticado) {
        Alert.alert(
          "Acesso Negado",
          "Você precisa estar autenticado para criar uma Ordem de Serviço",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
        return;
      }

      if (usuario.papel !== "MORADOR") {
        Alert.alert(
          "Acesso Negado",
          "Apenas moradores podem criar Ordens de Serviço",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
        return;
      }
    }, [usuario, navigation])
  );

  /**
   * Lidar com sucesso na criação de OS
   */
  useEffect(() => {
    if (sucesso) {
      Alert.alert(
        "Sucesso! ✓",
        "Sua Ordem de Serviço foi criada e aguarda aprovação do síndico.",
        [
          {
            text: "Retornar",
            onPress: () => {
              reset();
              resetar();
              navigation.goBack();
            },
          },
        ]
      );
    }
  }, [sucesso, reset, resetar, navigation]);

  /**
   * Manipular envio do formulário
   */
  const aoSubmeter = async (dados: CriacaoOSFormulario) => {
    if (!usuario) {
      Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
      return;
    }

    await executarCriacao(dados.descricao, usuario.cpf);
  };

  if (!usuario || usuario.papel !== "MORADOR") {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View
        className="bg-red-600 px-4 py-3"
        style={{ paddingTop: (insets.top || 0) + 12 }}
      >
        <Text
          className="text-white text-lg font-bold"
          style={{ lineHeight: 20 }}
        >
          Criar Ordem de Serviço
        </Text>
        <Text className="text-white/90 text-xs mt-1" style={{ lineHeight: 18 }}>
          Descreva o problema que precisa ser resolvido. Será enviado para
          aprovação do síndico.
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 bg-white"
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 120 }}
          onLayout={(e) => {
            const layout = e?.nativeEvent?.layout;
            if (!layout) return;
            const { height } = layout;
            setScrollInfo((s) => ({ ...s, visibleHeight: height || 1 }));
          }}
          onContentSizeChange={(_, h) =>
            setScrollInfo((s) => ({ ...s, contentHeight: h || 1 }))
          }
          onScroll={(e) => {
            const offsetY = e?.nativeEvent?.contentOffset?.y ?? 0;
            setScrollInfo((s) => ({ ...s, offset: offsetY }));
          }}
          scrollEventThrottle={16}
        >
          <View className="px-4 py-4">
            {/* Espaço após header */}
            <View style={{ marginBottom: responsividade.margens.mb4 }} />

            {/* Dica Informativa */}
            <View className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
              <Text
                className="text-blue-700 font-medium"
                style={{ fontSize: responsividade.fontSize.corpo - 1 }}
              >
                💡 Dica: Quanto mais detalhada sua descrição, mais rápido o
                síndico poderá aprovar sua solicitação.
              </Text>
            </View>

            {/* Mensagem de Erro Global */}
            {erro && (
              <View style={{ marginBottom: responsividade.margens.mb6 }}>
                <MensagemErro mensagem={erro} tipo="erro" />
              </View>
            )}

            {/* Card de Informações do Morador */}
            <View
              className="bg-slate-50 rounded-xl mb-6 border border-slate-200"
              style={{ padding: responsividade.padding.horizontal }}
            >
              <Text
                className="font-semibold text-slate-500 mb-1"
                style={{ fontSize: responsividade.fontSize.label - 2 }}
              >
                Morador
              </Text>
              <Text
                className="font-semibold text-slate-800"
                style={{ fontSize: responsividade.fontSize.label }}
              >
                {usuario.nome}
              </Text>
              <Text
                className="text-slate-600 mt-1"
                style={{ fontSize: responsividade.fontSize.corpo - 1 }}
              >
                CPF: {usuario.cpf}
              </Text>
            </View>

            {/* Campo de Descrição */}
            <CampoTextoArea
              ref={descricaoInputRef}
              nome="descricao"
              controle={control}
              rotulo="Descrição do Problema *"
              placeholder="Descreva detalhadamente o problema que precisa ser resolvido..."
              numeroLinhas={12}
              maxCaracteres={500}
              mostrarContador={true}
            />

            {/* Info sobre caracteres mínimos */}
            {descricaoValue && descricaoValue.length < 10 && (
              <View style={{ marginBottom: responsividade.margens.mb4 }}>
                <Text
                  className="text-orange-600 font-medium"
                  style={{ fontSize: responsividade.fontSize.corpo - 1 }}
                >
                  ℹ️ Faltam {10 - descricaoValue.length} caracteres
                </Text>
              </View>
            )}

            {/* Botão de Submissão */}
            <View style={{ marginBottom: responsividade.margens.mb6 }}>
              <BotaoCriar
                titulo={carregando ? "Criando..." : "Criar Ordem de Serviço"}
                aoPresionar={handleSubmit(aoSubmeter)}
                carregando={carregando || isSubmitting}
                desabilitado={
                  carregando ||
                  isSubmitting ||
                  !isValid ||
                  !descricaoValue ||
                  descricaoValue.length < 10
                }
                tamanho={responsividade.isSmallScreen ? "medio" : "grande"}
              />
            </View>
          </View>
        </ScrollView>

        {/* Scrollbar custom em vermelho */}
        {scrollInfo.contentHeight > scrollInfo.visibleHeight && (
          <View
            pointerEvents="none"
            className="absolute"
            style={{
              right: 4,
              top: 8,
              bottom: 8,
              justifyContent: "flex-start",
            }}
          >
            <View
              className="rounded-full"
              style={{
                width: 4,
                backgroundColor: "rgba(220,38,38,0.10)",
                height: "100%",
              }}
            />
            {(() => {
              const { contentHeight, visibleHeight, offset } = scrollInfo;
              const thumbHeight = Math.max(
                28,
                (visibleHeight / contentHeight) * visibleHeight
              );
              const maxThumbTop = visibleHeight - thumbHeight;
              const scrollable = contentHeight - visibleHeight;
              const thumbTop =
                scrollable <= 0
                  ? 0
                  : Math.min(maxThumbTop, (offset / scrollable) * maxThumbTop);

              return (
                <View
                  className="absolute right-0 rounded-full"
                  style={{
                    width: 4,
                    backgroundColor: "#dc2626",
                    height: thumbHeight,
                    top: thumbTop,
                  }}
                />
              );
            })()}
          </View>
        )}

        {/* Navbar inferior */}
        <View
          className="absolute inset-x-4 bg-red-600 py-3 px-2 rounded-2xl shadow-xl"
          style={{
            bottom: Math.max(insets.bottom + 8, 24),
          }}
        >
          <View className="flex-row justify-around items-center">
            <NavItemServicos
              idIcone="home"
              label="Início"
              isFocused={false}
              onPress={() => navigation.goBack()}
            />
            <NavItemServicos
              idIcone="servicos"
              label="Serviços"
              isFocused={true}
              onPress={() => {}}
            />
            <NavItemServicos
              idIcone="financeiro"
              label="Financeiro"
              isFocused={false}
              onPress={() => Alert.alert("Navegação", "Financeiro!")}
            />
            <NavItemServicos
              idIcone="reservas"
              label="Reservas"
              isFocused={false}
              onPress={() => Alert.alert("Navegação", "Reservas!")}
            />
          </View>
        </View>

        {(carregando || isSubmitting) && (
          <View className="absolute inset-0 bg-black/10 items-center justify-center">
            <ActivityIndicator size="large" color="#dc2626" />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface NavItemServicosProps {
  idIcone: "home" | "servicos" | "financeiro" | "reservas";
  label: string;
  isFocused: boolean;
  onPress: () => void;
}

const NavItemServicos: React.FC<NavItemServicosProps> = ({
  idIcone,
  label,
  isFocused,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="items-center justify-center p-1"
  >
    <IconeLucide
      id={idIcone}
      tamanho={24}
      cor={isFocused ? "#ffffff" : "#d1d5db"}
    />
    <Text
      className={`text-xs ${isFocused ? "text-white" : "text-gray-300"} mt-1`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);
