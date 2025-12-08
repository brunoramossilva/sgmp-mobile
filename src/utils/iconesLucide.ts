/**
 * Mapeamento centralizado de ícones Lucide
 * Facilita manutenção, reutilização e futuras mudanças visuais
 * 
 * Usa um padrão de lazy loading para evitar problemas com Metro bundler
 */

export type IdIcone =
  | 'home'
  | 'servicos'
  | 'financeiro'
  | 'reservas'
  | 'boas-vindas'
  | 'criar-os'
  | 'acompanhar'
  | 'comunicacao'
  | 'comeco'
  | 'tecnico'
  | 'ordenar'
  | 'cooperacao'
  | 'executar'
  | 'aprovar'
  | 'progresso'
  | 'historico'
  | 'predio'
  | 'adicionar'
  | 'confirmar'
  | 'cancelar'
  | 'anterior'
  | 'proximo'
  | 'logout'
  | 'alerta'
  | 'moradores'
  | 'gestao'
  | 'calendario'
  | 'relogio'
  | 'verificado';

interface ConfiguradorIcone {
  iconeNome: string;
  tamanhoPadrao: number;
  corPadrao: string;
  descricao: string;
}

/**
 * Mapa de configurações de ícones
 * Armazena apenas nomes e configurações, não componentes
 */
const MAPA_ICONES: Record<IdIcone, ConfiguradorIcone> = {
  // Navegação principal
  home: {
    iconeNome: 'Home',
    tamanhoPadrao: 24,
    corPadrao: '#ffffff',
    descricao: 'Ícone de home/início',
  },
  servicos: {
    iconeNome: 'Wrench',
    tamanhoPadrao: 24,
    corPadrao: '#ffffff',
    descricao: 'Ícone de serviços/manutenção',
  },
  financeiro: {
    iconeNome: 'DollarSign',
    tamanhoPadrao: 24,
    corPadrao: '#ffffff',
    descricao: 'Ícone de financeiro',
  },
  reservas: {
    iconeNome: 'Calendar',
    tamanhoPadrao: 24,
    corPadrao: '#ffffff',
    descricao: 'Ícone de reservas/calendário',
  },

  // Carrossel de onboarding - Morador
  'boas-vindas': {
    iconeNome: 'Hand',
    tamanhoPadrao: 48,
    corPadrao: '#3b82f6',
    descricao: 'Ícone de boas-vindas',
  },
  'criar-os': {
    iconeNome: 'FileText',
    tamanhoPadrao: 48,
    corPadrao: '#10b981',
    descricao: 'Ícone de criar ordem de serviço',
  },
  acompanhar: {
    iconeNome: 'ClipboardList',
    tamanhoPadrao: 48,
    corPadrao: '#eab308',
    descricao: 'Ícone de acompanhar status',
  },
  comunicacao: {
    iconeNome: 'MessageCircle',
    tamanhoPadrao: 48,
    corPadrao: '#a855f7',
    descricao: 'Ícone de comunicação',
  },
  comeco: {
    iconeNome: 'Rocket',
    tamanhoPadrao: 48,
    corPadrao: '#ef4444',
    descricao: 'Ícone de início/começar',
  },

  // Carrossel de onboarding - Técnico
  tecnico: {
    iconeNome: 'HardHat',
    tamanhoPadrao: 48,
    corPadrao: '#3b82f6',
    descricao: 'Ícone de técnico',
  },
  ordenar: {
    iconeNome: 'CheckCircle',
    tamanhoPadrao: 48,
    corPadrao: '#10b981',
    descricao: 'Ícone de ordens aprovadas',
  },
  cooperacao: {
    iconeNome: 'Handshake',
    tamanhoPadrao: 48,
    corPadrao: '#eab308',
    descricao: 'Ícone de cooperação/aceitar',
  },
  executar: {
    iconeNome: 'Wrench',
    tamanhoPadrao: 48,
    corPadrao: '#a855f7',
    descricao: 'Ícone de executar trabalho',
  },

  // Carrossel de onboarding - Síndico
  predio: {
    iconeNome: 'Building2',
    tamanhoPadrao: 48,
    corPadrao: '#3b82f6',
    descricao: 'Ícone de prédio/condomínio',
  },
  aprovar: {
    iconeNome: 'Scale',
    tamanhoPadrao: 48,
    corPadrao: '#10b981',
    descricao: 'Ícone de aprovação',
  },
  progresso: {
    iconeNome: 'BarChart3',
    tamanhoPadrao: 48,
    corPadrao: '#eab308',
    descricao: 'Ícone de progresso/acompanhamento',
  },
  historico: {
    iconeNome: 'BookOpen',
    tamanhoPadrao: 48,
    corPadrao: '#a855f7',
    descricao: 'Ícone de histórico',
  },

  // Ações e estados
  adicionar: {
    iconeNome: 'Plus',
    tamanhoPadrao: 24,
    corPadrao: '#ffffff',
    descricao: 'Ícone de adicionar/criar',
  },
  confirmar: {
    iconeNome: 'Check',
    tamanhoPadrao: 24,
    corPadrao: '#10b981',
    descricao: 'Ícone de confirmação',
  },
  cancelar: {
    iconeNome: 'X',
    tamanhoPadrao: 24,
    corPadrao: '#ef4444',
    descricao: 'Ícone de cancelamento',
  },
  anterior: {
    iconeNome: 'ChevronLeft',
    tamanhoPadrao: 24,
    corPadrao: '#ffffff',
    descricao: 'Ícone de voltar/anterior',
  },
  proximo: {
    iconeNome: 'ChevronRight',
    tamanhoPadrao: 24,
    corPadrao: '#ffffff',
    descricao: 'Ícone de próximo/avançar',
  },

  // Logout
  logout: {
    iconeNome: 'LogOut',
    tamanhoPadrao: 24,
    corPadrao: '#ffffff',
    descricao: 'Ícone de logout/sair',
  },

  // Dashboard e gestão
  alerta: {
    iconeNome: 'AlertCircle',
    tamanhoPadrao: 24,
    corPadrao: '#ef4444',
    descricao: 'Ícone de alerta/aviso',
  },
  moradores: {
    iconeNome: 'Users',
    tamanhoPadrao: 24,
    corPadrao: '#10b981',
    descricao: 'Ícone de moradores/usuários',
  },
  gestao: {
    iconeNome: 'ClipboardList',
    tamanhoPadrao: 24,
    corPadrao: '#ffffff',
    descricao: 'Ícone de gestão/gerenciamento',
  },
  calendario: {
    iconeNome: 'Calendar',
    tamanhoPadrao: 16,
    corPadrao: '#64748b',
    descricao: 'Ícone de calendário/data',
  },
  relogio: {
    iconeNome: 'Clock',
    tamanhoPadrao: 16,
    corPadrao: '#64748b',
    descricao: 'Ícone de relógio/tempo',
  },
  verificado: {
    iconeNome: 'CheckCircle',
    tamanhoPadrao: 48,
    corPadrao: '#10b981',
    descricao: 'Ícone de verificado/sucesso',
  },
};

/**
 * Obtém a configuração de um ícone
 * @param id - ID do ícone
 * @returns Configuração do ícone
 */
export function obterConfigIcone(id: IdIcone): ConfiguradorIcone {
  const config = MAPA_ICONES[id];
  if (!config) {
    console.warn(`Ícone "${id}" não encontrado no mapa`);
    return MAPA_ICONES.logout;
  }
  return config;
}

/**
 * Obtém o componente Lucide dinamicamente
 * @param id - ID do ícone
 * @returns Componente Lucide ou null
 */
export function obterComponenteIcone(id: IdIcone) {
  try {
    const config = obterConfigIcone(id);
    const modulo = require('lucide-react-native');
    return modulo[config.iconeNome] || null;
  } catch (erro) {
    console.error(`Erro ao carregar ícone "${id}":`, erro);
    return null;
  }
}
