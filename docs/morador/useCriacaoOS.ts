import { useState } from "react";
import { CriacaoOsDados } from "../../src/types/ordemServico";

interface ResultadoCriacaoOS {
  sucesso: boolean;
  mensagem: string;
  payload?: CriacaoOsDados;
}

/**
 * Hook customizado para lógica de criação de Ordem de Serviço
 * Encapsula preparação de payload, validações de negócio, e estrutura para integração com API
 *
 * Responsabilidades:
 * - Preparar payload para envio ao backend
 * - Validações de regras de negócio (além das validações de schema)
 * - Gerenciar estado de loading/sucesso
 *
 * TODO: Integração com API
 * Próximos passos ao integrar:
 * 1. Importar função criarOS de services/ordemServico.ts (a ser criada)
 * 2. Chamar await criarOS(payload) dentro de executarCriacao()
 * 3. Tratar respostas e erros de rede
 */
export const useCriacaoOS = () => {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  /**
   * Formata descricao: remove espaços extras e normaliza quebras de linha
   */
  const formatarDescricao = (descricao: string): string => {
    return descricao.trim().replace(/\s+/g, " ").replace(/\n\s+/g, "\n");
  };

  /**
   * Prepara payload para envio ao backend
   * Adiciona cpf_morador capturado do contexto de autenticação
   * Apenas descricao é enviado (outros campos como dataAbertura, status, aprovado
   * são preenchidos automaticamente no backend conforme schema Prisma)
   */
  const prepararPayload = (
    descricao: string,
    cpfMorador: string
  ): CriacaoOsDados => {
    return {
      descricao: formatarDescricao(descricao),
      cpf_morador: cpfMorador,
    };
  };

  /**
   * Executa lógica de criação de OS
   * Em produção, esta função chamará a API
   *
   * @param descricao - Descrição da ordem de serviço
   * @param cpfMorador - CPF do morador (obtido via contexto de autenticação)
   */
  const executarCriacao = async (
    descricao: string,
    cpfMorador: string
  ): Promise<ResultadoCriacaoOS> => {
    setCarregando(true);
    setErro(null);
    setSucesso(false);

    try {
      const payload = prepararPayload(descricao, cpfMorador);

      // ========== TODO: INTEGRAÇÃO COM API ==========
      // Descomente e implemente quando integrar com backend:
      //
      // import { criarOrdemServico } from '../services/ordemServico';
      // const resposta = await criarOrdemServico(payload);
      //
      // if (!resposta || !resposta.id) {
      //   throw new Error('Resposta inválida do servidor');
      // }
      //
      // setSucesso(true);
      // return {
      //   sucesso: true,
      //   mensagem: 'Ordem de Serviço criada com sucesso!',
      //   payload: resposta,
      // };
      // ============================================

      // Por enquanto, simula sucesso para testes
      console.log("Payload pronto para integração:", payload);

      setSucesso(true);
      return {
        sucesso: true,
        mensagem: "Ordem de Serviço criada com sucesso!",
        payload,
      };
    } catch (erro: any) {
      const mensagemErro =
        erro?.response?.data?.mensagem ||
        erro?.message ||
        "Erro ao criar Ordem de Serviço. Tente novamente.";

      setErro(mensagemErro);
      return {
        sucesso: false,
        mensagem: mensagemErro,
      };
    } finally {
      setCarregando(false);
    }
  };

  /**
   * Reseta estado do hook
   */
  const resetar = () => {
    setCarregando(false);
    setErro(null);
    setSucesso(false);
  };

  return {
    carregando,
    erro,
    sucesso,
    executarCriacao,
    resetar,
  };
};
