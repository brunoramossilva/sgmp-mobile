import React, { useMemo } from 'react';
import { View, TextInput, Text, Dimensions } from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

interface PropriedadesCampoTextoArea<T extends FieldValues> {
  nome: Path<T>;
  controle: Control<T>;
  rotulo: string;
  placeholder: string;
  numeroLinhas?: number;
  maxCaracteres?: number;
  mostrarContador?: boolean;
}

/**
 * Componente reutilizável para campo de texto área (descrição)
 * 
 * Features:
 * - Integrado com React Hook Form via Controller
 * - Validação visual com cores
 * - Responsivo (adapta altura mínima ao tamanho da tela)
 * - Contador de caracteres opcional
 * - Erro message contextualizado
 * - Suporta diferentes tamanhos de tela
 * 
 * @param mostrarContador - Exibir contador de caracteres (default: false)
 * @param maxCaracteres - Máximo de caracteres para o contador (opcional)
 */
export const CampoTextoArea = React.forwardRef<
  TextInput,
  PropriedadesCampoTextoArea<any>
>(
  (
    {
      nome,
      controle,
      rotulo,
      placeholder,
      numeroLinhas = 5,
      maxCaracteres,
      mostrarContador = false,
    },
    ref
  ) => {
    const { width } = Dimensions.get('window');
    
    // Valores responsivos
    const isSmallScreen = width < 375;
    const alturaMinima = useMemo(() => {
      const lineHeight = 20;
      const padding = 16;
      const border = 2;
      
      // Reduz altura mínima em telas pequenas
      const numLinhas = isSmallScreen ? Math.max(3, numeroLinhas - 1) : numeroLinhas;
      return numLinhas * lineHeight + padding + border;
    }, [numeroLinhas, isSmallScreen]);

    const fontSizeRotulo = isSmallScreen ? 13 : 14;
    const fontSizeTexto = isSmallScreen ? 13 : 14;
    const fontSizeErro = isSmallScreen ? 11 : 12;
    const fontSizeContador = isSmallScreen ? 10 : 11;

    return (
      <Controller
        name={nome}
        control={controle}
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
          const caracteresUsados = value?.length || 0;
          const percentualPreenchimento = maxCaracteres 
            ? Math.round((caracteresUsados / maxCaracteres) * 100)
            : 0;

          // Função para limitar caracteres
          const handleChangeText = (text: string) => {
            if (maxCaracteres && text.length > maxCaracteres) {
              onChange(text.slice(0, maxCaracteres));
            } else {
              onChange(text);
            }
          };

          return (
            <View className="mb-6">
              {/* Rótulo */}
              <Text
                className="font-semibold text-slate-700 mb-2"
                style={{ fontSize: fontSizeRotulo }}
              >
                {rotulo}
              </Text>

              {/* TextInput */}
              <TextInput
                ref={ref}
                value={value}
                onChangeText={handleChangeText}
                onBlur={onBlur}
                placeholder={placeholder}
                multiline
                numberOfLines={isSmallScreen ? Math.max(3, numeroLinhas - 1) : numeroLinhas}
                placeholderTextColor="#cbd5e1"
                editable={true}
                selectTextOnFocus={false}
                textAlignVertical="top"
                maxLength={maxCaracteres}
                className={`border-2 rounded-xl p-4 font-normal ${
                  error
                    ? 'border-red-600 bg-red-50'
                    : 'border-slate-200 bg-white'
                }`}
                style={{
                  minHeight: alturaMinima,
                  fontSize: fontSizeTexto,
                  maxHeight: isSmallScreen ? 200 : 300, // Evita crescimento infinito
                }}
              />

              {/* Contador de caracteres */}
              {mostrarContador && maxCaracteres && (
                <View className="flex-row justify-between items-center mt-2 px-1">
                  <Text
                    className={`font-medium ${
                      percentualPreenchimento > 90
                        ? 'text-orange-600'
                        : 'text-slate-500'
                    }`}
                    style={{ fontSize: fontSizeContador }}
                  >
                    {caracteresUsados}/{maxCaracteres}
                  </Text>
                  {/* Barra de progresso visual */}
                  <View className="flex-1 h-1 bg-slate-200 rounded-full ml-3">
                    <View
                      className={`h-full rounded-full ${
                        percentualPreenchimento > 90
                          ? 'bg-orange-500'
                          : 'bg-slate-400'
                      }`}
                      style={{
                        width: `${percentualPreenchimento}%`,
                      }}
                    />
                  </View>
                </View>
              )}

              {/* Mensagem de erro */}
              {error && (
                <Text
                  className="text-red-600 font-medium mt-2"
                  style={{ fontSize: fontSizeErro }}
                >
                  {error.message}
                </Text>
              )}

              {/* Texto de ajuda */}
              {!error && (
                <Text
                  className="text-xs text-slate-500 mt-1"
                  style={{ fontSize: fontSizeContador }}
                >
                  Digite com clareza para acelerar a resolução
                </Text>
              )}
            </View>
          );
        }}
      />
    );
  }
);

CampoTextoArea.displayName = 'CampoTextoArea';
