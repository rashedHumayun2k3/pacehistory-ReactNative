/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { achievementBadges, sportsApplicationList } from "../../helpers/constantValues";
import {
  clearEventState,
  deleteParticipatedEventResult,
  insertEventActivity,
  updateEventActivity,
} from "../../store/slices/eventResultAddEditSlice";
import { fetchuserEventResult } from "../../store/slices/eventResultSlice";
import { fetchEventDetails } from "../../store/slices/eventSlice";
import { fetchUserEventActivities } from "../../store/slices/eventActivitiesSlice";
import { fetchMedalInfoByEventId } from "../../store/slices/medalListSlice";
import { deleteUploadImage } from "../../store/slices/uploadImageActivitiesSlice";
import { AppDispatch, RootState } from "../../store/store";
import { IEvent } from "../../types/event/eventType.interface";
import {
  ParticipatedEventResult,
  UserMedals,
  UserProfile,
} from "../../types/user/userProfile.interface";
import CustomNewEvent from "./customNewEvent";
import ShowEventDetails from "./showEventDetails";
import ShowMedalDetails from "./ShowMedalDetails";

interface EditProfileProps {
  loggedInUser: UserProfile | null;
  actionType: string;
  actionTitle: string;
  onClose: () => void;
  selectedActivityResult?: ParticipatedEventResult;
}

const getImageUrl = (path?: string | null) =>
  `${process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME || process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME || ""}${path ?? ""}`;

const initialResult = (loggedInUser: UserProfile | null): ParticipatedEventResult => ({
  resultId: 0,
  userId: loggedInUser?.id || 0,
  userName: `${loggedInUser?.firstName ?? ""} ${loggedInUser?.lastName ?? ""}`,
  eventId: 0,
  eventName: "",
  eventYear: 2025,
  bibNumber: "",
  raceDistance: "",
  finishTime: "",
  pace: "",
  raceScore: 0,
  ageGroupRank: 0,
  genderWiseRank: 0,
  isBigAchievement: false,
  isPersonalBest: false,
  isAgeGroupWinner: false,
  difficulty: "",
  personalComment: "",
  historyOfTheAchievement: "",
  trackingAppName: "Strava",
  trackingRecordLink: "",
  eventResultLink: "",
  isPacer: false,
  isRaceAmbassador: false,
  imageEventFinisher: "",
  imageCertificate: "",
  imageMedalPicture: "",
  eventMadelId: 0,
  elevationGain: 0,
  elevationLoss: 0,
  achievementBadgeId: 0,
});

const ParticipatedEventEntry: React.FC<EditProfileProps> = ({
  loggedInUser,
  actionType,
  actionTitle,
  onClose,
  selectedActivityResult,
}) => {
  const [formData, setFormData] = useState<ParticipatedEventResult>(initialResult(loggedInUser));
  const [selectedEvent, setSelectedEvent] = useState<IEvent>();
  const [showExistingMedalImage, setShowExistingMedalImage] = useState(true);
  const [showExistingFinisherImage, setShowExistingFinisherImage] = useState(true);
  const [showExistingCertificateImage, setShowExistingCertificateImage] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { eventDetails } = useSelector((state: RootState) => state.event);
  const { userEventResult } = useSelector((state: RootState) => state.eventResult);
  const { eventResultAfterInsertUpdate, isEventDeleted } = useSelector((state: RootState) => state.eventResultAddEdit);
  const { isImageDeletedSuccessfully } = useSelector((state: RootState) => state.uploadImage);

  useEffect(() => {
    dispatch(clearEventState());
  }, [dispatch]);

  useEffect(() => {
    if (eventDetails) setSelectedEvent(eventDetails);
  }, [eventDetails]);

  useEffect(() => {
    if (selectedActivityResult) {
      setFormData((prev) => ({ ...prev, ...selectedActivityResult }));
      setShowForm(actionType === "Edit");
    }
  }, [actionType, selectedActivityResult]);

  useEffect(() => {
    if (actionType === "Edit" && userEventResult?.[0]) {
      setFormData((prev) => ({ ...prev, ...userEventResult[0] }));
      setShowForm(true);
    }
  }, [actionType, userEventResult]);

  useEffect(() => {
    if (!loggedInUser || (loggedInUser.id ?? 0) < 1) {
      Alert.alert("Login required", "Please login to continue.");
      onClose();
      return;
    }
    setFormData((prev) => ({
      ...prev,
      userId: loggedInUser.id ?? 0,
      userName: `${loggedInUser.firstName ?? ""} ${loggedInUser.lastName ?? ""}`,
    }));
  }, [loggedInUser, onClose]);

  useEffect(() => {
    if (eventResultAfterInsertUpdate && eventResultAfterInsertUpdate?.eventId) {
      dispatch(clearEventState());
      onClose();
    }
  }, [dispatch, eventResultAfterInsertUpdate, onClose]);

  useEffect(() => {
    if (isImageDeletedSuccessfully === true) {
      dispatch(fetchuserEventResult({
        userId: loggedInUser?.id?.toString() ?? "0",
        eventId: selectedEvent?.eventId?.toString() ?? "0",
      }));
    }
  }, [dispatch, isImageDeletedSuccessfully, loggedInUser?.id, selectedEvent?.eventId]);

  useEffect(() => {
    if (isEventDeleted === true) {
      Alert.alert("Deleted", "The record has been successfully deleted.");
      onClose();
    }
  }, [isEventDeleted, onClose]);

  const handleEventChange = (event: { eventId: number; eventName: string }) => {
    setFormData((prev) => ({ ...prev, eventId: event.eventId, eventName: event.eventName }));
    if (event.eventId > 0) {
      dispatch(fetchMedalInfoByEventId(event.eventId));
      dispatch(fetchEventDetails(event.eventId.toString()));
    }
  };

  const setField = (name: keyof ParticipatedEventResult, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (formData.eventId === 0) {
      Alert.alert("Event required", "Please select an event from event list");
      return;
    }
    if (formData.achievementBadgeId === 0) {
      Alert.alert("Achievement badge required", "Please select an achievement badge from the list");
      return;
    }
    try {
      if (formData.resultId === 0) await dispatch(insertEventActivity(formData)).unwrap();
      else await dispatch(updateEventActivity(formData)).unwrap();
      dispatch(fetchUserEventActivities(loggedInUser?.id ?? 0));
    } catch (error) {
      console.error("Failed to add event activity:", error);
    }
  };

  const handleDeleteImage = (uploadPurpose: string, imageName: string) => {
    Alert.alert("Delete image", "Are you sure you want to delete this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          dispatch(deleteUploadImage({
            userId: (loggedInUser?.id ?? 0).toString(),
            eventId: selectedEvent?.eventId ?? 0,
            uploadPurpose,
            tableName: "ParticipatedEvent",
            imageName,
          })),
      },
    ]);
  };

  const updateMedalImageData = (selectedMedal: UserMedals) => {
    setFormData((prev) => ({
      ...prev,
      imageMedalPicture: selectedMedal.medelPictureLink ?? "",
      eventMadelId: selectedMedal.eventMadelId ?? 0,
    }));
  };

  const handleBadgeChange = (badgeId: number | null) => {
    const selectedBadge = achievementBadges.find((badge) => badge.achievementBadgeId === badgeId);
    setFormData((prev) => ({
      ...prev,
      achievementBadgeId: badgeId ?? 0,
      raceDistance: selectedBadge?.generalDistance != null ? selectedBadge.generalDistance.toString() : "",
    }));
  };

  const handleDelete = () => {
    const resultId = selectedActivityResult?.resultId ?? 0;
    const userId = loggedInUser?.id ?? 0;
    if (userId < 1 || resultId < 1) return;
    Alert.alert("Delete Activity", "Deleting this record will permanently remove it from our system. Are you sure you want to proceed?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => dispatch(deleteParticipatedEventResult({ userId, resultId })) },
    ]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <Text style={styles.title}>{actionTitle}</Text>
          <View style={styles.actionRow}>
            <Pressable style={styles.primaryButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{actionType === "Edit" ? "Edit Activity" : "Save Activity"}</Text>
            </Pressable>
            <Pressable style={styles.dangerButton} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          {actionType === "Add" ? (
            <View style={styles.section}>
              <CustomNewEvent formData={formData} handleEventChange={handleEventChange} />
            </View>
          ) : null}

          {formData.eventId > 0 ? (
            <View style={styles.section}>
              <ShowEventDetails selectedEvent={selectedEvent ?? null} eventRaceDistanceDetails={eventDetails?.raceDistance ?? null} />
            </View>
          ) : null}

          <View style={styles.section}>
            {actionType === "Edit" && formData.imageMedalPicture && showExistingMedalImage ? (
              <ImagePreview title="Medal picture" image={formData.imageMedalPicture} onEdit={() => setShowExistingMedalImage(false)} />
            ) : (
              formData.eventId > 0 && <ShowMedalDetails loggedInUser={loggedInUser?.id ?? 0} event={selectedEvent || ({} as IEvent)} passSelectedMedalImage={updateMedalImageData} />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Achievement Badge</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorList}>
              <Pressable style={[styles.selectorOption, formData.achievementBadgeId === 0 && styles.selectorSelected]} onPress={() => handleBadgeChange(null)}>
                <Text style={[styles.selectorText, formData.achievementBadgeId === 0 && styles.selectorTextSelected]}>Select</Text>
              </Pressable>
              {achievementBadges.map((badge) => (
                <Pressable key={badge.achievementBadgeId} style={[styles.selectorOption, formData.achievementBadgeId === badge.achievementBadgeId && styles.selectorSelected]} onPress={() => handleBadgeChange(badge.achievementBadgeId)}>
                  <Text style={[styles.selectorText, formData.achievementBadgeId === badge.achievementBadgeId && styles.selectorTextSelected]}>{badge.achievementBadgeName}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Text style={styles.label}>Your Race Distance(Km)</Text>
            <TextInput style={styles.input} maxLength={3} keyboardType="decimal-pad" value={formData.raceDistance ?? ""} onChangeText={(value) => /^\d*\.?\d*$/.test(value) && setField("raceDistance", value)} />
          </View>

          {!showForm ? (
            <Pressable style={styles.addMoreButton} onPress={() => setShowForm(true)}>
              <Text style={styles.addMoreText}>You can also add finish time, pace, tracking details, etc. to showcase your achievement</Text>
            </Pressable>
          ) : null}

          {showForm ? (
            <>
              <View style={styles.section}>
                <NumberInput label="Elevation Gain (m)" value={formData.elevationGain} onChange={(value) => setField("elevationGain", value)} />
                <NumberInput label="Elevation Loss (m)" value={formData.elevationLoss} onChange={(value) => setField("elevationLoss", value)} />
              </View>

              <View style={styles.blackSection}>
                <TextInputField label="BIB Number" value={formData.bibNumber ?? ""} maxLength={6} onChange={(value) => setField("bibNumber", value)} dark />
                <TextInputField label="Finish Time(ex: hh:mm:ss)" value={formData.finishTime ?? ""} maxLength={12} placeholder="Please give the finished time" onChange={(value) => /^[\d:]*$/.test(value) && setField("finishTime", value)} dark />
                <TextInputField label="Pace(min/km)" value={formData.pace ?? ""} maxLength={5} placeholder="mm:ss or mm.ss" onChange={(value) => /^[0-9:.]*$/.test(value) && setField("pace", value)} dark />
                <NumberInput label="Rank(Overall)" value={formData.raceScore} onChange={(value) => setField("raceScore", value)} dark />
                <NumberInput label="Rank(Age Category)" value={formData.ageGroupRank} onChange={(value) => setField("ageGroupRank", value)} dark />
                <NumberInput label="Rank(Gender Category)" value={formData.genderWiseRank} onChange={(value) => setField("genderWiseRank", value)} dark />
              </View>

              <View style={styles.section}>
                <CheckRow label="This is my major achievement" value={formData.isBigAchievement} onPress={() => setField("isBigAchievement", !formData.isBigAchievement)} />
                <CheckRow label="This is my personal best record" value={formData.isPersonalBest} onPress={() => setField("isPersonalBest", !formData.isPersonalBest)} />
                <CheckRow label="I am age group winner" value={formData.isAgeGroupWinner} onPress={() => setField("isAgeGroupWinner", !formData.isAgeGroupWinner)} />
                <CheckRow label="I am pacer of this race" value={formData.isPacer} onPress={() => setField("isPacer", !formData.isPacer)} />
              </View>

              <View style={styles.orangeSection}>
                <Text style={styles.label}>Select record tracker app</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorList}>
                  {sportsApplicationList.map((app) => (
                    <Pressable key={app.runningAppID} style={[styles.selectorOption, formData.trackingAppName === app.appName && styles.selectorSelected]} onPress={() => setField("trackingAppName", app.appName)}>
                      <Text style={[styles.selectorText, formData.trackingAppName === app.appName && styles.selectorTextSelected]}>{app.appName}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <TextInput style={styles.input} maxLength={500} placeholder="Enter your activity link" value={formData.trackingRecordLink ?? ""} onChangeText={(value) => setField("trackingRecordLink", value)} />
              </View>

              <TextInputField label="Personal Comment" value={formData.personalComment ?? ""} maxLength={500} placeholder="Provide additional comments or feedback, if applicable." onChange={(value) => setField("personalComment", value)} multiline />
              <TextInputField label="History of Achievement" value={formData.historyOfTheAchievement ?? ""} maxLength={500} placeholder="Provide the history of the achievement, if applicable" onChange={(value) => setField("historyOfTheAchievement", value)} multiline />
              <TextInputField label="Event Result Link" value={formData.eventResultLink ?? ""} maxLength={500} placeholder="Enter the result link provided by the event organizer after publication" onChange={(value) => setField("eventResultLink", value)} />

              <View style={styles.section}>
                {actionType === "Edit" && formData.imageEventFinisher && showExistingFinisherImage ? (
                  <ImagePreview title="Finisher picture / Your best picture" image={formData.imageEventFinisher} onEdit={() => setShowExistingFinisherImage(false)} onDelete={() => handleDeleteImage("UserActivities", formData.imageEventFinisher)} />
                ) : (
                  <UploadBox title="Your best picture of this event" />
                )}
              </View>
              <View style={styles.section}>
                {actionType === "Edit" && formData.imageCertificate && showExistingCertificateImage ? (
                  <ImagePreview title="Certificate of the event" image={formData.imageCertificate} onEdit={() => setShowExistingCertificateImage(false)} onDelete={() => handleDeleteImage("Certificates", formData.imageCertificate)} />
                ) : (
                  <UploadBox title="Upload certificate of this event" />
                )}
              </View>
            </>
          ) : null}

          <View style={styles.bottomActions}>
            <Pressable style={styles.primaryButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{actionType === "Edit" ? "Edit Activity" : "Save Activity"}</Text>
            </Pressable>
            <Pressable style={styles.dangerButton} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
            {actionType === "Edit" ? (
              <Pressable style={styles.deleteActivityButton} onPress={handleDelete}>
                <Text style={styles.buttonText}>Delete Activity</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const TextInputField = ({ label, value, onChange, maxLength, placeholder, multiline, dark }: { label: string; value: string; onChange: (value: string) => void; maxLength?: number; placeholder?: string; multiline?: boolean; dark?: boolean }) => (
  <View style={styles.field}>
    <Text style={dark ? styles.whiteLabel : styles.label}>{label}</Text>
    <TextInput style={[styles.input, multiline && styles.textArea]} value={value} onChangeText={onChange} maxLength={maxLength} placeholder={placeholder} multiline={multiline} placeholderTextColor="#777" />
  </View>
);

const NumberInput = ({ label, value, onChange, dark }: { label: string; value: number; onChange: (value: number) => void; dark?: boolean }) => (
  <TextInputField label={label} value={value?.toString() ?? ""} onChange={(text) => onChange(Number(text || 0))} maxLength={5} dark={dark} />
);

const CheckRow = ({ label, value, onPress }: { label: string; value?: boolean; onPress: () => void }) => (
  <Pressable style={styles.checkRow} onPress={onPress}>
    <View style={[styles.checkbox, value && styles.checkboxSelected]}>{value ? <Text style={styles.checkMark}>Y</Text> : null}</View>
    <Text style={styles.checkLabel}>{label}</Text>
  </Pressable>
);

const ImagePreview = ({ title, image, onEdit, onDelete }: { title: string; image: string; onEdit: () => void; onDelete?: () => void }) => (
  <View style={styles.imagePreviewWrap}>
    <Text style={styles.label}>{title}</Text>
    <Image source={{ uri: getImageUrl(image) }} style={styles.previewImage} resizeMode="cover" />
    <View style={styles.imageActions}>
      <Pressable style={styles.primarySmallButton} onPress={onEdit}>
        <Text style={styles.buttonText}>Edit</Text>
      </Pressable>
      {onDelete ? (
        <Pressable style={styles.dangerSmallButton} onPress={onDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </Pressable>
      ) : null}
    </View>
  </View>
);

const UploadBox = ({ title }: { title: string }) => (
  <Pressable style={styles.uploadBox}>
    <Text style={styles.uploadTitle}>{title}</Text>
    <Text style={styles.uploadText}>Select image</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  container: { backgroundColor: "#111111", flex: 1 },
  content: { padding: 12 },
  headerRow: { gap: 10, marginBottom: 12 },
  title: { color: "#ffffff", fontSize: 22, fontWeight: "800" },
  actionRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: { backgroundColor: "#ffffff", borderRadius: 8, elevation: 3, padding: 12 },
  section: { borderColor: "#dddddd", borderRadius: 6, borderWidth: 1, gap: 8, marginBottom: 12, padding: 10 },
  blackSection: { backgroundColor: "#000000", borderRadius: 6, gap: 8, marginBottom: 12, padding: 10 },
  orangeSection: { backgroundColor: "#ff8b2c", borderRadius: 6, gap: 8, marginBottom: 12, padding: 10 },
  label: { color: "#111111", fontSize: 13, fontWeight: "700", marginBottom: 5 },
  whiteLabel: { color: "#ffffff", fontSize: 13, fontWeight: "700", marginBottom: 5 },
  field: { gap: 5, marginBottom: 10 },
  input: { backgroundColor: "#ffffff", borderColor: "#ced4da", borderRadius: 6, borderWidth: 1, color: "#111111", minHeight: 42, paddingHorizontal: 10 },
  textArea: { minHeight: 90, paddingTop: 10, textAlignVertical: "top" },
  selectorList: { gap: 6, paddingBottom: 8 },
  selectorOption: { backgroundColor: "#ffffff", borderColor: "#ced4da", borderRadius: 5, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8 },
  selectorSelected: { backgroundColor: "#0d6efd", borderColor: "#0d6efd" },
  selectorText: { color: "#111111", fontSize: 12 },
  selectorTextSelected: { color: "#ffffff", fontWeight: "700" },
  addMoreButton: { backgroundColor: "#e9f5ff", borderColor: "#0d6efd", borderRadius: 6, borderWidth: 1, marginBottom: 12, padding: 12 },
  addMoreText: { color: "#0d6efd", fontSize: 13, fontWeight: "700", textAlign: "center" },
  checkRow: { alignItems: "center", flexDirection: "row", gap: 8, marginBottom: 8 },
  checkbox: { alignItems: "center", borderColor: "#333333", borderRadius: 3, borderWidth: 1, height: 22, justifyContent: "center", width: 22 },
  checkboxSelected: { backgroundColor: "#198754", borderColor: "#198754" },
  checkMark: { color: "#ffffff", fontWeight: "700" },
  checkLabel: { color: "#111111", flex: 1, fontSize: 13 },
  uploadBox: { alignItems: "center", borderColor: "#ced4da", borderRadius: 8, borderStyle: "dashed", borderWidth: 1, height: 150, justifyContent: "center" },
  uploadTitle: { color: "#111111", fontSize: 13, fontWeight: "700", marginBottom: 6, textAlign: "center" },
  uploadText: { color: "#0d6efd", fontSize: 13, fontWeight: "700" },
  imagePreviewWrap: { gap: 8 },
  previewImage: { borderRadius: 6, height: 190, width: "100%" },
  imageActions: { flexDirection: "row", gap: 8 },
  primaryButton: { alignItems: "center", backgroundColor: "#0d6efd", borderRadius: 6, minHeight: 42, justifyContent: "center", paddingHorizontal: 14 },
  dangerButton: { alignItems: "center", backgroundColor: "#dc3545", borderRadius: 6, minHeight: 42, justifyContent: "center", paddingHorizontal: 14 },
  primarySmallButton: { alignItems: "center", backgroundColor: "#0d6efd", borderRadius: 6, justifyContent: "center", paddingHorizontal: 12, paddingVertical: 8 },
  dangerSmallButton: { alignItems: "center", backgroundColor: "#dc3545", borderRadius: 6, justifyContent: "center", paddingHorizontal: 12, paddingVertical: 8 },
  deleteActivityButton: { alignItems: "center", backgroundColor: "#4d0303", borderRadius: 6, minHeight: 42, justifyContent: "center", paddingHorizontal: 14 },
  buttonText: { color: "#ffffff", fontSize: 13, fontWeight: "700" },
  bottomActions: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 6 },
});

export default ParticipatedEventEntry;
