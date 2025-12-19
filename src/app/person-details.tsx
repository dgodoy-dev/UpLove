import React, { useState, useEffect } from "react";
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
import AddNecessityModal from "@/src/components/AddNecessityModal";
import usePeople from "@/src/hooks/database/usePeople";
import useNecessities from "@/src/hooks/database/useNecessities";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { withOpacity } from "@/src/theme/theme";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NecessityItem from "@/src/components/entity/NecessityItem";

export default function PersonDetailsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const personId = params.id;

  const { getPerson, updatePerson, deletePerson } = usePeople();
  const { createNecessity, deleteNecessity } = useNecessities();
  const personQuery = getPerson(personId);
  const person = personQuery.data;

  const [personName, setPersonName] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Add necessity modal state
  const [showAddNecessityModal, setShowAddNecessityModal] = useState(false);

  // Delete necessity confirmation state
  const [necessityToDelete, setNecessityToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Initialize name when person data loads
  useEffect(() => {
    if (person?.name) {
      setPersonName(person.name);
    }
  }, [person?.name]);

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
    setPersonName(value);
    setHasChanges(value !== person?.name);
  };

  const handleSave = async () => {
    Keyboard.dismiss();

    if (!personName.trim()) {
      Alert.alert("Error", "Person name cannot be empty");
      return;
    }

    if (personName === person?.name) {
      return;
    }

    try {
      await updatePerson.mutateAsync({ id: personId, name: personName });
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setHasChanges(false);
    } catch (error) {
      console.error("Error updating person:", error);
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
      await deletePerson.mutateAsync(personId);
      setShowDeleteConfirmation(false);
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.back();
    } catch (error) {
      console.error("Error deleting person:", error);
      setShowDeleteConfirmation(false);
      Alert.alert(
        "Deletion Failed",
        "We couldn't delete this person. Please try again.",
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

  // Necessity management functions
  const handleAddNecessity = async (name: string, description: string) => {
    try {
      await createNecessity.mutateAsync({
        personId,
        name,
        description,
      });

      if (Platform.OS === "ios" || Platform.OS === "android") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      setShowAddNecessityModal(false);
    } catch (error) {
      console.error("Error creating necessity:", error);
      Alert.alert(
        "Creation Failed",
        "We couldn't add the necessity. Please try again.",
        [{ text: "OK", style: "default" }]
      );
    }
  };

  const handleDeleteNecessityPress = (
    necessityId: string,
    necessityName: string
  ) => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    setNecessityToDelete({ id: necessityId, name: necessityName });
  };

  const handleConfirmDeleteNecessity = async () => {
    if (!necessityToDelete) return;

    try {
      await deleteNecessity.mutateAsync({
        necessityId: necessityToDelete.id,
        personId,
      });

      if (Platform.OS === "ios" || Platform.OS === "android") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      setNecessityToDelete(null);
    } catch (error) {
      console.error("Error deleting necessity:", error);
      setNecessityToDelete(null);
      Alert.alert(
        "Deletion Failed",
        "We couldn't delete the necessity. Please try again.",
        [{ text: "OK", style: "default" }]
      );
    }
  };

  const handleCancelDeleteNecessity = () => {
    setNecessityToDelete(null);
  };

  if (personQuery.isLoading) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <AppText
          text="Loading person..."
          variant="secondary"
          typography="body"
        />
      </View>
    );
  }

  if (!person) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <AppText
          text="Person not found"
          variant="secondary"
          typography="body"
        />
        <Button
          title="Go Back"
          variant="primary"
          onPress={() => router.back()}
          width="auto"
        />
      </View>
    );
  }

  const necessitiesCount = person.necessities?.length || 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Person Avatar Section */}
        <View style={styles.avatarSection}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <AppText
              text={personName.charAt(0).toUpperCase() || "?"}
              variant="onPrimary"
              typography="h1"
            />
          </View>
        </View>

        {/* Person Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="account"
              size={24}
              color={colors.primary}
            />
            <AppText
              text="Personal Information"
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
              label="Name"
              value={personName}
              onChange={handleNameChange}
              placeholder="Enter person name"
              variant="default"
              required
              clearable
              maxLength={100}
              accessibilityLabel="Person name input"
              accessibilityHint="Enter the person's name"
            />
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Button
            title="Save Name"
            variant="primary"
            onPress={handleSave}
            disabled={!hasChanges || !personName.trim()}
            loading={updatePerson.isPending}
            width="100%"
            accessibilityLabel="Save person changes"
          />
        </View>

        {/* Necessities Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="heart" size={24} color={colors.secondary} />
            <AppText text="Necessities" variant="primary" typography="h2" />
          </View>

          <View style={styles.necessitiesInfo}>
            <View style={styles.necessitiesHeaderRow}>
              <View style={styles.necessitiesCountText}>
                <AppText
                  text={necessitiesCount.toString()}
                  variant="primary"
                  typography="h2"
                />
                <AppText
                  text={necessitiesCount === 1 ? "necessity" : "necessities"}
                  variant="secondary"
                  typography="body"
                />
              </View>

              <TouchableOpacity
                onPress={() => setShowAddNecessityModal(true)}
                style={[
                  styles.addButton,
                  {
                    backgroundColor: withOpacity(colors.secondary, 0.1),
                    borderColor: colors.secondary,
                  },
                ]}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Add new necessity"
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={24}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            </View>

            {/* Necessities List */}
            {necessitiesCount > 0 ? (
              <View style={styles.necessitiesList}>
                {person.necessities.map((necessity) => (
                  <NecessityItem
                    key={necessity.id}
                    necessity={necessity}
                    variant="default"
                    expandable={true}
                    onDelete={() =>
                      handleDeleteNecessityPress(necessity.id, necessity.name)
                    }
                  />
                ))}
              </View>
            ) : (
              <AppText
                text="No necessities added yet. Click the + button to add one!"
                variant="secondary"
                typography="body"
                style={styles.emptyText}
              />
            )}
          </View>
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
                name="account-remove"
                size={32}
                color={colors.error}
              />
              <View style={styles.dangerText}>
                <AppText
                  text="Delete Person"
                  variant="primary"
                  typography="bodyBold"
                />
                <AppText
                  text="This will permanently delete this person and all their necessities. This action cannot be undone."
                  variant="secondary"
                  typography="caption"
                />
              </View>
            </View>

            <Button
              title="Delete Person"
              variant="secondary"
              onPress={handleDeletePress}
              width="100%"
              accessibilityLabel="Delete person"
            />
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Delete Person Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteConfirmation}
        title="Delete Person?"
        description={`This will permanently delete ${person.name} and all their necessities. This action cannot be undone.`}
        confirmLabel="Delete Forever"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deletePerson.isPending}
        variant="danger"
        iconName="alert-circle"
      />

      {/* Delete Necessity Confirmation Modal */}
      <ConfirmationModal
        visible={necessityToDelete !== null}
        title="Delete Necessity?"
        description={`This will permanently delete "${necessityToDelete?.name}". This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDeleteNecessity}
        onCancel={handleCancelDeleteNecessity}
        isLoading={deleteNecessity.isPending}
        variant="danger"
        iconName="heart-broken"
      />

      {/* Add Necessity Modal */}
      <AddNecessityModal
        visible={showAddNecessityModal}
        onConfirm={handleAddNecessity}
        onCancel={() => setShowAddNecessityModal(false)}
        isLoading={createNecessity.isPending}
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
    gap: SPACING.lg,
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
  avatarSection: {
    alignItems: "center",
    paddingVertical: SPACING.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
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
  necessitiesInfo: {
    gap: SPACING.lg,
  },
  necessitiesHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  necessitiesCountText: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: SPACING.xs,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
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
        elevation: 2,
      },
    }),
  },
  necessitiesList: {
    gap: SPACING.md,
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: SPACING.lg,
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
});
