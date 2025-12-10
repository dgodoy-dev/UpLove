import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useTheme } from "@/src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS, ICON_SIZE } from "@/src/theme/spacing";
import AppText from "../AppText";
import UpLove from "@/src/entities/UpLove/UpLove";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface UpLoveCardProps {
  upLove: UpLove;
  onPress?: () => void;
  variant?: "default" | "compact";
  showDetails?: boolean;
}

export default function UpLoveCard({
  upLove,
  onPress,
  variant = "default",
  showDetails = true,
}: UpLoveCardProps) {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    if (showDetails) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsExpanded(!isExpanded);
    } else if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  // Format date
  const formattedDate = new Date(upLove.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const toImproveCount = upLove.toImprove?.length || 0;
  const toPraiseCount = upLove.toPraise?.length || 0;
  const pillarsCount = upLove.pillars?.length || 0;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={!showDetails && !onPress}
      style={styles.touchable}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`UpLove from ${formattedDate}, ${pillarsCount} pillars${
        isExpanded ? ", showing details" : ""
      }`}
      accessibilityState={{ expanded: isExpanded }}
      accessibilityHint={
        showDetails
          ? isExpanded
            ? "Double tap to collapse"
            : "Double tap to expand"
          : onPress
          ? "Double tap to view details"
          : undefined
      }
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          variant === "compact" && styles.compact,
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.primary + "20",
              },
            ]}
          >
            <MaterialCommunityIcons
              name="heart-pulse"
              size={variant === "compact" ? 20 : 24}
              color={colors.primary}
            />
          </View>

          {/* Date and Stats */}
          <View style={styles.headerContent}>
            <AppText
              text={formattedDate}
              variant="primary"
              typography={variant === "compact" ? "bodyBold" : "h3"}
            />

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <MaterialCommunityIcons
                  name="pillar"
                  size={14}
                  color={colors.textSecondary}
                />
                <AppText
                  text={`${pillarsCount} ${
                    pillarsCount === 1 ? "pillar" : "pillars"
                  }`}
                  variant="secondary"
                  typography="caption"
                />
              </View>
            </View>
          </View>

          {/* Expand/Collapse indicator */}
          {showDetails && (
            <MaterialCommunityIcons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={24}
              color={colors.textSecondary}
            />
          )}
        </View>

        {/* Expanded Content */}
        {isExpanded && showDetails && (
          <View style={styles.expandedContent}>
            {/* To Improve Section */}
            {toImproveCount > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons
                    name="arrow-up-circle"
                    size={18}
                    color={colors.primary}
                  />
                  <AppText
                    text="To Improve"
                    variant="primary"
                    typography="bodyBold"
                  />
                </View>
                <View style={styles.itemsList}>
                  {upLove.toImprove.map((item, index) => (
                    <View
                      key={index}
                      style={[
                        styles.item,
                        { backgroundColor: colors.surfaceMuted },
                      ]}
                    >
                      <AppText
                        text={item}
                        variant="primary"
                        typography="body"
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* To Praise Section */}
            {toPraiseCount > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons
                    name="emoticon-happy"
                    size={18}
                    color={colors.success}
                  />
                  <AppText
                    text="To Praise"
                    variant="primary"
                    typography="bodyBold"
                  />
                </View>
                <View style={styles.itemsList}>
                  {upLove.toPraise.map((item, index) => (
                    <View
                      key={index}
                      style={[
                        styles.item,
                        { backgroundColor: colors.surfaceMuted },
                      ]}
                    >
                      <AppText
                        text={item}
                        variant="primary"
                        typography="body"
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Summary */}
            <View
              style={[
                styles.summary,
                {
                  backgroundColor: colors.primary + "10",
                  borderColor: colors.primary + "30",
                },
              ]}
            >
              <MaterialCommunityIcons
                name="information"
                size={16}
                color={colors.primary}
              />
              <AppText
                text={`${toImproveCount} improvement${
                  toImproveCount === 1 ? "" : "s"
                }, ${toPraiseCount} praise${toPraiseCount === 1 ? "" : "s"}`}
                variant="secondary"
                typography="caption"
              />
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: "100%",
  },
  container: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    gap: SPACING.lg,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  compact: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    gap: SPACING.xs,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  expandedContent: {
    gap: SPACING.lg,
  },
  section: {
    gap: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  itemsList: {
    gap: SPACING.sm,
  },
  item: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
  },
});
