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