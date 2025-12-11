import api from "./api";

export type OrdemServicoApi = {
  id: number;
  descricao: string;
  local?: string;
  dataAbertura: string;
  dataConclusao?: string | null;
  status: string;
  cpf_morador: string;
  morador?: { nome?: string };
  cpf_funcionario?: string | null;
  cpf_sindico?: string | null;
};

export const getOrdens = async (): Promise<OrdemServicoApi[]> => {
  const { data } = await api.get<OrdemServicoApi[]>("/ordens-servico");
  return data;
};

export const updateOrdem = async (
  id: number,
  payload: Partial<OrdemServicoApi>
) => {
  const { data } = await api.put<OrdemServicoApi>(
    `/ordens-servico/${id}`,
    payload
  );
  return data;
};

/**
 * Cria uma nova Ordem de Serviço
 *
 * Payload esperado:
 * {
 *   descricao: string (obrigatório, min 10, max 500 caracteres)
 *   cpf_morador: string (obrigatório)
 * }
 *
 * Campos preenchidos automaticamente no backend:
 * - dataAbertura: DateTime @default(now())
 * - status: String @default("ABERTA")
 *
 * @param payload - Dados para criação da OS
 * @returns Ordem de serviço criada
 */
export const criarOrdemServico = async (payload: {
  descricao: string;
  cpf_morador: string;
}): Promise<OrdemServicoApi> => {
  const { data } = await api.post<OrdemServicoApi>("/ordens-servico", payload);
  return data;
};
