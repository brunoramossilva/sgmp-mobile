import {
  mapUIToApi,
  mapApiToUI,
  calcularDiasEmAberto,
  truncarTexto,
  corPrioridade,
  corStatus,
} from "../src/utils/mapeadores";

import { OrdemServicoApi } from "../src/services/ordemServico";

describe("mapeadores - casos adicionais", () => {
  test("mapUIToApi mapeia somente os campos esperados", () => {
    const ui = {
      descricao: "descricao teste",
      statusApi: "AGUARDANDO_EXECUCAO",
      cpf_sindico: "111",
      cpf_funcionario: "222",
    } as any;

    expect(mapUIToApi(ui)).toEqual({
      descricao: "descricao teste",
      status: "AGUARDANDO_EXECUCAO",
      cpf_sindico: "111",
      cpf_funcionario: "222",
    });
  });

  test("mapApiToUI usa 'Desconhecido' quando morador ausente e local padrão", () => {
    const ordem: OrdemServicoApi = {
      id: 1,
      descricao: "desc",
      dataAbertura: "2025-12-10T00:00:00.000Z",
      status: "PENDENTE_APROVACAO",
      cpf_morador: "0",
    };

    const ui = mapApiToUI(ordem as any);
    expect(ui.solicitante).toBe("Desconhecido");
    expect(ui.local).toBe("Condomínio Vista Verde");
  });

  test("mapApiToUI formata dataConclusao quando presente", () => {
    // Use date string without timezone to avoid local offset shifting the day
    const ordem: OrdemServicoApi = {
      id: 2,
      descricao: "desc",
      // use Date objects to avoid parsing/timezone ambiguity
      dataAbertura: new Date(2025, 11, 10) as any,
      dataConclusao: new Date(2025, 11, 11) as any,
      status: "FINALIZADA",
      cpf_morador: "0",
    };

    const ui = mapApiToUI(ordem as any);
    expect(ui.dataConclusao).toBe("11/12/2025");
  });

  test("calcularDiasEmAberto retorna 0 para datas no futuro", () => {
    const fakeNow = new Date("2025-12-10T00:00:00.000Z");
    const spy = jest.spyOn(Date, "now").mockReturnValue(fakeNow.getTime());

    const dias = calcularDiasEmAberto("2025-12-12T00:00:00.000Z");
    expect(dias).toBe(0);

    spy.mockRestore();
  });

  test("truncarTexto comportamento em limites", () => {
    const exato = "a".repeat(40);
    expect(truncarTexto(exato, 40)).toBe(exato);

    const mais = "b".repeat(41);
    const t = truncarTexto(mais, 40);
    expect(t.endsWith("...")).toBe(true);
  });

  test("corPrioridade e corStatus retornam fallback para valores desconhecidos", () => {
    expect(corPrioridade("Outra")).toContain("slate");
    expect(corStatus("XYZ")).toContain("slate");
  });
});
