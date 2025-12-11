/**
 * ========================================
 * 📚 GUIA DE INTEGRAÇÃO - TELA DE CRIAÇÃO DE OS
 * ========================================
 * 
 * Este arquivo consolida todas as informações importantes para integração
 * da tela de criação de Ordem de Serviço com o backend.
 */

export const GUIA_INTEGRACAO = {
  
  /**
   * 1️⃣ INTEGRAÇÃO COM API
   * ====================
   */
  integracao_api: {
    descricao: "Passos para conectar com o backend",
    
    passo_1: {
      titulo: "Descomentar função no service",
      arquivo: "src/services/ordemServico.ts",
      acao: "Descomentar a função criarOrdemServico()",
      codigo: `
export const criarOrdemServico = async (payload: {
  descricao: string;
  cpf_morador: string;
}): Promise<OrdemServicoApi> => {
  const { data } = await api.post<OrdemServicoApi>("/ordens-servico", payload);
  return data;
};
      `
    },
    
    passo_2: {
      titulo: "Importar e usar no hook",
      arquivo: "src/screens/morador/useCriacaoOS.ts",
      acao: "Adicionar import e substituir lógica comentada",
      codigo: `
// Adicionar no topo do arquivo:
import { criarOrdemServico } from '../../services/ordemServico';

// Dentro de executarCriacao(), substituir console.log por:
const resposta = await criarOrdemServico(payload);

if (!resposta || !resposta.id) {
  throw new Error('Resposta inválida do servidor');
}

setSucesso(true);
return {
  sucesso: true,
  mensagem: 'Ordem de Serviço criada com sucesso!',
  payload: resposta,
};
      `
    },
    
    passo_3: {
      titulo: "Configurar endpoint na API",
      arquivo: "src/services/api.ts",
      acao: "Verificar se baseURL está correta",
      nota: "Certifique-se que a API backend está rodando e acessível"
    }
  },

  /**
   * 2️⃣ SCHEMA PRISMA UTILIZADO
   * ==========================
   */
  schema_prisma: {
    descricao: "Campos do modelo OrdemServico considerados",
    
    campos_obrigatorios_frontend: {
      descricao: "String - min 10, max 500 caracteres",
      cpf_morador: "String - obtido do contexto de autenticação"
    },
    
    campos_automaticos_backend: {
      dataAbertura: "DateTime @default(now()) - preenchido automaticamente",
      status: "String @default('PENDENTE_APROVACAO') - preenchido automaticamente",
      id: "Int @id @default(autoincrement()) - gerado pelo banco"
    },
    
    payload_enviado: {
      exemplo: {
        descricao: "Vazamento no banheiro do apartamento 301",
        cpf_morador: "12345678900"
      }
    }
  },

  /**
   * 3️⃣ VALIDAÇÕES IMPLEMENTADAS
   * ===========================
   */
  validacoes: {
    descricao: "Validações com Zod + React Hook Form",
    
    schema_zod: {
      arquivo: "src/types/ordemServico.ts",
      validacoes: [
        "✅ Descrição obrigatória",
        "✅ Mínimo 10 caracteres",
        "✅ Máximo 500 caracteres",
        "✅ maxLength no TextInput (truncamento automático)",
        "✅ Validação em tempo real (mode: 'onChange')",
        "✅ Botão desabilitado até validação passar"
      ]
    },
    
    regras_negocio: {
      autenticacao: "Usuário deve estar autenticado",
      papel: "Apenas moradores podem criar OS",
      cpf: "CPF do morador é obrigatório (vem do contexto)"
    }
  },

  /**
   * 4️⃣ COMPONENTES REUTILIZÁVEIS CRIADOS
   * ====================================
   */
  componentes: {
    descricao: "Componentes em src/components/formulario/",
    
    lista: [
      {
        nome: "ContainerFormulario",
        uso: "Wrapper com SafeAreaView e padding responsivo",
        props: "padronizarPadding?: boolean"
      },
      {
        nome: "CampoTextoArea",
        uso: "Textarea com validação, contador, Controller RHF",
        props: "nome, controle, rotulo, placeholder, numeroLinhas, maxCaracteres, mostrarContador"
      },
      {
        nome: "BotaoCriar",
        uso: "Botão submit com loading states e responsividade",
        props: "titulo, aoPresionar, carregando, desabilitado, tamanho, icone"
      },
      {
        nome: "MensagemErro",
        uso: "Feedback visual com 4 tipos (erro/sucesso/informacao/aviso)",
        props: "mensagem, tipo"
      }
    ],
    
    nota: "Todos exportados via barrel export em src/components/formulario/index.ts"
  },

  /**
   * 5️⃣ CONTEXTO DE AUTENTICAÇÃO
   * ===========================
   */
  contexto_autenticacao: {
    descricao: "Sistema de autenticação implementado",
    
    arquivo: "src/contexto/ContextoAutenticacao.tsx",
    
    hook: {
      nome: "useAutenticacao()",
      retorna: {
        usuario: "DadosAutenticacao | null",
        autenticar: "(dados: DadosAutenticacao) => void",
        desautenticar: "() => void"
      }
    },
    
    dados_usuario: {
      cpf: "string",
      nome: "string",
      telefone: "string",
      papel: "'MORADOR' | 'SINDICO' | 'FUNCIONARIO'",
      autenticado: "boolean"
    },
    
    uso_na_tela: "Valida autenticação e papel ao entrar na tela (useFocusEffect)",
    
    mock_login: {
      arquivo: "src/screens/telaLogin.tsx",
      credenciais: "123 / 123 (para testes)",
      nota: "Substituir por integração real com backend"
    }
  },

  /**
   * 6️⃣ BOAS PRÁTICAS IMPLEMENTADAS
   * ==============================
   */
  boas_praticas: {
    responsividade: [
      "✅ SafeAreaView para notches",
      "✅ KeyboardAvoidingView para teclado",
      "✅ Dimensions.get() para breakpoints",
      "✅ useMemo para cálculos responsivos",
      "✅ Fontes e espaçamentos escaláveis"
    ],
    
    performance: [
      "✅ useMemo para valores responsivos",
      "✅ useCallback para funções (se necessário)",
      "✅ React.forwardRef para refs",
      "✅ Validação otimizada (mode: 'onChange' apenas quando necessário)"
    ],
    
    manutencao: [
      "✅ Separação de responsabilidades (hook, componentes, types)",
      "✅ Componentes reutilizáveis",
      "✅ TypeScript para type safety",
      "✅ Comentários e documentação JSDoc",
      "✅ Nomenclatura em português brasileiro"
    ],
    
    ux: [
      "✅ Loading states claros",
      "✅ Mensagens de erro contextualizadas",
      "✅ Contador de caracteres com barra de progresso",
      "✅ Validação em tempo real",
      "✅ Botão desabilitado com feedback visual",
      "✅ Dica informativa para o usuário"
    ]
  },

  /**
   * 7️⃣ ESTRUTURA DE ARQUIVOS
   * ========================
   */
  estrutura_arquivos: {
    componentes: [
      "src/components/formulario/ContainerFormulario.tsx",
      "src/components/formulario/CampoTextoArea.tsx",
      "src/components/formulario/BotaoCriar.tsx",
      "src/components/formulario/MensagemErro.tsx",
      "src/components/formulario/index.ts (barrel export)"
    ],
    
    screens: [
      "src/screens/morador/criacaoOs.tsx (tela principal)",
      "src/screens/morador/useCriacaoOS.ts (hook customizado)"
    ],
    
    types: [
      "src/types/ordemServico.ts (interfaces, Zod schema, tipos)"
    ],
    
    services: [
      "src/services/ordemServico.ts (API calls)",
      "src/services/api.ts (axios instance)"
    ],
    
    contexto: [
      "src/contexto/ContextoAutenticacao.tsx"
    ],
    
    utils: [
      "src/utils/responsividade.ts",
      "src/utils/GUIA_INTEGRACAO.ts (este arquivo)"
    ]
  },

  /**
   * 8️⃣ DEPENDÊNCIAS INSTALADAS
   * ==========================
   */
  dependencias: {
    novas: [
      "react-hook-form - Gerenciamento de formulários",
      "zod - Validação de schema",
      "@hookform/resolvers - Integração RHF + Zod"
    ],
    
    comando: "npm install react-hook-form zod @hookform/resolvers",
    status: "✅ Instaladas"
  },

  /**
   * 9️⃣ TESTES RECOMENDADOS
   * ======================
   */
  testes: {
    validacao: [
      "Digitar menos de 10 caracteres → botão desabilitado",
      "Digitar exatamente 10 caracteres → botão habilitado",
      "Digitar 500 caracteres → contador em 500/500",
      "Tentar digitar mais de 500 → não permite",
      "Apagar texto → botão desabilita novamente"
    ],
    
    responsividade: [
      "Testar em iPhone SE (375px)",
      "Testar em iPhone 14 Pro Max (430px)",
      "Testar em iPad (768px)",
      "Verificar SafeAreaView em dispositivos com notch",
      "Testar com teclado aberto (KeyboardAvoidingView)"
    ],
    
    fluxo: [
      "Login com 123/123",
      "Navegar para tela de criação de OS",
      "Preencher descrição com 10+ caracteres",
      "Submeter formulário",
      "Verificar alert de sucesso",
      "Verificar navegação de volta"
    ],
    
    edge_cases: [
      "Tentar acessar sem estar autenticado",
      "Tentar acessar com papel diferente de MORADOR",
      "Simular erro de rede (quando API estiver integrada)",
      "Tentar submeter múltiplas vezes (loading state)"
    ]
  },

  /**
   * 🔟 PRÓXIMOS PASSOS
   * ==================
   */
  proximos_passos: {
    backend: [
      "1. Criar endpoint POST /ordens-servico no backend",
      "2. Validar payload no backend (descricao, cpf_morador)",
      "3. Inserir registro no banco (Prisma)",
      "4. Retornar OS criada com id gerado"
    ],
    
    frontend: [
      "1. Descomentar função criarOrdemServico() em services/ordemServico.ts",
      "2. Descomentar import e lógica em useCriacaoOS.ts",
      "3. Testar integração completa",
      "4. Ajustar mensagens de erro conforme respostas da API",
      "5. Remover mock de login e integrar autenticação real"
    ],
    
    melhorias_futuras: [
      "Adicionar campo 'local' (opcional no schema Prisma)",
      "Upload de imagens/anexos",
      "Lista de OS criadas pelo morador",
      "Notificações push quando OS for aprovada/atribuída",
      "Filtros e busca de OS"
    ]
  }

};

/**
 * ========================================
 * 📋 CHECKLIST DE INTEGRAÇÃO
 * ========================================
 */
export const CHECKLIST_INTEGRACAO = [
  "☐ Backend: Endpoint POST /ordens-servico implementado",
  "☐ Backend: Validações de payload implementadas",
  "☐ Backend: Retorna objeto OrdemServico com id",
  "☐ Frontend: Descomentar criarOrdemServico() em services/ordemServico.ts",
  "☐ Frontend: Descomentar lógica em useCriacaoOS.ts",
  "☐ Frontend: Importar criarOrdemServico no hook",
  "☐ Frontend: Configurar baseURL correta em api.ts",
  "☐ Teste: Login funciona (substituir mock por API real)",
  "☐ Teste: Criar OS com sucesso",
  "☐ Teste: Tratar erros de validação do backend",
  "☐ Teste: Tratar erros de rede",
  "☐ Teste: Verificar OS criada no banco de dados",
  "☐ Deploy: Testar em ambiente de produção"
];

// Exporta apenas o necessário
export default GUIA_INTEGRACAO;
