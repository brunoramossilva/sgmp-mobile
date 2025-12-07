import { z } from 'zod';

// Tipo para Ordem de Serviço
export interface OrdemServico {
  id: number;
  titulo: string;
  descricao: string;
  local: string;
  solicitante: string;
  data: string;
  prioridade: "Alta" | "Média" | "Baixa";
  status: "Pendente" | "Aceita" | "Recusada" | "Finalizada";
  comentarioResolucao?: string;
}

// ========== TIPOS PARA CRIAÇÃO DE OS ==========

/**
 * Dados de entrada para criação de Ordem de Serviço
 * Baseado rigorosamente no schema Prisma - apenas descricao é obrigatório
 * Outros campos (dataAbertura, status, aprovado) são preenchidos automaticamente no backend
 */
export interface CriacaoOsDados {
  descricao: string;
  cpf_morador: string;
}

/**
 * Schema de validação Zod para criação de OS
 * Valida descricao com mínimo 10 caracteres e máximo 500
 */
export const schemaCriacaoOS = z.object({
  descricao: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(500, 'Descrição não pode exceder 500 caracteres')
    .nonempty('Descrição é obrigatória'),
});

export type CriacaoOSFormulario = z.infer<typeof schemaCriacaoOS>;