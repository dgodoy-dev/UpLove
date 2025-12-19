import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useTheme } from "@/src/theme/ThemeContext";
import { SPACING } from "@/src/theme/spacing";
import AppText from "@/src/components/AppText";
import useRelationship from "@/src/hooks/database/useRelationship";
import usePillars from "@/src/hooks/database/usePillars";
import Relationship from "@/src/entities/Relationship/Relatioship";
import Button from "@/src/components/Button";
import RelationshipHeader from "@/src/components/entity/RelationshipHeader";
import PillarCard from "@/src/components/entity/PillarCard";
import usePeople from "@/src/hooks/database/usePeople";
import useUpLove from "@/src/hooks/database/useUpLove";
import PersonCard from "@/src/components/entity/PersonCard";
import UpLoveCard from "@/src/components/entity/UpLoveCard";
import { useRouter } from "expo-router";

export default function HomePage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { getRelationshipMetadata, initializeRelationship } = useRelationship();
  const pillarsQuery = usePillars();
  const peopleQuery = usePeople();
  const { getAllUpLoves } = useUpLove();

  const isLoading =
    getRelationshipMetadata.isLoading ||
    pillarsQuery.isLoading ||
    peopleQuery.isLoading ||
    getAllUpLoves.isLoading;

  const isRefreshing =
    getRelationshipMetadata.isFetching ||
    pillarsQuery.isFetching ||
    peopleQuery.isFetching ||
    getAllUpLoves.isFetching;

  const handleRefresh = () => {
    getRelationshipMetadata.refetch();
    pillarsQuery.refetch();
    peopleQuery.refetch();
    getAllUpLoves.refetch();
  };

  // Show loading state
  if (isLoading) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <AppText
          text="Loading your relationship..."
          variant="secondary"
          typography="body"
        />
      </View>
    );
  }

  const relationshipMetadata = getRelationshipMetadata.data;

  // Show empty state - no relationship initialized
  if (!relationshipMetadata) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <View style={styles.emptyState}>
          <AppText text="Welcome to UpLove" variant="primary" typography="h1" />
          <AppText
            text="Start by creating your relationship"
            variant="secondary"
            typography="body"
          />
          <Button
            title="Initialize Relationship"
            onPress={() => initializeRelationship.mutate("My Relationship")}
            loading={initializeRelationship.isPending}
            variant="primary"
          />
        </View>
      </View>
    );
  }

  const pillars = pillarsQuery.data || [];
  const people = peopleQuery.data || [];
  const upLoves = getAllUpLoves.data || [];
  const relationship = new Relationship(
    relationshipMetadata.name,
    relationshipMetadata.name,
    people,
    pillars,
    upLoves
  );

  // Sort pillars by satisfaction (lowest first to highlight areas needing attention)
  const sortedPillars = [...pillars].sort(
    (a, b) => a.satisfaction - b.satisfaction
  );

  // Get top 3 pillars needing attention
  const pillarsNeedingAttention = sortedPillars.slice(0, pillars.length / 2);

  // Get top 3 strongest pillars
  const strongestPillars = sortedPillars
    .slice(pillars.length / 2)
    .sort((a, b) => b.satisfaction - a.satisfaction);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing && !isLoading}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
        />
      }
    >
      {/* Relationship Header */}
      <RelationshipHeader
        relationship={relationship}
        onPress={() => router.push("/relationship-settings")}
      />

      {/* Pillars Needing attention and strong */}
      {pillars.length > 0 ? (
        <>
          {/* Pillars exist */}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppText
                text="Areas Needing Attention"
                variant="primary"
                typography="h2"
              />
              <AppText
                text="Focus on improving these pillars"
                variant="secondary"
                typography="caption"
              />
            </View>

            {pillarsNeedingAttention.map((pillar) => (
              <PillarCard
                key={pillar.id}
                pillar={pillar}
                onPress={() => {
                  console.log("Edit pillar:", pillar.name);
                }}
                showSatisfaction={true}
              />
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppText
                text="Your Strengths"
                variant="primary"
                typography="h2"
              />
              <AppText
                text="Keep nurturing these pillars"
                variant="secondary"
                typography="caption"
              />
            </View>

            {strongestPillars.map((pillar) => (
              <PillarCard
                key={pillar.id}
                pillar={pillar}
                onPress={() => {
                  console.log("View pillar:", pillar.name);
                }}
                showSatisfaction={true}
              />
            ))}
          </View>
        </>
      ) : (
        <>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppText text="Pillars" variant="primary" typography="h2" />
              <AppText
                text="No Pillars added"
                variant="secondary"
                typography="caption"
              />
            </View>
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: colors.surfaceMuted,
                  borderColor: colors.border,
                },
              ]}
            >
              <AppText
                text="Add pillars to your relationship to track them"
                variant="secondary"
                typography="body"
              />
            </View>
          </View>
        </>
      )}

      {/* Recent UpLoves */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText text="Recent uploves" variant="primary" typography="h2" />
          <AppText
            text={
              upLoves.length > 0
                ? `${upLoves.length} uploves registered`
                : "No uplove done yet"
            }
            variant="secondary"
            typography="caption"
          />
        </View>

        {upLoves.length > 0 ? (
          // Render list of recent UpLoves
          [...upLoves]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 4)
            .map((upLove) => (
              <UpLoveCard
                key={upLove.id}
                upLove={upLove}
                variant="default"
                onPress={() => console.log("View UpLove details: " + upLove.id)}
              />
            ))
        ) : (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: colors.surfaceMuted,
                borderColor: colors.border,
              },
            ]}
          >
            <AppText
              text="Uplove details about your relationship to track your progress"
              variant="secondary"
              typography="body"
            />
          </View>
        )}
      </View>

      {/* Bottom padding for safe area */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.xxl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  emptyState: {
    alignItems: "center",
    gap: SPACING.lg,
    maxWidth: 300,
  },
  section: {
    gap: SPACING.md,
  },
  sectionHeader: {
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  emptyCard: {
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  bottomPadding: {
    height: SPACING.xl,
  },
});
