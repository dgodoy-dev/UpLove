import { useTheme } from "@/src/theme/ThemeContext";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import AnimatedChip from "./AnimatedChip";

type Props = {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  leftLabel?: string;
  rightLabel?: string;
};

export default function ScoreSelector({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  leftLabel,
  rightLabel,
}: Props) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const selected = value;

  // Calculate if we need scrolling based on screen width and number of chips
  // Each chip is 34px + we need spacing, so we use a conservative threshold
  const needsScrolling = useMemo(() => {
    const chipCount = max - min + 1;
    const estimatedWidth = chipCount * 34 + (chipCount - 1) * 8; // chips + gaps
    return screenWidth < 400 || estimatedWidth > screenWidth * 0.9;
  }, [screenWidth, min, max]);

  // Handle value change with haptic feedback
  const handleChange = useCallback(
    (newValue: number) => {
      if (newValue !== value) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onChange(newValue);
      }
    },
    [value]
  );

  // Generate chips array
  const chips = useMemo(() => {
    return Array.from({ length: max - min + 1 }).map((_, i) => {
      const chipValue = min + i;
      return (
        <AnimatedChip
          key={chipValue}
          value={chipValue}
          selected={selected === chipValue}
          variant="primary"
          onSelect={() => handleChange(chipValue)}
        />
      );
    });
  }, [min, max, selected, handleChange]);

  // Container style based on scrolling need
  const containerStyle = [
    styles.chipsContainer,
    needsScrolling ? styles.scrollingContainer : styles.staticContainer,
  ];

  return (
    <View
      style={styles.wrapper}
      accessibilityRole="radiogroup"
      accessibilityLabel={`Score selector from ${min} to ${max}`}
    >
      {/* Optional label */}
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}

      {/* End labels row */}
      <View style={styles.contentContainer}>
        {leftLabel && (
          <Text
            style={[
              styles.endLabel,
              styles.leftLabel,
              { color: theme.colors.textSecondary },
            ]}
          >
            {leftLabel}
          </Text>
        )}

        {/* Chips container - either scrollable or static */}
        {needsScrolling ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={containerStyle}
            style={styles.scrollView}
          >
            {chips}
          </ScrollView>
        ) : (
          <View style={containerStyle}>{chips}</View>
        )}

        {rightLabel && (
          <Text
            style={[
              styles.endLabel,
              styles.rightLabel,
              { color: theme.colors.textSecondary },
            ]}
          >
            {rightLabel}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
  },
  chipsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  staticContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollingContainer: {
    gap: 4,
    paddingHorizontal: 4,
  },
  scrollView: {
    flex: 1,
  },
  endLabel: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  leftLabel: {
    marginRight: 8,
  },
  rightLabel: {
    marginLeft: 8,
  },
});
