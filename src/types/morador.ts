export interface Morador {
  cpf: string;
  nome: string;
  telefone: string;
  usuario: {
    cpf: string;
    senha: string;
    papel: string;
  };
}
