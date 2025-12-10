import Button from "@/src/components/Button";
import AppText from "@/src/components/AppText";
import { useDatabase } from "@/src/services/database/DatabaseContext";
import { seedDatabase } from "@/src/utils/seedDatabase";
import { clearAllData } from "@/src/utils/clearDatabase";
import { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "@/src/theme/ThemeContext";

export default function DevToolsScreen() {
  const { db, initializing } = useDatabase();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const resultBoxBg = theme.colors.surface;

  const handleSeed = async () => {
    if (!db) {
      setResult("❌ Database not initialized");
      return;
    }

    setLoading(true);
    setResult("🌱 Starting seed...");

    try {
      await seedDatabase(db);
      setResult("✅ Database seeded successfully!");
    } catch (error) {
      setResult(
        `❌ Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!db) {
      setResult("❌ Database not initialized");
      return;
    }

    Alert.alert(
      "Clear All Data?",
      "This will delete all data from the database but keep the schema. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            setResult("🗑️  Clearing all data...");

            try {
              await clearAllData(db);
              setResult("✅ All data cleared successfully!");
            } catch (error) {
              setResult(
                `❌ Error: ${
                  error instanceof Error ? error.message : String(error)
                }`
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (initializing) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <AppText text="Initializing database..." typography="body" />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <AppText text="🛠️ Development Tools" typography="h1" />

      {/* Seed Database Section */}
      <View style={styles.section}>
        <AppText text="Seed Database" typography="h3" />
        <AppText
          text="Populate the database with sample data for testing."
          typography="body"
        />
        <Button
          title={loading ? "Loading..." : "Seed Database"}
          onPress={handleSeed}
          disabled={loading || !db}
          width="100%"
        />
      </View>

      {/* Clear Data Section */}
      <View style={styles.section}>
        <AppText text="Clear All Data" typography="h3" />
        <AppText
          text="Delete all data from tables but keep the schema intact."
          typography="body"
        />
        <Button
          title={loading ? "Loading..." : "Clear All Data"}
          onPress={handleClearData}
          disabled={loading || !db}
          width="100%"
        />
      </View>

      {/* Result Box */}
      {result && (
        <View style={[styles.resultBox, { backgroundColor: resultBoxBg }]}>
          <AppText text={result} typography="body" />
        </View>
      )}

      {/* Info Section */}
      <View style={styles.info}>
        <AppText text="Seed Data Includes:" typography="h3" />
        <AppText text="• 1 Relationship (Sonia & Dani)" typography="body" />
        <AppText text="• 2 Persons" typography="body" />
        <AppText text="• 6 Necessities" typography="body" />
        <AppText text="• 6 Pillars" typography="body" />
        <AppText text="• 4 Todos" typography="body" />
        <AppText text="• 4 ToKeeps" typography="body" />
        <AppText text="• 2 UpLoves" typography="body" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 15,
  },
  section: {
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  resultBox: {
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  info: {
    marginTop: 20,
    gap: 8,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
});
