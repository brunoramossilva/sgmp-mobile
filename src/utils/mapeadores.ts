/**
 * Utilitários para mapeamento de dados entre API e UI
 * Reutilizáveis em todas as telas de ordens
 */

import { OrdemServicoApi } from "../services/ordemServico";

/**
 * Interface para ordem de serviço formatada para UI
 */
export interface OrdemServicoUI {
  id: number;
  titulo: string; // descricao truncada para ~40 caracteres
  descricao: string; // descrição completa
  solicitante: string; // nome do morador
  dataAbertura: string; // "DD/MM/YYYY"
  dataConclusao?: string; // "DD/MM/YYYY" ou undefined
  diasEmAberto: number; // número de dias desde abertura
  prioridade: "Alta" | "Média" | "Baixa";
  status: "Pendente" | "Aceita" | "Finalizada" | "Recusada";
  cpf_morador: string;
  cpf_funcionario?: string | null;
  cpf_sindico?: string | null;
  statusApi?: string; // status original da API
}

/**
 * Formata data no padrão DD/MM/YYYY
 * @param data - string ISO ou Date
 * @returns Data formatada ou "N/A" se inválida
 */
export const formatarData = (data?: string | Date | null): string => {
  if (!data) return "N/A";

  try {
    const date = typeof data === "string" ? new Date(data) : data;
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();

    return `${dia}/${mes}/${ano}`;
  } catch (erro) {
    console.error("Erro ao formatar data:", erro);
    return "N/A";
  }
};

/**
 * Calcula número de dias desde uma data até agora
 * @param dataAbertura - data de abertura
 * @returns número de dias
 */
export const calcularDiasEmAberto = (dataAbertura: string): number => {
  try {
    const data = new Date(dataAbertura);
    const agora = new Date();
    const diferenca = agora.getTime() - data.getTime();
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    return Math.max(0, dias);
  } catch (erro) {
    console.error("Erro ao calcular dias:", erro);
    return 0;
  }
};

/**
 * Calcula prioridade baseado no tempo
 * @param diasEmAberto - número de dias
 * @returns prioridade
 */
export const calcularPrioridade = (
  diasEmAberto: number
): "Alta" | "Média" | "Baixa" => {
  // Prioridade baseada no tempo de espera
  if (diasEmAberto > 7) return "Alta";
  if (diasEmAberto > 3) return "Média";
  return "Baixa";
};

/**
 * Converte status da API para status UI
 * @param statusApi - status do banco de dados
 * @returns status formatado
 */
export const converterStatus = (
  statusApi?: string | null
): "Pendente" | "Aceita" | "Finalizada" | "Recusada" => {
  if (!statusApi) {
    return "Pendente";
  }

  const status = statusApi.toUpperCase();

  if (["FINALIZADA", "CONCLUIDA"].includes(status)) {
    return "Finalizada";
  }

  if (status === "RECUSADA" || status === "REJEITADA") {
    return "Recusada";
  }

  if (status === "EM_EXECUCAO") {
    return "Aceita";
  }

  // AGUARDANDO_EXECUCAO = aprovado pelo síndico, aguardando técnico
  // PENDENTE_APROVACAO = aguardando aprovação do síndico
  return "Pendente";
};

/**
 * Trunca texto para número máximo de caracteres
 * @param texto - texto a truncar
 * @param max - número máximo de caracteres (padrão 40)
 * @returns texto truncado com "..." se necessário
 */
export const truncarTexto = (texto: string, max: number = 40): string => {
  if (texto.length <= max) {
    return texto;
  }
  return texto.substring(0, max).trim() + "...";
};

/**
 * Mapeia dados da API para formato de UI
 * @param ordem - dados da API
 * @returns ordem formatada para UI
 */
export const mapApiToUI = (ordem: OrdemServicoApi): OrdemServicoUI => {
  const diasEmAberto = calcularDiasEmAberto(ordem.dataAbertura);
  const prioridade = calcularPrioridade(diasEmAberto);
  const status = converterStatus(ordem.status);
  
  // Debug log
  if (ordem.status === "FINALIZADA") {
    console.log("Mapeando ordem finalizada:", { id: ordem.id, statusApi: ordem.status, statusUI: status });
  }

  return {
    id: ordem.id,
    titulo: truncarTexto(ordem.descricao, 40),
    descricao: ordem.descricao,
    solicitante: ordem.morador?.nome ?? "Desconhecido",
    dataAbertura: formatarData(ordem.dataAbertura),
    dataConclusao: ordem.dataConclusao
      ? formatarData(ordem.dataConclusao)
      : undefined,
    diasEmAberto,
    prioridade,
    status,
    cpf_morador: ordem.cpf_morador,
    cpf_funcionario: ordem.cpf_funcionario,
    cpf_sindico: ordem.cpf_sindico,
    statusApi: ordem.status,
  };
};

/**
 * Mapeia UI de volta para API (partial update)
 * @param ordem - ordem de UI
 * @returns dados para enviar na API
 */
export const mapUIToApi = (
  ordem: OrdemServicoUI
): Partial<OrdemServicoApi> => {
  return {
    descricao: ordem.descricao,
    status: ordem.statusApi,
    cpf_sindico: ordem.cpf_sindico,
    cpf_funcionario: ordem.cpf_funcionario,
  };
};
