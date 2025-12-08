import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Hook customizado para gerenciar o estado de visualização de onboarding por usuário
 *
 * Armazena no AsyncStorage uma chave unique por CPF + papel do usuário
 * para controlar se o carrossel de introdução já foi visualizado
 *
 * @param cpf - CPF do usuário autenticado
 * @param papel - Papel do usuário (MORADOR, FUNCIONARIO, SINDICO)
 * @returns {{ deveExibirIntroducao, marcarComoVisto, carregando }}
 */
export const useIntroducaoUsuario = (
  cpf: string,
  papel: "MORADOR" | "FUNCIONARIO" | "SINDICO"
) => {
  const [deveExibirIntroducao, setDeveExibirIntroducao] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Chave única: CPF + papel para suportar múltiplos usuários no device
  const chaveArmazenamento = `introducao_${cpf}_${papel}`;

  // Verificar se introdução já foi visualizada
  useEffect(() => {
    const verificarIntroducao = async () => {
      try {
        const jaVisualizado = await AsyncStorage.getItem(chaveArmazenamento);
        setDeveExibirIntroducao(jaVisualizado === null);
      } catch (erro) {
        console.error(`Erro ao verificar introdução: ${erro}`);
        // Se houver erro, exibir introdução por segurança
        setDeveExibirIntroducao(true);
      } finally {
        setCarregando(false);
      }
    };

    verificarIntroducao();
  }, [cpf, papel, chaveArmazenamento]);

  // Marcar introdução como visualizada
  const marcarComoVisto = async () => {
    try {
      await AsyncStorage.setItem(chaveArmazenamento, "true");
      setDeveExibirIntroducao(false);
    } catch (erro) {
      console.error(`Erro ao marcar introdução como visto: ${erro}`);
    }
  };

  return {
    deveExibirIntroducao,
    marcarComoVisto,
    carregando,
  };
};
