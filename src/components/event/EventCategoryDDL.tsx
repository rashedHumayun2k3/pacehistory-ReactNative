import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { categories } from "../../helpers/constantValues";

type Category = {
  EventCategoryId: number;
  ParentCategoryId: number | null;
  CategoryName: string;
  CategoryCode?: string;
};

type Props = {
  selectedCategoryId: number | null;
  onCategorySelect: (category: Category | null) => void;
};

const categoryIcons: { [key: number]: string } = {
  1: "Run",
  2: "Swim",
  3: "Cycle",
  4: "Trail",
  5: "Tri",
  6: "Adventure",
  7: "Winter",
  8: "Obstacle",
};

const EventCategoryDDL = ({ selectedCategoryId, onCategorySelect }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(selectedCategoryId);

  const groupedCategories = useMemo(
    () =>
      categories
        .filter((category) => category.ParentCategoryId === null)
        .map((parentCategory) => ({
          parentCategory,
          children: categories.filter(
            (category) => category.ParentCategoryId === parentCategory.EventCategoryId
          ),
        })),
    []
  );

  const handleSelect = (category: Category) => {
    setSelectedCategory(category.EventCategoryId);
    onCategorySelect(category);
  };

  return (
    <ScrollView style={styles.selectBox} nestedScrollEnabled>
      {groupedCategories.map(({ parentCategory, children }) => (
        <View key={parentCategory.EventCategoryId} style={styles.group}>
          <Text style={styles.groupLabel}>
            {categoryIcons[parentCategory.EventCategoryId] || ""} {parentCategory.CategoryName}
          </Text>
          {children.map((subcategory) => {
            const selected = selectedCategory === subcategory.EventCategoryId;

            return (
              <Pressable
                key={subcategory.EventCategoryId}
                onPress={() => handleSelect(subcategory)}
                style={[styles.option, selected && styles.selectedOption]}
              >
                <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
                  {subcategory.CategoryName}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  selectBox: {
    borderColor: "#dddddd",
    borderRadius: 3,
    borderWidth: 2,
    maxHeight: 220,
    width: "100%",
  },
  group: { paddingVertical: 4 },
  groupLabel: {
    backgroundColor: "#f0f0f0",
    fontSize: 14,
    fontWeight: "700",
    padding: 7,
  },
  option: { paddingHorizontal: 10, paddingVertical: 8 },
  selectedOption: { backgroundColor: "#575757" },
  optionText: { color: "#000000", fontSize: 14 },
  selectedOptionText: { color: "#ffffff", fontWeight: "700" },
});

export default EventCategoryDDL;
