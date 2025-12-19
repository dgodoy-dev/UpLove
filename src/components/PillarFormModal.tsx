import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Platform,
  Pressable,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useTheme } from "@/src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS } from "@/src/theme/spacing";
import { withOpacity } from "@/src/theme/theme";
import AppText from "./AppText";
import Button from "./Button";
import InputText from "./InputText";
import ScoreSelector from "./ScoreSelector";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Priority, priorities } from "@/src/entities/types/Priority";
import Pillar from "@/src/entities/Relationship/Pillar";

interface PillarFormModalProps {
  visible: boolean;
  onConfirm: (name: string, priority: Priority, satisfaction: number) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "add" | "edit";
  pillar?: Pillar;
}

// Priority configuration for display
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

/**
 * PillarFormModal - A reusable modal for adding or editing pillars
 *
 * Provides a form with name input, priority selection, and satisfaction scoring.
 * Supports both add and edit modes with proper validation.
 *
 * @example
 * ```tsx
 * <PillarFormModal
 *   visible={showModal}
 *   mode="add"
 *   onConfirm={handleAddPillar}
 *   onCancel={handleCancel}
 *   isLoading={isCreating}
 * />
 * ```
 */
export default function PillarFormModal({
  visible,
  onConfirm,
  onCancel,
  isLoading = false,
  mode,
  pillar,
}: PillarFormModalProps) {
  const { colors } = useTheme();
  const [pillarName, setPillarName] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("medium");
  const [satisfaction, setSatisfaction] = useState(5);
  const [error, setError] = useState("");

  // Reset state when modal opens/closes or mode changes
  useEffect(() => {
    if (visible) {
      if (mode === "edit" && pillar) {
        setPillarName(pillar.name);
        setSelectedPriority(pillar.priority);
        setSatisfaction(pillar.satisfaction);
      } else {
        setPillarName("");
        setSelectedPriority("medium");
        setSatisfaction(5);
      }
      setError("");
    }
  }, [visible, mode, pillar]);

  const handleConfirm = () => {
    const trimmedName = pillarName.trim();

    if (!trimmedName) {
      setError("Name cannot be empty");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (trimmedName.length > 100) {
      setError("Name is too long (max 100 characters)");
      return;
    }

    Keyboard.dismiss();
    onConfirm(trimmedName, selectedPriority, satisfaction);
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    onCancel();
  };

  const handleBackdropPress = () => {
    if (!isLoading) {
      handleCancel();
    }
  };

  const handleContentPress = (e: any) => {
    e.stopPropagation();
  };

  const handleNameChange = (value: string) => {
    setPillarName(value);
    if (error) {
      setError("");
    }
  };

  const isFormValid = pillarName.trim().length >= 2;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={isLoading ? undefined : handleCancel}
      accessibilityViewIsModal={true}
    >
      <Pressable style={styles.modalOverlay} onPress={handleBackdropPress}>
        <Pressable
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.surface,
            },
          ]}
          onPress={handleContentPress}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
            <View style={styles.modalHeader}>
              <View
                style={[
                  styles.modalIconContainer,
                  { backgroundColor: withOpacity(colors.primary, 0.12) },
                ]}
              >
                <MaterialCommunityIcons
                  name={mode === "add" ? "plus-circle" : "pencil"}
                  size={48}
                  color={colors.primary}
                />
              </View>
              <AppText
                text={mode === "add" ? "Add Pillar" : "Edit Pillar"}
                variant="primary"
                typography="h2"
              />
              <AppText
                text={
                  mode === "add"
                    ? "Create a new pillar for your relationship"
                    : "Update pillar details"
                }
                variant="secondary"
                typography="body"
                style={styles.modalDescription}
              />
            </View>

            {/* Error Banner */}
            {error && (
              <View
                style={[
                  styles.errorBanner,
                  {
                    backgroundColor: withOpacity(colors.error, 0.1),
                    borderColor: colors.error,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={20}
                  color={colors.error}
                />
                <AppText
                  text={error}
                  variant="primary"
                  typography="caption"
                  style={[styles.errorBannerText, { color: colors.error }]}
                />
              </View>
            )}

            <View style={styles.modalForm}>
              {/* Name Input */}
              <InputText
                label="Pillar Name"
                value={pillarName}
                onChange={handleNameChange}
                placeholder="e.g., Communication, Trust, Fun"
                variant="default"
                required
                clearable
                maxLength={100}
                showCharacterCount={true}
                error={error}
                disabled={isLoading}
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={handleConfirm}
                accessibilityLabel="Pillar name input"
                accessibilityHint="Enter the name of the pillar"
              />

              {/* Priority Selector */}
              <View style={styles.formGroup}>
                <View style={styles.labelContainer}>
                  <AppText
                    text="Priority"
                    variant="primary"
                    typography="bodyBold"
                  />
                  <AppText
                    text="*"
                    variant="primary"
                    typography="bodyBold"
                    style={{ color: colors.error }}
                  />
                </View>
                <AppText
                  text="How important is this pillar to your relationship?"
                  variant="secondary"
                  typography="caption"
                  style={styles.helperText}
                />

                <View style={styles.priorityGrid}>
                  {priorities.map((priority) => {
                    const config = getPriorityConfig(priority, colors);
                    const isSelected = selectedPriority === priority;

                    return (
                      <TouchableOpacity
                        key={priority}
                        onPress={() => setSelectedPriority(priority)}
                        disabled={isLoading}
                        style={[
                          styles.priorityOption,
                          {
                            backgroundColor: isSelected
                              ? withOpacity(config.color, 0.2)
                              : colors.surfaceMuted,
                            borderColor: isSelected
                              ? config.color
                              : colors.border,
                            borderWidth: isSelected ? 2 : 1,
                          },
                        ]}
                        activeOpacity={0.7}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: isSelected }}
                        accessibilityLabel={`Priority ${config.label}`}
                      >
                        <MaterialCommunityIcons
                          name={config.icon as any}
                          size={20}
                          color={config.color}
                        />
                        <AppText
                          text={config.label}
                          variant={isSelected ? "primary" : "secondary"}
                          typography="caption"
                          style={styles.priorityLabel}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Satisfaction Score */}
              <View style={styles.formGroup}>
                <View style={styles.labelContainer}>
                  <AppText
                    text="Satisfaction Score"
                    variant="primary"
                    typography="bodyBold"
                  />
                  <AppText
                    text="*"
                    variant="primary"
                    typography="bodyBold"
                    style={{ color: colors.error }}
                  />
                </View>
                <AppText
                  text="How satisfied are you with this pillar currently?"
                  variant="secondary"
                  typography="caption"
                  style={styles.helperText}
                />

                <ScoreSelector
                  value={satisfaction}
                  onChange={setSatisfaction}
                  min={1}
                  max={10}
                  leftLabel="Needs Work"
                  rightLabel="Thriving"
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={handleCancel}
                disabled={isLoading}
                width="48%"
                position="flex-start"
                accessibilityLabel="Cancel pillar operation"
              />
              <Button
                title={mode === "add" ? "Add Pillar" : "Save Changes"}
                variant="primary"
                onPress={handleConfirm}
                loading={isLoading}
                disabled={!isFormValid}
                width="48%"
                position="flex-end"
                accessibilityLabel={
                  mode === "add" ? "Confirm add pillar" : "Confirm edit pillar"
                }
              />
            </View>
          </ScrollView>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  modalContent: {
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    alignItems: "center",
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  modalDescription: {
    textAlign: "center",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginTop: SPACING.md,
  },
  errorBannerText: {
    flex: 1,
  },
  modalForm: {
    width: "100%",
    gap: SPACING.xl,
  },
  formGroup: {
    width: "100%",
    gap: SPACING.sm,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  helperText: {
    marginTop: -SPACING.xs,
  },
  priorityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  priorityOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 100,
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  priorityLabel: {
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    gap: SPACING.lg,
    justifyContent: "space-between",
    marginTop: SPACING.lg,
  },
});
