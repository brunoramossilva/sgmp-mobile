import api from "./api";
import { Morador } from "../types/morador";

export const getMoradores = async (): Promise<Morador[]> => {
  try {
    const response = await api.get("/moradores");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar moradores:", error);
    throw error;
  }
};
