import { StyleProp, Text, TextStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "bodyBold"
  | "caption"
  | "button";

type Props = {
  text: string;
  variant?: "primary" | "secondary" | "onPrimary" | "onSecondary";
  typography?: TypographyVariant;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  ellipsizeMode?: "head" | "middle" | "tail" | "clip";
  accessibilityRole?: "text" | "header";
  accessibilityLevel?: number;
};

const typographyStyles = {
  h1: { fontSize: 32, fontWeight: "700" as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: "600" as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: "600" as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
  bodyBold: { fontSize: 16, fontWeight: "600" as const, lineHeight: 24 },
  caption: { fontSize: 12, fontWeight: "400" as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: "600" as const, lineHeight: 20 },
};

export default function AppText({
  text,
  variant = "primary",
  typography = "body",
  style,
  numberOfLines,
  ellipsizeMode,
  accessibilityRole = "text",
  accessibilityLevel,
}: Props) {
  const theme = useTheme();

  const palette = {
    primary: theme.colors.text,
    secondary: theme.colors.textSecondary,
    onPrimary: theme.colors.onPrimary,
    onSecondary: theme.colors.onSecondary,
  };

  const textColor = palette[variant] ?? palette.primary;
  const typographyStyle = typographyStyles[typography];

  return (
    <Text
      style={[typographyStyle, { color: textColor }, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      accessibilityRole={accessibilityRole}
      {...(accessibilityLevel && { accessibilityLevel })}
    >
      {text}
    </Text>
  );
}
