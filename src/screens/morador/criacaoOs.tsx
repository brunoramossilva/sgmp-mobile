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
      {/* Header com botão voltar */}
      <View
        className="bg-red-600 px-4 py-3 flex-row items-center"
        style={{ paddingTop: (insets.top || 0) + 12 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-row items-center"
          style={{ gap: 8 }}
        >
          <Text
            className="text-white text-base font-semibold"
            style={{ lineHeight: 20 }}
          >
            Voltar
          </Text>
        </TouchableOpacity>
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
        >
          <View className="px-4 py-6">
            {/* Cabeçalho */}
            <View style={{ marginBottom: responsividade.margens.mb8 }}>
              <Text
                className="font-bold text-red-600 text-center"
                style={{ fontSize: responsividade.fontSize.titulo }}
              >
                Criar Ordem de Serviço
              </Text>
              <Text
                className="text-slate-600 mt-2"
                style={{ fontSize: responsividade.fontSize.subtitulo }}
              >
                Descreva o problema que você gostaria de relatar. A solicitação
                será enviada para aprovação do síndico.
              </Text>
            </View>

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
