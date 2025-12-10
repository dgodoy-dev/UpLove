import { useDatabase } from "@/src/services/database/DatabaseContext";
import { useQuery } from "@tanstack/react-query";

export default function usePillars() {
  const { db, initializing: dbInitializing, error: dbError } = useDatabase();
  return useQuery({
    queryKey: ["pillars"],
    queryFn: () => {
      if (!db) throw new Error("Database not initialized");
      return db.getAllPillars();
    },
    enabled: !dbInitializing && !!db,
  });
}
