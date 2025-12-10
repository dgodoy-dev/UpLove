import { useTheme } from "@/src/theme/ThemeContext";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../../components/AppText";

export default function StatsPage() {
  const theme = useTheme();

  const [communication, setCommunication] = useState(5);
  return (
    <View
      style={[sytles.container, { backgroundColor: theme.colors.background }]}
    >
      <AppText text="Stats Page" variant="primary" />
    </View>
  );
}

const sytles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
