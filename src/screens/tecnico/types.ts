import { OrdemServicoApi } from "../../services/ordemServico";

export type OrdemServicoUI = {
  id: number;
  titulo: string;
  descricao: string;
  local: string;
  solicitante: string;
  data: string;
  prioridade: "Alta" | "Média" | "Baixa";
  status: "Pendente" | "Aceita" | "Recusada" | "Finalizada";
  raw?: OrdemServicoApi;
};

export const mapApiToUI = (o: OrdemServicoApi): OrdemServicoUI => {
  const descricao = o.descricao ?? "Sem descrição";
  const dataAbertura = new Date(o.dataAbertura ?? new Date());

  const dd = String(dataAbertura.getDate()).padStart(2, "0");
  const mm = String(dataAbertura.getMonth() + 1).padStart(2, "0");
  const yyyy = dataAbertura.getFullYear();
  const dataStr = `${dd}/${mm}/${yyyy}`;

  const statusRaw = (o.status ?? "").toUpperCase();

  let uiStatus: OrdemServicoUI["status"] = "Pendente";

  if (
    statusRaw.includes("EM_EXECUCAO")
  ) {
    uiStatus = "Aceita";
  } else if (
    statusRaw.includes("CONCLUIDA")
  ) {
    uiStatus = "Finalizada";
  } else if (statusRaw.includes("RECUSADA") || statusRaw.includes("REJEITADA")) {
    uiStatus = "Recusada";
  } else if (statusRaw.includes("APROVADA")) {
    uiStatus = "Pendente";
  }

  const prioridade = o.aprovado ? "Alta" : "Baixa";

  return {
    id: o.id,
    titulo: descricao.length > 40 ? descricao.slice(0, 40) + "..." : descricao,
    descricao,
    local: o.local ?? "Condomínio Vista Verde",
    solicitante: o.morador?.nome ?? o.cpf_morador ?? "Desconhecido",
    data: dataStr,
    prioridade,
    status: uiStatus,
    raw: o,
  };
};

export const corPrioridade = (p: string) => {
  switch (p) {
    case "Alta":
      return "bg-red-100 text-red-700";
    case "Média":
      return "bg-yellow-100 text-yellow-700";
    case "Baixa":
      return "bg-green-100 text-green-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export const corStatus = (s: string) => {
  switch (s) {
    case "Pendente":
      return "bg-orange-100 text-orange-700";
    case "Aceita":
      return "bg-blue-100 text-blue-700";
    case "Recusada":
      return "bg-red-100 text-red-700";
    case "Finalizada":
      return "bg-green-100 text-green-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};
