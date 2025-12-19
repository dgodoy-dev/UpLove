import { useDatabase } from "@/src/services/database/DatabaseContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useNecessities() {
  const { db, initializing: dbInitializing, error: dbError } = useDatabase();
  const queryClient = useQueryClient();

  const createNecessity = useMutation({
    mutationKey: ["createNecessity"],
    mutationFn: ({
      personId,
      name,
      description,
    }: {
      personId: string;
      name: string;
      description: string;
    }) => {
      if (!db) throw new Error("Database not initialized");
      return db.createNecessity(personId, name, description);
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific person query to refetch with new necessity
      queryClient.invalidateQueries({ queryKey: ["person", variables.personId] });
      // Also invalidate the people list
      queryClient.invalidateQueries({ queryKey: ["people"] });
    },
    onError: (error) => {
      console.error("Failed to create necessity:", error);
    },
  });

  const deleteNecessity = useMutation({
    mutationKey: ["deleteNecessity"],
    mutationFn: ({
      necessityId,
      personId,
    }: {
      necessityId: string;
      personId: string;
    }) => {
      if (!db) throw new Error("Database not initialized");
      return db.deleteNecessity(necessityId);
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific person query to refetch
      queryClient.invalidateQueries({ queryKey: ["person", variables.personId] });
      // Also invalidate the people list
      queryClient.invalidateQueries({ queryKey: ["people"] });
    },
    onError: (error) => {
      console.error("Failed to delete necessity:", error);
    },
  });

  return {
    createNecessity,
    deleteNecessity,
    isInitializing: dbInitializing,
    dbError,
  };
}
