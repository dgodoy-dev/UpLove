import { DimensionValue, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import AppText from "./AppText";

type CardVariant = "surface" | "highlight";

type Props = {
  title?: string;
  description?: string;
  variant?: CardVariant;
  width?: DimensionValue;
  children?: React.ReactNode;
  onPress?: () => void;
};

export default function Card({
  title,
  description,
  variant = "surface",
  width = "90%",
  children,
  onPress,
}: Props) {
  const theme = useTheme();

  const palette =
    variant === "highlight"
      ? {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
          textVariant: "onPrimary" as const,
        }
      : {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          textVariant: "primary" as const,
        };

  const CardContainer = onPress ? Pressable : View;

  const containerProps = onPress
    ? {
        onPress,
        style: ({ pressed }: { pressed: boolean }) => [
          styles.container,
          styles.shadow,
          {
            backgroundColor: palette.backgroundColor,
            borderColor: palette.borderColor,
            opacity: pressed ? 0.8 : 1,
            width,
          },
        ],
        accessibilityRole: "button" as const,
        accessible: true,
      }
    : {
        style: [
          styles.container,
          styles.shadow,
          {
            backgroundColor: palette.backgroundColor,
            borderColor: palette.borderColor,
            width,
          },
        ],
        accessibilityRole: "text" as const,
        accessible: true,
      };

  return (
    <CardContainer {...containerProps}>
      {title && (
        <AppText text={title} variant={palette.textVariant} typography="h3" />
      )}
      {description && (
        <AppText text={description} variant={palette.textVariant} />
      )}
      {children && children}
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});
