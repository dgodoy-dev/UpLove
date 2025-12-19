import { useDatabase } from "@/src/services/database/DatabaseContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useRelationship() {
  const { db, initializing } = useDatabase();
  const queryClient = useQueryClient();

  const initializeRelationship = useMutation({
    mutationKey: ["initializeRelationship"],
    mutationFn: (name: string) => {
      if (!db) throw new Error("Database not initialized");
      return db.initializeRelationshipMetadata(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationshipMetadata"] });
    },
    onError: () => alert("Relationship not initialized"),
  });

  const updateRelationship = useMutation({
    mutationKey: ["updateRelationship"],
    mutationFn: (name: string) => {
      if (!db) throw new Error("Database not initialized");
      return db.updateRelationshipMetadata(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationshipMetadata"] });
    },
    onError: () => alert("Failed to update relationship"),
  });

  const deleteRelationship = useMutation({
    mutationKey: ["deleteRelationship"],
    mutationFn: async () => {
      if (!db) throw new Error("Database not initialized");

      const dbInstance = (db as any).db;
      if (!dbInstance) throw new Error("Database instance not found");

      await dbInstance.withTransactionAsync(async () => {
        await dbInstance.execAsync("DELETE FROM up_love_items");
        await dbInstance.execAsync("DELETE FROM up_love_pillars");
        await dbInstance.execAsync("DELETE FROM up_loves");
        await dbInstance.execAsync("DELETE FROM pillars");
        await dbInstance.execAsync("DELETE FROM commitments");
        await dbInstance.execAsync("DELETE FROM necessities");
        await dbInstance.execAsync("DELETE FROM persons");
        await dbInstance.execAsync("DELETE FROM relationship_metadata");
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: () => alert("Failed to delete relationship"),
  });

  const getRelationshipMetadata = useQuery({
    queryKey: ["relationshipMetadata"],
    queryFn: () => {
      if (!db) throw new Error("Database not initialized");
      return db.getRelationshipMetadata();
    },
    enabled: !initializing && !!db,
  });

  return {
    initializeRelationship,
    updateRelationship,
    deleteRelationship,
    getRelationshipMetadata,
  };
}
