import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Platform,
  Pressable,
  Keyboard,
  AccessibilityInfo,
} from "react-native";
import { useTheme } from "@/src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS } from "@/src/theme/spacing";
import { withOpacity } from "@/src/theme/theme";
import AppText from "./AppText";
import Button from "./Button";
import InputText from "./InputText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface AddNecessityModalProps {
  visible: boolean;
  onConfirm: (name: string, description: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * AddNecessityModal - A modal for adding a new necessity to a person
 *
 * Provides a form with name and description inputs with validation.
 * Follows the same pattern as AddPersonModal for consistency.
 *
 * @example
 * ```tsx
 * <AddNecessityModal
 *   visible={showAddModal}
 *   onConfirm={handleAddNecessity}
 *   onCancel={handleCancel}
 *   isLoading={isCreating}
 * />
 * ```
 */
export default function AddNecessityModal({
  visible,
  onConfirm,
  onCancel,
  isLoading = false,
}: AddNecessityModalProps) {
  const { colors } = useTheme();
  const [necessityName, setNecessityName] = useState("");
  const [necessityDescription, setNecessityDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      setNecessityName("");
      setNecessityDescription("");
      setNameError("");
      setDescriptionError("");
      // Announce modal opening for screen readers
      AccessibilityInfo.announceForAccessibility(
        "Add necessity form opened. Enter necessity name and description."
      );
    }
  }, [visible]);

  const handleConfirm = () => {
    const trimmedName = necessityName.trim();
    const trimmedDescription = necessityDescription.trim();
    let hasError = false;

    // Validate name
    if (!trimmedName) {
      setNameError("Name cannot be empty");
      hasError = true;
      AccessibilityInfo.announceForAccessibility("Error: Name cannot be empty");
    } else if (trimmedName.length < 2) {
      setNameError("Name must be at least 2 characters");
      hasError = true;
      AccessibilityInfo.announceForAccessibility(
        "Error: Name must be at least 2 characters"
      );
    } else if (trimmedName.length > 255) {
      setNameError("Name is too long (max 255 characters)");
      hasError = true;
      AccessibilityInfo.announceForAccessibility(
        "Error: Name is too long, maximum 255 characters"
      );
    }

    // Validate description
    if (!trimmedDescription) {
      setDescriptionError("Description cannot be empty");
      hasError = true;
      AccessibilityInfo.announceForAccessibility(
        "Error: Description cannot be empty"
      );
    } else if (trimmedDescription.length < 2) {
      setDescriptionError("Description must be at least 2 characters");
      hasError = true;
      AccessibilityInfo.announceForAccessibility(
        "Error: Description must be at least 2 characters"
      );
    } else if (trimmedDescription.length > 1000) {
      setDescriptionError("Description is too long (max 1000 characters)");
      hasError = true;
      AccessibilityInfo.announceForAccessibility(
        "Error: Description is too long, maximum 1000 characters"
      );
    }

    if (hasError) return;

    Keyboard.dismiss();
    AccessibilityInfo.announceForAccessibility("Creating necessity");
    onConfirm(trimmedName, trimmedDescription);
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    AccessibilityInfo.announceForAccessibility("Add necessity cancelled");
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
    setNecessityName(value);
    if (nameError) {
      setNameError("");
    }
  };

  const handleDescriptionChange = (value: string) => {
    setNecessityDescription(value);
    if (descriptionError) {
      setDescriptionError("");
    }
  };

  const isFormValid =
    necessityName.trim().length > 0 && necessityDescription.trim().length > 0;

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
          <View style={styles.modalHeader}>
            <View
              style={[
                styles.modalIconContainer,
                { backgroundColor: withOpacity(colors.secondary, 0.2) },
              ]}
            >
              <MaterialCommunityIcons
                name="heart-plus"
                size={48}
                color={colors.secondary}
              />
            </View>
            <AppText text="Add Necessity" variant="primary" typography="h2" />
            <AppText
              text="Define a new necessity for this person"
              variant="secondary"
              typography="body"
              style={styles.modalDescription}
            />
          </View>

          <View
            style={[
              styles.modalForm,
              {
                backgroundColor: withOpacity(colors.secondary, 0.05),
                borderColor: withOpacity(colors.secondary, 0.15),
              },
            ]}
          >
            <InputText
              label="Name"
              value={necessityName}
              onChange={handleNameChange}
              placeholder="e.g., Quality Time"
              variant="default"
              required
              clearable
              maxLength={255}
              error={nameError}
              disabled={isLoading}
              autoCapitalize="words"
              returnKeyType="next"
              accessibilityLabel="Necessity name input"
              accessibilityHint="Enter the name of the necessity"
            />

            <InputText
              label="Description"
              value={necessityDescription}
              onChange={handleDescriptionChange}
              placeholder="Describe what this necessity means..."
              variant="default"
              required
              clearable
              multiline
              numberOfLines={4}
              maxLength={1000}
              showCharacterCount
              error={descriptionError}
              disabled={isLoading}
              autoCapitalize="sentences"
              returnKeyType="done"
              onSubmitEditing={handleConfirm}
              accessibilityLabel="Necessity description input"
              accessibilityHint="Enter a detailed description of the necessity"
            />
          </View>

          <View style={styles.modalActions}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={handleCancel}
              disabled={isLoading}
              width="48%"
              position="flex-start"
              accessibilityLabel="Cancel adding necessity"
            />
            <Button
              title="Add Necessity"
              variant="primary"
              onPress={handleConfirm}
              loading={isLoading}
              disabled={!isFormValid}
              width="48%"
              position="flex-end"
              accessibilityLabel="Confirm add necessity"
            />
          </View>
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
    maxWidth: 400,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    gap: SPACING.xl,
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
  modalForm: {
    width: "100%",
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    gap: SPACING.md,
  },
  modalActions: {
    flexDirection: "row",
    gap: SPACING.lg,
    justifyContent: "space-between",
  },
});
