import React, { useMemo } from "react";
import {
  IdIcone,
  obterConfigIcone,
  obterComponenteIcone,
} from "../../utils/iconesLucide";

interface PropriedadesIconeLucide {
  id: IdIcone;
  tamanho?: number;
  cor?: string;
  className?: string;
  testID?: string;
}

/**
 * Componente wrapper para ícones Lucide
 *
 * Encapsula Lucide com props padrão, Tailwind e acessibilidade
 * Centraliza customizações visuais
 *
 * @param id - ID do ícone (mapeado em iconesLucide.ts)
 * @param tamanho - Tamanho customizado (default: configuração padrão)
 * @param cor - Cor customizada (default: configuração padrão)
 * @param className - Classes Tailwind adicionais
 * @param testID - ID para testes
 */
export const IconeLucide: React.FC<PropriedadesIconeLucide> = ({
  id,
  tamanho,
  cor,
  className = "",
  testID,
}) => {
  const config = obterConfigIcone(id);
  const Componente = useMemo(() => obterComponenteIcone(id), [id]);

  if (!config || !Componente) {
    console.warn(`[IconeLucide] Ícone não encontrado: ${id}`);
    return null;
  }

  const { tamanhoPadrao, corPadrao } = config;

  const tamanhoProcurado = tamanho ?? tamanhoPadrao;
  const corProcurada = cor ?? corPadrao;

  return (
    <Componente
      size={tamanhoProcurado}
      color={corProcurada}
      className={className}
      testID={testID}
      strokeWidth={1.5}
    />
  );
};
