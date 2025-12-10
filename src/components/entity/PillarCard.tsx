import React, { useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useTheme } from "@/src/theme/ThemeContext";
import { withOpacity } from "@/src/theme/theme";
import { SPACING, BORDER_RADIUS, ICON_SIZE } from "@/src/theme/spacing";
import AppText from "../AppText";
import Pillar from "@/src/entities/Relationship/Pillar";
import { Priority } from "@/src/entities/types/Priority";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface PillarCardProps {
  pillar: Pillar;
  onPress?: () => void;
  showSatisfaction?: boolean;
  variant?: "default" | "compact";
}

// Priority configuration using theme colors
const getPriorityConfig = (
  priority: Priority,
  colors: any
): { label: string; color: string; icon: string } => {
  const configs: Record<
    Priority,
    { label: string; colorKey: keyof typeof colors; icon: string }
  > = {
    "very low": {
      label: "Very Low",
      colorKey: "priorityVeryLow",
      icon: "chevron-down",
    },
    low: { label: "Low", colorKey: "priorityLow", icon: "chevron-down" },
    medium: { label: "Medium", colorKey: "priorityMedium", icon: "minus" },
    high: { label: "High", colorKey: "priorityHigh", icon: "chevron-up" },
    "very high": {
      label: "Very High",
      colorKey: "priorityVeryHigh",
      icon: "chevron-double-up",
    },
  };

  const config = configs[priority];
  return {
    ...config,
    color: colors[config.colorKey],
  };
};

const PILLAR_ICONS: Record<
  string,
  keyof typeof MaterialCommunityIcons.glyphMap
> = {
  Communication: "message-text",
  Security: "shield-check",
  Affection: "heart",
  Awareness: "lightbulb-on",
  Fun: "emoticon-happy",
  Sex: "fire",
};

export default function PillarCard({
  pillar,
  onPress,
  showSatisfaction = true,
  variant = "default",
}: PillarCardProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const priorityConfig = useMemo(
    () => getPriorityConfig(pillar.priority, colors),
    [pillar.priority, colors]
  );

  const iconName = PILLAR_ICONS[pillar.name] || "star";

  // Calculate satisfaction percentage and color (memoized)
  const satisfactionPercent = useMemo(
    () => (pillar.satisfaction / 10) * 100,
    [pillar.satisfaction]
  );

  const satisfactionColor = useMemo(() => {
    if (pillar.satisfaction >= 8) return colors.success;
    if (pillar.satisfaction >= 5) return colors.priorityMedium;
    return colors.error;
  }, [
    pillar.satisfaction,
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
      accessibilityRole="button"
      accessibilityLabel={`${pillar.name} pillar, ${
        priorityConfig.label
      } priority${
        showSatisfaction
          ? `, satisfaction ${pillar.satisfaction} out of 10`
          : ""
      }`}
      accessibilityHint={onPress ? "Double tap to edit" : undefined}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: withOpacity(colors.primary, 0.2),
          },
        ]}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={variant === "compact" ? ICON_SIZE.sm : ICON_SIZE.md}
          color={colors.primary}
        />
      </View>

      {/* Pillar Info */}
      <View style={styles.info}>
        <AppText
          text={pillar.name}
          variant="primary"
          typography={variant === "compact" ? "body" : "h3"}
        />

        {/* Priority Badge */}
        <View style={styles.row}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: withOpacity(priorityConfig.color, 0.3) },
            ]}
          >
            <MaterialCommunityIcons
              name={priorityConfig.icon as any}
              size={12}
              color={priorityConfig.color}
            />
            <AppText
              text={priorityConfig.label}
              variant="secondary"
              typography="caption"
            />
          </View>
        </View>
      </View>

      {/* Satisfaction Score */}
      {showSatisfaction && variant === "default" && (
        <View style={styles.satisfactionContainer}>
          <AppText
            text={pillar.satisfaction.toString()}
            variant="primary"
            typography="h2"
          />
          <AppText text="/10" variant="secondary" typography="caption" />

          {/* Progress Bar */}
          <View
            style={[
              styles.progressBar,
              { backgroundColor: colors.surfaceMuted },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${satisfactionPercent}%`,
                  backgroundColor: satisfactionColor,
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Chevron indicator */}
      {onPress && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={colors.textSecondary}
        />
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
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    gap: SPACING.md,
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
    gap: SPACING.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
    gap: SPACING.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    opacity: 0.85,
  },
  satisfactionContainer: {
    alignItems: "center",
    gap: SPACING.xs,
    minWidth: 60,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  progressBar: {
    width: 48,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
});
