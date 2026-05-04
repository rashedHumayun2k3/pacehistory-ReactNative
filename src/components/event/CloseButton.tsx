import React, { FC, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface CloseButtonProps {
  onClose: () => void;
}

const CloseButton: FC<CloseButtonProps> = ({ onClose }) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirmClose = () => {
    setShowModal(false);
    onClose();
  };

  return (
    <>
      <Pressable style={styles.dangerButton} onPress={() => setShowModal(true)}>
        <Text style={styles.buttonText}>Close</Text>
      </Pressable>

      <Modal transparent animationType="fade" visible={showModal} onRequestClose={() => setShowModal(false)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Confirmation</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Text style={styles.closeIcon}>x</Text>
              </Pressable>
            </View>
            <Text style={styles.bodyText}>
              Are you sure you want to close and not create an event? If you face any problem creating an event,
              you can contact us for support.
            </Text>
            <View style={styles.footer}>
              <Pressable style={styles.dangerButton} onPress={handleConfirmClose}>
                <Text style={styles.buttonText}>Yes, I want to close</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={() => setShowModal(false)}>
                <Text style={styles.buttonText}>No, I don't want to close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dangerButton: {
    alignItems: "center",
    backgroundColor: "#dc3545",
    borderRadius: 4,
    minHeight: 36,
    justifyContent: "center",
    marginBottom: 10,
    paddingHorizontal: 12,
    width: 180,
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#6c757d",
    borderRadius: 4,
    minHeight: 36,
    justifyContent: "center",
    marginTop: 8,
    paddingHorizontal: 12,
  },
  buttonText: { color: "#ffffff", fontSize: 12, fontWeight: "700", textAlign: "center" },
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    maxWidth: 520,
    padding: 15,
    width: "100%",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { fontSize: 18, fontWeight: "600" },
  closeIcon: { fontSize: 24 },
  bodyText: { color: "#444444", fontSize: 14, marginVertical: 14 },
  footer: { alignItems: "flex-start" },
});

export default CloseButton;
