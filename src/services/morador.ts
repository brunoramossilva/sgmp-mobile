import api from "./api";
import { Morador } from "../types/morador";

export const getMoradores = async (): Promise<Morador[]> => {
  try {
    const { data } = await api.get<Morador[]>("/moradores");
    return data;
  } catch (error: any) {
    console.error("Erro ao buscar moradores:", error);
    throw new Error(
      error?.response?.data?.mensagem ||
        error?.message ||
        "Erro ao buscar moradores"
    );
  }
};
