// src/components/AnimatedChip.tsx

import { useTheme } from "@/src/theme/ThemeContext";
import * as Haptics from "expo-haptics";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type ChipVariant = "primary" | "secondary" | "transparent";

type AnimatedChipProps = {
  value: number;
  selected: boolean;
  variant?: ChipVariant;
  onSelect: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AnimatedChip({
  value,
  selected,
  variant = "primary",
  onSelect,
}: AnimatedChipProps) {
  const scale = useSharedValue(1);
  const theme = useTheme();

  // 🎨 Fondo base según variant + estado seleccionado
  // Memoized for performance optimization
  const chipBgColor = useMemo(() => {
    if (!selected) {
      // No seleccionado: fondo neutro para no robar protagonismo
      if (variant === "transparent") return theme.colors.transparent;
      return theme.colors.surface;
    }

    // Seleccionado: usamos los colores protagonistas
    if (variant === "secondary") return theme.colors.secondary;
    return theme.colors.primary; // default: primary
  }, [selected, variant, theme.colors]);

  // 🎨 Color de texto según estado
  // Memoized for performance optimization
  const chipTextColor = useMemo(() => {
    if (!selected) return theme.colors.text;
    if (variant === "secondary") return theme.colors.onSecondary;
    if (variant === "transparent") return theme.colors.text;
    return theme.colors.onPrimary;
  }, [selected, variant, theme.colors]);

  // 🎨 Borde (sutil, siempre neutro)
  // Memoized for performance optimization
  const chipBorderColor = useMemo(
    () => (selected ? theme.colors.transparent : theme.colors.border),
    [selected, theme.colors]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    // Provide haptic feedback for better tactile experience
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(1.1, { damping: 10 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      style={[
        styles.chip,
        {
          backgroundColor: chipBgColor,
          borderColor: chipBorderColor,
          // sombra un pelín más fuerte si está seleccionado
          shadowOpacity: selected ? 0.18 : 0.08,
          shadowRadius: selected ? 8 : 4,
          elevation: selected ? 4 : 2,
        },
        animatedStyle,
      ]}
      onPress={onSelect}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      // Accessibility enhancements for screen readers
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`Score ${value}`}
      accessibilityHint="Tap to select this score"
      // Touch target sizing: expands touch area to meet iOS minimum (44x44)
      // without changing visual appearance (34x34)
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    >
      <Text style={[styles.chipText, { color: chipTextColor }]}>{value}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: 34,
    height: 34,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000", // esto sí puede quedar hardcodeado, es un efecto, no parte del brand
  },
  chipText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
