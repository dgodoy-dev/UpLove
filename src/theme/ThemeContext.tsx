import { darkTheme, lightTheme } from "@/src/theme/theme";
import { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

export const ThemeContext = createContext(lightTheme);

type Props = {
  children: React.ReactNode;
  scheme: "light" | "dark" | null;
};
export function ThemeProvider({ children, scheme }: Props) {
  const systemScheme = useColorScheme();
  const mode = scheme ?? systemScheme ?? "light";

  const theme = mode === "light" ? lightTheme : darkTheme;

  return <ThemeContext value={theme}>{children}</ThemeContext>;
}
export default ThemeContext;

export function useTheme() {
  return useContext(ThemeContext);
}
