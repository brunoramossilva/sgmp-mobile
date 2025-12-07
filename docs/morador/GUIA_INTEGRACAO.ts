/**
 * ========================================
 * GUIA DE INTEGRAÇÃO - CRIAÇÃO DE OS
 * ========================================
 * 
 * Este arquivo fornece exemplos práticos de como integrar
 * a tela de criação de OS com o backend.
 * 
 * ========================================
 * ESTRUTURA DO PAYLOAD
 * ========================================
 */

// Payload que será enviado para o backend
interface PayloadCriacaoOS {
  descricao: string;      // Descrição detalhada do problema (10-500 chars)
  cpf_morador: string;    // CPF do morador (obtido do contexto de autenticação)
}

// Exemplo de payload:
const exemploPayload: PayloadCriacaoOS = {
  descricao: "Torneira da cozinha está pingando constantemente e o vazamento está prejudicando a estrutura abaixo.",
  cpf_morador: "12345678901"
};

/**
 * ========================================
 * PASSO 1: ADICIONAR FUNÇÃO NO SERVICE
 * ========================================
 * 
 * Arquivo: src/services/ordemServico.ts
 * 
 * Código a adicionar:
 */

/*
import api from './api';
import { CriacaoOsDados } from '../types/ordemServico';
import type { OrdemServicoApi } from '../types/ordemServico';

// Função para criar nova ordem de serviço
export const criarOrdemServico = async (
  payload: CriacaoOsDados
): Promise<OrdemServicoApi> => {
  try {
    const { data } = await api.post('/ordens-servico', payload);
    return data;
  } catch (erro: any) {
    // Tratamento centralizado de erro
    throw new Error(
      erro?.response?.data?.mensagem ||
      'Erro ao criar ordem de serviço'
    );
  }
};
*/

/**
 * ========================================
 * PASSO 2: IMPORTAR NO HOOK useCriacaoOS
 * ========================================
 * 
 * Arquivo: src/screens/morador/useCriacaoOS.ts
 * 
 * Na função executarCriacao(), substitua:
 * 
 *   // Simulação temporária
 *   console.log('Payload pronto para integração:', payload);
 *   setSucesso(true);
 * 
 * Por:
 * 
 *   import { criarOrdemServico } from '../../services/ordemServico';
 *   
 *   const resposta = await criarOrdemServico(payload);
 *   
 *   if (!resposta || !resposta.id) {
 *     throw new Error('Resposta inválida do servidor');
 *   }
 *   
 *   setSucesso(true);
 */

/**
 * ========================================
 * PASSO 3: TESTAR A INTEGRAÇÃO
 * ========================================
 * 
 * 1. Certifique-se de que o backend está rodando:
 *    cd sgmp-api
 *    npm run dev
 * 
 * 2. Inicie o app mobile:
 *    cd sgmp-mobile
 *    npm start
 * 
 * 3. Faça login como morador:
 *    Matrícula: 123
 *    Senha: 123
 *    Perfil: Morador
 * 
 * 4. Navegue para "Criar Ordem de Serviço"
 * 
 * 5. Preencha o formulário:
 *    - Descrição: algo com 10+ caracteres
 *    - Clique "Criar Ordem de Serviço"
 * 
 * 6. Verifique:
 *    - Sucesso: mensagem de confirmação
 *    - Erro: mensagem de erro detalhada
 *    - Backend: verifique se OS foi criada no banco
 * 
 * Comando para verificar no banco (PostgreSQL):
 *   SELECT * FROM "OrdemServico" 
 *   WHERE "cpf_morador" = '12345678901' 
 *   ORDER BY "dataAbertura" DESC 
 *   LIMIT 1;
 */

/**
 * ========================================
 * EXEMPLO COMPLETO DE RESPOSTA DO BACKEND
 * ========================================
 * 
 * Status: 201 Created
 * 
 * {
 *   "id": 42,
 *   "descricao": "Torneira da cozinha está pingando...",
 *   "dataAbertura": "2025-12-06T14:30:00.000Z",
 *   "dataConclusao": null,
 *   "status": "ABERTA",
 *   "aprovado": false,
 *   "cpf_morador": "12345678901",
 *   "cpf_sindico": null,
 *   "cpf_funcionario": null
 * }
 */

/**
 * ========================================
 * TRATAMENTO DE ERROS
 * ========================================
 */

// Possíveis erros e como lidar:

interface ErroAPI {
  status: number;
  mensagem: string;
  solucao: string;
}

const possiveisErros: ErroAPI[] = [
  {
    status: 400,
    mensagem: 'Descrição deve ter entre 10 e 500 caracteres',
    solucao: 'Validação já feita no frontend (Zod), mas backend também valida'
  },
  {
    status: 401,
    mensagem: 'Usuário não autenticado',
    solucao: 'Redirecionar para login (validação já existe em criacaoOs.tsx)'
  },
  {
    status: 403,
    mensagem: 'Apenas moradores podem criar OS',
    solucao: 'Verificar papel do usuário (validação já existe em criacaoOs.tsx)'
  },
  {
    status: 404,
    mensagem: 'Morador não encontrado no banco',
    solucao: 'Verificar se CPF existe na tabela Morador'
  },
  {
    status: 500,
    mensagem: 'Erro interno do servidor',
    solucao: 'Revisar logs do backend'
  }
];

/**
 * ========================================
 * FLUXO COMPLETO DE INTEGRAÇÃO
 * ========================================
 */

const fluxoIntegracao = `
1. PREPARAÇÃO
   ├─ ✅ Backend: Endpoint POST /ordens-servico pronto
   ├─ ✅ Frontend: Tela criacaoOs.tsx com formulário
   ├─ ✅ Types: CriacaoOsDados definido
   └─ ✅ Autenticação: Contexto implementado

2. IMPLEMENTAÇÃO
   ├─ Adicionar função criarOrdemServico em services/ordemServico.ts
   ├─ Importar função em useCriacaoOS.ts
   ├─ Substituir simulador por chamada real
   └─ Testar com postman/insomnia

3. VALIDAÇÃO
   ├─ Testar com descrição válida (10-500 chars)
   ├─ Testar com descrição inválida (< 10 chars)
   ├─ Testar com usuário não autenticado
   ├─ Testar com usuário não-morador
   ├─ Verificar dados no banco
   └─ Testar mensagens de erro

4. MONITORAMENTO
   ├─ Logs do backend
   ├─ Logs do frontend (console.log)
   ├─ Verificação de dados no banco
   └─ Teste de rede instável (Throttling)

5. REFINAMENTO
   ├─ Ajustar mensagens de erro
   ├─ Otimizar performance
   ├─ Adicionar retry lógica se necessário
   └─ Documentar edge cases
`;

/**
 * ========================================
 * CHECKLIST DE IMPLEMENTAÇÃO
 * ========================================
 */

const checklistImplementacao = {
  backend: [
    '✓ Endpoint POST /ordens-servico implementado',
    '✓ Validação de descricao (10-500 chars)',
    '✓ Validação de CPF_morador',
    '✓ Testes de erro (400, 401, 403, 404, 500)',
    '✓ Retorna OrdemServicoApi com ID gerado'
  ],
  frontend: [
    '✓ Tela criacaoOs.tsx funcional',
    '✓ Validação Zod implementada',
    '✓ Contexto de autenticação ativo',
    '✓ Componentes reutilizáveis prontos',
    '✓ Estados de loading/erro/sucesso',
    '✓ React Hook Form integrado'
  ],
  integracao: [
    '⏳ Função criarOrdemServico em services/ordemServico.ts',
    '⏳ Descomente bloco de integração em useCriacaoOS.ts',
    '⏳ Teste com postman/insomnia',
    '⏳ Teste no app mobile',
    '⏳ Verifique dados no banco PostgreSQL'
  ]
};

/**
 * ========================================
 * REFERÊNCIAS E RECURSOS
 * ========================================
 */

const recursos = {
  documentacao: {
    prisma: 'sgmp-api/prisma/schema.prisma',
    rodas: 'sgmp-api/src/routes/ordemServicoRoutes.ts',
    controller: 'sgmp-api/src/controllers/ordemServicoController.ts'
  },
  exemplosBackend: {
    criarOS: 'Implementar POST /ordens-servico',
    listarOS: 'Já existe: GET /ordens-servico',
    atualizarOS: 'Já existe: PUT /ordens-servico/:id'
  },
  testesRecomendados: [
    'Descrição com exatamente 10 caracteres',
    'Descrição com 500 caracteres',
    'Descrição com 501 caracteres (deve falhar)',
    'Descrição vazia (deve falhar)',
    'CPF inválido (deve falhar)'
  ]
};

export { fluxoIntegracao, checklistImplementacao, recursos };
