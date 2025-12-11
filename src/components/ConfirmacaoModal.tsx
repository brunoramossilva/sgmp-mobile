/**
 * Modal de confirmação para ações em ordens
 * Usado em aprovação, rejeição e finalização
 */

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  AccessibilityInfo,
  Platform,
} from "react-native";
import { IconeLucide } from "./icones";

export type AcaoConfirmacao = "aprovar" | "recusar" | "finalizar";

interface ConfirmacaoModalProps {
  visible: boolean;
  titulo: string;
  descricao: string;
  acao: AcaoConfirmacao;
  onConfirmar: () => Promise<void>;
  onCancelar: () => void;
  carregando?: boolean;
  erro?: string | null;
}

/**
 * Retorna configurações de cor e ícone baseado na ação
 */
const getConfiguracaoAcao = (acao: AcaoConfirmacao) => {
  const configs = {
    aprovar: {
      icone: "confirmar" as const,
      cor: "bg-green-600",
      corBotao: "bg-green-600",
      textoBotao: "Aprovar",
      textoConfirmacao: "Esta ação não pode ser desfeita.",
    },
    recusar: {
      icone: "cancelar" as const,
      cor: "bg-red-600",
      corBotao: "bg-red-600",
      textoBotao: "Recusar",
      textoConfirmacao: "Esta ação não pode ser desfeita.",
    },
    finalizar: {
      icone: "verificado" as const,
      cor: "bg-blue-600",
      corBotao: "bg-blue-600",
      textoBotao: "Finalizar",
      textoConfirmacao: "Marcar como concluída.",
    },
  };

  return configs[acao];
};

/**
 * Modal de confirmação para ações críticas
 * Mostra ícone, descrição e botões de confirmar/cancelar
 */
export const ConfirmacaoModal = React.memo(
  ({
    visible,
    titulo,
    descricao,
    acao,
    onConfirmar,
    onCancelar,
    carregando = false,
    erro = null,
  }: ConfirmacaoModalProps) => {
    const [erroLocal, setErroLocal] = useState<string | null>(erro);
    const config = getConfiguracaoAcao(acao);

    const handleConfirmar = useCallback(async () => {
      try {
        setErroLocal(null);
        await onConfirmar();
      } catch (erro) {
        const mensagem =
          erro instanceof Error
            ? erro.message
            : `Erro ao ${config.textoBotao.toLowerCase()}`;
        setErroLocal(mensagem);

        // Lê erro para acessibilidade
        if (Platform.OS !== "web") {
          AccessibilityInfo.announceForAccessibility(mensagem);
        }
      }
    }, [onConfirmar, config.textoBotao]);

    const handleCancelar = useCallback(() => {
      setErroLocal(null);
      onCancelar();
    }, [onCancelar]);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelar}
      >
        {/* Overlay escuro */}
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          {/* Card do modal */}
          <View
            className="bg-white rounded-xl shadow-lg w-full max-w-sm"
            accessibilityLiveRegion="polite"
          >
            {/* Cabeçalho com ícone */}
            <View className="items-center pt-6 pb-4">
              <View className={`${config.cor} rounded-full p-4 mb-3`}>
                <IconeLucide
                  id={config.icone as any}
                  tamanho={32}
                  cor="white"
                />
              </View>
            </View>

            {/* ScrollView para conteúdo longo */}
            <ScrollView
              className="px-6 max-h-96"
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {/* Título */}
              <Text
                className="text-xl font-bold text-slate-900 text-center mb-3"
                accessibilityRole="header"
              >
                {titulo}
              </Text>

              {/* Descrição */}
              <Text className="text-center text-slate-600 mb-4 leading-5">
                {descricao}
              </Text>

              {/* Confirmação */}
              <Text className="text-center text-sm text-slate-500 mb-4 font-medium">
                {config.textoConfirmacao}
              </Text>

              {/* Erro */}
              {erroLocal && (
                <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <View className="flex-row items-center">
                    <IconeLucide id="alerta" tamanho={18} cor="#dc2626" />
                    <Text className="text-red-600 text-sm font-medium ml-2">
                      {erroLocal}
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Botões */}
            <View className="flex-row gap-3 px-6 py-4 border-t border-slate-100">
              {/* Cancelar */}
              <TouchableOpacity
                onPress={handleCancelar}
                disabled={carregando}
                className="flex-1 py-3 rounded-lg bg-slate-100 justify-center items-center"
                accessibilityRole="button"
                accessibilityLabel="Cancelar"
                accessibilityState={{ disabled: carregando }}
              >
                <Text className="text-slate-900 font-semibold">Cancelar</Text>
              </TouchableOpacity>

              {/* Confirmar */}
              <TouchableOpacity
                onPress={handleConfirmar}
                disabled={carregando}
                className={`flex-1 py-3 rounded-lg ${config.corBotao} justify-center items-center flex-row`}
                accessibilityRole="button"
                accessibilityLabel={config.textoBotao}
                accessibilityState={{ disabled: carregando }}
              >
                {carregando ? (
                  <>
                    <ActivityIndicator color="white" size="small" />
                    <Text className="text-white font-semibold ml-2">
                      {config.textoBotao}...
                    </Text>
                  </>
                ) : (
                  <Text className="text-white font-semibold">
                    {config.textoBotao}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

ConfirmacaoModal.displayName = "ConfirmacaoModal";
