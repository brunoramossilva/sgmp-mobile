import {
  formatarData,
  calcularPrioridade,
  converterStatus,
  truncarTexto,
  corPrioridade,
  corStatus,
} from "../src/utils/mapeadores";

describe("mapeadores utilitários", () => {
  test("formatarData formata Date corretamente", () => {
    const d = new Date(2023, 0, 5); // 05/01/2023
    expect(formatarData(d)).toBe("05/01/2023");
  });

  test("calcularPrioridade retorna Baixa/Média/Alta conforme dias", () => {
    expect(calcularPrioridade(0)).toBe("Baixa");
    expect(calcularPrioridade(4)).toBe("Média");
    expect(calcularPrioridade(8)).toBe("Alta");
  });

  test("converterStatus mapeia corretamente status da API", () => {
    expect(converterStatus("FINALIZADA")).toBe("Finalizada");
    expect(converterStatus("RECUSADA")).toBe("Recusada");
    expect(converterStatus("EM_EXECUCAO")).toBe("Em Execução");
    expect(converterStatus("AGUARDANDO_EXECUCAO")).toBe("Aceita");
    expect(converterStatus(undefined)).toBe("Pendente");
  });

  test("truncarTexto não altera textos curtos e trunca os longos", () => {
    const curto = "Texto curto";
    const longo =
      "Este é um texto muito longo que precisa ser truncado para exibir apenas uma parte dele";

    expect(truncarTexto(curto, 40)).toBe(curto);
    const truncado = truncarTexto(longo, 20);
    expect(truncado.length).toBeLessThanOrEqual(23); // 20 + ...
    expect(truncado.endsWith("...")).toBe(true);
  });

  test("corPrioridade e corStatus retornam classes esperadas", () => {
    expect(corPrioridade("Alta")).toContain("red");
    expect(corPrioridade("Média")).toContain("yellow");
    expect(corPrioridade("Baixa")).toContain("green");

    expect(corStatus("Pendente")).toContain("orange");
    expect(corStatus("Aceita")).toContain("blue");
    expect(corStatus("Finalizada")).toContain("green");
  });
});
