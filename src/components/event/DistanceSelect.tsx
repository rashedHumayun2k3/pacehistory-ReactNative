import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { raceDistanceConstact } from "../../helpers/constantValues";
import { AppDispatch, RootState } from "../../store/store";
import { fetchEventDistanceList } from "../../store/slices/eventSlice";

type Props = {
  eventId: number;
  eventDistance: string | null;
  onDistanceSelect: (selectedDistance: string | null) => void;
};

const colors = ["#ff6f61", "#6b8e23", "#4682b4", "#dda0dd", "#f4a460"];

const DistanceSelect = ({ eventId, eventDistance, onDistanceSelect }: Props) => {
  useSelector((state: RootState) => state.event.eventDistanceWithFeeList);
  const [selectedValue, setSelectedValue] = useState<number[]>([]);
  const [customDistance, setCustomDistance] = useState("");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (eventId > 0) {
      dispatch(fetchEventDistanceList(eventId));
    }
  }, [dispatch, eventId]);

  useEffect(() => {
    if (eventDistance) {
      const parsedValues = eventDistance
        .split(",")
        .map((value) => parseFloat(value))
        .filter((value) => !Number.isNaN(value));

      setSelectedValue((prev) => [...new Set([...prev, ...parsedValues])]);
    } else {
      setSelectedValue([]);
    }
  }, [eventDistance]);

  const updateSelection = (values: number[]) => {
    setSelectedValue(values);
    onDistanceSelect(values.length > 0 ? values.join(",") : null);
  };

  const toggleDistance = (value: number) => {
    const updatedValues = selectedValue.includes(value)
      ? selectedValue.filter((item) => item !== value)
      : [...selectedValue, value];

    updateSelection(updatedValues);
  };

  const handleAddCustom = () => {
    const value = parseFloat(customDistance);

    if (!Number.isNaN(value) && value >= 0 && !selectedValue.includes(value)) {
      updateSelection([...selectedValue, value]);
    }

    setCustomDistance("");
  };

  const handleClear = () => {
    updateSelection([]);
    setCustomDistance("");
  };

  const handleOk = () => {
    onDistanceSelect(selectedValue.length > 0 ? selectedValue.map((item) => `${item}`).join(", ") : null);
    setShowModal(false);
  };

  return (
    <View>
      {selectedValue.map((item, index) => (
        <View style={styles.triathlonContainer} key={`${item}-${index}`}>
          <Text style={styles.distanceText}>
            <Text style={styles.bold}>Distance:</Text> {item} km
          </Text>
        </View>
      ))}

      <View style={styles.right}>
        <Pressable style={styles.fullPrimaryButton} onPress={() => setShowModal(true)}>
          <Text style={styles.primaryButtonText}>Select Distance</Text>
        </Pressable>
      </View>

      <Modal transparent animationType="fade" visible={showModal} onRequestClose={() => setShowModal(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalPopup}>
            <View style={styles.closeRow}>
              <Text style={styles.modalHeader}>Select Distance From Checkbox</Text>
              <Pressable style={styles.closeButton} onPress={() => setShowModal(false)}>
                <Text style={styles.closeButtonText}>x</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.checkboxGroup}>
                {raceDistanceConstact.map((value, index) => {
                  const selected = selectedValue.includes(value);

                  return (
                    <Pressable
                      key={value}
                      onPress={() => toggleDistance(value)}
                      style={[styles.checkboxLabel, { backgroundColor: colors[index % colors.length] }]}
                    >
                      <View style={[styles.checkbox, selected && styles.checkboxSelected]} />
                      <Text style={styles.checkboxText}>{value} K</Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.customDistanceRow}>
                <TextInput
                  keyboardType="numeric"
                  placeholder="Add a custom distance"
                  value={customDistance}
                  onChangeText={setCustomDistance}
                  style={styles.formControl}
                />
                {parseFloat(customDistance) > 0 ? (
                  <Pressable onPress={handleAddCustom} style={styles.addButton}>
                    <Text style={styles.primaryButtonText}>Add</Text>
                  </Pressable>
                ) : null}
              </View>

              <View style={styles.selectedValues}>
                <Text style={styles.bold}>Selected Distances:</Text>
                <View style={styles.selectedValuesList}>
                  {selectedValue.length > 0 ? (
                    selectedValue.map((value) => (
                      <Text key={value} style={styles.selectedValue}>
                        {value}km
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.noSelection}>No distances selected.</Text>
                  )}
                </View>
              </View>

              {selectedValue.length > 0 ? (
                <View style={styles.buttonRowEnd}>
                  <Pressable style={styles.primaryButton} onPress={handleClear}>
                    <Text style={styles.primaryButtonText}>Clear</Text>
                  </Pressable>
                  <Pressable style={styles.primaryButton} onPress={handleOk}>
                    <Text style={styles.primaryButtonText}>Ok</Text>
                  </Pressable>
                </View>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  triathlonContainer: {
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    elevation: 1,
    marginBottom: 5,
    padding: 10,
  },
  distanceText: { fontSize: 16 },
  right: { alignItems: "flex-end" },
  fullPrimaryButton: {
    alignItems: "center",
    backgroundColor: "#337ab7",
    borderRadius: 4,
    margin: 5,
    padding: 9,
    width: "100%",
  },
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    padding: 12,
  },
  modalPopup: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    maxHeight: "90%",
    width: "100%",
  },
  closeRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalHeader: { fontSize: 16, paddingHorizontal: 10, paddingVertical: 4 },
  closeButton: {
    backgroundColor: "#af0000",
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  closeButtonText: { color: "#ffffff", fontSize: 18 },
  modalBody: { padding: 12 },
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
  checkbox: {
    backgroundColor: "#ffffff",
    borderColor: "#333333",
    borderRadius: 3,
    borderWidth: 1,
    height: 12,
    marginRight: 8,
    width: 12,
  },
  checkboxSelected: { backgroundColor: "#000000" },
  checkboxText: { color: "#000000", fontWeight: "500" },
  customDistanceRow: { flexDirection: "row", marginTop: 10 },
  formControl: {
    borderColor: "#dddddd",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  addButton: {
    alignItems: "center",
    backgroundColor: "#337ab7",
    borderRadius: 4,
    height: 40,
    justifyContent: "center",
    marginLeft: 4,
    width: 80,
  },
  selectedValues: { marginTop: 12 },
  selectedValuesList: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  selectedValue: {
    backgroundColor: "#000000",
    borderRadius: 10,
    color: "#ffffff",
    fontSize: 24,
    marginBottom: 5,
    marginRight: 5,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  noSelection: { color: "#777777" },
  buttonRowEnd: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: "#337ab7",
    borderRadius: 4,
    height: 35,
    justifyContent: "center",
    marginRight: 10,
    paddingHorizontal: 18,
  },
  primaryButtonText: { color: "#ffffff", fontSize: 12, textAlign: "center" },
  bold: { fontWeight: "700" },
});

export default DistanceSelect;
