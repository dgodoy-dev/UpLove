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
import { withOpacity } from "@/src/theme/theme";
import {
  SPACING,
  BORDER_RADIUS,
  ICON_SIZE,
  TOUCH_TARGET,
} from "@/src/theme/spacing";
import AppText from "../AppText";
import Necessity from "@/src/entities/Person/Necessity";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface NecessityItemProps {
  necessity: Necessity;
  onPress?: () => void;
  onDelete?: () => void;
  variant?: "default" | "compact";
  expandable?: boolean;
}

export default function NecessityItem({
  necessity,
  onPress,
  onDelete,
  variant = "default",
  expandable = true,
}: NecessityItemProps) {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    if (expandable && necessity.description) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsExpanded(!isExpanded);
    } else if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onDelete();
    }
  };

  const hasDescription = !!necessity.description;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={!expandable && !onPress}
      style={styles.touchable}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${necessity.name}${
        hasDescription ? `, ${isExpanded ? "expanded" : "collapsed"}` : ""
      }`}
      accessibilityValue={{ text: necessity.description || "" }}
      accessibilityState={{ expanded: isExpanded }}
      accessibilityHint={
        expandable && hasDescription
          ? isExpanded
            ? "Double tap to collapse"
            : "Double tap to expand"
          : onPress
          ? "Double tap to edit"
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
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: withOpacity(colors.secondary, 0.2),
            },
          ]}
        >
          <MaterialCommunityIcons
            name="heart-outline"
            size={variant === "compact" ? ICON_SIZE.xs : ICON_SIZE.sm}
            color={colors.secondary}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <AppText
              text={necessity.name}
              variant="primary"
              typography={variant === "compact" ? "body" : "bodyBold"}
            />

            {/* Expand indicator */}
            {expandable && hasDescription && (
              <MaterialCommunityIcons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color={colors.textSecondary}
              />
            )}
          </View>

          {/* Description (expandable) */}
          {hasDescription && isExpanded && (
            <AppText
              text={necessity.description}
              variant="secondary"
              typography="body"
            />
          )}
        </View>

        {/* Delete button */}
        {onDelete && (
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Delete necessity"
          >
            <View
              style={[
                styles.deleteButtonContainer,
                { backgroundColor: withOpacity(colors.error, 0.15) },
              ]}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={ICON_SIZE.sm}
                color={colors.error}
              />
            </View>
          </TouchableOpacity>
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
    flexDirection: "row",
    alignItems: "flex-start",
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    gap: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  compact: {
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  content: {
    flex: 1,
    gap: SPACING.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SPACING.sm,
  },
  deleteButton: {
    padding: SPACING.sm,
    minWidth: TOUCH_TARGET.minimum,
    minHeight: TOUCH_TARGET.minimum,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BORDER_RADIUS.lg,
  },
});
