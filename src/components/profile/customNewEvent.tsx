/* eslint-disable @typescript-eslint/no-explicit-any */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { countries } from "../../helpers/common-for-all";
import EventDropdown from "../event/EventDropdown";
import EventTypePhysicalVirtual from "../event/EventTypePhysical_Virtual";
import { fetchEventInsertUpdate } from "../../store/slices/eventInsertUpdateSlice";
import { fetchEventList } from "../../store/slices/eventSlice";
import { AppDispatch, RootState } from "../../store/store";
import { IEvent } from "../../types/event/eventType.interface";

type EventOption = { eventId: number; eventName: string };

interface CustomDropdownProps {
  formData: { eventId: number };
  handleEventChange: (event: EventOption) => void;
}

const years = Array.from({ length: new Date().getFullYear() + 2 - 2000 }, (_, index) => 2000 + index);

const defaultFilters = {
  eventName: null,
  eventYear: null,
  eventTypeId: null,
  raceDistance: null,
  eventStatusId: null,
  organizerId: null,
  organizerUserId: null,
  country: null,
  isCustom: null,
  isCertified: null,
};

const createDefaultEvent = (loggedInUserId: number): IEvent => {
  const currentDate = new Date();

  return {
    eventId: 0,
    eventTypeId: 1,
    eventName: "",
    eventCode: "",
    organizerUserID: 1,
    eventDate: currentDate,
    eventYear: currentDate.getFullYear(),
    raceDistance: "",
    surfaceType: "",
    elevationGain: 0,
    elevationLoss: 0,
    eventStatusId: 3,
    registrationStartDate: currentDate,
    registrationEndDate: currentDate,
    eventRules: "",
    eligibilityCriteria: "",
    eventTotalDuration: "",
    venueLatitude: 0,
    venueLongitude: 0,
    venueCoordinates: "",
    routeMap: "",
    safetyMeasures: "",
    checkInTime: "",
    startTime: "",
    endTime: "",
    eventCategoryId: 0,
    description: "",
    organizerId: 0,
    eventType: "",
    venueDetails: "",
    totalInterestedCount: 0,
    totalGoingCount: 0,
    country: "",
    createdAt: currentDate,
    updatedAt: currentDate,
    isCustom: true,
    isCertified: false,
    certificationList: "",
    registrationFeeDetails: "",
    createdBy: loggedInUserId,
    imageEventProfilePicture: "",
    imageOfEventMadel: "",
    imageEventThumPicture1: "",
    imageEventThumPicture2: "",
    imageEventThumPicture3: "",
    imageEventThumPicture4: "",
    imageEventThumPicture5: "",
  };
};

const toEventOptions = (events: IEvent[]): EventOption[] =>
  events
    .filter((event) => event.eventId && event.eventName)
    .map((event) => ({ eventId: event.eventId ?? 0, eventName: event.eventName ?? "" }));

const CustomNewEvent: React.FC<CustomDropdownProps> = ({ formData, handleEventChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { eventList } = useSelector((state: RootState) => state.event);
  const { errorOnCreatingCustomEvent, isSuccessCreatingEvent } = useSelector(
    (state: RootState) => state.eventInsertUpdate
  );
  const [filteredEventList, setFilteredEventList] = useState<IEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(0);
  const [filters] = useState(defaultFilters);
  const [newEvent, setNewEvent] = useState<IEvent>(() => createDefaultEvent(0));
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedTextEvent, setSelectedTextEvent] = useState<string | null>(null);
  const [selectedYearEvent, setSelectedYearEvent] = useState<number | null>(2025);
  const [filteredEventYear, setFilteredEventYear] = useState(0);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning" | "";
    message: string;
  }>({ type: "", message: "" });

  useEffect(() => {
    const readUser = async () => {
      const storedUser = await AsyncStorage.getItem("userProfile");

      if (storedUser && storedUser !== "[]") {
        try {
          const parsedUser = JSON.parse(storedUser);

          if (parsedUser?.id) {
            setLoggedInUserId(parsedUser.id);
            setNewEvent((prev) => ({ ...prev, createdBy: parsedUser.id }));
          }
        } catch (error) {
          console.error("Error parsing user profile from AsyncStorage:", error);
        }
      }
    };

    readUser();
  }, []);

  useEffect(() => setFilteredEventList(eventList), [eventList]);

  useEffect(() => {
    if (eventList.length === 0) {
      dispatch(fetchEventList({ pageNumber: 1, pageSize: 10, filters, isAll: true }));
    }
  }, [dispatch, eventList.length, filters]);

  useEffect(() => {
    setSelectedEvent(selectedTextEvent ? `${selectedTextEvent},${selectedYearEvent?.toString()}` : null);
  }, [selectedTextEvent, selectedYearEvent]);

  useEffect(() => {
    if (errorOnCreatingCustomEvent) {
      setNotification({
        type: "error",
        message: errorOnCreatingCustomEvent || "An error occurred while creating the event.",
      });
    }
  }, [errorOnCreatingCustomEvent]);

  useEffect(() => {
    if (isSuccessCreatingEvent) {
      setNotification({ type: "success", message: isSuccessCreatingEvent });
      dispatch(fetchEventList({ pageNumber: 1, pageSize: 10, filters, isAll: true }));
    }
  }, [dispatch, filters, isSuccessCreatingEvent]);

  const handleCreateEvent = async () => {
    const eventToSave = {
      ...newEvent,
      createdBy: loggedInUserId,
      eventName: selectedEvent ?? "",
      eventYear: selectedYearEvent ?? 2025,
    };

    if (!selectedEvent || !eventToSave.eventYear || !eventToSave.country) {
      setNotification({
        type: "warning",
        message: "Please fill in all fields: Event Name, Event Year, and Country.",
      });
      return;
    }

    try {
      const result = await dispatch(fetchEventInsertUpdate(eventToSave)).unwrap();

      if (result.rowsAffected > 0 || result.eventId) {
        setNotification({
          type: "success",
          message: "Event created successfully! Close this window to locate the event name in the list.",
        });
      } else {
        throw new Error("Failed to create event.");
      }
    } catch (error: any) {
      setNotification({ type: "error", message: String(error) || "An error occurred while creating the event." });
    }
  };

  const eventYearForSelect = (selectedEventYear: string) => {
    if (!selectedEventYear || selectedEventYear === "0") {
      setFilteredEventList(eventList);
      setFilteredEventYear(0);
      return;
    }

    const year = parseInt(selectedEventYear, 10);
    setFilteredEventYear(year);
    setFilteredEventList(eventList.filter((event) => Number(event.eventYear) === year));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Event Year</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.yearList}>
        <Pressable style={[styles.yearOption, filteredEventYear === 0 && styles.yearSelected]} onPress={() => eventYearForSelect("0")}>
          <Text style={[styles.yearText, filteredEventYear === 0 && styles.yearTextSelected]}>All</Text>
        </Pressable>
        {years.map((year) => (
          <Pressable key={year} style={[styles.yearOption, filteredEventYear === year && styles.yearSelected]} onPress={() => eventYearForSelect(year.toString())}>
            <Text style={[styles.yearText, filteredEventYear === year && styles.yearTextSelected]}>{year}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <Text style={styles.label}>
        Event List For <Text style={styles.redText}>{filteredEventYear === 0 ? "All" : filteredEventYear}</Text>
      </Text>
      <EventDropdown eventList={toEventOptions(filteredEventList)} formData={formData} handleEventChange={handleEventChange} />
      <Pressable style={styles.primaryButton} onPress={() => setShowModal(true)}>
        <Text style={styles.primaryButtonText}>Create New Event</Text>
      </Pressable>

      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Event</Text>
              <Pressable style={styles.closeButton} onPress={() => setShowModal(false)}>
                <Text style={styles.closeText}>x</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalBody}>
              <Text style={styles.label}>Event Name (please select event year first)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.yearList}>
                {years.map((year) => (
                  <Pressable key={year} style={[styles.yearOption, selectedYearEvent === year && styles.yearSelected]} onPress={() => setSelectedYearEvent(year)}>
                    <Text style={[styles.yearText, selectedYearEvent === year && styles.yearTextSelected]}>{year}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <TextInput style={styles.input} maxLength={60} value={selectedTextEvent ?? ""} onChangeText={setSelectedTextEvent} />
              <Text style={styles.label}>Event Type</Text>
              <EventTypePhysicalVirtual
                selecteEventTypeValue={newEvent?.eventTypeId ?? 1}
                onEventTypeSelect={(value) => value && setNewEvent((prev) => ({ ...prev, eventTypeId: value }))}
              />
              <Text style={styles.label}>Country</Text>
              <ScrollView style={styles.countryList} nestedScrollEnabled>
                {countries.map((country) => (
                  <Pressable key={country.value} style={[styles.countryOption, newEvent.country === country.value && styles.countrySelected]} onPress={() => setNewEvent({ ...newEvent, country: country.value })}>
                    <Text style={newEvent.country === country.value ? styles.countryTextSelected : styles.countryText}>{country.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <View style={styles.instructions}>
                <Text style={styles.instructionText}>Group Association: This event will be marked as unlisted. An authorized group can add this event to the official list later.</Text>
                <Text style={[styles.instructionText, styles.yellowText]}>Check Spelling: Ensure there are no spelling mistakes in the name.</Text>
                <Text style={styles.instructionText}>Final Name: Cannot be edited or deleted after creation.</Text>
                <Text style={styles.instructionText}>Format: Follow Event Name, Year (e.g., City Marathon, 2025).</Text>
              </View>
              {selectedEvent ? <Text style={styles.selectedEvent}>Event Name: {selectedEvent}</Text> : null}
              {notification.message ? (
                <Text style={[styles.notification, notification.type ? styles[notification.type] : null]}>
                  {notification.message}
                </Text>
              ) : null}
              <View style={styles.modalActions}>
                <Pressable style={styles.primaryButton} onPress={handleCreateEvent}>
                  <Text style={styles.primaryButtonText}>Save Event</Text>
                </Pressable>
                <Pressable style={styles.dangerButton} onPress={() => setShowModal(false)}>
                  <Text style={styles.primaryButtonText}>Cancel</Text>
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
  container: { gap: 8, width: "100%" },
  label: { color: "#111111", fontSize: 13, fontWeight: "700", marginTop: 6 },
  yearList: { gap: 6, paddingVertical: 6 },
  yearOption: { borderColor: "#ced4da", borderRadius: 5, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  yearSelected: { backgroundColor: "#0d6efd", borderColor: "#0d6efd" },
  yearText: { color: "#111111", fontSize: 12 },
  yearTextSelected: { color: "#ffffff", fontWeight: "700" },
  redText: { color: "red" },
  primaryButton: { alignItems: "center", backgroundColor: "#0d6efd", borderRadius: 6, minHeight: 42, justifyContent: "center", marginTop: 10, paddingHorizontal: 14 },
  dangerButton: { alignItems: "center", backgroundColor: "#dc3545", borderRadius: 6, minHeight: 42, justifyContent: "center", marginTop: 10, paddingHorizontal: 14 },
  primaryButtonText: { color: "#ffffff", fontSize: 13, fontWeight: "700" },
  overlay: { backgroundColor: "rgba(0,0,0,0.55)", flex: 1, justifyContent: "center", padding: 16 },
  modal: { backgroundColor: "#ffffff", borderRadius: 8, maxHeight: "92%", overflow: "hidden" },
  modalHeader: { alignItems: "center", borderBottomColor: "#eeeeee", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", padding: 12 },
  modalTitle: { color: "#111111", fontSize: 16, fontWeight: "700" },
  closeButton: { alignItems: "center", height: 34, justifyContent: "center", width: 34 },
  closeText: { color: "#111111", fontSize: 18, fontWeight: "700" },
  modalBody: { padding: 12 },
  input: { borderColor: "#ced4da", borderRadius: 6, borderWidth: 1, color: "#111111", minHeight: 42, paddingHorizontal: 10 },
  countryList: { borderColor: "#ced4da", borderRadius: 6, borderWidth: 1, maxHeight: 170 },
  countryOption: { borderBottomColor: "#eeeeee", borderBottomWidth: 1, padding: 10 },
  countrySelected: { backgroundColor: "#0d6efd" },
  countryText: { color: "#111111", fontSize: 13 },
  countryTextSelected: { color: "#ffffff", fontSize: 13, fontWeight: "700" },
  instructions: { backgroundColor: "#111111", borderRadius: 6, gap: 5, marginTop: 10, padding: 10 },
  instructionText: { color: "#ffffff", fontSize: 12 },
  yellowText: { color: "#ffd966" },
  selectedEvent: { backgroundColor: "#f8f9fa", borderRadius: 6, color: "#111111", fontSize: 13, fontWeight: "700", marginTop: 10, padding: 10 },
  notification: { borderRadius: 6, fontSize: 13, marginTop: 10, padding: 10 },
  success: { backgroundColor: "#d1e7dd", color: "#0f5132" },
  error: { backgroundColor: "#f8d7da", color: "#842029" },
  warning: { backgroundColor: "#fff3cd", color: "#664d03" },
  modalActions: { flexDirection: "row", gap: 10, justifyContent: "flex-end" },
});

export default CustomNewEvent;
