import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  DimensionValue,
  FlexAlignType,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import AppText from "./AppText";

type ButtonVariant = "primary" | "secondary";

type Props = {
  title: string;
  variant?: ButtonVariant;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  width?: DimensionValue;
  position?: FlexAlignType;
  accessibilityLabel?: string;
};

export default function Button({
  title,
  variant = "primary",
  onPress,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  width = "70%",
  position = "center",
  accessibilityLabel,
}: Props) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const handlePress = () => {
    if (isDisabled) return;

    // Add haptic feedback on supported platforms
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onPress();
  };

  const baseStyle: ViewStyle = {
    backgroundColor:
      variant === "secondary" ? theme.colors.secondary : theme.colors.primary,
    borderColor:
      variant === "secondary" ? theme.colors.border : theme.colors.primary,
    width,
    alignSelf: position,
    opacity: isDisabled ? 0.5 : 1,
  };

  // Get the appropriate color for the ActivityIndicator based on variant
  const indicatorColor =
    variant === "secondary" ? theme.colors.onSecondary : theme.colors.onPrimary;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isDisabled }}
      style={({ pressed }) => [
        styles.button,
        baseStyle,
        pressed && !isDisabled && styles.buttonPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={indicatorColor} />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <AppText
            text={title}
            variant={variant === "secondary" ? "onSecondary" : "onPrimary"}
          />
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
}

const MINIMUM_TOUCH_TARGET = Platform.select({
  ios: 44,
  android: 48,
  default: 44,
});

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    minHeight: MINIMUM_TOUCH_TARGET,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
