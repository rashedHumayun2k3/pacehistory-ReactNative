import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AddNewDistanceProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddNewDistance: React.FC<AddNewDistanceProps> = ({ isOpen, onClose }) => {
  return (
    <Modal transparent animationType="fade" visible={isOpen} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.text}>This is a modal!</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  content: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    width: "100%",
  },
  text: { fontSize: 16, marginBottom: 12 },
  closeButton: { backgroundColor: "#dc3545", borderRadius: 4, padding: 10 },
  closeText: { color: "#ffffff", textAlign: "center" },
});

export default AddNewDistance;
