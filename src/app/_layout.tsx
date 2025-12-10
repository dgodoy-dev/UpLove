import { Stack } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";
import { ThemeProvider } from "../theme/ThemeContext";
import { DatabaseProvider } from "../services/database/DatabaseContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <>
      <StatusBar
        barStyle={colorScheme === "light" ? "dark-content" : "light-content"}
      />
      <ThemeProvider scheme={null}>
        <QueryClientProvider client={new QueryClient()}>
          <DatabaseProvider>
            <Stack screenOptions={{ headerShown: false }}></Stack>
          </DatabaseProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}
