import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function SkeletonOrdem() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      className="bg-white rounded-2xl border border-slate-200 p-4 mb-3"
      style={{ opacity }}
    >
      <View className="h-4 w-24 bg-slate-200 rounded mb-3" />
      <View className="h-3 w-40 bg-slate-200 rounded mb-2" />
      <View className="h-3 w-32 bg-slate-200 rounded mb-2" />
      <View className="h-3 w-28 bg-slate-200 rounded" />
    </Animated.View>
  );
}
