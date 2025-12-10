import AnimatedTextChip from "@/src/components/AnimatedTextChip";
import AppText from "@/src/components/AppText";
import Button from "@/src/components/Button";
import InputText from "@/src/components/InputText";
import ScoreSelector from "@/src/components/ScoreSelector";
import StatsPentagon from "@/src/components/StatsPentagon";
import Pillar from "@/src/entities/Relationship/Pillar";
import usePillars from "@/src/hooks/database/usePillars";
import useUpLove from "@/src/hooks/database/useUpLove";
import { useTheme } from "@/src/theme/ThemeContext";
import { useEffect, useReducer, useState } from "react";
import { FlatList, StyleSheet, View, ScrollView } from "react-native";

const pillarsBase: Pillar[] = [
  new Pillar("1", "Communication", "high", 1),
  new Pillar("2", "Security", "medium", 1),
  new Pillar("3", "Affection", "high", 1),
  new Pillar("4", "Awareness", "low", 1),
  new Pillar("5", "Fun", "very high", 1),
  new Pillar("6", "Sex", "very high", 1),
];

const textInfo = [""];

export default function FeelingsScreen() {
  const { data, isLoading, error } = usePillars();
  const { createUpLove } = useUpLove();
  const theme = useTheme();
  const [pillars, dispatch] = useReducer(reducer, []);
  const [step, setStep] = useState(1);
  const [reflection, setReflection] = useState(
    "Reflect about your relationship here..."
  );
  const [aspectsToImprove, improveDispatch] = useReducer(listReducer, []);
  const [aspectsToPraise, praiseDispatch] = useReducer(listReducer, []);
  const [toImproveText, setToImproveText] = useState("");
  const [toPraiseText, setToPraiseText] = useState("");

  // synchronize data to pillars
  useEffect(() => {
    if (!isLoading && data) {
      dispatch({ type: "set", payload: data });
    }
  }, [isLoading, data]);

  // delay normal render until data is loaded
  const isHydrating = isLoading || !data || pillars.length === 0;
  if (isHydrating) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      ></View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <AppText text={`Error: ${String(error)}`} typography="h3" />
      </View>
    );
  }

  const names = pillars.map((pillar) => pillar.name);
  const values = pillars;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Feelings registry */}
      {step === 1 && (
        <ScrollView>
          <StatsPentagon
            labels={names}
            values={values.map((pillar) => pillar.satisfaction)}
          />
          <View>
            {values.map((pillar) => (
              <ScoreSelector
                key={pillar.id}
                label={pillar.name}
                value={pillar.satisfaction || 1}
                onChange={(value) =>
                  dispatch({
                    type: "update",
                    payload: { id: pillar.id, satisfaction: value },
                  })
                }
              />
            ))}
          </View>
          <Button
            title="Next"
            width={"70%"}
            onPress={() => setStep(2)}
          ></Button>
        </ScrollView>
      )}

      {/*  Weekly reflection registry */}
      {step === 2 && (
        <>
          <InputText
            variant="default"
            value={reflection}
            clearable={true}
            label="Weekly relatioship reflection"
            multiline={true}
            numberOfLines={15}
            onChange={(value: string) => setReflection(value)}
          />
          {/* Ctrl buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: "10",
            }}
          >
            <Button title="Back" width="35%" onPress={() => setStep(1)} />
            <Button title="Next" width="35%" onPress={() => setStep(3)} />
          </View>
        </>
      )}

      {step === 3 && (
        <>
          {/* Aspect To Improve list */}
          <AppText text={"Aspects to Improve"} typography="h3" />
          <FlatList
            data={aspectsToImprove}
            contentContainerStyle={{ gap: 10 }}
            keyExtractor={(element) => element}
            renderItem={(element) => (
              <AnimatedTextChip
                value={element.item}
                selected={false}
                onSelect={() =>
                  improveDispatch({
                    type: "remove",
                    item: element.item,
                  })
                }
              />
            )}
          />
          <InputText
            variant="default"
            value={toImproveText}
            clearable={true}
            label="To Improve"
            // multiline={true}
            onChange={(value: string) => setToImproveText(value)}
            onSubmitEditing={() =>
              improveDispatch({ type: "add", item: toImproveText })
            }
          />

          {/* Aspect To Praise list */}
          <AppText text={"Aspects to Praise"} typography="h3" />
          <FlatList
            data={aspectsToPraise}
            contentContainerStyle={{ gap: 10 }}
            keyExtractor={(element) => element}
            renderItem={(element) => (
              <AnimatedTextChip
                value={element.item}
                selected={false}
                onSelect={() =>
                  praiseDispatch({
                    type: "remove",
                    item: element.item,
                  })
                }
              />
            )}
          />
          <InputText
            variant="default"
            value={toPraiseText}
            clearable={true}
            label="To Improve"
            // multiline={true}
            onChange={(value: string) => setToPraiseText(value)}
            onSubmitEditing={() =>
              praiseDispatch({ type: "add", item: toPraiseText })
            }
          />

          {/* Ctrl buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: "10",
            }}
          >
            <Button title="Back" width="35%" onPress={() => setStep(2)} />
            <Button
              title="Submit"
              width="35%"
              onPress={() => {
                createUpLove.mutate({
                  pillarsIds: pillars.map((p) => p.id),
                  toImprove: aspectsToImprove,
                  toPraise: aspectsToPraise,
                });

                setStep(1);
              }}
            />
          </View>
        </>
      )}
    </View>
  );
}

type PillarArgs = ConstructorParameters<typeof Pillar>;

type PillarAction =
  | { type: "set"; payload: Pillar[] }
  | { type: "upsert"; payload: PillarArgs }
  | { type: "update"; payload: { id: string; satisfaction: number } };

function reducer(state: Pillar[], action: PillarAction) {
  switch (action.type) {
    case "set":
      return [...action.payload];

    case "upsert":
      const [upId, upName, upPriority, upSatisfaction] = action.payload;
      const existingIndex = state.findIndex((p) => p.id === upId);
      const newPillar = new Pillar(upId, upName, upPriority, upSatisfaction);
      if (existingIndex >= 0) {
        return [
          ...state.slice(0, existingIndex),
          newPillar,
          ...state.slice(existingIndex + 1),
        ];
      }
      return [...state, newPillar];
    case "update":
      const { id, satisfaction } = action.payload;
      return state.map((pillar) =>
        pillar.id === id
          ? new Pillar(pillar.id, pillar.name, pillar.priority, satisfaction)
          : pillar
      );
  }
}

type ListAction = {
  type: "add" | "remove";
  item: string;
};

function listReducer(state: string[], action: ListAction) {
  switch (action.type) {
    case "add":
      return [...state, action.item];
    case "remove":
      return state.filter((value) => value !== action.item);
    default:
      throw new Error(
        "Action " + action.type + " is not supported in list reducer."
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    paddingBottom: 20,
  },
});
