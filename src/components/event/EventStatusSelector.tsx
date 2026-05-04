import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { statusOptions } from "../../helpers/constantValues";

type Props = {
  selectedStatus: number | null;
  onStatusChange: (newStatus: number | null) => void;
};

const EventStatusSelector = ({ selectedStatus, onStatusChange }: Props) => {
  const [selectedStatusInternal, setSelectedStatusInternal] = useState<number | null>(selectedStatus);

  useEffect(() => {
    setSelectedStatusInternal(selectedStatus);
  }, [selectedStatus]);

  const handleStatusChange = (newStatus: number) => {
    setSelectedStatusInternal(newStatus);
    onStatusChange(newStatus);
  };

  return (
    <View>
      <Text style={styles.label}>Event Status</Text>
      <View style={styles.radioGroup}>
        {statusOptions.map((option) => {
          const selected = selectedStatusInternal === option.EventStatusId;

          return (
            <Pressable
              key={option.EventStatusId}
              onPress={() => handleStatusChange(option.EventStatusId)}
              style={[
                styles.statusItem,
                { backgroundColor: selected ? option.color : "#eeeeee" },
                selected && styles.selectedStatus,
              ]}
            >
              <View style={[styles.radio, selected && styles.radioSelected]} />
              <Text style={[styles.statusText, selected && styles.selectedStatusText]}>
                {option.EventStatusName}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {selectedStatus === 1 ? (
        <View style={styles.warning}>
          <Text style={styles.warningText}>
            Event timing and schedule cannot be set while the status is Planning.
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  label: { color: "#444444", fontSize: 14, fontWeight: "600", marginBottom: 5 },
  radioGroup: { flexDirection: "row", flexWrap: "wrap" },
  statusItem: {
    alignItems: "center",
    borderRadius: 5,
    flexDirection: "row",
    marginHorizontal: 5,
    marginVertical: 3,
    paddingHorizontal: 10,
    paddingVertical: 4,
    width: 130,
  },
  selectedStatus: { borderColor: "#404040", borderWidth: 1 },
  statusText: { color: "#000000", fontSize: 13 },
  selectedStatusText: { color: "#ffffff", fontWeight: "700" },
  radio: {
    borderColor: "#333333",
    borderRadius: 6,
    borderWidth: 1,
    height: 12,
    marginRight: 8,
    width: 12,
  },
  radioSelected: { backgroundColor: "#ffffff" },
  warning: { backgroundColor: "#fff3cd", borderRadius: 4, marginTop: 8, padding: 8 },
  warningText: { color: "#856404", fontSize: 11 },
});

export default EventStatusSelector;
