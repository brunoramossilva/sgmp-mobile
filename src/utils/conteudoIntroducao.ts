/**
 * Conteúdo dos slides de introdução personalizados por tipo de usuário
 * 
 * Cada tipo de usuário tem um carrossel específico mostrando
 * as principais funções disponíveis no sistema
 */

import { IdIcone } from './iconesLucide';

export interface SlideIntroducao {
  titulo: string;
  descricao: string;
  idIcone: IdIcone;
  cor: string;
}

/**
 * Slides de introdução para Morador
 * Mostra funções relacionadas a criação de ordens de serviço e gestão
 */
export const slidesMorador: SlideIntroducao[] = [
  {
    titulo: 'Bem-vindo ao SGMP',
    descricao: 'Sistema de Gestão de Manutenção Predial. Gerencie as manutenções do seu condomínio de forma fácil e rápida.',
    idIcone: 'boas-vindas',
    cor: 'bg-blue-100',
  },
  {
    titulo: 'Criar Ordem de Serviço',
    descricao: 'Solicite manutenções para o seu apartamento. Descreva o problema e acompanhe o status em tempo real.',
    idIcone: 'criar-os',
    cor: 'bg-green-100',
  },
  {
    titulo: 'Acompanhar Status',
    descricao: 'Veja todas as suas solicitações de manutenção, o responsável técnico e a data prevista de conclusão.',
    idIcone: 'acompanhar',
    cor: 'bg-yellow-100',
  },
  {
    titulo: 'Comunicação Direta',
    descricao: 'Mantenha-se informado sobre o progresso de cada ordem de serviço com atualizações em tempo real.',
    idIcone: 'comunicacao',
    cor: 'bg-purple-100',
  },
  {
    titulo: 'Pronto para começar!',
    descricao: 'Clique em "Começar" para explorar o sistema e criar sua primeira ordem de serviço.',
    idIcone: 'comeco',
    cor: 'bg-red-100',
  },
];

/**
 * Slides de introdução para Funcionário/Técnico
 * Mostra funções relacionadas a aceitar e executar ordens de serviço
 */
export const slidesFuncionario: SlideIntroducao[] = [
  {
    titulo: 'Bem-vindo ao SGMP - Técnico',
    descricao: 'Gerencie suas atribuições de manutenção e acompanhe os trabalhos designados para você.',
    idIcone: 'tecnico',
    cor: 'bg-blue-100',
  },
  {
    titulo: 'Ordens Aprovadas',
    descricao: 'Visualize todas as ordens de serviço que foram aprovadas pelo síndico e aguardam sua aceitação.',
    idIcone: 'ordenar',
    cor: 'bg-green-100',
  },
  {
    titulo: 'Aceitar Trabalhos',
    descricao: 'Revise os detalhes da ordem e aceite o trabalho para começar a execução imediatamente.',
    idIcone: 'cooperacao',
    cor: 'bg-yellow-100',
  },
  {
    titulo: 'Executar e Finalizar',
    descricao: 'Registre o progresso dos trabalhos e finalize com um relatório detalhado do que foi feito.',
    idIcone: 'executar',
    cor: 'bg-purple-100',
  },
  {
    titulo: 'Comece a trabalhar!',
    descricao: 'Clique em "Começar" para ver suas ordens e gerenciar seus trabalhos.',
    idIcone: 'comeco',
    cor: 'bg-red-100',
  },
];

/**
 * Slides de introdução para Síndico
 * Mostra funções relacionadas a aprovação de ordens de serviço
 */
export const slidesSindico: SlideIntroducao[] = [
  {
    titulo: 'Bem-vindo ao SGMP - Síndico',
    descricao: 'Gerencie as solicitações de manutenção do condomínio com visão completa do processo.',
    idIcone: 'predio',
    cor: 'bg-blue-100',
  },
  {
    titulo: 'Aprovar Ordens',
    descricao: 'Revise as solicitações de manutenção e aprove-as para que os técnicos possam começar o trabalho.',
    idIcone: 'aprovar',
    cor: 'bg-green-100',
  },
  {
    titulo: 'Acompanhar Execução',
    descricao: 'Monitore o progresso de todas as ordens de serviço em andamento no condomínio.',
    idIcone: 'progresso',
    cor: 'bg-yellow-100',
  },
  {
    titulo: 'Histórico Completo',
    descricao: 'Acesse o histórico de todas as manutenções realizadas para referência e controle.',
    idIcone: 'historico',
    cor: 'bg-purple-100',
  },
  {
    titulo: 'Comece a gerenciar!',
    descricao: 'Clique em "Começar" para acessar seu painel de controle e gerenciar as ordens de serviço.',
    idIcone: 'comeco',
    cor: 'bg-red-100',
  },
];

/**
 * Função auxiliar para obter os slides corretos baseado no papel do usuário
 */
export const obterSlidesIntroducao = (papel: 'MORADOR' | 'FUNCIONARIO' | 'SINDICO'): SlideIntroducao[] => {
  switch (papel) {
    case 'MORADOR':
      return slidesMorador;
    case 'FUNCIONARIO':
      return slidesFuncionario;
    case 'SINDICO':
      return slidesSindico;
    default:
      return slidesMorador;
  }
};
