import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Platform,
  Pressable,
  Keyboard,
} from "react-native";
import { useTheme } from "@/src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS } from "@/src/theme/spacing";
import AppText from "./AppText";
import Button from "./Button";
import InputText from "./InputText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface AddPersonModalProps {
  visible: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * AddPersonModal - A modal for adding a new person to the relationship
 *
 * Provides a simple form with name input and validation.
 *
 * @example
 * ```tsx
 * <AddPersonModal
 *   visible={showAddModal}
 *   onConfirm={handleAddPerson}
 *   onCancel={handleCancel}
 *   isLoading={isCreating}
 * />
 * ```
 */
export default function AddPersonModal({
  visible,
  onConfirm,
  onCancel,
  isLoading = false,
}: AddPersonModalProps) {
  const { colors } = useTheme();
  const [personName, setPersonName] = useState("");
  const [error, setError] = useState("");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      setPersonName("");
      setError("");
    }
  }, [visible]);

  const handleConfirm = () => {
    const trimmedName = personName.trim();

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
    onConfirm(trimmedName);
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
    setPersonName(value);
    if (error) {
      setError("");
    }
  };

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
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <MaterialCommunityIcons
                name="account-plus"
                size={48}
                color={colors.primary}
              />
            </View>
            <AppText text="Add Person" variant="primary" typography="h2" />
            <AppText
              text="Add someone to your relationship"
              variant="secondary"
              typography="body"
              style={styles.modalDescription}
            />
          </View>

          <View style={styles.modalForm}>
            <InputText
              label="Name"
              value={personName}
              onChange={handleNameChange}
              placeholder="Enter person's name"
              variant="default"
              required
              clearable
              maxLength={100}
              error={error}
              disabled={isLoading}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleConfirm}
              accessibilityLabel="Person name input"
              accessibilityHint="Enter the name of the person to add"
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
              accessibilityLabel="Cancel adding person"
            />
            <Button
              title="Add Person"
              variant="primary"
              onPress={handleConfirm}
              loading={isLoading}
              disabled={!personName.trim()}
              width="48%"
              position="flex-end"
              accessibilityLabel="Confirm add person"
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
  },
  modalActions: {
    flexDirection: "row",
    gap: SPACING.lg,
    justifyContent: "space-between",
  },
});
