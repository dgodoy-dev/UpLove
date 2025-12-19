import { Stack } from "expo-router";
import { StatusBar, useColorScheme, View } from "react-native";
import { ThemeProvider, useTheme } from "../theme/ThemeContext";
import { DatabaseProvider } from "../services/database/DatabaseContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SystemUI from "expo-system-ui";
import { HeaderTitle } from "@react-navigation/elements";

function RootStack() {
  const { colors } = useTheme();
  SystemUI.setBackgroundColorAsync(colors.background);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        presentation: "card",
        animation: "fade",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="relationship-settings"
        options={{
          headerTitle: "Relationship",
          headerShown: true,
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.background },
        }}
      />
      <Stack.Screen
        name="person-details"
        options={{
          headerTitle: "Person Details",
          headerShown: true,
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.background },
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const mode = useColorScheme();
  return (
    <>
      <StatusBar
        barStyle={mode === "light" ? "dark-content" : "light-content"}
      />
      <ThemeProvider scheme={null}>
        <QueryClientProvider client={new QueryClient()}>
          <DatabaseProvider>
            <RootStack />
          </DatabaseProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}
