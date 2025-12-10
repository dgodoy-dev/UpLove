import UpLove from "@/src/entities/UpLove/UpLove";
import { useDatabase } from "@/src/services/database/DatabaseContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

type CreateUpLoveInput = {
  pillarsIds: string[];
  toImprove: string[];
  toPraise: string[];
};

export default function useUpLove() {
  const { db } = useDatabase();
  const queryClient = useQueryClient();

  const createUpLove = useMutation<UpLove, Error, CreateUpLoveInput>({
    mutationKey: ["createUpLove"],
    mutationFn: async ({ pillarsIds, toImprove, toPraise }) => {
      if (!db) throw new Error("Database not initialized");
      return db.createUpLove(new Date(), pillarsIds, toImprove, toPraise);
    },
    onSuccess: () => {
      Alert.alert("UpLove created");
      // invalida las queries que dependen de esto
      queryClient.invalidateQueries({ queryKey: ["upLoves"] });
    },
    onError: () => {
      Alert.alert("Could not create UpLove");
    },
  });

  const getAllUpLoves = useQuery({
    queryKey: ["upLoves"],
    queryFn: () => {
      if (!db) throw new Error("Database not initialized");
      return db.getAllUpLoves();
    },
  });

  return { createUpLove, getAllUpLoves };
}
