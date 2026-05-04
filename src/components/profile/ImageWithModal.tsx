import React, { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface ImageWithModalProps {
  fileServerDomain?: string;
  imageUrl?: string | null;
  isNarrowSize?: boolean;
}

const getImageUrl = (path?: string | null, fileServerDomain = "") => {
  const server =
    fileServerDomain ||
    process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
    process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
    "";

  if (path) {
    return path.startsWith("http") ? path : `${server}${path}`;
  }

  return `${server}/images/image-not-found.png`;
};

const ImageWithModal: React.FC<ImageWithModalProps> = ({
  fileServerDomain,
  imageUrl,
  isNarrowSize,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const uri = getImageUrl(imageUrl, fileServerDomain);

  return (
    <>
      <Pressable onPress={() => setIsModalOpen(true)}>
        <Image
          source={{ uri }}
          style={isNarrowSize ? styles.narrowImage : styles.standardImage}
          resizeMode="cover"
        />
      </Pressable>
      <Modal
        visible={isModalOpen && Boolean(imageUrl)}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Image Preview</Text>
              <Pressable style={styles.closeButton} onPress={() => setIsModalOpen(false)}>
                <Text style={styles.closeText}>x</Text>
              </Pressable>
            </View>
            <Image source={{ uri }} style={styles.modalImage} resizeMode="contain" />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  narrowImage: { borderRadius: 6, height: 90, width: 70 },
  standardImage: { borderRadius: 6, height: 190, width: "100%" },
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  modal: { backgroundColor: "#ffffff", borderRadius: 8, maxHeight: "90%", padding: 12, width: "100%" },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerText: { color: "#111111", fontSize: 14, fontWeight: "700" },
  closeButton: { alignItems: "center", height: 34, justifyContent: "center", width: 34 },
  closeText: { color: "#111111", fontSize: 18, fontWeight: "700" },
  modalImage: { height: 350, width: "100%" },
});

export default ImageWithModal;
