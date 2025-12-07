/**
 * ========================================
 * 📚 EXEMPLOS DE USO - COMPONENTES
 * ========================================
 * 
 * Este arquivo fornece exemplos prontos para uso
 * dos componentes criados em outras telas
 */

/**
 * ========================================
 * 1. USAR CONTEXTO DE AUTENTICAÇÃO
 * ========================================
 */

export const exemploUsoContextoAutenticacao = `
// Em qualquer componente/screen
import { useAutenticacao } from '../contexto/ContextoAutenticacao';

export default function MinhaScreen() {
  const { usuario, autenticar, desautenticar } = useAutenticacao();
  
  // Acessar dados do usuário autenticado
  if (usuario && usuario.autenticado) {
    console.log(usuario.cpf);      // "12345678901"
    console.log(usuario.nome);     // "João Silva"
    console.log(usuario.papel);    // "MORADOR"
  }
  
  // Fazer logout
  const handleLogout = () => {
    desautenticar();
    navigation.navigate('Login');
  };
  
  return (
    <View>
      <Text>{usuario?.nome}</Text>
      <Button onPress={handleLogout} title="Logout" />
    </View>
  );
}
`;

/**
 * ========================================
 * 2. USAR CONTAINER FORMULARIO
 * ========================================
 */

export const exemploContainerFormulario = `
import { ContainerFormulario } from '../../components/formulario';
import { View, Text, ScrollView } from 'react-native';

export default function MinhaTelaComFormulario() {
  return (
    <ScrollView className="flex-1 bg-slate-100">
      <ContainerFormulario>
        {/* Conteúdo aqui */}
        <Text className="text-2xl font-bold text-red-600 mb-4">
          Título do Formulário
        </Text>
        <View className="mb-6">
          {/* Campos aqui */}
        </View>
      </ContainerFormulario>
    </ScrollView>
  );
}
`;

/**
 * ========================================
 * 3. USAR CAMPO TEXTO AREA
 * ========================================
 */

export const exemploCampoTextoArea = `
import { CampoTextoArea } from '../../components/formulario';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Definir schema Zod
const schema = z.object({
  descricao: z
    .string()
    .min(10, 'Mínimo 10 caracteres')
    .max(500, 'Máximo 500 caracteres')
});

export default function TelaComTextArea() {
  const { control } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur'
  });
  
  return (
    <CampoTextoArea
      nome="descricao"
      controle={control}
      rotulo="Descrição do Problema *"
      placeholder="Digite aqui..."
      numeroLinhas={6}
    />
  );
}
`;

/**
 * ========================================
 * 4. USAR BOTAO CRIAR
 * ========================================
 */

export const exemploBotaoCriar = `
import { BotaoCriar } from '../../components/formulario';
import { useState } from 'react';

export default function TelaComBotao() {
  const [carregando, setCarregando] = useState(false);
  
  const handleAoPresionar = async () => {
    setCarregando(true);
    try {
      // Fazer algo (API call, etc)
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setCarregando(false);
    }
  };
  
  return (
    <BotaoCriar
      titulo="Enviar Dados"
      aoPresionar={handleAoPresionar}
      carregando={carregando}
      desabilitado={false}
    />
  );
}
`;

/**
 * ========================================
 * 5. USAR MENSAGEM ERRO
 * ========================================
 */

export const exemploMensagemErro = `
import { MensagemErro } from '../../components/formulario';
import { useState } from 'react';

export default function TelaComMensagens() {
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  
  return (
    <View className="flex-1">
      {erro && (
        <MensagemErro 
          mensagem={erro} 
          tipo="erro"
        />
      )}
      
      {sucesso && (
        <MensagemErro
          mensagem="Operação realizada com sucesso!"
          tipo="sucesso"
        />
      )}
      
      <MensagemErro
        mensagem="Esta é uma mensagem informativa"
        tipo="informacao"
      />
    </View>
  );
}
`;

/**
 * ========================================
 * 6. USAR HOOK CRIAR OS COMPLETO
 * ========================================
 */

export const exemploHookCriacaoOS = `
import { useCriacaoOS } from './useCriacaoOS';
import { useAutenticacao } from '../../contexto/ContextoAutenticacao';
import { View, ScrollView, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaCriacaoOS } from '../../types/ordemServico';

export default function TelaQueCriaOS() {
  const { usuario } = useAutenticacao();
  const { carregando, erro, sucesso, executarCriacao, resetar } = useCriacaoOS();
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schemaCriacaoOS),
    mode: 'onBlur'
  });
  
  const aoSubmeter = async (dados) => {
    if (!usuario) return;
    
    const resultado = await executarCriacao(
      dados.descricao,
      usuario.cpf
    );
    
    if (resultado.sucesso) {
      Alert.alert('Sucesso!', 'OS criada com sucesso');
      reset();
      resetar();
    }
  };
  
  return (
    <ScrollView>
      {erro && <MensagemErro mensagem={erro} tipo="erro" />}
      {/* Campos do formulário aqui */}
      <BotaoCriar
        titulo="Criar OS"
        aoPresionar={handleSubmit(aoSubmeter)}
        carregando={carregando}
      />
    </ScrollView>
  );
}
`;

/**
 * ========================================
 * 7. EXEMPLO COMPLETO: TELA DE FEEDBACK
 * ========================================
 */

export const exemploTelaCompletoFeedback = `
// src/screens/morador/telaFeedback.tsx (exemplo de tela similar)

import React from 'react';
import { View, ScrollView, Alert, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  ContainerFormulario,
  CampoTextoArea,
  BotaoCriar,
  MensagemErro
} from '../../components/formulario';

// Schema específico para feedback
const schemaFeedback = z.object({
  mensagem: z
    .string()
    .min(5, 'Mínimo 5 caracteres')
    .max(1000, 'Máximo 1000 caracteres')
});

export default function TelaFeedback() {
  const [erro, setErro] = React.useState<string | null>(null);
  const [carregando, setCarregando] = React.useState(false);
  
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schemaFeedback),
    mode: 'onBlur',
    defaultValues: { mensagem: '' }
  });
  
  const onSubmit = async (dados) => {
    setCarregando(true);
    try {
      // TODO: chamar API aqui
      // await api.post('/feedback', dados);
      
      Alert.alert('Obrigado!', 'Seu feedback foi enviado com sucesso');
      reset();
    } catch (err: any) {
      setErro(err.message || 'Erro ao enviar feedback');
    } finally {
      setCarregando(false);
    }
  };
  
  return (
    <ScrollView className="flex-1 bg-slate-100">
      <ContainerFormulario>
        <Text className="text-2xl font-bold text-red-600 mb-2">
          Enviar Feedback
        </Text>
        <Text className="text-slate-600 mb-6">
          Sua opinião é importante para melhorar o sistema
        </Text>
        
        {erro && <MensagemErro mensagem={erro} tipo="erro" />}
        
        <CampoTextoArea
          nome="mensagem"
          controle={control}
          rotulo="Sua mensagem *"
          placeholder="O que você achou do sistema?"
          numeroLinhas={5}
        />
        
        <BotaoCriar
          titulo={carregando ? 'Enviando...' : 'Enviar Feedback'}
          aoPresionar={handleSubmit(onSubmit)}
          carregando={carregando}
        />
      </ContainerFormulario>
    </ScrollView>
  );
}
`;

/**
 * ========================================
 * 8. PADRÃO PARA ADICIONAR NOVO CAMPO
 * ========================================
 */

export const padraoAdicionarCampo = `
// PASSO 1: Atualizar Zod Schema
// Em src/types/ordemServico.ts

export const schemaCriacaoOS = z.object({
  descricao: z.string().min(10).max(500),
  // NOVO: Adicionar novo campo
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA'])
});

// PASSO 2: Usar em formulário
// Em criacaoOs.tsx

import { Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';

<Controller
  name="prioridade"
  control={control}
  render={({ field: { value, onChange }, fieldState: { error } }) => (
    <View>
      <Text className="text-sm font-semibold text-slate-700 mb-2">
        Prioridade
      </Text>
      <Picker
        selectedValue={value}
        onValueChange={onChange}
        style={{ borderWidth: 1, borderColor: error ? 'red' : '#ccc' }}
      >
        <Picker.Item label="Selecione..." value="" />
        <Picker.Item label="Baixa" value="BAIXA" />
        <Picker.Item label="Média" value="MEDIA" />
        <Picker.Item label="Alta" value="ALTA" />
      </Picker>
      {error && <Text className="text-red-600 text-xs">{error.message}</Text>}
    </View>
  )}
/>

// PASSO 3: Usar no payload
const payload = {
  descricao: dados.descricao,
  prioridade: dados.prioridade,
  cpf_morador: usuario.cpf
};
`;

/**
 * ========================================
 * SUMMARY
 * ========================================
 */

export const EXEMPLOS_SUMMARY = {
  1: "Usar contexto de autenticação",
  2: "Container de formulário",
  3: "Campo textarea com validação",
  4: "Botão com loading",
  5: "Mensagens de feedback",
  6: "Hook customizado completo",
  7: "Tela completa exemplo (Feedback)",
  8: "Padrão para adicionar campos novos"
};
