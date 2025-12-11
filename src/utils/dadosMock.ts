// Dados financeiros
export type StatusFatura = "pago" | "pendente" | "atrasado";

export interface Fatura {
  id: string;
  titulo: string;
  tipo: "condominio" | "energia" | "agua" | "extra";
  valor: number;
  vencimento: string;
  status: StatusFatura;
}

export const FATURAS_MOCK: Fatura[] = [
  {
    id: "1",
    titulo: "Taxa de Condomínio",
    tipo: "condominio",
    valor: 1200.0,
    vencimento: "10/12/2025",
    status: "pendente",
  },
  {
    id: "2",
    titulo: "Conta de Energia",
    tipo: "energia",
    valor: 350.5,
    vencimento: "05/12/2025",
    status: "pago",
  },
  {
    id: "3",
    titulo: "Taxa de Água",
    tipo: "agua",
    valor: 120.0,
    vencimento: "01/12/2025",
    status: "atrasado",
  },
  {
    id: "4",
    titulo: "Fundo de Reserva",
    tipo: "extra",
    valor: 200.0,
    vencimento: "15/12/2025",
    status: "pendente",
  },
];

export const formatarMoeda = (valor: number) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

// Dados de reserva 
export type TipoArea = "piscina" | "churrasqueira" | "salao";

export interface AreaComum {
  id: string;
  titulo: string;
  tipo: TipoArea;
  capacidade: number;
  foto?: string;
}

export const AREAS_COMUNS: AreaComum[] = [
  { id: "1", titulo: "Salão de Festas", tipo: "salao", capacidade: 50 },
  { id: "2", titulo: "Churrasqueira Gourmet", tipo: "churrasqueira", capacidade: 15 },
  { id: "3", titulo: "Piscina Principal", tipo: "piscina", capacidade: 20 },
];

export const HORARIOS_RESERVA_MOCK = [
  "09:00 - 13:00",
  "13:00 - 17:00",
  "18:00 - 22:00",
];

// Dados financeiros síndico
export interface BalancoMensal {
  mes: string;
  receita: number;
  despesa: number;
}

export interface Inadimplente {
  id: string;
  unidade: string;
  nome: string;
  valor: number;
  mesesAtraso: number;
}

export const RESUMO_SINDICO = {
  saldoAtual: 45250.00,
  receitaMes: 28500.00,
  despesaMes: 22100.00,
  previsaoProximoMes: 30000.00
};

export const GRAFICO_FLUXO_MOCK: BalancoMensal[] = [
  { mes: "AGO", receita: 24000, despesa: 21000 },
  { mes: "SET", receita: 25500, despesa: 23000 },
  { mes: "OUT", receita: 28000, despesa: 19500 }, 
  { mes: "NOV", receita: 26000, despesa: 25000 },
  { mes: "DEZ", receita: 28500, despesa: 22100 },
];

export const INADIMPLENCIA_MOCK: Inadimplente[] = [
  { id: "1", unidade: "Bl 01 - 302", nome: "Carlos Almeida", valor: 3600.00, mesesAtraso: 3 },
  { id: "2", unidade: "Bl 02 - 104", nome: "Fernanda Costa", valor: 1200.00, mesesAtraso: 1 },
  { id: "3", unidade: "Bl 01 - 501", nome: "Roberto Nunes", valor: 2400.00, mesesAtraso: 2 },
];

// Dados de reservas do sindico
export type StatusReserva = "pendente" | "aprovada" | "recusada" | "concluida";

export interface ReservaGestao {
  id: string;
  morador: string;
  unidade: string;
  area: string; // Ex: "Salão de Festas"
  data: string; // Formato DD/MM/AAAA
  horario: string;
  status: StatusReserva;
}

export const RESERVAS_LISTA_MOCK: ReservaGestao[] = [
  {
    id: "101",
    morador: "João Silva",
    unidade: "101-A",
    area: "Salão de Festas",
    data: new Date().toLocaleDateString("pt-BR"), // Hoje
    horario: "18:00 - 22:00",
    status: "aprovada",
  },
  {
    id: "102",
    morador: "Maria Oliveira",
    unidade: "304-B",
    area: "Churrasqueira Gourmet",
    data: new Date().toLocaleDateString("pt-BR"), // Hoje
    horario: "13:00 - 17:00",
    status: "pendente",
  },
  {
    id: "103",
    morador: "Carlos Souza",
    unidade: "202-A",
    area: "Piscina Principal",
    data: new Date(Date.now() + 86400000).toLocaleDateString("pt-BR"), // Amanhã
    horario: "09:00 - 13:00",
    status: "pendente",
  },
  {
    id: "104",
    morador: "Ana Pereira",
    unidade: "501-C",
    area: "Salão de Festas",
    data: "15/12/2025",
    horario: "18:00 - 23:00",
    status: "aprovada",
  },
];