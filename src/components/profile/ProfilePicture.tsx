import React, { useState } from "react";
import { Alert, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { UserProfile } from "../../types/user/userProfile.interface";

interface ProfilePictureProps {
  userProfileDetails: UserProfile | null | undefined;
  onClose: (loggedInUserId: number) => void;
  showEditActivity?: boolean;
  fileServerDomain?: string;
}

const getImageUrl = (path?: string | null, fallback?: string, fileServerDomain = "") => {
  const server =
    fileServerDomain ||
    process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
    process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
    "";

  if (path) {
    return path.startsWith("http") ? path : `${server}${path}`;
  }

  return `${server}${fallback ?? ""}`;
};

const ProfilePicture = ({
  userProfileDetails,
  onClose,
  showEditActivity,
  fileServerDomain,
}: ProfilePictureProps) => {
  const [showModalBanner, setShowModalBanner] = useState(false);
  const [showModalProfile, setShowModalProfile] = useState(false);

  const imageActionStatus = (isSavedImage: boolean) => {
    if (isSavedImage) {
      setShowModalProfile(false);
      setShowModalBanner(false);
      onClose(userProfileDetails?.id ?? 0);
    } else {
      Alert.alert("Upload failed", "We encountered an issue while saving your image. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bannerWrap}>
        <Image
          source={{ uri: getImageUrl(userProfileDetails?.imageProfileBanner, "/images/profile-banner.jpg", fileServerDomain) }}
          style={styles.banner}
          resizeMode="cover"
        />
        {showEditActivity ? (
          <Pressable style={[styles.cameraButton, styles.bannerCamera]} onPress={() => setShowModalBanner(true)}>
            <Text style={styles.cameraText}>Camera</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.profileWrap}>
        <Image
          source={{ uri: getImageUrl(userProfileDetails?.imageProfilePicture, "/images/user-profile.jpg", fileServerDomain) }}
          style={styles.profileImage}
          resizeMode="cover"
        />
        {showEditActivity ? (
          <Pressable style={[styles.cameraButton, styles.profileCamera]} onPress={() => setShowModalProfile(true)}>
            <Text style={styles.cameraText}>Camera</Text>
          </Pressable>
        ) : null}
      </View>

      <UploadModal
        title="Change Banner Picture"
        saveLabel="Save Banner Image"
        visible={showModalBanner}
        onClose={() => setShowModalBanner(false)}
        onSave={() => imageActionStatus(true)}
      />
      <UploadModal
        title="Change Profile Picture"
        saveLabel="Save Profile Image"
        visible={showModalProfile}
        onClose={() => setShowModalProfile(false)}
        onSave={() => imageActionStatus(true)}
      />
    </View>
  );
};

const UploadModal = ({
  visible,
  title,
  saveLabel,
  onClose,
  onSave,
}: {
  visible: boolean;
  title: string;
  saveLabel: string;
  onClose: () => void;
  onSave: () => void;
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>x</Text>
          </Pressable>
        </View>
        <Pressable style={styles.uploadBox}>
          <Text style={styles.uploadText}>Select image</Text>
        </Pressable>
        <View style={styles.modalActions}>
          <Pressable style={styles.primaryButton} onPress={onSave}>
            <Text style={styles.buttonText}>{saveLabel}</Text>
          </Pressable>
          <Pressable style={styles.dangerButton} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: { alignItems: "center", marginBottom: 4 },
  bannerWrap: { position: "relative", width: "100%" },
  banner: { height: 156, width: "100%" },
  profileWrap: { marginTop: -48, position: "relative" },
  profileImage: { borderColor: "#ffffff", borderRadius: 60, borderWidth: 4, height: 120, width: 120 },
  cameraButton: {
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    position: "absolute",
    width: 36,
  },
  bannerCamera: { left: 0, top: 20 },
  profileCamera: { left: 0, top: 10 },
  cameraText: { color: "#ffffff", fontSize: 9, fontWeight: "800" },
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  modal: { backgroundColor: "#ffffff", borderRadius: 8, padding: 12, width: "100%" },
  modalHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  modalTitle: { color: "#111111", fontSize: 18, fontWeight: "800" },
  closeButton: { alignItems: "center", height: 34, justifyContent: "center", width: 34 },
  closeText: { color: "#111111", fontSize: 18, fontWeight: "700" },
  uploadBox: {
    alignItems: "center",
    borderColor: "#ced4da",
    borderRadius: 8,
    borderStyle: "dashed",
    borderWidth: 1,
    height: 180,
    justifyContent: "center",
    marginVertical: 12,
  },
  uploadText: { color: "#0d6efd", fontWeight: "800" },
  modalActions: { flexDirection: "row", gap: 10, justifyContent: "flex-end" },
  primaryButton: { backgroundColor: "#0d6efd", borderRadius: 6, paddingHorizontal: 14, paddingVertical: 10 },
  dangerButton: { backgroundColor: "#dc3545", borderRadius: 6, paddingHorizontal: 14, paddingVertical: 10 },
  buttonText: { color: "#ffffff", fontWeight: "800" },
});

export default ProfilePicture;
