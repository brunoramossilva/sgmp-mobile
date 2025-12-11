import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity, // Adicionado
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAutenticacao } from "../../contexto/ContextoAutenticacao";
import { CriacaoOSFormulario, schemaCriacaoOS } from "../../types/ordemServico";
import { BotaoCriar, MensagemErro } from "../../components/formulario";
import { useCriacaoOS } from "../../hooks/useCriacaoOS";
import NavbarGlobal from "../../components/navegacao/NavbarGlobal";
import { IconeLucide } from "../../components/icones"; // Para o ícone do botão novo
import { BotaoVoltar } from "../../components/navegacao";

export default function CriacaoOS() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { usuario } = useAutenticacao();
  const { carregando, erro, sucesso, executarCriacao, resetar } =
    useCriacaoOS();

  const [tecladoVisivel, setTecladoVisivel] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isValid },
  } = useForm<CriacaoOSFormulario>({
    resolver: zodResolver(schemaCriacaoOS),
    mode: "onChange",
    defaultValues: { descricao: "" },
  });

  const descricaoValue = watch("descricao");

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setTecladoVisivel(true)
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setTecladoVisivel(false)
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (!usuario || usuario.papel !== "MORADOR") {
        navigation.goBack();
      }
    }, [usuario, navigation])
  );

  useEffect(() => {
    if (sucesso) {
      Alert.alert("Sucesso!", "Ordem de Serviço enviada para o síndico.", [
        {
          text: "OK",
          onPress: () => {
            reset();
            resetar();
            navigation.goBack();
          },
        },
      ]);
    }
  }, [sucesso, reset, resetar, navigation]);

  const aoSubmeter = async (dados: CriacaoOSFormulario) => {
    if (usuario) await executarCriacao(dados.descricao, usuario.cpf);
  };

  // Ação do novo botão (apenas visual por enquanto)
  const handleVerHistorico = () => {
    Alert.alert(
      "Minhas Solicitações",
      "Aqui será exibida a lista de suas ordens abertas."
    );
  };

  if (!usuario) return null;

  return (
    <View className="flex-1 bg-slate-50">
      {/* HEADER FIXO (Estrutura Original Mantida) */}
      <View
        className="bg-red-600 px-4 pb-4 shadow-md z-10"
        style={{ paddingTop: (insets.top || 0) + 12 }}
      >
        <View className="flex-row justify-between items-center">
          <BotaoVoltar />
          <View className="flex-1 mx-3">
            <Text className="text-white text-lg font-bold">
              Nova Solicitação
            </Text>
            <Text className="text-white/80 text-xs">
              Descreva o problema para o síndico
            </Text>
          </View>
          <View className="bg-red-700 px-2 py-1 rounded-lg">
            <Text className="text-white text-[10px] font-bold uppercase">
              {usuario.nome.split(" ")[0]}
            </Text>
          </View>
        </View>
      </View>

      {/* ÁREA DE CONTEÚDO */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-4 pt-6 pb-36 justify-start">
          {/* DICA */}
          <View className="flex-row items-center bg-blue-50 p-3 rounded-xl border border-blue-100 mb-5 shadow-sm">
            <IconeLucide id="alerta" tamanho={20} cor="#1d4ed8" />
            <Text className="text-blue-700 text-xs ml-2 flex-1 leading-4">
              Quanto mais detalhes você fornecer, mais rápida será a análise e
              aprovação do síndico.
            </Text>
          </View>

          {erro && (
            <View className="mb-4">
              <MensagemErro mensagem={erro} tipo="erro" />
            </View>
          )}

          {/* INPUT CARD */}
          <View className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-4 h-60">
            <Text className="text-slate-700 font-bold mb-2 text-sm">
              Descrição do Problema *
            </Text>

            <Controller
              control={control}
              name="descricao"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="flex-1 text-slate-800 text-base"
                  style={{ textAlignVertical: "top" }}
                  placeholder="Ex: A lâmpada do corredor do 3º andar está queimada..."
                  placeholderTextColor="#94a3b8"
                  multiline={true}
                  scrollEnabled={true}
                  value={value}
                  onChangeText={onChange}
                  maxLength={500}
                />
              )}
            />

            <View className="flex-row justify-between items-center mt-2 pt-3 border-t border-slate-100">
              <Text
                className={`text-[10px] font-medium ${
                  descricaoValue?.length < 10
                    ? "text-orange-500"
                    : "text-green-600"
                }`}
              >
                {descricaoValue?.length < 10
                  ? `Mínimo de 10 caracteres`
                  : "Descrição válida"}
              </Text>
              <Text className="text-slate-400 text-[10px]">
                {descricaoValue?.length || 0}/500
              </Text>
            </View>
          </View>

          {/* Ver historico */}
          <TouchableOpacity
            onPress={handleVerHistorico}
            activeOpacity={0.7}
            className="flex-row items-center justify-center p-3 mb-2 rounded-xl border border-red-200 bg-red-50"
          >
            <IconeLucide id="historico" tamanho={20} cor="#dc2626" />
            <Text className="text-red-700 font-bold text-sm ml-2">
              Acompanhar Minhas Solicitações
            </Text>
          </TouchableOpacity>

          {/* BOTÃO ENVIAR */}
          <View className="mt-auto">
            <BotaoCriar
              titulo={carregando ? "Enviando..." : "Enviar Solicitação"}
              aoPresionar={handleSubmit(aoSubmeter)}
              carregando={carregando || isSubmitting}
              desabilitado={
                carregando ||
                isSubmitting ||
                !isValid ||
                (descricaoValue?.length || 0) < 10
              }
              tamanho="grande"
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* NAVBAR GLOBAL FIXA */}
      {!tecladoVisivel && <NavbarGlobal telaAtiva="Servicos" />}

      {/* Loading Overlay */}
      {(carregando || isSubmitting) && (
        <View className="absolute inset-0 bg-black/20 items-center justify-center z-50">
          <View className="bg-white p-4 rounded-full shadow-lg">
            <ActivityIndicator size="large" color="#dc2626" />
          </View>
        </View>
      )}
    </View>
  );
}
