import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IconeLucide } from "../icones";

interface BotaoVoltarProps {
  onPress?: () => void;
  cor?: string;
  corFundo?: string;
  tamanho?: number;
}

export const BotaoVoltar: React.FC<BotaoVoltarProps> = ({
  onPress,
  cor = "#ffffff",
  corFundo = "rgba(255, 255, 255, 0.15)",
  tamanho = 20,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="w-10 h-10 rounded-full items-center justify-center"
      style={{ backgroundColor: corFundo }}
      activeOpacity={0.7}
      accessibilityLabel="Voltar"
      accessibilityRole="button"
    >
      <IconeLucide id="anterior" tamanho={tamanho} cor={cor} />
    </TouchableOpacity>
  );
};
