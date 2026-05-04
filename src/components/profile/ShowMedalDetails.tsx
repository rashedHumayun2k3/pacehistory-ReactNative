import React, { useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchMedalListCustomByEventId } from "../../store/slices/medalListSlice";
import { AppDispatch, RootState } from "../../store/store";
import { IEvent } from "../../types/event/eventType.interface";
import { UserMedals } from "../../types/user/userProfile.interface";

interface ShowMedalDetailsProps {
  loggedInUser: number;
  event: IEvent;
  passSelectedMedalImage: (selectedImage: UserMedals) => void;
}

const FILE_SERVER =
  process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
  process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
  "";

const getImageUrl = (path?: string | null) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${FILE_SERVER}${path}`;
};

const ShowMedalDetails: React.FC<ShowMedalDetailsProps> = ({
  loggedInUser: _loggedInUser,
  event,
  passSelectedMedalImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { eventCustomMadelList, loading, errorMadelPicture } = useSelector((state: RootState) => state.medalList);

  const handleImageSelect = (selectedMedal: UserMedals) => {
    setSelectedImage(selectedMedal.medelPictureLink ?? null);
    passSelectedMedalImage(selectedMedal);
    setIsModalOpen(false);
  };

  const pickEventMedal = () => {
    if (!event?.eventId) return;
    dispatch(fetchMedalListCustomByEventId(event.eventId));
    setIsModalOpen(true);
  };

  if (!event?.eventId) {
    return <Text style={styles.muted}>Select an event to choose a medal.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Event Medal</Text>
      <Pressable style={styles.primaryButton} onPress={pickEventMedal}>
        <Text style={styles.primaryButtonText}>Pick Event Medal</Text>
      </Pressable>

      <Modal visible={isModalOpen} transparent animationType="fade" onRequestClose={() => setIsModalOpen(false)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Event Medal</Text>
              <Pressable style={styles.closeButton} onPress={() => setIsModalOpen(false)}>
                <Text style={styles.closeText}>x</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.medalList}>
              {loading.isCustomMadelList ? <Text style={styles.muted}>Loading medals...</Text> : null}
              {errorMadelPicture ? <Text style={styles.errorText}>{errorMadelPicture}</Text> : null}
              {!loading.isCustomMadelList && eventCustomMadelList.length === 0 ? (
                <Text style={styles.muted}>No medals found for this event.</Text>
              ) : null}

              {eventCustomMadelList.map((medal, index) => {
                const imageUri = getImageUrl(medal.medelPictureLink);
                return (
                  <Pressable
                    key={`${medal.eventMadelId ?? index}-${medal.medelPictureLink ?? "medal"}`}
                    style={styles.medalCard}
                    onPress={() => handleImageSelect(medal)}
                  >
                    {imageUri ? (
                      <Image source={{ uri: imageUri }} style={styles.medalImage} resizeMode="cover" />
                    ) : (
                      <View style={styles.emptyImage}>
                        <Text style={styles.muted}>No image</Text>
                      </View>
                    )}
                    <View style={styles.medalInfo}>
                      <Text style={styles.medalTitle}>{medal.titleOfMadelPicture || "Event Medal"}</Text>
                      <Text style={styles.medalMeta}>{medal.eventName || event.eventName || ""}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {selectedImage ? (
        <View style={styles.selectedWrap}>
          <Text style={styles.label}>Selected Medal</Text>
          <Image source={{ uri: getImageUrl(selectedImage) }} style={styles.selectedImage} resizeMode="cover" />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 8, width: "100%" },
  label: { color: "#111111", fontSize: 13, fontWeight: "700" },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#0d6efd",
    borderRadius: 6,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 14,
  },
  primaryButtonText: { color: "#ffffff", fontSize: 14, fontWeight: "700" },
  muted: { color: "#666666", fontSize: 13 },
  errorText: { color: "#dc3545", fontSize: 13 },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    maxHeight: "90%",
    overflow: "hidden",
  },
  modalHeader: {
    alignItems: "center",
    borderBottomColor: "#eeeeee",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  modalTitle: { color: "#111111", fontSize: 16, fontWeight: "700" },
  closeButton: {
    alignItems: "center",
    backgroundColor: "#dc3545",
    borderRadius: 4,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  closeText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  medalList: { gap: 10, padding: 12 },
  medalCard: {
    alignItems: "center",
    borderColor: "#eeeeee",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 8,
  },
  medalImage: { borderRadius: 6, height: 72, width: 72 },
  emptyImage: {
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  medalInfo: { flex: 1 },
  medalTitle: { color: "#111111", fontSize: 13, fontWeight: "700" },
  medalMeta: { color: "#666666", fontSize: 12, marginTop: 3 },
  selectedWrap: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 10,
  },
  selectedImage: { borderRadius: 6, height: 96, width: 96 },
});

export default ShowMedalDetails;
