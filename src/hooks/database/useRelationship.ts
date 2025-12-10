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
    getRelationshipMetadata,
  };
}
