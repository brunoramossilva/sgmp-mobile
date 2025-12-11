import React, { createContext, useContext, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface DadosAutenticacao {
  cpf: string;
  nome: string;
  telefone: string;
  papel: "MORADOR" | "FUNCIONARIO" | "SINDICO";
  autenticado: boolean;
}

interface ContextoAutenticacaoType {
  usuario: DadosAutenticacao | null;
  autenticar: (dados: Omit<DadosAutenticacao, "autenticado">) => void;
  desautenticar: () => void;
}

const ContextoAutenticacao = createContext<
  ContextoAutenticacaoType | undefined
>(undefined);

export const ProvedorAutenticacao: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [usuario, setUsuario] = useState<DadosAutenticacao | null>(null);

  const autenticar = (dados: Omit<DadosAutenticacao, "autenticado">) => {
    setUsuario({
      ...dados,
      autenticado: true,
    });
  };

  const desautenticar = async () => {
    setUsuario(null);

    // Limpar todas as chaves de introdução do AsyncStorage
    try {
      const keys = await AsyncStorage.getAllKeys();
      const introducaoKeys = keys.filter((key) =>
        key.startsWith("introducao_")
      );
      if (introducaoKeys.length > 0) {
        await AsyncStorage.multiRemove(introducaoKeys);
      }
    } catch (erro) {
      console.error("Erro ao limpar introduções:", erro);
    }
  };

  return (
    <ContextoAutenticacao.Provider
      value={{ usuario, autenticar, desautenticar }}
    >
      {children}
    </ContextoAutenticacao.Provider>
  );
};

export const useAutenticacao = (): ContextoAutenticacaoType => {
  const context = useContext(ContextoAutenticacao);
  if (!context) {
    throw new Error(
      "useAutenticacao deve ser usado dentro de ProvedorAutenticacao"
    );
  }
  return context;
};
