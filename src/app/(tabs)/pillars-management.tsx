import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS } from "@/src/theme/spacing";
import AppText from "@/src/components/AppText";
import PillarCard from "@/src/components/entity/PillarCard";
import PillarFormModal from "@/src/components/PillarFormModal";
import ConfirmationModal from "@/src/components/ConfirmationModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { withOpacity } from "@/src/theme/theme";
import * as Haptics from "expo-haptics";
import { useDatabase } from "@/src/services/database/DatabaseContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import usePillars from "@/src/hooks/database/usePillars";
import { Priority } from "@/src/entities/types/Priority";
import Pillar from "@/src/entities/Relationship/Pillar";

export default function PillarsManagementScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { db } = useDatabase();
  const queryClient = useQueryClient();

  // Fetch pillars
  const {
    data: pillars = [],
    isLoading,
    isFetching,
    error,
  } = usePillars();

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);

  // Create pillar mutation
  const createPillar = useMutation({
    mutationFn: async ({
      name,
      priority,
      satisfaction,
    }: {
      name: string;
      priority: Priority;
      satisfaction: number;
    }) => {
      if (!db) throw new Error("Database not initialized");
      return db.createPillar(name, priority, satisfaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pillars"] });
      setShowAddModal(false);
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    onError: (error) => {
      console.error("Error creating pillar:", error);
      Alert.alert(
        "Creation Failed",
        "We couldn't create the pillar. Please try again.",
        [{ text: "OK", style: "default" }]
      );
    },
  });

  // Update pillar mutation
  const updatePillar = useMutation({
    mutationFn: async ({
      id,
      name,
      priority,
      satisfaction,
    }: {
      id: string;
      name: string;
      priority: Priority;
      satisfaction: number;
    }) => {
      if (!db) throw new Error("Database not initialized");
      return db.updatePillar(id, name, priority, satisfaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pillars"] });
      setShowEditModal(false);
      setSelectedPillar(null);
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    onError: (error) => {
      console.error("Error updating pillar:", error);
      Alert.alert(
        "Update Failed",
        "We couldn't update the pillar. Please try again.",
        [{ text: "OK", style: "default" }]
      );
    },
  });

  // Delete pillar mutation
  const deletePillar = useMutation({
    mutationFn: async (id: string) => {
      if (!db) throw new Error("Database not initialized");
      return db.deletePillar(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pillars"] });
      setShowDeleteConfirmation(false);
      setSelectedPillar(null);
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    onError: (error) => {
      console.error("Error deleting pillar:", error);
      setShowDeleteConfirmation(false);
      Alert.alert(
        "Deletion Failed",
        "We couldn't delete the pillar. Please try again.",
        [
          {
            text: "Retry",
            onPress: () => selectedPillar && handleConfirmDelete(),
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    },
  });

  // Handlers
  const handleAddPillar = (
    name: string,
    priority: Priority,
    satisfaction: number
  ) => {
    createPillar.mutate({ name, priority, satisfaction });
  };

  const handleEditPillar = (
    name: string,
    priority: Priority,
    satisfaction: number
  ) => {
    if (!selectedPillar) return;
    updatePillar.mutate({
      id: selectedPillar.id,
      name,
      priority,
      satisfaction,
    });
  };

  const handlePillarPress = (pillar: Pillar) => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedPillar(pillar);
    setShowEditModal(true);
  };

  const handleDeletePress = (pillar: Pillar) => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    setSelectedPillar(pillar);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedPillar) return;
    deletePillar.mutate(selectedPillar.id);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setSelectedPillar(null);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setSelectedPillar(null);
  };

  const handleFabPress = () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowAddModal(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <AppText
          text="Loading pillars..."
          variant="secondary"
          typography="body"
        />
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <MaterialCommunityIcons
          name="alert-circle"
          size={48}
          color={colors.error}
        />
        <AppText
          text="Failed to load pillars"
          variant="primary"
          typography="h3"
        />
        <AppText
          text="Please check your connection and try again"
          variant="secondary"
          typography="body"
          style={styles.errorDescription}
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <AppText text="Manage Pillars" variant="primary" typography="h2" />
        </View>

        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Section */}
        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: withOpacity(colors.primary, 0.1),
              borderColor: withOpacity(colors.primary, 0.2),
            },
          ]}
        >
          <MaterialCommunityIcons
            name="pillar"
            size={32}
            color={colors.primary}
          />
          <View style={styles.statsContent}>
            <AppText
              text={pillars.length.toString()}
              variant="primary"
              typography="h1"
            />
            <AppText
              text={pillars.length === 1 ? "pillar" : "pillars"}
              variant="secondary"
              typography="body"
            />
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <MaterialCommunityIcons
            name="information-outline"
            size={20}
            color={colors.textSecondary}
          />
          <AppText
            text="Pillars represent the fundamental aspects of your relationship. Track their priority and your satisfaction level."
            variant="secondary"
            typography="caption"
            style={styles.infoText}
          />
        </View>

        {/* Pillars List */}
        {pillars.length > 0 ? (
          <View style={styles.pillarsSection}>
            <View style={styles.sectionHeader}>
              <AppText text="Your Pillars" variant="primary" typography="h3" />
              <AppText
                text={`${pillars.length} total`}
                variant="secondary"
                typography="caption"
              />
            </View>

            <View style={styles.pillarsList}>
              {isFetching && !isLoading && (
                <View
                  style={[
                    styles.loadingOverlay,
                    {
                      backgroundColor: withOpacity(colors.surface, 0.95),
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <ActivityIndicator size="small" color={colors.primary} />
                  <AppText
                    text="Updating..."
                    variant="secondary"
                    typography="caption"
                  />
                </View>
              )}
              {pillars.map((pillar) => (
                <View key={pillar.id} style={styles.pillarItemContainer}>
                  <View style={styles.pillarCardWrapper}>
                    <PillarCard
                      pillar={pillar}
                      onPress={() => handlePillarPress(pillar)}
                      showSatisfaction={true}
                      variant="default"
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeletePress(pillar)}
                    style={[
                      styles.deleteButton,
                      {
                        backgroundColor: withOpacity(colors.error, 0.1),
                        borderColor: withOpacity(colors.error, 0.3),
                      },
                    ]}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${pillar.name} pillar`}
                  >
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={20}
                      color={colors.error}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ) : (
          // Empty state
          <View style={styles.emptyState}>
            <View
              style={[
                styles.emptyIconContainer,
                { backgroundColor: withOpacity(colors.primary, 0.1) },
              ]}
            >
              <MaterialCommunityIcons
                name="pillar"
                size={64}
                color={withOpacity(colors.primary, 0.5)}
              />
            </View>
            <AppText
              text="No pillars yet"
              variant="primary"
              typography="h3"
              style={styles.emptyTitle}
            />
            <AppText
              text="Create your first pillar to start building the foundation of your relationship."
              variant="secondary"
              typography="body"
              style={styles.emptyDescription}
            />
            <TouchableOpacity
              onPress={handleFabPress}
              style={[
                styles.emptyActionButton,
                { backgroundColor: colors.primary },
              ]}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Add your first pillar"
            >
              <MaterialCommunityIcons
                name="plus"
                size={24}
                color={colors.onPrimary}
              />
              <AppText
                text="Add Your First Pillar"
                variant="onPrimary"
                typography="bodyBold"
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Action Button - Only show if there are existing pillars */}
      {pillars.length > 0 && (
        <TouchableOpacity
          onPress={handleFabPress}
          style={[styles.fab, { backgroundColor: colors.primary }]}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Add new pillar"
        >
          <MaterialCommunityIcons
            name="plus"
            size={28}
            color={colors.onPrimary}
          />
        </TouchableOpacity>
      )}

      {/* Add Pillar Modal */}
      <PillarFormModal
        visible={showAddModal}
        mode="add"
        onConfirm={handleAddPillar}
        onCancel={() => setShowAddModal(false)}
        isLoading={createPillar.isPending}
      />

      {/* Edit Pillar Modal */}
      <PillarFormModal
        visible={showEditModal}
        mode="edit"
        pillar={selectedPillar || undefined}
        onConfirm={handleEditPillar}
        onCancel={handleCancelEdit}
        isLoading={updatePillar.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteConfirmation}
        title="Delete Pillar?"
        description={`This will permanently delete "${selectedPillar?.name}". This action cannot be undone.`}
        confirmLabel="Delete Forever"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deletePillar.isPending}
        variant="danger"
        iconName="pillar"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
    gap: SPACING.lg,
  },
  errorDescription: {
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    padding: SPACING.md,
    marginLeft: -SPACING.md,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.xl,
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
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
  statsContent: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: SPACING.sm,
  },
  infoSection: {
    flexDirection: "row",
    gap: SPACING.sm,
    alignItems: "flex-start",
    paddingHorizontal: SPACING.sm,
  },
  infoText: {
    flex: 1,
    lineHeight: 18,
  },
  pillarsSection: {
    gap: SPACING.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pillarsList: {
    gap: SPACING.md,
    marginTop: SPACING.sm,
    position: "relative",
  },
  loadingOverlay: {
    flexDirection: "row",
    gap: SPACING.sm,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  pillarItemContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
    alignItems: "center",
  },
  pillarCardWrapper: {
    flex: 1,
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: SPACING.xxl * 2,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    textAlign: "center",
  },
  emptyDescription: {
    textAlign: "center",
    lineHeight: 24,
  },
  emptyActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  bottomPadding: {
    height: SPACING.xxl * 3,
  },
  fab: {
    position: "absolute",
    bottom: SPACING.xxl,
    right: SPACING.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
