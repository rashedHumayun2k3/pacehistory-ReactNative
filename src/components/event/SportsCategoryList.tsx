import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { categories } from "../../helpers/constantValues";

type Props = {
  selectedSportsCategories: string | null;
  onSportsCategoryChange: (selectedSportsCategories: string | null) => void;
};

const SportsCategoryList = ({ selectedSportsCategories, onSportsCategoryChange }: Props) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customText, setCustomText] = useState("");

  useEffect(() => {
    if (selectedSportsCategories) {
      setSelectedCategories(selectedSportsCategories.split(",").map((value) => value.trim()).filter(Boolean));
    } else {
      setSelectedCategories([]);
    }
  }, [selectedSportsCategories]);

  useEffect(() => {
    const values = [...selectedCategories, customText].filter(Boolean);
    onSportsCategoryChange(values.length > 0 ? values.join(",") : null);
  }, [selectedCategories, customText, onSportsCategoryChange]);

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  return (
    <View>
      <Text style={styles.label}>Sports Categories (You can select multiple categories)</Text>
      <View style={styles.checkboxGroup}>
        {categories
          .filter((category) => category.ParentCategoryId === null)
          .map((option) => {
            const selected = selectedCategories.includes(option.CategoryCode);

            return (
              <Pressable
                key={option.EventCategoryId}
                onPress={() => toggleCategory(option.CategoryCode)}
                style={styles.checkboxLabel}
              >
                <View style={[styles.checkbox, selected && styles.checkboxSelected]} />
                <Text style={styles.checkboxText}>
                  {option.Logo} {option.CategoryName}
                </Text>
              </Pressable>
            );
          })}
      </View>
      <TextInput
        placeholder="Add a custom category"
        value={customText}
        onChangeText={setCustomText}
        style={styles.formControl}
      />
      <View style={styles.selectedRow}>
        <Text>Selected Category(s): </Text>
        <Text style={styles.surfaceValue}>
          {[...selectedCategories, customText].filter(Boolean).join(", ")}
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
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    flexDirection: "row",
    margin: 5,
    padding: 5,
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

export default SportsCategoryList;
