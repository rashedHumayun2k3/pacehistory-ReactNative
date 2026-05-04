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

interface AddEventDescriptionProps {
  value: string;
  onChange: (content: string) => void;
}

const templateContent = `Join us for the Boston Marathon 2025, a celebration of endurance, community, and the vibrant spirit of runners from around the world.

Event Details
Date: Sunday, April 20, 2025
Location: Starting at Hopkinton, Massachusetts, USA
Distances: 5K, 10K, Half Marathon (21.1K), Full Marathon (42.2K)

Event Start Times
Full Marathon: 9:00 AM
Half Marathon: 9:30 AM
10K: 10:00 AM
5K: 10:30 AM

Course Highlights
Scenic Route: Experience the iconic Boston Marathon route, including Heartbreak Hill, Copley Square, and the cheering crowds of Boylston Street.
Fully Supported: Aid stations every 3 km with water, electrolytes, and medical assistance.
Safety Measures: Medical teams and volunteers stationed throughout the course to ensure runner safety.`;

const AddEventDescription: React.FC<AddEventDescriptionProps> = ({ value, onChange }) => {
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
      <Text style={styles.label}>Event Description</Text>
      <Pressable style={styles.helpButton} onPress={() => setShowModal(true)}>
        <Text style={styles.helpButtonText}>Click here to view a sample template.</Text>
      </Pressable>
      <CommonEditorForHtml
        placeholder="Please give a welcome message about the event"
        name="description"
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

export default AddEventDescription;
