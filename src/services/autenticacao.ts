import api from "./api";

interface LoginRequest {
  cpf: string;
  senha: string;
}

interface LoginResponse {
  message: string;
  usuario: {
    cpf: string;
    papel: "MORADOR" | "FUNCIONARIO" | "SINDICO";
  };
}

interface DadosUsuario {
  cpf: string;
  nome: string;
  telefone: string;
}

/**
 * Realiza o login do usuário
 * O backend detecta automaticamente o papel do usuário
 */
export const fazerLogin = async (
  cpf: string,
  senha: string
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", { cpf, senha });
  return response.data;
};

/**
 * Busca os dados completos do usuário após autenticação
 * Dependendo do papel, busca em endpoints diferentes
 */
export const buscarDadosUsuario = async (
  cpf: string,
  papel: "MORADOR" | "FUNCIONARIO" | "SINDICO"
): Promise<DadosUsuario> => {
  let endpoint = "";

  switch (papel) {
    case "MORADOR":
      endpoint = `/moradores/${cpf}`;
      break;
    case "FUNCIONARIO":
      endpoint = `/funcionarios/${cpf}`;
      break;
    case "SINDICO":
      endpoint = `/sindicos/${cpf}`;
      break;
  }

  const response = await api.get<DadosUsuario>(endpoint);
  return response.data;
};
