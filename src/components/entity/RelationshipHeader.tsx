import React, { useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useTheme } from "@/src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS, ICON_SIZE } from "@/src/theme/spacing";
import AppText from "../AppText";
import Relationship from "@/src/entities/Relationship/Relatioship";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { withOpacity } from "@/src/theme/theme";

interface RelationshipHeaderProps {
  relationship: Relationship;
  onPress?: () => void;
  variant?: "default" | "compact";
  showStats?: boolean;
}

export default function RelationshipHeader({
  relationship,
  onPress,
  variant = "default",
  showStats = true,
}: RelationshipHeaderProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const peopleCount = relationship.people?.length || 0;
  const pillarsCount = relationship.pillars?.length || 0;
  const upLovesCount = relationship.upLoves?.length || 0;

  // Calculate average pillar satisfaction (memoized)
  const averageSatisfaction = useMemo(
    () =>
      relationship.pillars.length > 0
        ? (
            relationship.pillars.reduce(
              (sum, pillar) => sum + pillar.satisfaction,
              0
            ) / pillarsCount
          ).toFixed(1)
        : "0.0",
    [relationship.pillars]
  );

  const satisfactionColor = useMemo(() => {
    const avg = parseFloat(averageSatisfaction);
    if (avg >= 8) return colors.success;
    if (avg >= 5) return colors.priorityMedium;
    return colors.error;
  }, [
    averageSatisfaction,
    colors.success,
    colors.priorityMedium,
    colors.error,
  ]);

  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        variant === "compact" && styles.compact,
      ]}
      accessible={true}
      accessibilityRole={onPress ? "button" : "header"}
      accessibilityLabel={`Relationship: ${relationship.name}${
        showStats
          ? `, ${peopleCount} people, ${pillarsCount} pillars, ${upLovesCount} Uploves, average satisfaction ${averageSatisfaction} out of 10`
          : ""
      }`}
      accessibilityHint={onPress ? "Double tap to edit" : undefined}
    >
      {/* Top Section: Icon and Name */}
      <View style={styles.topSection}>
        {/* Heart Icon */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: withOpacity(colors.primary, 0.2),
            },
          ]}
        >
          <MaterialCommunityIcons
            name="heart-multiple"
            size={variant === "compact" ? 28 : 36}
            color={colors.primary}
          />
        </View>

        {/* Relationship Name */}
        <View style={styles.nameSection}>
          <AppText
            text={relationship.name}
            variant="primary"
            typography={variant === "compact" ? "h3" : "h2"}
          />
        </View>

        {/* Edit Indicator */}
        {onPress && (
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={colors.textSecondary}
          />
        )}
      </View>

      {/* Stats Section */}
      {showStats && variant === "default" && (
        <View style={styles.statsSection}>
          {/* Average Satisfaction */}
          <View
            style={[
              styles.satisfactionCard,
              {
                backgroundColor: colors.surfaceMuted,
              },
            ]}
          >
            <View style={styles.satisfactionContent}>
              <MaterialCommunityIcons
                name="chart-line"
                size={ICON_SIZE.sm}
                color={satisfactionColor}
              />
              <View style={styles.satisfactionText}>
                <AppText
                  text="Avg. Satisfaction"
                  variant="secondary"
                  typography="caption"
                />
                <View style={styles.scoreRow}>
                  <AppText
                    text={averageSatisfaction}
                    variant="primary"
                    typography="h2"
                  />
                  <AppText text="/10" variant="secondary" typography="body" />
                </View>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {/* People Count */}
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="account-multiple"
                size={20}
                color={colors.primary}
              />
              <View style={styles.statText}>
                <AppText
                  text={peopleCount.toString()}
                  variant="primary"
                  typography="h3"
                />
                <AppText
                  text={peopleCount === 1 ? "Person" : "People"}
                  variant="secondary"
                  typography="caption"
                />
              </View>
            </View>

            {/* Pillars Count */}
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="pillar"
                size={20}
                color={colors.secondary}
              />
              <View style={styles.statText}>
                <AppText
                  text={pillarsCount.toString()}
                  variant="primary"
                  typography="h3"
                />
                <AppText
                  text={pillarsCount === 1 ? "Pillar" : "Pillars"}
                  variant="secondary"
                  typography="caption"
                />
              </View>
            </View>

            {/* UpLoves Count */}
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="heart-pulse"
                size={20}
                color={colors.primary}
              />
              <View style={styles.statText}>
                <AppText
                  text={upLovesCount.toString()}
                  variant="primary"
                  typography="h3"
                />
                <AppText
                  text={upLovesCount === 1 ? "Uplove" : "Uploves"}
                  variant="secondary"
                  typography="caption"
                />
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.touchable}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  touchable: {
    width: "100%",
  },
  container: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.xl,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  compact: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        // elevation: 3,
      },
    }),
  },
  nameSection: {
    flex: 1,
  },
  statsSection: {
    gap: SPACING.md,
  },
  satisfactionCard: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  satisfactionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  satisfactionText: {
    flex: 1,
    gap: SPACING.xs,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: SPACING.xs,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.md,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  statText: {
    gap: 2,
  },
});
