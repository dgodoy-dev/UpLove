import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Keyboard,
  BackHandler,
} from "react-native";
import { useTheme } from "@/src/theme/ThemeContext";
import { SPACING, BORDER_RADIUS } from "@/src/theme/spacing";
import AppText from "@/src/components/AppText";
import Button from "@/src/components/Button";
import InputText from "@/src/components/InputText";
import ConfirmationModal from "@/src/components/ConfirmationModal";
import AddPersonModal from "@/src/components/AddPersonModal";
import PersonCard from "@/src/components/entity/PersonCard";
import useRelationship from "@/src/hooks/database/useRelationship";
import usePeople from "@/src/hooks/database/usePeople";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { withOpacity } from "@/src/theme/theme";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RelationshipSettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getRelationshipMetadata, updateRelationship, deleteRelationship } =
    useRelationship();
  const { createPerson, deletePerson, ...peopleQuery } = usePeople();

  const relationshipMetadata = getRelationshipMetadata.data;
  const people = peopleQuery.data || [];

  const [relationshipName, setRelationshipName] = useState(
    relationshipMetadata?.name || ""
  );
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [showDeletePersonConfirmation, setShowDeletePersonConfirmation] =
    useState(false);
  const [personToDelete, setPersonToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Handle Android hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (hasChanges) {
          handleBack();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [hasChanges])
  );

  const handleNameChange = (value: string) => {
    setRelationshipName(value);
    setHasChanges(value !== relationshipMetadata?.name);
  };

  const handleSave = async () => {
    Keyboard.dismiss();

    if (!relationshipName.trim()) {
      Alert.alert("Error", "Relationship name cannot be empty");
      return;
    }

    if (relationshipName === relationshipMetadata?.name) {
      router.back();
      return;
    }

    try {
      await updateRelationship.mutateAsync(relationshipName);
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert("Success", "Relationship updated successfully");
      router.back();
    } catch (error) {
      console.error("Error updating relationship:", error);
      Alert.alert(
        "Update Failed",
        "We couldn't save your changes. Please check your connection and try again.",
        [{ text: "OK", style: "default" }]
      );
    }
  };

  const handleDeletePress = () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteRelationship.mutateAsync();
      setShowDeleteConfirmation(false);
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert(
        "Relationship Deleted",
        "All data has been removed successfully"
      );
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error deleting relationship:", error);
      setShowDeleteConfirmation(false);
      Alert.alert(
        "Deletion Failed",
        "We couldn't delete your relationship. Please try again.",
        [
          { text: "Retry", onPress: handleConfirmDelete },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleAddPerson = async (name: string) => {
    try {
      await createPerson.mutateAsync(name);
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setShowAddPersonModal(false);
    } catch (error) {
      console.error("Error creating person:", error);
      Alert.alert(
        "Failed to Add Person",
        "We couldn't add the person. Please try again.",
        [{ text: "OK", style: "default" }]
      );
    }
  };

  const handleDeletePersonPress = (personId: string, personName: string) => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    setPersonToDelete({ id: personId, name: personName });
    setShowDeletePersonConfirmation(true);
  };

  const handleConfirmDeletePerson = async () => {
    if (!personToDelete) return;

    try {
      await deletePerson.mutateAsync(personToDelete.id);
      setShowDeletePersonConfirmation(false);
      setPersonToDelete(null);
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Error deleting person:", error);
      setShowDeletePersonConfirmation(false);
      Alert.alert(
        "Deletion Failed",
        "We couldn't delete this person. Please try again.",
        [
          { text: "Retry", onPress: handleConfirmDeletePerson },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }
  };

  const handleCancelDeletePerson = () => {
    setShowDeletePersonConfirmation(false);
    setPersonToDelete(null);
  };

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Do you want to discard them?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  if (!relationshipMetadata) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <AppText
          text="Loading relationship..."
          variant="secondary"
          typography="body"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Relationship Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="heart-multiple"
              size={24}
              color={colors.primary}
            />
            <AppText
              text="Relationship Details"
              variant="primary"
              typography="h2"
            />
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <InputText
              label="Relationship Name"
              value={relationshipName}
              onChange={handleNameChange}
              placeholder="Enter relationship name"
              variant="default"
              required
              clearable
              maxLength={100}
              accessibilityLabel="Relationship name input"
              accessibilityHint="Enter a name for your relationship"
            />

            <View style={styles.metadataItem}>
              <AppText
                text="Created on"
                variant="secondary"
                typography="body"
              />
              <AppText
                text={new Date(
                  relationshipMetadata.createdAt
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                variant="primary"
                typography="bodyBold"
              />
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Button
            title="Save Name"
            variant="primary"
            onPress={handleSave}
            disabled={!hasChanges || !relationshipName.trim()}
            loading={updateRelationship.isPending}
            width="100%"
            accessibilityLabel="Save relationship name"
          />
        </View>

        {/* People Management Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="account-multiple"
              size={24}
              color={colors.primary}
            />
            <AppText text="People" variant="primary" typography="h2" />
          </View>

          <AppText
            text={
              people.length > 0
                ? `${people.length} ${
                    people.length === 1 ? "person" : "people"
                  } in relationship`
                : "No people added yet"
            }
            variant="secondary"
            typography="body"
          />

          {people.length > 0 && (
            <View style={styles.peopleList}>
              {people.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  variant="compact"
                  onPress={() => router.push(`/person-details?id=${person.id}`)}
                  onDelete={() =>
                    handleDeletePersonPress(person.id, person.name)
                  }
                />
              ))}
            </View>
          )}

          <Button
            title="Add Person"
            variant="primary"
            onPress={() => setShowAddPersonModal(true)}
            width="100%"
            accessibilityLabel="Add new person"
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="alert"
              size={24}
              color={colors.error}
            />
            <AppText text="Danger Zone" variant="primary" typography="h2" />
          </View>

          <View
            style={[
              styles.dangerCard,
              {
                backgroundColor: withOpacity(colors.error, 0.05),
                borderColor: withOpacity(colors.error, 0.3),
              },
            ]}
          >
            <View style={styles.dangerContent}>
              <MaterialCommunityIcons
                name="delete-forever"
                size={32}
                color={colors.error}
              />
              <View style={styles.dangerText}>
                <AppText
                  text="Delete Relationship"
                  variant="primary"
                  typography="bodyBold"
                />
                <AppText
                  text="This will permanently delete all your data including people, pillars, commitments, and uploves. This action cannot be undone."
                  variant="secondary"
                  typography="caption"
                />
              </View>
            </View>

            <Button
              title="Delete Relationship"
              variant="secondary"
              onPress={handleDeletePress}
              width="100%"
              accessibilityLabel="Delete relationship"
            />
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Delete Relationship Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteConfirmation}
        title="Delete Relationship?"
        description="This action cannot be undone. All your data will be permanently deleted."
        confirmLabel="Delete Forever"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteRelationship.isPending}
        variant="danger"
        iconName="alert-circle"
      />

      {/* Add Person Modal */}
      <AddPersonModal
        visible={showAddPersonModal}
        onConfirm={handleAddPerson}
        onCancel={() => setShowAddPersonModal(false)}
        isLoading={createPerson.isPending}
      />

      {/* Delete Person Confirmation Modal */}
      <ConfirmationModal
        visible={showDeletePersonConfirmation}
        title="Delete Person?"
        description={
          personToDelete
            ? `This will permanently delete ${personToDelete.name} and all their necessities. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete Forever"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDeletePerson}
        onCancel={handleCancelDeletePerson}
        isLoading={deletePerson.isPending}
        variant="danger"
        iconName="alert-circle"
      />
    </View>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
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
    gap: SPACING.xxl,
  },
  section: {
    gap: SPACING.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  card: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.lg,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  metadataItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  dangerCard: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    gap: SPACING.lg,
  },
  dangerContent: {
    flexDirection: "row",
    gap: SPACING.md,
    alignItems: "flex-start",
  },
  dangerText: {
    flex: 1,
    gap: SPACING.xs,
  },
  bottomPadding: {
    height: SPACING.xl,
  },
  peopleList: {
    gap: SPACING.md,
  },
});
