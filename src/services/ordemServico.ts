import api from "./api";

export type OrdemServicoApi = {
  id: number;
  descricao: string;
  local?: string;
  dataAbertura: string;
  dataConclusao?: string | null;
  status: string;
  aprovado: boolean;
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
