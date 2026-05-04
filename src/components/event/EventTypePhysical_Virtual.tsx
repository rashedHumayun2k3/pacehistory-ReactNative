import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  selecteEventTypeValue: number | null;
  onEventTypeSelect: (selectedEventType: number | null) => void;
};

const eventTypes = [
  { id: 1, label: "Physical" },
  { id: 2, label: "Virtual" },
  { id: 3, label: "Hybrid" },
];

const EventTypePhysicalVirtual = ({ selecteEventTypeValue, onEventTypeSelect }: Props) => {
  return (
    <View style={styles.container}>
      {eventTypes.map((item) => {
        const selected = selecteEventTypeValue === item.id;

        return (
          <Pressable
            key={item.id}
            onPress={() => onEventTypeSelect(item.id)}
            style={[styles.option, selected && styles.selectedOption]}
          >
            <View style={[styles.radio, selected && styles.radioSelected]} />
            <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", paddingBottom: 10 },
  option: {
    alignItems: "center",
    backgroundColor: "#eeeeee",
    borderRadius: 5,
    flexDirection: "row",
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  selectedOption: { backgroundColor: "#575757" },
  optionText: { color: "#000000", fontSize: 13, fontWeight: "600" },
  selectedOptionText: { color: "#ffffff" },
  radio: {
    borderColor: "#333333",
    borderRadius: 6,
    borderWidth: 1,
    height: 12,
    marginRight: 8,
    width: 12,
  },
  radioSelected: { backgroundColor: "#ffffff" },
});

export default EventTypePhysicalVirtual;
