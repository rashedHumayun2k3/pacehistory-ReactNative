import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  status: "uploading" | "success" | "partial-fail" | "error" | null;
  errorMessage?: string;
  onClose: () => void;
  show: boolean;
}

const DataSaveStatusPopup: React.FC<Props> = ({ status, errorMessage, onClose, show }) => {
  if (!show || !status) return null;

  const titleMap = {
    uploading: "Uploading Images...",
    success: "Success",
    "partial-fail": "Partial Success",
    error: "Error",
  };

  const messageMap = {
    uploading: "Event saved. Uploading images...",
    success: "Event and all images saved successfully!",
    "partial-fail": "Event saved, but some images failed to upload.",
    error: errorMessage || "Unable to save event data.",
  };

  const borderStyle = {
    uploading: styles.borderInfo,
    success: styles.borderSuccess,
    "partial-fail": styles.borderWarning,
    error: styles.borderDanger,
  }[status];

  return (
    <Modal transparent animationType="fade" visible={show} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.modalContent, borderStyle]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{titleMap[status]}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>x</Text>
            </Pressable>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.message}>{messageMap[status]}</Text>
            <View style={styles.buttonRow}>
              <Pressable onPress={onClose} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    borderWidth: 2,
    maxWidth: 520,
    width: "100%",
  },
  borderInfo: { borderColor: "#0dcaf0" },
  borderSuccess: { borderColor: "#198754" },
  borderWarning: { borderColor: "#ffc107" },
  borderDanger: { borderColor: "#dc3545" },
  modalHeader: {
    alignItems: "center",
    borderBottomColor: "#e5e5e5",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  modalTitle: { fontSize: 18, fontWeight: "600" },
  closeButton: { paddingHorizontal: 8 },
  closeText: { fontSize: 24 },
  modalBody: { padding: 15 },
  message: { fontSize: 15 },
  buttonRow: { alignItems: "flex-end", marginTop: 16 },
  primaryButton: {
    backgroundColor: "#337ab7",
    borderColor: "#2e6da4",
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  primaryButtonText: { color: "#ffffff", fontSize: 14 },
});

export default DataSaveStatusPopup;
