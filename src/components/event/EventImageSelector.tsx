/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchEventDetails } from "../../store/slices/eventSlice";
import { deleteUploadImage } from "../../store/slices/uploadImageActivitiesSlice";

interface EventImageSelectorProp {
  handleImageUpload: (file: any, imageFor?: string) => void;
  previewUrlEventProfile: string | undefined;
  previewUrlEventMadel: string | undefined;
  actionType: string;
  selectedEventId: number;
  eventBannerPicture?: string | null;
  eventMadelPicture?: string | null;
}

const FILE_SERVER =
  process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
  process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
  "";

const createFileLike = (uri: string, fallbackName: string) => ({
  uri,
  name: uri.split("/").pop() || fallbackName,
  type: "image/jpeg",
});

const EventImageSelector: FC<EventImageSelectorProp> = ({
  handleImageUpload,
  previewUrlEventProfile,
  previewUrlEventMadel,
  actionType,
  eventBannerPicture,
  eventMadelPicture,
  selectedEventId,
}) => {
  const [showExistingBannerImage, setShowExistingBannerImage] = useState(true);
  const [showExistingMedalImage, setShowExistingMedalImage] = useState(true);
  const [imageUri, setImageUri] = useState(previewUrlEventProfile ?? "");
  const [medalImageUri, setMedalImageUri] = useState(previewUrlEventMadel ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const { imageDelete } = useSelector((state: RootState) => state.uploadImage);

  useEffect(() => {
    setImageUri(previewUrlEventProfile ?? "");
  }, [previewUrlEventProfile]);

  useEffect(() => {
    setMedalImageUri(previewUrlEventMadel ?? "");
  }, [previewUrlEventMadel]);

  const handleDeleteImage = (uploadPurpose: string, tableName: string, imageName: string) => {
    dispatch(
      deleteUploadImage({
        userId: 0,
        eventId: selectedEventId ?? 0,
        uploadPurpose,
        tableName,
        imageName,
      })
    );
  };

  useEffect(() => {
    if (selectedEventId > 0) {
      dispatch(fetchEventDetails(selectedEventId.toString()));
    }
  }, [dispatch, imageDelete, selectedEventId]);

  const handleUseProfileImage = () => {
    if (!imageUri.trim()) return;

    handleImageUpload(createFileLike(imageUri.trim(), "event-profile.jpg"), "EventProfile");
  };

  const handleUseMedalImage = () => {
    if (!medalImageUri.trim()) return;

    handleImageUpload(createFileLike(medalImageUri.trim(), "event-medal.jpg"), "EventMadel");
  };

  const existingBannerUri = eventBannerPicture ? `${FILE_SERVER}${eventBannerPicture}` : "";
  const existingMedalUri = eventMadelPicture ? `${FILE_SERVER}${eventMadelPicture}` : "";

  return (
    <View style={styles.row}>
      {actionType === "Edit" && eventBannerPicture && showExistingBannerImage ? (
        <View style={styles.imageCard}>
          <Image source={{ uri: existingBannerUri }} resizeMode="cover" style={styles.fixedImage} />
          <View style={styles.imageActions}>
            <Pressable onPress={() => setShowExistingBannerImage(false)} style={styles.iconButton}>
              <Text style={styles.iconText}>Edit</Text>
            </Pressable>
            <Pressable
              onPress={() => handleDeleteImage("EventBanner", "Event", eventBannerPicture)}
              style={styles.deleteButton}
            >
              <Text style={styles.iconText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <ImageInputBlock
          label="Event Profile Picture"
          imageUri={imageUri}
          setImageUri={setImageUri}
          onUseImage={handleUseProfileImage}
        />
      )}

      {actionType === "Edit" && eventMadelPicture && showExistingMedalImage ? (
        <View style={styles.imageCard}>
          <Image source={{ uri: existingMedalUri }} resizeMode="cover" style={styles.fixedImage} />
          <View style={styles.imageActions}>
            <Pressable onPress={() => setShowExistingMedalImage(false)} style={styles.iconButton}>
              <Text style={styles.iconText}>Edit</Text>
            </Pressable>
            <Pressable
              onPress={() => handleDeleteImage("Medals", "Event", eventMadelPicture)}
              style={styles.deleteButton}
            >
              <Text style={styles.iconText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <ImageInputBlock
          label="Event Medal Picture"
          imageUri={medalImageUri}
          setImageUri={setMedalImageUri}
          onUseImage={handleUseMedalImage}
        />
      )}
    </View>
  );
};

const ImageInputBlock = ({
  label,
  imageUri,
  setImageUri,
  onUseImage,
}: {
  label: string;
  imageUri: string;
  setImageUri: (value: string) => void;
  onUseImage: () => void;
}) => (
  <View style={styles.uploadBlock}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      placeholder="Paste local/image URI"
      value={imageUri}
      onChangeText={setImageUri}
      style={styles.input}
    />
    {imageUri ? <Image source={{ uri: imageUri }} resizeMode="cover" style={styles.preview} /> : null}
    <Pressable onPress={onUseImage} style={styles.primaryButton}>
      <Text style={styles.primaryButtonText}>Use Image</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  row: { width: "100%" },
  imageCard: {
    backgroundColor: "#a1a1a1",
    borderRadius: 8,
    elevation: 3,
    marginBottom: 12,
    overflow: "hidden",
    position: "relative",
    width: 300,
  },
  fixedImage: { height: 200, width: "100%" },
  imageActions: { flexDirection: "row", justifyContent: "space-around", padding: 8 },
  iconButton: { backgroundColor: "#545e95", borderRadius: 4, padding: 8 },
  deleteButton: { backgroundColor: "#dc3545", borderRadius: 4, padding: 8 },
  iconText: { color: "#ffffff", fontSize: 12 },
  uploadBlock: { marginBottom: 12, width: "100%" },
  label: { color: "#444444", fontSize: 14, fontWeight: "600", marginBottom: 5 },
  input: {
    borderColor: "#cccccc",
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  preview: { borderRadius: 8, height: 160, marginTop: 8, width: "100%" },
  primaryButton: {
    backgroundColor: "#337ab7",
    borderRadius: 4,
    marginTop: 8,
    padding: 10,
    width: 180,
  },
  primaryButtonText: { color: "#ffffff", textAlign: "center" },
});

export default EventImageSelector;
