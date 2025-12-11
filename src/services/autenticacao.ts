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

  const response = await api.get<any>(endpoint);

  // Normalizar resposta: o backend retorna cpf_sindico para síndico
  const dados = response.data;

  let nome = dados.usuario?.nome || dados.nome || dados.morador?.nome || "";

  let telefone =
    dados.usuario?.telefone || dados.telefone || dados.morador?.telefone || "";

  // Fallback extra: síndico sem nome/telefone -> busca em /moradores/{cpf}
  if (papel === "SINDICO" && (!nome || !telefone)) {
    try {
      const moradorResp = await api.get<any>(`/moradores/${cpf}`);
      const m = moradorResp.data;
      nome = nome || m?.usuario?.nome || m?.nome || nome;
      telefone = telefone || m?.usuario?.telefone || m?.telefone || telefone;
    } catch (e) {
      // Log apenas no terminal para debug
      console.log("[AUTH] Fallback morador para síndico:", e);
    }
  }

  return {
    cpf: dados.cpf || dados.cpf_sindico || cpf, // Fallback para cpf_sindico do backend
    nome: nome || "",
    telefone: telefone || "",
  };
};
