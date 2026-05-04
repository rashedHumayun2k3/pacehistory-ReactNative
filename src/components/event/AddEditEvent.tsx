/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useEffect, useState } from "react";
import {
  Alert,
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
import { AppDispatch, RootState } from "../../store/store";
import {
  fetchEventDetails,
  fetchGetParticipationCountAsync,
} from "../../store/slices/eventSlice";
import { fetchEventInsertUpdate } from "../../store/slices/eventInsertUpdateSlice";
import { fetchGroupInfoById } from "../../store/slices/groupSlice";
import { uploadImage } from "../../store/slices/uploadImageActivitiesSlice";
import { IEvent } from "../../types/event/eventType.interface";
import { ParticipatedEventResult } from "../../types/user/userProfile.interface";
import AddEventDescription from "./AddEventDescription";
import AddEventDeliverables from "./AddEventDeliverables";
import CertificationsSelect from "./CertificationList";
import CloseButton from "./CloseButton";
import DataSaveStatusPopup from "./DataSaveStatusPopup";
import DistanceSelect from "./DistanceSelect";
import EventCategoryDDL from "./EventCategoryDDL";
import EventImageSelector from "./EventImageSelector";
import EventNameSelection from "./EventNameSelection";
import EventStatusSelector from "./EventStatusSelector";
import SurfaceTypeSelector from "./SurfaceType";
import TriathlonDistance from "./TriathlonDistance";

interface AddEditEventProps {
  selectedGroupId?: number;
  selectedEventDetails?: IEvent;
  loggedInUser: number;
  actionType: string;
  actionTitle: string;
  onClose: () => void;
  selectedActivityResult?: ParticipatedEventResult;
  navigation?: any;
}

type UploadStatus = "uploading" | "success" | "partial-fail" | "error" | null;
type ImageFile = { uri: string; name: string; type: string };

const createDefaultEvent = (loggedInUser: number, selectedGroupId?: number): IEvent => {
  const currentDate = new Date();

  return {
    eventId: 0,
    eventTypeId: 1,
    eventName: "",
    eventCode: "",
    organizerUserID: loggedInUser ?? 0,
    eventDate: currentDate,
    eventYear: currentDate.getFullYear(),
    raceDistance: "",
    distanceCategory: [],
    surfaceType: "",
    cutoffTimesHr: 0,
    elevationDetails: "",
    eventStatusId: 1,
    registrationStartDate: currentDate,
    registrationEndDate: currentDate,
    eventPriceMoney: "",
    deliverablesForTheParticipants: "",
    registrationLink: "",
    facebookLink: "",
    instagramLink: "",
    otherText: "",
    isSelfSupported: false,
    eventTotalDuration: "",
    venueLatitude: 0,
    venueLongitude: 0,
    venueCoordinates: "",
    routeMap: "",
    safetyMeasures: "",
    checkInTime: "",
    startTime: "",
    endTime: "",
    eventCategoryId: 9,
    description: "",
    organizerId: selectedGroupId,
    eventType: "",
    venueDetails: "",
    totalInterestedCount: 0,
    totalGoingCount: 0,
    country: "bd",
    createdAt: currentDate,
    updatedAt: currentDate,
    isCustom: false,
    isCertified: false,
    certificationList: "",
    registrationFeeDetails: "",
    createdBy: loggedInUser ?? 0,
    imageEventProfilePicture: "",
    imageOfEventMadel: "",
    imageEventThumPicture1: "",
    imageEventThumPicture2: "",
    imageEventThumPicture3: "",
    imageEventThumPicture4: "",
    imageEventThumPicture5: "",
  };
};

const AddEditEvent: React.FC<AddEditEventProps> = ({
  selectedGroupId,
  selectedEventDetails,
  loggedInUser,
  actionType,
  actionTitle,
  onClose,
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [newEventId, setNewEventId] = useState(0);
  const [newEvent, setNewEvent] = useState<IEvent>(() => createDefaultEvent(loggedInUser, selectedGroupId));
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string | null>(null);
  const [selectedParentCategoryId, setSelectedParentCategoryId] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [file1, setFile1] = useState<ImageFile | null>(null);
  const [file2, setFile2] = useState<ImageFile | null>(null);
  const [previewUrlEventProfile, setPreviewUrlEventProfile] = useState<string | undefined>(undefined);
  const [previewUrlEventMadel, setPreviewUrlEventMadel] = useState<string | undefined>(undefined);
  const [activeSections, setActiveSections] = useState<string[]>(["coreDetails"]);

  const { actionResult } = useSelector((state: RootState) => state.eventInsertUpdate);
  const { countParticipatedCountForEvent } = useSelector(
    (state: RootState) => state.event
  );
  const { groupInfo } = useSelector((state: RootState) => state.group);

  useEffect(() => {
    if (selectedEventDetails) {
      setNewEvent((prevEvent) => ({ ...prevEvent, ...selectedEventDetails }));
      setPreviewUrlEventProfile(selectedEventDetails.imageEventProfilePicture || undefined);
      setPreviewUrlEventMadel(selectedEventDetails.imageOfEventMadel || undefined);
    }
  }, [selectedEventDetails]);

  useEffect(() => {
    const groupId = selectedGroupId || selectedEventDetails?.organizerId;

    if (groupId && groupId > 0) {
      dispatch(fetchGroupInfoById(groupId));
    }
  }, [dispatch, selectedGroupId, selectedEventDetails?.organizerId]);

  useEffect(() => {
    if (selectedEventDetails?.eventId && selectedEventDetails.eventId > 0 && actionType === "Edit") {
      dispatch(fetchGetParticipationCountAsync(selectedEventDetails.eventId));
    }
  }, [actionType, dispatch, selectedEventDetails?.eventId]);

  useEffect(() => {
    if (countParticipatedCountForEvent > 0) {
      Alert.alert(
        "Participants exist",
        `The event already has ${countParticipatedCountForEvent} participants. Avoid changing key event details unless necessary.`
      );
    }
  }, [countParticipatedCountForEvent]);

  useEffect(() => {
    const proceedAfterEventCreated = async () => {
      if (newEventId > 0) {
        setUploadStatus("uploading");
        const isSuccess = await onImageUploadComplete(newEventId);
        setUploadStatus(isSuccess ? "success" : "partial-fail");
      }
    };

    proceedAfterEventCreated();
  }, [newEventId]);

  const setField = (name: keyof IEvent, value: any) => {
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (event: { target: { name: string; value: string } }) => {
    setNewEvent((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const parseDateInput = (value: string) => (value ? new Date(value) : undefined);

  const handleSubmit = async () => {
    if (!newEvent.eventName?.trim()) {
      Alert.alert("Validation", "Please fill in the required fields: Event Name");
      return;
    }

    if (!newEvent.raceDistance?.trim()) {
      Alert.alert("Validation", "Please select at least one distance category to proceed.");
      return;
    }

    const eventDate = new Date(newEvent.eventDate || "");
    const registrationStartDate = new Date(newEvent.registrationStartDate || "");
    const registrationEndDate = new Date(newEvent.registrationEndDate || "");

    if (newEvent.eventStatusId !== 1) {
      if (isNaN(eventDate.getTime())) {
        Alert.alert("Validation", "Invalid event date. Please provide a valid event date.");
        return;
      }
      if (isNaN(registrationStartDate.getTime())) {
        Alert.alert("Validation", "Invalid registration start date. Please provide a valid registration start date.");
        return;
      }
      if (isNaN(registrationEndDate.getTime())) {
        Alert.alert("Validation", "Invalid registration end date. Please provide a valid registration end date.");
        return;
      }
      if (registrationStartDate > eventDate) {
        Alert.alert("Validation", "The registration start date must be on or before the event date.");
        return;
      }
      if (registrationEndDate > eventDate) {
        Alert.alert("Validation", "The registration end date must be on or before the event date.");
        return;
      }
      if (registrationStartDate > registrationEndDate) {
        Alert.alert("Validation", "The registration start date must be before or equal to the registration end date.");
        return;
      }
    }

    if (isNaN(eventDate.getTime())) {
      Alert.alert("Validation", "Event date is required to set the event year.");
      return;
    }

    const eventToSave: IEvent = {
      ...newEvent,
      eventYear: eventDate.getFullYear(),
      organizerId: newEvent.organizerId || selectedGroupId,
      createdBy: newEvent.createdBy || loggedInUser,
      organizerUserID: newEvent.organizerUserID || loggedInUser,
    };

    try {
      const result = await dispatch(fetchEventInsertUpdate(eventToSave)).unwrap();
      const savedId = Number(result?.rowsAffected || result?.eventId || result?.data?.eventId || eventToSave.eventId || 0);

      if (savedId > 0 || !file1 && !file2) {
        setNewEventId(savedId);
        setUploadStatus(file1 || file2 ? "uploading" : "success");
        setErrorMessage(null);
      } else {
        throw new Error("Event saved, but the saved event id was not returned for image upload.");
      }
    } catch (error: any) {
      setUploadStatus("error");
      setErrorMessage(String(error));
    }
  };

  const onImageUploadComplete = async (eventId: number): Promise<boolean> => {
    let allUploadsSuccessful = true;
    const uploadPromises: Promise<boolean>[] = [];
    const upload = (file: ImageFile, purpose: string) =>
      dispatch(
        uploadImage({
          file,
          userId: loggedInUser.toString(),
          eventId,
          uploadPurpose: purpose,
          tableName: "Event",
        })
      )
        .unwrap()
        .then(() => true)
        .catch(() => {
          allUploadsSuccessful = false;
          return false;
        });

    if (file1) uploadPromises.push(upload(file1, "EventBanner"));
    if (file2) uploadPromises.push(upload(file2, "Medals"));
    await Promise.all(uploadPromises);
    return allUploadsSuccessful;
  };

  const closeTheNotificationMsg = () => {
    setUploadStatus(null);

    if (newEventId > 0) {
      dispatch(fetchEventDetails(newEventId.toString()));
    }

    if (actionType === "Add") {
      navigation?.navigate?.("EventDetails", { eventCode: actionResult?.eventCode || newEvent.eventCode });
    } else {
      onClose();
    }
  };

  const toggleSection = (section: string) => {
    setActiveSections((prev) =>
      prev.includes(section) ? prev.filter((item) => item !== section) : [...prev, section]
    );
  };

  const handleImageUpload = (file: ImageFile, imageFor?: string) => {
    if (imageFor === "EventProfile") {
      setPreviewUrlEventProfile(file.uri);
      setFile1(file);
    } else if (imageFor === "EventMadel") {
      setPreviewUrlEventMadel(file.uri);
      setFile2(file);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboardRoot}>
      <DataSaveStatusPopup
        status={uploadStatus}
        errorMessage={errorMessage ?? undefined}
        onClose={closeTheNotificationMsg}
        show={uploadStatus !== null}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.wrapper, actionType === "Add" ? styles.createBackground : styles.darkBackground]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{actionTitle}</Text>
          <View style={styles.actionRow}>
            <Pressable style={styles.primaryButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Save Event Data</Text>
            </Pressable>
            <CloseButton onClose={onClose} />
          </View>
        </View>

        <View style={styles.editCard}>
          <Text style={styles.label}>
            Event is creating with group name: <Text style={styles.bold}>{groupInfo?.groupName ?? "No group selected"}</Text>
          </Text>

          <Section
            title="Core Event Details"
            open={activeSections.includes("coreDetails")}
            onPress={() => toggleSection("coreDetails")}
          >
            {countParticipatedCountForEvent === 0 ? (
              <>
                <Text style={styles.label}>Event Name</Text>
                <EventNameSelection
                  initialValue={newEvent.eventName ?? ""}
                  onClose={(value) => setField("eventName", value)}
                />
              </>
            ) : (
              <View>
                <Text style={styles.eventNameReadOnly}>Event Name: {newEvent.eventName}</Text>
                <Text style={styles.blueTiny}>Total Participants: {countParticipatedCountForEvent}</Text>
              </View>
            )}

            <Text style={styles.label}>Select Category</Text>
            <EventCategoryDDL
              selectedCategoryId={newEvent.eventCategoryId ?? 9}
              onCategorySelect={(category) => {
                if (category) {
                  setField("eventCategoryId", category.EventCategoryId);
                  setSelectedCategoryCode(category.CategoryCode ?? null);
                  setSelectedParentCategoryId(category.ParentCategoryId);
                }
              }}
            />

            <View style={styles.distanceContainer}>
              {selectedParentCategoryId === 5 ? (
                <TriathlonDistance categoryCode={selectedCategoryCode} />
              ) : (
                <DistanceSelect
                  eventId={newEvent.eventId ?? 0}
                  eventDistance={newEvent.raceDistance ?? null}
                  onDistanceSelect={(value) => setField("raceDistance", value ?? "")}
                />
              )}
            </View>

            <View style={styles.grayChild}>
              <Text style={styles.label}>Event Type</Text>
              <OptionRow
                options={[
                  { label: "Physical", value: "1" },
                  { label: "Virtual", value: "2" },
                ]}
                selectedValue={String(newEvent.eventTypeId ?? 1)}
                onSelect={(value) => setField("eventTypeId", Number(value))}
              />
              <EventStatusSelector
                selectedStatus={newEvent.eventStatusId ?? 1}
                onStatusChange={(value) => setField("eventStatusId", value ?? 1)}
              />
            </View>

            <DateInput
              label="Event Date"
              disabled={newEvent.eventStatusId === 1}
              value={newEvent.eventDate}
              onChange={(value: string) => setField("eventDate", parseDateInput(value))}
            />
            <DateInput
              label="Registration Start Date"
              disabled={newEvent.eventStatusId === 1}
              value={newEvent.registrationStartDate}
              onChange={(value: string) => setField("registrationStartDate", parseDateInput(value))}
            />
            <DateInput
              label="Registration End Date"
              disabled={newEvent.eventStatusId === 1}
              value={newEvent.registrationEndDate}
              onChange={(value: string) => setField("registrationEndDate", parseDateInput(value))}
            />

            <TextInputField label="Country" name="country" value={newEvent.country ?? "bd"} onChange={handleInputChange} />
            <AddEventDescription
              value={newEvent.description ?? ""}
              onChange={(value) => setField("description", value)}
            />
            <AddEventDeliverables
              value={newEvent.deliverablesForTheParticipants ?? ""}
              onChange={(value) => setField("deliverablesForTheParticipants", value)}
            />
            <TextAreaField
              label="Registration Fee Details"
              name="registrationFeeDetails"
              value={newEvent.registrationFeeDetails ?? ""}
              onChange={handleInputChange}
              placeholder="Please give registration fee details about the event"
            />
          </Section>

          <Section
            title="Environment Criteria"
            open={activeSections.includes("trailCriteria")}
            onPress={() => toggleSection("trailCriteria")}
          >
            <SurfaceTypeSelector
              selectedSurfaceType={newEvent.surfaceType ?? null}
              onSurfaceTypeChange={(value) => setField("surfaceType", value ?? "")}
            />
          </Section>

          <Section
            title="Event Profile Pictures, Other Images"
            open={activeSections.includes("eventPictures")}
            onPress={() => toggleSection("eventPictures")}
          >
            <EventImageSelector
              handleImageUpload={handleImageUpload}
              previewUrlEventProfile={previewUrlEventProfile}
              previewUrlEventMadel={previewUrlEventMadel}
              actionType={actionType}
              eventBannerPicture={newEvent.imageEventProfilePicture ?? null}
              eventMadelPicture={newEvent.imageOfEventMadel ?? null}
              selectedEventId={newEvent.eventId ?? 0}
            />
          </Section>

          <Section title="Others" open={activeSections.includes("eventRulesPrice")} onPress={() => toggleSection("eventRulesPrice")}>
            <Text style={styles.label}>Select Certification</Text>
            <Text style={styles.helperText}>{newEvent.certificationList || "None selected"}</Text>
            <CertificationsSelect
              selectedIsCertification={newEvent.isCertified ?? null}
              selectedCertificationsValue={newEvent.certificationList ?? null}
              onCertificationsSelect={(value) => {
                setField("isCertified", Boolean(value));
                setField("certificationList", value ?? "");
              }}
            />

            <TextInputField label="Registration Link (External)" name="registrationLink" value={newEvent.registrationLink ?? ""} onChange={handleInputChange} />
            <TextInputField label="Facebook Link" name="facebookLink" value={newEvent.facebookLink ?? ""} onChange={handleInputChange} />
            <TextInputField label="Instagram Link" name="instagramLink" value={newEvent.instagramLink ?? ""} onChange={handleInputChange} />
          </Section>

          <View style={styles.actionRowBottom}>
            <Pressable style={styles.primaryButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Save Event Data</Text>
            </Pressable>
            <CloseButton onClose={onClose} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Section = ({ title, open, onPress, children }: { title: string; open: boolean; onPress: () => void; children: ReactNode }) => (
  <View style={styles.parentSection}>
    <Pressable style={styles.sectionHeader} onPress={onPress}>
      <Text style={styles.cardHeader}>{title}</Text>
      <Text style={styles.chevron}>{open ? "^" : "v"}</Text>
    </Pressable>
    {open ? <View style={styles.sectionContent}>{children}</View> : null}
  </View>
);

const DateInput = ({ label, value, onChange, disabled }: any) => (
  <View style={styles.inputBlock}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      editable={!disabled}
      value={formatDateOnly(value)}
      onChangeText={onChange}
      placeholder="YYYY-MM-DD"
      style={[styles.formControl, disabled && styles.disabledInput]}
    />
  </View>
);

const TextInputField = ({ label, name, value, onChange, placeholder }: any) => (
  <View style={styles.inputBlock}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={(text: string) => onChange({ target: { name, value: text } })}
      placeholder={placeholder}
      style={styles.formControl}
    />
  </View>
);

const TextAreaField = ({ label, name, value, onChange, placeholder }: any) => (
  <View style={styles.inputBlock}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={(text: string) => onChange({ target: { name, value: text } })}
      multiline
      placeholder={placeholder}
      textAlignVertical="top"
      style={[styles.formControl, styles.textArea]}
    />
  </View>
);

const OptionRow = ({
  options,
  selectedValue,
  onSelect,
}: {
  options: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
}) => (
  <View style={styles.optionRow}>
    {options.map((option) => {
      const selected = option.value === selectedValue;

      return (
        <Pressable
          key={`${option.value}-${option.label}`}
          style={[styles.optionButton, selected && styles.optionButtonSelected]}
          onPress={() => onSelect(option.value)}
        >
          <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option.label}</Text>
        </Pressable>
      );
    })}
  </View>
);

const ImageUriSelector = ({
  label,
  previewUri,
  onChange,
}: {
  label: string;
  previewUri?: string;
  onChange: (file: ImageFile) => void;
}) => {
  const [uri, setUri] = useState(previewUri ?? "");

  useEffect(() => {
    setUri(previewUri ?? "");
  }, [previewUri]);

  return (
    <View style={styles.inputBlock}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={uri} onChangeText={setUri} placeholder="Image URI" style={styles.formControl} />
      <Pressable
        style={[styles.secondaryButton, !uri.trim() && styles.disabledButton]}
        disabled={!uri.trim()}
        onPress={() =>
          onChange({
            uri: uri.trim(),
            name: uri.trim().split("/").pop() || `${label.toLowerCase().replace(/\s+/g, "-")}.jpg`,
            type: "image/jpeg",
          })
        }
      >
        <Text style={styles.secondaryButtonText}>Use Image</Text>
      </Pressable>
      {previewUri ? <Text style={styles.helperText}>Selected: {previewUri}</Text> : null}
    </View>
  );
};

const formatDateOnly = (date: string | Date | undefined): string => {
  if (!date) return "";
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  if (isNaN(parsedDate.getTime())) return "";
  return parsedDate.toISOString().split("T")[0];
};

const styles = StyleSheet.create({
  keyboardRoot: { flex: 1 },
  wrapper: {
    flexGrow: 1,
    padding: 10,
  },
  createBackground: { backgroundColor: "#6f767d" },
  darkBackground: { backgroundColor: "#710c0c" },
  headerRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  headerTitle: { color: "#ffffff", fontSize: 22, fontWeight: "700", marginBottom: 10 },
  actionRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 10 },
  actionRowBottom: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "flex-end", marginBottom: 10 },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#337ab7",
    borderRadius: 4,
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 12,
    width: 180,
  },
  dangerButton: {
    alignItems: "center",
    backgroundColor: "#dc3545",
    borderRadius: 4,
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 12,
    width: 180,
  },
  secondaryButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#34495e",
    borderRadius: 4,
    marginTop: 8,
    minHeight: 34,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  disabledButton: { opacity: 0.5 },
  buttonText: { color: "#ffffff", fontSize: 12, fontWeight: "700", textAlign: "center" },
  secondaryButtonText: { color: "#ffffff", fontSize: 12, fontWeight: "700" },
  editCard: { backgroundColor: "#ffffff", borderRadius: 8, padding: 10 },
  label: { color: "#444444", fontSize: 14, fontWeight: "600", marginBottom: 5, marginTop: 8 },
  bold: { fontWeight: "700" },
  parentSection: { padding: 0 },
  sectionHeader: {
    backgroundColor: "#b5b5b5",
    borderColor: "#dee2e6",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    padding: 10,
  },
  cardHeader: { color: "#000000", flex: 1, fontWeight: "600" },
  chevron: { color: "#000000", fontSize: 16, fontWeight: "700", marginLeft: 8 },
  sectionContent: { marginBottom: 15, padding: 12 },
  eventNameReadOnly: { fontSize: 18, fontWeight: "600" },
  blueTiny: { color: "blue", fontSize: 10 },
  distanceContainer: {
    backgroundColor: "#e2ffe1",
    borderColor: "#c1ffbf",
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 10,
    minHeight: 120,
    padding: 10,
  },
  grayChild: { backgroundColor: "#d5d5d5", borderRadius: 8, marginVertical: 8, padding: 8 },
  inputBlock: { marginBottom: 8 },
  formControl: {
    borderColor: "#dddddd",
    borderRadius: 4,
    borderWidth: 1,
    minHeight: 40,
    paddingHorizontal: 10,
    width: "100%",
  },
  textArea: { minHeight: 96, paddingTop: 10 },
  disabledInput: { backgroundColor: "#c5c5c5", borderColor: "#979797" },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  optionButton: {
    borderColor: "#b8c2cc",
    borderRadius: 4,
    borderWidth: 1,
    minHeight: 34,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  optionButtonSelected: { backgroundColor: "#337ab7", borderColor: "#337ab7" },
  optionText: { color: "#2f3a44", fontSize: 12 },
  optionTextSelected: { color: "#ffffff", fontWeight: "700" },
  helperText: { color: "#5d6872", fontSize: 12, marginTop: 5 },
});

export default AddEditEvent;
