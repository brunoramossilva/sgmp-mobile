/**
 * ========================================
 * DOCUMENTAÇÃO TÉCNICA - CRIAÇÃO DE OS
 * ========================================
 * 
 * Arquivo: src/screens/morador/criacaoOs.tsx
 * Última Atualização: 06/12/2025
 * Status: ✅ Funcional e pronto para integração com API
 * 
 * ========================================
 * 1. VISÃO GERAL
 * ========================================
 * 
 * Esta tela permite que moradores criem novas Ordens de Serviço (OS) para relatar
 * problemas/manutenção necessária no prédio. O formulário foi construído com:
 * 
 * - React Hook Form para gerenciamento reativo do estado
 * - Zod para validação declarativa de schema
 * - Contexto de autenticação para obter CPF do morador logado
 * - Componentes reutilizáveis seguindo design system do projeto
 * - Estrutura preparada para integração com API (sem chamadas reais no momento)
 * 
 * ========================================
 * 2. CAMPOS DO FORMULÁRIO (SCHEMA PRISMA)
 * ========================================
 * 
 * Campo: descricao
 * - Tipo: String
 * - Obrigatório: ✅ Sim
 * - Min caracteres: 10
 * - Max caracteres: 500
 * - Descrição: Descrição detalhada do problema a ser resolvido
 * - Componente: CampoTextoArea (textarea com 6 linhas)
 * 
 * Campos Preenchidos Automaticamente (Backend):
 * - dataAbertura: DateTime @default(now())
 * - status: String @default("ABERTA")
 * - aprovado: Boolean @default(false)
 * - cpf_morador: String (capturado do contexto de autenticação)
 * - cpf_sindico: String? (NULL até aprovação)
 * - cpf_funcionario: String? (NULL até atribuição)
 * - dataConclusao: DateTime? (NULL até finalização)
 * 
 * ========================================
 * 3. ESTRUTURA DE COMPONENTES
 * ========================================
 * 
 * ├── criacaoOs.tsx (Tela Principal)
 * │   ├── ScrollView (container de rolagem)
 * │   ├── ContainerFormulario (wrapper do formulário)
 * │   │   ├── Cabeçalho (título + descrição)
 * │   │   ├── MensagemErro (exibição condicional de erros)
 * │   │   ├── Informações do Morador (box com dados)
 * │   │   ├── CampoTextoArea (descrição do problema)
 * │   │   ├── Contador de Caracteres
 * │   │   ├── BotaoCriar (submit do formulário)
 * │   │   └── Dica de Informação
 * │
 * └── Hooks Utilizados:
 *     ├── useForm (React Hook Form) - Gerencia estado do formulário
 *     ├── useAutenticacao - Obtém dados do usuário logado
 *     ├── useCriacaoOS - Lógica de negócio e preparação para API
 *     └── useNavigation - Navegação entre telas
 * 
 * ========================================
 * 4. FLUXO DE DADOS
 * ========================================
 * 
 * 1. Usuário acessa tela (após login)
 *    └─> useEffect valida autenticação + papel (MORADOR)
 * 
 * 2. Usuário preenche campo de descrição
 *    └─> React Hook Form monitora mudanças
 *    └─> Zod valida em tempo real (onBlur)
 *    └─> MensagemErro exibida se inválido
 * 
 * 3. Usuário clica "Criar Ordem de Serviço"
 *    └─> handleSubmit valida todo o formulário
 *    └─> useCriacaoOS.executarCriacao() é chamado
 *    └─> Payload é preparado: { descricao, cpf_morador }
 *    └─> [TODO] Chamada POST à API em services/ordemServico.ts
 *    └─> Aguarda resposta
 * 
 * 4. Sucesso
 *    └─> useEffect monitora estado 'sucesso'
 *    └─> Alert de confirmação exibido
 *    └─> Formulário reseta
 *    └─> Usuário retorna à tela anterior
 * 
 * 5. Erro
 *    └─> Mensagem de erro exibida no topo
 *    └─> Usuário pode tentar novamente
 * 
 * ========================================
 * 5. FLUXO DE INTEGRAÇÃO COM API
 * ========================================
 * 
 * PASSO 1: Implementar função em src/services/ordemServico.ts
 * 
 *   export const criarOrdemServico = async (
 *     payload: CriacaoOsDados
 *   ): Promise<OrdemServicoApi> => {
 *     const { data } = await api.post('/ordens-servico', payload);
 *     return data;
 *   };
 * 
 * PASSO 2: Descomente o bloco integração em src/screens/morador/useCriacaoOS.ts
 * 
 *   // Procure por: // ========== TODO: INTEGRAÇÃO COM API ==========
 *   // Descomente o código do bloco e remova o simulador
 * 
 * PASSO 3: Teste a integração
 * 
 *   1. Execute npm start
 *   2. Login como morador (teste: 123/123)
 *   3. Acesse "Criar Ordem de Serviço"
 *   4. Preencha a descrição (mín. 10 caracteres)
 *   5. Clique "Criar Ordem de Serviço"
 *   6. Verifique no backend se OS foi criada
 * 
 * ========================================
 * 6. TIPOS E INTERFACES UTILIZADOS
 * ========================================
 * 
 * CriacaoOSFormulario (do Zod)
 * - descricao: string (validado por schema Zod)
 * 
 * CriacaoOsDados (para payload)
 * - descricao: string
 * - cpf_morador: string
 * 
 * DadosAutenticacao (contexto)
 * - cpf: string
 * - nome: string
 * - telefone: string
 * - papel: 'MORADOR' | 'FUNCIONARIO' | 'SINDICO'
 * - autenticado: boolean
 * 
 * ========================================
 * 7. VALIDAÇÕES IMPLEMENTADAS
 * ========================================
 * 
 * Schema Zod (src/types/ordemServico.ts):
 * - descricao: string
 *   ✓ Não vazio
 *   ✓ Mínimo 10 caracteres
 *   ✓ Máximo 500 caracteres
 * 
 * Validações de Negócio (criacaoOs.tsx):
 * - ✓ Usuário deve estar autenticado
 * - ✓ Papel do usuário deve ser 'MORADOR'
 * - ✓ CPF capturado automaticamente
 * 
 * ========================================
 * 8. DESIGN SYSTEM APLICADO
 * ========================================
 * 
 * Cores Utilizadas:
 * - Primária: red-600 (botões, cabeçalho)
 * - Secundária: slate-100 / slate-200 (backgrounds, borders)
 * - Sucesso: green-100 / green-600
 * - Informação: blue-100 / blue-700
 * - Erro: red-50 / red-600
 * 
 * Componentes Padrão:
 * - ContainerFormulario: bg-white p-6 rounded-2xl border border-slate-200
 * - CampoTextoArea: border-2 rounded-xl com estados de erro
 * - BotaoCriar: bg-red-600 p-4 rounded-2xl com feedback visual
 * - MensagemErro: bg-red-50 border-l-4 border-red-600
 * 
 * Espaçamento:
 * - mb-6: Entre seções principais
 * - mb-4: Entre elementos relacionados
 * - mb-2: Entre rótulos e inputs
 * - p-4 / p-6: Padding consistente
 * 
 * ========================================
 * 9. PRÓXIMAS MELHORIAS (SUGESTÕES)
 * ========================================
 * 
 * - [ ] Adicionar campo de categoria/tipo de OS
 * - [ ] Adicionar foto/anexo do problema
 * - [ ] Adicionar localização (apto/bloco)
 * - [ ] Adicionar prioridade (seletor)
 * - [ ] Salvar rascunho em AsyncStorage
 * - [ ] Histórico de OS criadas pelo morador
 * - [ ] Notificação quando OS for aprovada/recusada
 * - [ ] Integração com maps para localizar problema
 * 
 * ========================================
 * 10. REFERÊNCIAS ÚTEIS
 * ========================================
 * 
 * React Hook Form Docs:
 * https://react-hook-form.com/
 * 
 * Zod Docs:
 * https://zod.dev/
 * 
 * @hookform/resolvers:
 * https://www.npmjs.com/package/@hookform/resolvers
 * 
 * Schema Prisma:
 * sgmp-api/prisma/schema.prisma (modelo OrdemServico)
 * 
 * ========================================
 */

export const DOCUMENTACAO_CRIACAO_OS = {
  versao: '1.0.0',
  dataAtualizacao: '2025-12-06',
  status: 'production-ready',
  integracao: 'pendente',
};
