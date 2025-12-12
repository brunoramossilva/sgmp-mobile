import { mapApiToUI, calcularDiasEmAberto } from "../src/utils/mapeadores";
import { OrdemServicoApi } from "../src/services/ordemServico";

describe("mapApiToUI e cálculos relacionados", () => {
  test("calcularDiasEmAberto usa Date.now mockado", () => {
    const fakeNow = new Date("2025-12-12T00:00:00.000Z");
    const spy = jest.spyOn(Date, "now").mockReturnValue(fakeNow.getTime());

    const dias = calcularDiasEmAberto("2025-12-10T00:00:00.000Z");
    expect(dias).toBe(2);

    spy.mockRestore();
  });

  test("mapApiToUI mapeia campos básicos corretamente", () => {
    const fakeNow = new Date("2025-12-12T00:00:00.000Z");
    const spy = jest.spyOn(Date, "now").mockReturnValue(fakeNow.getTime());

    const ordem: OrdemServicoApi = {
      id: 123,
      descricao:
        "Este é um texto de descrição muito longo que deve ser truncado no título da UI para não extrapolar o limite",
      dataAbertura: "2025-12-10T00:00:00.000Z",
      status: "FINALIZADA",
      cpf_morador: "00000000000",
      morador: { nome: "Fulano de Tal" },
    };

    const ui = mapApiToUI(ordem);

    expect(ui.id).toBe(123);
    expect(ui.solicitante).toBe("Fulano de Tal");
    expect(ui.status).toBe("Finalizada");
    expect(ui.statusApi).toBe(ordem.status);
    expect(ui.titulo.length).toBeLessThanOrEqual(43);
    expect(ui.titulo.endsWith("...")).toBe(true);
    expect(ui.diasEmAberto).toBe(2);
    expect(ui.local).toBe("Condomínio Vista Verde");

    spy.mockRestore();
  });
});
