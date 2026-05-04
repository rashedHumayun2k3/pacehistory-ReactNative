import React, { useState } from "react";
import { AchievementBadge } from "../../helpers/constantValues";

const { Pressable, ScrollView, StyleSheet, Text, View } = require("react-native");

interface CheckboxDropdownProps {
  achievementBadges: AchievementBadge[];
  onSelectionChange?: (selectedBadges: string[]) => void;
  dropdownLabel?: string;
}

const CheckboxDropdown: React.FC<CheckboxDropdownProps> = ({
  achievementBadges,
  onSelectionChange,
  dropdownLabel = "Select Achievements",
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  const handleCheckboxChange = (badgeName: string, checked: boolean) => {
    const updatedSelection = checked
      ? [...tempSelected, badgeName]
      : tempSelected.filter((name) => name !== badgeName);

    setTempSelected(updatedSelection);
    onSelectionChange?.(updatedSelection);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.dropdownButton} onPress={() => setDropdownOpen((value) => !value)}>
        <Text style={styles.dropdownButtonText}>{dropdownLabel}</Text>
      </Pressable>

      {dropdownOpen && (
        <ScrollView style={styles.menu} nestedScrollEnabled>
          {achievementBadges.map((badge) => {
            const badgeName = badge?.achievementBadgeName || "";
            const selected = tempSelected.includes(badgeName);

            return (
              <Pressable
                key={badge?.achievementBadgeId || badgeName || "unknown-id"}
                style={styles.option}
                onPress={() => handleCheckboxChange(badgeName, !selected)}
              >
                <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                  {selected && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={styles.optionText}>{badgeName || "Unnamed Badge"}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignSelf: "flex-start", minWidth: 190, position: "relative" },
  dropdownButton: { backgroundColor: "#fff", borderColor: "#ced4da", borderRadius: 6, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10 },
  dropdownButtonText: { color: "#111", fontSize: 13, fontWeight: "700" },
  menu: { backgroundColor: "#fff", borderColor: "#e5e7eb", borderRadius: 6, borderWidth: 1, marginTop: 4, maxHeight: 300, minWidth: 220 },
  option: { alignItems: "center", borderBottomColor: "#eee", borderBottomWidth: 1, flexDirection: "row", gap: 8, padding: 10 },
  checkbox: { alignItems: "center", borderColor: "#6c757d", borderRadius: 3, borderWidth: 1, height: 20, justifyContent: "center", width: 20 },
  checkboxSelected: { backgroundColor: "#0d6efd", borderColor: "#0d6efd" },
  checkMark: { color: "#fff", fontSize: 13, fontWeight: "800" },
  optionText: { color: "#111", flex: 1, fontSize: 13 },
});

export default CheckboxDropdown;
