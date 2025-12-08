/**
 * Hook customizado para fetch de ordens com otimismo e refetch
 * Centraliza lógica de sincronização entre aprovação e execução
 */

import { useCallback, useState, useRef, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  getOrdens,
  updateOrdem,
  type OrdemServicoApi,
} from "../services/ordemServico";
import { mapApiToUI, type OrdemServicoUI } from "../utils/mapeadores";

export interface FetchOrdensSindicoResult {
  // Dados
  ordensPendentes: OrdemServicoUI[];
  ordensEmExecucao: OrdemServicoUI[];

  // Estados
  loading: boolean;
  error: string | null;

  // Funções
  refetch: () => Promise<void>;
  atualizar: (
    ordemId: number,
    dados: Partial<OrdemServicoApi>
  ) => Promise<void>;
  limparErro: () => void;
}

/**
 * Hook para gerenciar fetch de ordens do síndico
 * @returns estado e funções de gerenciamento
 */
export const useFetchOrdensSindico = (): FetchOrdensSindicoResult => {
  const [ordensPendentes, setOrdensPendentes] = useState<OrdemServicoUI[]>([]);
  const [ordensEmExecucao, setOrdensEmExecucao] = useState<OrdemServicoUI[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs para gerenciar ciclo de vida
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Busca todas as ordens e filtra por status
   */
  const refetch = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      setLoading(true);
      setError(null);

      const ordens = await getOrdens();

      if (!isMountedRef.current) return;

      // Mapeia para UI
      const ordensUI = ordens.map(mapApiToUI);

      // Filtra pendentes (não aprovado)
      const pendentes = ordensUI.filter((o) => !o.aprovado);

      // Filtra em execução (aprovado e status não é final)
      const emExecucao = ordensUI.filter(
        (o) =>
          o.aprovado &&
          !["FINALIZADA", "RECUSADA", "CANCELADA"].includes(o.status)
      );

      setOrdensPendentes(pendentes);
      setOrdensEmExecucao(emExecucao);
    } catch (erro) {
      if (!isMountedRef.current) return;

      const mensagem =
        erro instanceof Error ? erro.message : "Erro ao carregar ordens";
      setError(mensagem);
      console.error("Erro em useFetchOrdensSindico:", erro);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  /**
   * Atualiza uma ordem de forma otimista
   * Faz update local + requisição + refetch em caso de erro
   */
  const atualizar = useCallback(
    async (ordemId: number, dados: Partial<OrdemServicoApi>) => {
      if (!isMountedRef.current) return;

      try {
        // Backup dos estados anteriores
        const pendantesAnterior = [...ordensPendentes];
        const execucaoAnterior = [...ordensEmExecucao];

        // Update otimista (remove de pendentes se aprovando)
        if (dados.aprovado !== undefined) {
          const index = ordensPendentes.findIndex((o) => o.id === ordemId);
          if (index !== -1) {
            const ordemAtualizada = {
              ...ordensPendentes[index],
              aprovado: dados.aprovado,
              cpf_sindico:
                dados.cpf_sindico || ordensPendentes[index].cpf_sindico,
            };

            if (dados.aprovado) {
              // Move para execução
              const novasPendentes = ordensPendentes.filter(
                (o) => o.id !== ordemId
              );
              setOrdensPendentes(novasPendentes);
              setOrdensEmExecucao([...ordensEmExecucao, ordemAtualizada]);
            } else {
              // Mantém em pendentes (rejeitou)
              const novasPendentes = [...ordensPendentes];
              novasPendentes[index] = ordemAtualizada;
              setOrdensPendentes(novasPendentes);
            }
          }
        }

        // Faz a requisição
        await updateOrdem(ordemId, dados);

        if (!isMountedRef.current) return;

        // Sucesso - refetch para sincronizar
        // Aguarda um pouco para evitar race conditions
        setTimeout(() => {
          if (isMountedRef.current) {
            refetch();
          }
        }, 300);
      } catch (erro) {
        if (!isMountedRef.current) return;

        // Erro - restaura estados anteriores
        setOrdensPendentes((prev) => (prev.length === 0 ? [] : prev));
        setOrdensEmExecucao((prev) => (prev.length === 0 ? [] : prev));

        // Força refetch para sincronizar com servidor
        setTimeout(() => {
          if (isMountedRef.current) {
            refetch();
          }
        }, 300);

        const mensagem =
          erro instanceof Error ? erro.message : "Erro ao atualizar ordem";
        setError(mensagem);
        console.error("Erro em atualizar:", erro);

        throw erro;
      }
    },
    [ordensPendentes, ordensEmExecucao, refetch]
  );

  /**
   * Limpa erro manualmente
   */
  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refetch automático ao focar na tela
   */
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return {
    ordensPendentes,
    ordensEmExecucao,
    loading,
    error,
    refetch,
    atualizar,
    limparErro,
  };
};
