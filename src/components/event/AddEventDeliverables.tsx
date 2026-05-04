import React, { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CommonEditorForHtml from "./CommonEditorForHtml";

interface AddEventDeliverablesProps {
  value: string;
  onChange: (content: string) => void;
}

const templateContent = `Event Deliverables for Participants

As part of the Boston Marathon 2025 experience, participants will receive thoughtfully curated deliverables and services.

Participant Perks
- Medals for Finishers
- T-Shirts for All Finishers
- Certificates for Finishers
- Starter Packs
- BIB Numbers
- Hydration
- Medical & Physiotherapy Support
- Food and Refreshments
- Washroom Facility
- Parking Facility
- Exclusive Photo and Video Documentation
- Pre-Race Warm-Up Session
- Live Tracking
- Post-Race Recovery Zone`;

const AddEventDeliverables: React.FC<AddEventDeliverablesProps> = ({ value, onChange }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDescriptionChange = useCallback(
    (event: { target: { value: string } }) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  const handleShowTemplate = () => {
    onChange(templateContent);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Deliverables for the Participants</Text>
      <Pressable style={[styles.helpButton, styles.maroon]} onPress={() => setShowModal(true)}>
        <Text style={styles.helpButtonText}>Click here to view a sample template.</Text>
      </Pressable>
      <CommonEditorForHtml
        placeholder="Please give participant deliverables about the event"
        name="deliverablesForTheParticipants"
        value={value}
        onChange={handleDescriptionChange}
      />
      <Modal transparent animationType="fade" visible={showModal} onRequestClose={() => setShowModal(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalPopup}>
            <View style={styles.closeRow}>
              <Pressable style={styles.closeButton} onPress={() => setShowModal(false)}>
                <Text style={styles.closeButtonText}>x</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.templateText}>{templateContent}</Text>
              <View style={styles.buttonRow}>
                <Pressable style={styles.primaryButton} onPress={handleShowTemplate}>
                  <Text style={styles.buttonText}>Get Template</Text>
                </Pressable>
                <Pressable style={styles.dangerButton} onPress={() => setShowModal(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  label: { color: "#444444", fontSize: 14, fontWeight: "600", marginBottom: 5, marginTop: 8 },
  helpButton: {
    alignSelf: "flex-start",
    backgroundColor: "green",
    borderRadius: 5,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  maroon: { backgroundColor: "#7a0000" },
  helpButtonText: { color: "#ffffff", fontSize: 13 },
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
  closeRow: { alignItems: "flex-end" },
  closeButton: {
    backgroundColor: "#af0000",
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  closeButtonText: { color: "#ffffff", fontWeight: "700" },
  modalBody: { maxHeight: 600, padding: 12 },
  templateText: { color: "#222222", fontSize: 12, lineHeight: 18 },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "flex-end",
    marginTop: 10,
  },
  primaryButton: { backgroundColor: "#337ab7", borderRadius: 4, padding: 10 },
  dangerButton: { backgroundColor: "#dc3545", borderRadius: 4, padding: 10 },
  buttonText: { color: "#ffffff", fontSize: 12, fontWeight: "700" },
});

export default AddEventDeliverables;
