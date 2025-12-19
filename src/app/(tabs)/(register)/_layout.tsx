import { useTheme } from "@/src/theme/ThemeContext";
import { Stack } from "expo-router";

export default function RegisterLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.primary,
        contentStyle: { backgroundColor: theme.colors.background },
        presentation: "card",
      }}
    >
      <Stack.Screen name="index" options={{ title: "UpLove" }} />
    </Stack>
  );
}
