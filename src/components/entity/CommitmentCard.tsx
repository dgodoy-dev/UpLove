import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Text,
} from "react-native";
import AppText from "../AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Commitment from "@/src/entities/Commitment/Commitment";
import ToDo from "@/src/entities/Commitment/ToDo";
import {
  ICON_SIZE,
  SPACING,
  BORDER_RADIUS,
  TOUCH_TARGET,
} from "@/src/theme/spacing";
import { withOpacity } from "@/src/theme/theme";
import { useTheme } from "@/src/theme/ThemeContext";

interface CommitmentCardProps {
  commitment: Commitment;
  onToggle?: () => void;
  onPress?: () => void;
  onDelete?: () => void;
  variant?: "default" | "compact";
}

export default function CommitmentCard({
  commitment,
  onToggle,
  onPress,
  onDelete,
  variant = "default",
}: CommitmentCardProps) {
  const { colors } = useTheme();

  const handleToggle = () => {
    if (onToggle) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onToggle();
    }
  };

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      onDelete();
    }
  };

  const isToDo = commitment instanceof ToDo;
  const isDone = commitment.isDone;

  const iconName = isToDo ? "checkbox-marked-circle" : "star-circle";
  const iconColor = isDone ? colors.success : colors.textSecondary;
  const iconOutlineName = isToDo
    ? "checkbox-blank-circle-outline"
    : "star-circle-outline";

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      style={styles.touchable}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${isToDo ? "To-do item" : "To-keep item"}: ${
        commitment.description
      }`}
      accessibilityState={{ checked: isDone }}
      accessibilityHint={onPress ? "Double tap to edit" : undefined}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDone ? colors.surfaceMuted : colors.surface,
            borderColor: isDone
              ? withOpacity(colors.success, 0.4)
              : colors.border,
            borderWidth: isDone ? 2 : 1,
          },
          variant === "compact" && styles.compact,
        ]}
      >
        {/* Checkbox/Status Toggle */}
        <TouchableOpacity
          onPress={handleToggle}
          disabled={!onToggle}
          style={styles.checkboxContainer}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessible={true}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isDone }}
          accessibilityLabel={
            isDone ? "Mark as incomplete" : "Mark as complete"
          }
        >
          <MaterialCommunityIcons
            name={isDone ? iconName : iconOutlineName}
            size={variant === "compact" ? ICON_SIZE.md : 28}
            color={iconColor}
          />
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          {/* Type Badge */}
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor: isToDo
                  ? withOpacity(colors.primary, 0.2)
                  : withOpacity(colors.secondary, 0.2),
              },
            ]}
          >
            <MaterialCommunityIcons
              name={isToDo ? "clipboard-check-outline" : "star-outline"}
              size={12}
              color={isToDo ? colors.primary : colors.secondary}
            />
            <AppText
              text={isToDo ? "To Do" : "To Keep"}
              variant="secondary"
              typography="caption"
            />
          </View>

          {/* Description */}
          <AppText
            text={commitment.description}
            variant={isDone ? "secondary" : "primary"}
            typography={variant === "compact" ? "body" : "bodyBold"}
            style={isDone && { textDecorationLine: "line-through" }}
          />
        </View>

        {/* Delete button */}
        {onDelete && (
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Delete commitment"
          >
            <View
              style={[
                styles.deleteButtonContainer,
                { backgroundColor: withOpacity(colors.error, 0.15) },
              ]}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
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
  checkboxContainer: {
    marginTop: 2,
    minWidth: TOUCH_TARGET.minimum,
    minHeight: TOUCH_TARGET.minimum,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    gap: SPACING.sm,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: "flex-start",
  },
  deleteButton: {
    padding: SPACING.sm,
    marginTop: 2,
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
