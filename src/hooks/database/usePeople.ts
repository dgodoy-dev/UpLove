import { useDatabase } from "@/src/services/database/DatabaseContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function usePeople() {
  const { db, initializing: dbInitializing, error: dbError } = useDatabase();
  const queryClient = useQueryClient();

  const getAllPeople = useQuery({
    queryKey: ["people"],
    queryFn: () => {
      if (!db) throw new Error("Database not initialized");
      return db.getAllPersons();
    },
    enabled: !dbInitializing && !!db,
  });

  const getPerson = (id: string) =>
    useQuery({
      queryKey: ["person", id],
      queryFn: () => {
        if (!db) throw new Error("Database not initialized");
        return db.getPerson(id);
      },
      enabled: !dbInitializing && !!db && !!id,
    });

  const createPerson = useMutation({
    mutationKey: ["createPerson"],
    mutationFn: (name: string) => {
      if (!db) throw new Error("Database not initialized");
      return db.createPerson(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people"] });
    },
    onError: () => alert("Failed to create person"),
  });

  const updatePerson = useMutation({
    mutationKey: ["updatePerson"],
    mutationFn: ({ id, name }: { id: string; name: string }) => {
      if (!db) throw new Error("Database not initialized");
      return db.updatePerson(id, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people"] });
      queryClient.invalidateQueries({ queryKey: ["person"] });
    },
    onError: () => alert("Failed to update person"),
  });

  const deletePerson = useMutation({
    mutationKey: ["deletePerson"],
    mutationFn: (id: string) => {
      if (!db) throw new Error("Database not initialized");
      return db.deletePerson(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people"] });
    },
    onError: () => alert("Failed to delete person"),
  });

  return {
    ...getAllPeople,
    getPerson,
    createPerson,
    updatePerson,
    deletePerson,
  };
}
