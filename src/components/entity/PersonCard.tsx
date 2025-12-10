import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useTheme } from "@/src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS, ICON_SIZE } from "@/src/theme/spacing";
import AppText from "../AppText";
import Person from "@/src/entities/Person/Person";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface PersonCardProps {
  person: Person;
  onPress?: () => void;
  showNecessitiesCount?: boolean;
  variant?: "default" | "compact";
}

export default function PersonCard({
  person,
  onPress,
  showNecessitiesCount = true,
  variant = "default",
}: PersonCardProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const necessitiesCount = person.necessities?.length || 0;

  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${person.name}${
        showNecessitiesCount ? `, ${necessitiesCount} necessities` : ""
      }`}
      accessibilityHint={onPress ? "Double tap to view details" : undefined}
    >
      {/* Avatar Circle */}
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: colors.primary,
          },
        ]}
      >
        <AppText
          text={person.name.charAt(0).toUpperCase()}
          variant="onPrimary"
          typography="h2"
        />
      </View>

      {/* Person Info */}
      <View style={styles.info}>
        <AppText text={person.name} variant="primary" typography="h3" />

        {showNecessitiesCount && variant === "default" && (
          <View style={styles.necessitiesRow}>
            <Feather name="heart" size={14} color={colors.textSecondary} />
            <AppText
              text={`${necessitiesCount} ${
                necessitiesCount === 1 ? "necessity" : "necessities"
              }`}
              variant="secondary"
              typography="caption"
            />
          </View>
        )}
      </View>

      {/* Chevron indicator */}
      {onPress && (
        <Feather name="chevron-right" size={24} color={colors.textSecondary} />
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
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
        elevation: 3,
      },
    }),
  },
  info: {
    flex: 1,
    gap: SPACING.sm,
  },
  necessitiesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
});
