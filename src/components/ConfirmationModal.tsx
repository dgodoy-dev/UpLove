import React from "react";
import { StyleSheet, View, Modal, Platform, Pressable } from "react-native";
import { useTheme } from "@/src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS } from "@/src/theme/spacing";
import AppText from "./AppText";
import Button from "./Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { withOpacity } from "@/src/theme/theme";
import * as Haptics from "expo-haptics";

type ConfirmationModalVariant = "danger" | "warning" | "info";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: ConfirmationModalVariant;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  allowBackdropDismiss?: boolean;
}

/**
 * ConfirmationModal - A reusable modal for confirmation dialogs
 *
 * Provides a consistent confirmation experience across the app with
 * proper accessibility, loading states, and visual variants.
 *
 * Button order follows UX best practices:
 * - Safe action (Cancel) on the RIGHT
 * - Destructive action (Delete, etc.) on the LEFT
 *
 * @example
 * ```tsx
 * <ConfirmationModal
 *   visible={showModal}
 *   title="Delete Person?"
 *   description="This action cannot be undone."
 *   confirmLabel="Delete Forever"
 *   cancelLabel="Cancel"
 *   onConfirm={handleDelete}
 *   onCancel={handleCancel}
 *   isLoading={isDeleting}
 *   variant="danger"
 *   iconName="alert-circle"
 * />
 * ```
 */
export default function ConfirmationModal({
  visible,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = "danger",
  iconName = "alert-circle",
  allowBackdropDismiss = false,
}: ConfirmationModalProps) {
  const { colors } = useTheme();

  const getVariantColor = () => {
    switch (variant) {
      case "danger":
        return colors.error;
      case "warning":
        return colors.priorityMedium;
      case "info":
        return colors.primary;
      default:
        return colors.error;
    }
  };

  const variantColor = getVariantColor();

  const handleBackdropPress = () => {
    if (allowBackdropDismiss && !isLoading) {
      onCancel();
    }
  };

  const handleContentPress = (e: any) => {
    e.stopPropagation();
  };

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm();
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onCancel();
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
                { backgroundColor: withOpacity(variantColor, 0.1) },
              ]}
            >
              <MaterialCommunityIcons
                name={iconName}
                size={48}
                color={variantColor}
              />
            </View>
            <AppText text={title} variant="primary" typography="h2" />
            <AppText
              text={description}
              variant="secondary"
              typography="body"
              style={styles.modalDescription}
            />
          </View>

          <View style={styles.modalActions}>
            {/* Destructive action on the LEFT */}
            <Button
              title={confirmLabel}
              variant="secondary"
              onPress={handleConfirm}
              loading={isLoading}
              width="48%"
              position="flex-start"
              accessibilityLabel={`${confirmLabel} action`}
            />
            {/* Safe action (Cancel) on the RIGHT */}
            <Button
              title={cancelLabel}
              variant="primary"
              onPress={handleCancel}
              disabled={isLoading}
              width="48%"
              position="flex-end"
              accessibilityLabel={`${cancelLabel} action`}
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
  modalActions: {
    flexDirection: "row",
    gap: SPACING.lg,
    justifyContent: "space-between",
  },
});
