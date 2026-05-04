import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { achievementBadges } from "../../helpers/constantValues";

interface FilterProps {
  nameValue: string;
  isTrainerSelected: boolean | null;
  filteredSelected: string[];
  onNameChange: (filterName: string) => void;
  onFiltersChange: (filters: {
    isTrainer: boolean | null;
    selectedFilters: string[];
    selectedCountry: string;
  }) => void;
  onFilterReset: () => void;
  loggedInUserCountry: string;
  closeModal?: () => void;
}

const ProfileFilters = ({
  nameValue,
  isTrainerSelected,
  filteredSelected,
  onNameChange,
  onFiltersChange,
  onFilterReset,
  loggedInUserCountry,
  closeModal,
}: FilterProps) => {
  const [localNameFilter, setLocalNameFilter] = useState(nameValue);
  const [localCountry, setLocalCountry] = useState(loggedInUserCountry || "bd");
  const [localIsTrainer, setLocalIsTrainer] = useState(isTrainerSelected);
  const [tempSelected, setTempSelected] = useState<string[]>(filteredSelected || []);

  useEffect(() => {
    setLocalNameFilter(nameValue);
    setLocalCountry(loggedInUserCountry || "bd");
    setLocalIsTrainer(isTrainerSelected);
    setTempSelected(filteredSelected || []);
  }, [nameValue, loggedInUserCountry, isTrainerSelected, filteredSelected]);

  const handleCheckboxChange = (badge: string) => {
    setTempSelected((current) =>
      current.includes(badge)
        ? current.filter((item) => item !== badge)
        : [...current, badge]
    );
  };

  const handleSearch = () => {
    onNameChange(localNameFilter);
    onFiltersChange({
      isTrainer: localIsTrainer,
      selectedFilters: tempSelected,
      selectedCountry: localCountry,
    });
    closeModal?.();
  };

  const handleReset = () => {
    setLocalNameFilter("");
    setLocalCountry("bd");
    setLocalIsTrainer(false);
    setTempSelected([]);
    onFilterReset();
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowBlock}>
        <TextInput
          onChangeText={setLocalNameFilter}
          placeholder="Search by Name..."
          style={styles.input}
          value={localNameFilter}
        />
      </View>

      <View style={styles.filterBlackShadow}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: localIsTrainer === true }}
          onPress={() => setLocalIsTrainer((current) => !current)}
          style={styles.checkRow}
        >
          <View
            style={[
              styles.checkbox,
              localIsTrainer === true && styles.checkboxSelected,
            ]}
          >
            {localIsTrainer === true ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={styles.checkLabel}>Is Trainer</Text>
        </Pressable>

        <View style={styles.countryWrapper}>
          <Text style={styles.countryLabel}>Country</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={setLocalCountry}
            placeholder="bd"
            style={styles.countryInput}
            value={localCountry}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Select Badge for Filter</Text>

      <ScrollView nestedScrollEnabled style={styles.scrollableContainer}>
        <View style={styles.badgeContainer}>
          {achievementBadges.map((badge) => {
            const badgeName = badge?.achievementBadgeName || "";
            const selected = tempSelected.includes(badgeName);

            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                key={badge?.achievementBadgeId || badgeName || "unknown-id"}
                onPress={() => handleCheckboxChange(badgeName)}
                style={styles.badgeCheck}
              >
                <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                  {selected ? <Text style={styles.checkmark}>✓</Text> : null}
                </View>
                <Text style={styles.badgeText}>{badgeName || "Unnamed Badge"}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.actionRow}>
        <Pressable onPress={handleSearch} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>
            Search{tempSelected.length > 0 ? ` (${tempSelected.length})` : ""}
          </Text>
        </Pressable>

        <Pressable onPress={handleReset} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Clear Filter</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    width: "100%",
  },
  rowBlock: {
    padding: 10,
    width: "100%",
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#cccccc",
    borderRadius: 4,
    borderWidth: 1,
    color: "#111111",
    minHeight: 42,
    paddingHorizontal: 10,
    width: "100%",
  },
  filterBlackShadow: {
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    width: "100%",
  },
  checkRow: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 38,
  },
  checkbox: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#777777",
    borderRadius: 3,
    borderWidth: 1,
    height: 20,
    justifyContent: "center",
    marginRight: 8,
    width: 20,
  },
  checkboxSelected: {
    backgroundColor: "#337ab7",
    borderColor: "#337ab7",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
  checkLabel: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "500",
  },
  countryWrapper: {
    alignItems: "center",
    flexDirection: "row",
  },
  countryLabel: {
    color: "#333333",
    fontSize: 13,
    fontWeight: "700",
    marginRight: 6,
  },
  countryInput: {
    backgroundColor: "#ffffff",
    borderColor: "#cccccc",
    borderRadius: 4,
    borderWidth: 1,
    color: "#111111",
    minHeight: 36,
    minWidth: 80,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    backgroundColor: "#ffffff",
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
    paddingTop: 10,
    textAlign: "center",
  },
  scrollableContainer: {
    maxHeight: 280,
    paddingHorizontal: 10,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingVertical: 10,
  },
  badgeCheck: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#e0e0e0",
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 38,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#222222",
    fontSize: 13,
    maxWidth: 180,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#337ab7",
    borderColor: "#2e6da4",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    marginTop: 5,
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ProfileFilters;
