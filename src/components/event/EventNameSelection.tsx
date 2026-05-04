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
import { AppDispatch, RootState } from "../../store/store";
import { fetchUnlistedEventListByYear } from "../../store/slices/eventSlice";
import { IEvent } from "../../types/event/eventType.interface";

type ModalProps = {
  initialValue: string;
  onClose: (selectedValue: string) => void;
};

const EventNameSelection: React.FC<ModalProps> = ({ initialValue, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[] | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedTextEvent, setSelectedTextEvent] = useState<string | null>(null);
  const [selectedYearEvent, setSelectedYearEvent] = useState<string | null>("2000");
  const dispatch = useDispatch<AppDispatch>();
  const { unlistedEventList } = useSelector((state: RootState) => state.event);

  useEffect(() => {
    if (selectedYearEvent) {
      dispatch(fetchUnlistedEventListByYear(parseInt(selectedYearEvent, 10)));
    }
  }, [dispatch, selectedYearEvent]);

  useEffect(() => {
    if (selectedTextEvent) {
      setSelectedEvent(`${selectedTextEvent},${selectedYearEvent}`);

      if (selectedTextEvent.length > 3) {
        const normalizedSearch = selectedTextEvent.toLowerCase();
        const results = unlistedEventList.filter((event) =>
          (event.eventName ?? "").toLowerCase().includes(normalizedSearch)
        );

        setFilteredEvents(results);
      }
    } else {
      setSelectedEvent(null);
      setFilteredEvents(null);
    }
  }, [selectedTextEvent, selectedYearEvent, unlistedEventList]);

  const handleOk = () => {
    onClose(selectedEvent ?? "");
    setShowModal(false);
  };

  const years = Array.from({ length: new Date().getFullYear() + 2 - 2000 }, (_, index) => `${2000 + index}`);

  return (
    <>
      <Pressable onPress={() => setShowModal(true)}>
        <TextInput editable={false} value={initialValue ?? ""} style={styles.formControl} />
      </Pressable>

      <Modal transparent animationType="fade" visible={showModal} onRequestClose={() => setShowModal(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalPopup}>
            <View style={styles.closeRow}>
              <Pressable style={styles.closeButton} onPress={() => setShowModal(false)}>
                <Text style={styles.closeButtonText}>x</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.title}>Event Name</Text>
              <Text style={styles.label}>Event Name (please select year first)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.yearList}>
                {years.map((year) => (
                  <Pressable
                    key={year}
                    onPress={() => setSelectedYearEvent(year)}
                    style={[styles.yearChip, selectedYearEvent === year && styles.selectedChip]}
                  >
                    <Text style={selectedYearEvent === year ? styles.selectedChipText : styles.chipText}>
                      {year}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              <TextInput
                maxLength={50}
                value={selectedTextEvent ?? ""}
                onChangeText={setSelectedTextEvent}
                placeholder="Type event name"
                style={styles.formControl}
              />

              {filteredEvents && filteredEvents.length > 0 ? (
                <>
                  <Text style={styles.yellow}>Select event if its name matches yours (recommended)</Text>
                  <View style={styles.eventSelectionList}>
                    {filteredEvents.map((event, index) => (
                      <Pressable
                        key={event.eventId ?? `${event.eventName}-${index}`}
                        style={[
                          styles.eventSelectionItem,
                          selectedEvent === event.eventName && styles.selectedEventItem,
                        ]}
                        onPress={() => setSelectedEvent(event.eventName ?? "")}
                      >
                        <Text>{event.eventName}</Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              ) : null}

              {selectedEvent ? (
                <View style={styles.selectedEvent}>
                  <Text style={styles.bold}>Selected Event Name:</Text>
                  <Text style={styles.eventNameSelection}>{selectedEvent}</Text>
                </View>
              ) : null}

              <View style={styles.buttonRow}>
                <Pressable style={styles.primaryButton} onPress={handleOk}>
                  <Text style={styles.buttonText}>Selected</Text>
                </Pressable>
                <Pressable style={styles.secondaryButton} onPress={() => setShowModal(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  formControl: {
    borderColor: "#dddddd",
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 10,
    width: "100%",
  },
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    padding: 12,
  },
  modalPopup: { backgroundColor: "#ffffff", borderRadius: 8, maxHeight: "90%", width: "100%" },
  closeRow: { alignItems: "flex-end" },
  closeButton: { backgroundColor: "#af0000", borderRadius: 3, paddingHorizontal: 10, paddingVertical: 6 },
  closeButtonText: { color: "#ffffff" },
  modalBody: { padding: 12 },
  title: { backgroundColor: "#ffffff", fontSize: 20, fontWeight: "700", textAlign: "center" },
  label: { color: "#444444", fontSize: 14, fontWeight: "600", marginTop: 8 },
  yearList: { marginVertical: 8 },
  yearChip: { backgroundColor: "#eeeeee", borderRadius: 4, marginRight: 5, padding: 8 },
  selectedChip: { backgroundColor: "#575757" },
  chipText: { color: "#000000" },
  selectedChipText: { color: "#ffffff" },
  yellow: { backgroundColor: "#feff00", marginTop: 8, padding: 4 },
  eventSelectionList: { backgroundColor: "#e1e1e1", borderRadius: 8, marginTop: 6, maxHeight: 144 },
  eventSelectionItem: { borderBottomColor: "#e0e0e0", borderBottomWidth: 1, padding: 10 },
  selectedEventItem: { backgroundColor: "#d3f9d8" },
  selectedEvent: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  eventNameSelection: {
    backgroundColor: "#eeeeee",
    borderRadius: 4,
    color: "#000000",
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  bold: { fontWeight: "700" },
  buttonRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  primaryButton: {
    backgroundColor: "#337ab7",
    borderRadius: 4,
    height: 35,
    justifyContent: "center",
    marginRight: 10,
    paddingHorizontal: 16,
  },
  secondaryButton: {
    backgroundColor: "#6c757d",
    borderRadius: 4,
    height: 35,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  buttonText: { color: "#ffffff", fontSize: 12 },
});

export default EventNameSelection;
