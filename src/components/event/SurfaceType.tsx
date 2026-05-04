import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  selectedSurfaceType: string | null;
  onSurfaceTypeChange: (selectedSurfaceType: string | null) => void;
};

const surfaceOptions = [
  { label: "Road", color: "#a2ffa5" },
  { label: "Garden", color: "#4CAF50" },
  { label: "Trail", color: "#ef7015" },
  { label: "Forest", color: "#ef8b43" },
  { label: "Desert", color: "#ef8b43" },
  { label: "Snow", color: "#ef8b43" },
  { label: "Rocky", color: "#ef8b43" },
  { label: "Gravel", color: "#cb5e10" },
  { label: "Sand", color: "#F4A300" },
  { label: "Pavement", color: "#808080" },
  { label: "Open Water", color: "#1E90FF" },
  { label: "Pool", color: "#1E90FF" },
  { label: "Ocean", color: "#1E90FF" },
];

const SurfaceTypeSelector = ({ selectedSurfaceType, onSurfaceTypeChange }: Props) => {
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]);
  const [customText, setCustomText] = useState("");

  useEffect(() => {
    if (selectedSurfaceType) {
      setSelectedSurfaces(selectedSurfaceType.split(",").map((value) => value.trim()).filter(Boolean));
    } else {
      setSelectedSurfaces([]);
    }
  }, [selectedSurfaceType]);

  useEffect(() => {
    const values = [...selectedSurfaces, customText].filter(Boolean);
    onSurfaceTypeChange(values.length > 0 ? values.join(",") : null);
  }, [selectedSurfaces, customText, onSurfaceTypeChange]);

  const toggleSurface = (value: string) => {
    setSelectedSurfaces((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  return (
    <View>
      <Text style={styles.label}>Surface Type (You can select multiple surface)</Text>
      <View style={styles.checkboxGroup}>
        {surfaceOptions.map((option) => {
          const selected = selectedSurfaces.includes(option.label);

          return (
            <Pressable
              key={option.label}
              style={[styles.checkboxLabel, { backgroundColor: option.color }]}
              onPress={() => toggleSurface(option.label)}
            >
              <View style={[styles.checkbox, selected && styles.checkboxSelected]} />
              <Text style={styles.checkboxText}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <TextInput
        placeholder="Add a custom surface"
        value={customText}
        onChangeText={setCustomText}
        style={styles.formControl}
      />
      <View style={styles.selectedRow}>
        <Text>Selected Surface(s): </Text>
        <Text style={styles.surfaceValue}>
          {[...selectedSurfaces, customText].filter(Boolean).join(", ")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: { color: "#444444", fontSize: 14, fontWeight: "600", marginBottom: 5 },
  checkboxGroup: { flexDirection: "row", flexWrap: "wrap" },
  checkboxLabel: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    marginBottom: 6,
    marginRight: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  checkbox: { backgroundColor: "#ffffff", borderWidth: 1, height: 12, marginRight: 8, width: 12 },
  checkboxSelected: { backgroundColor: "#000000" },
  checkboxText: { color: "#000000", fontWeight: "500" },
  formControl: {
    borderColor: "#dddddd",
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    marginTop: 8,
    paddingHorizontal: 10,
  },
  selectedRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  surfaceValue: {
    backgroundColor: "#3e3e3e",
    borderColor: "#eeeeee",
    borderRadius: 4,
    borderWidth: 1,
    color: "#ffffff",
    marginLeft: 10,
    paddingHorizontal: 10,
  },
});

export default SurfaceTypeSelector;
