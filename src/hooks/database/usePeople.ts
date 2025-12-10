import { useDatabase } from "@/src/services/database/DatabaseContext";
import { useQuery } from "@tanstack/react-query";

export default function usePeople() {
  const { db, initializing: dbInitializing, error: dbError } = useDatabase();
  return useQuery({
    queryKey: ["people"],
    queryFn: () => {
      if (!db) throw new Error("Database not initialized");
      return db.getAllPersons();
    },
    enabled: !dbInitializing && !!db,
  });
}
