import { IDatabase } from "../services/database/IDatabase";
import * as SQLite from "expo-sqlite";
import { DATABASE_NAME, SCHEMA_SQL } from "../services/database/schema";

/**
 * Deletes all data from all tables
 * Keeps the schema intact
 */
export async function clearAllData(db: IDatabase) {
  console.log("🗑️  Clearing all data from database...");

  try {
    const dbInstance = (db as any).db as SQLite.SQLiteDatabase;

    if (!dbInstance) {
      throw new Error("Database not initialized");
    }

    await dbInstance.withTransactionAsync(async () => {
      // Delete in correct order due to foreign key constraints
      console.log("Deleting relationship_metadata...");
      await dbInstance.execAsync("DELETE FROM relationship_metadata");

      console.log("Deleting up_love_items...");
      await dbInstance.execAsync("DELETE FROM up_love_items");

      console.log("Deleting up_love_pillars...");
      await dbInstance.execAsync("DELETE FROM up_love_pillars");

      console.log("Deleting up_loves...");
      await dbInstance.execAsync("DELETE FROM up_loves");

      console.log("Deleting pillars...");
      await dbInstance.execAsync("DELETE FROM pillars");

      console.log("Deleting commitments...");
      await dbInstance.execAsync("DELETE FROM commitments");

      console.log("Deleting necessities...");
      await dbInstance.execAsync("DELETE FROM necessities");

      console.log("Deleting persons...");
      await dbInstance.execAsync("DELETE FROM persons");
    });

    console.log("✅ All data cleared successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    throw error;
  }
}
