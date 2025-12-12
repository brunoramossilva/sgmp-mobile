import { useEffect, useRef } from "react";
import { Animated, ViewStyle, StyleProp } from "react-native";

interface SkeletonBlocoProps {
  height?: number;
  width?: number | `${number}%`;
  style?: StyleProp<ViewStyle>;
}

export default function SkeletonBloco({
  height = 60,
  width = "100%",
  style,
}: SkeletonBlocoProps) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      className="bg-slate-200 rounded-2xl mb-3"
      style={[{ height, width, opacity } as ViewStyle, style]}
    />
  );
}
