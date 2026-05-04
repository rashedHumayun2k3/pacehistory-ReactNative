import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type EventOption = { eventId: number; eventName: string };

interface EventDropdownProps {
  eventList: EventOption[];
  formData: { eventId: number };
  handleEventChange: (event: EventOption) => void;
}

const EventDropdown: React.FC<EventDropdownProps> = ({
  eventList,
  formData,
  handleEventChange,
}) => {
  const [open, setOpen] = useState(false);
  const selectedEvent = eventList.find((event) => event.eventId === formData.eventId);

  const handleSelect = (event: EventOption) => {
    handleEventChange(event);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.input} onPress={() => setOpen((value) => !value)}>
        <Text style={selectedEvent ? styles.inputText : styles.placeholder}>
          {selectedEvent?.eventName || "Select an Event"}
        </Text>
      </Pressable>
      {open ? (
        <ScrollView style={styles.menu} nestedScrollEnabled>
          <Pressable style={styles.option} onPress={() => handleSelect({ eventId: 0, eventName: "" })}>
            <Text style={styles.placeholder}>Clear selection</Text>
          </Pressable>
          {eventList.map((event) => (
            <Pressable key={event.eventId} style={styles.option} onPress={() => handleSelect(event)}>
              <Text style={styles.inputText}>{event.eventName}</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  input: {
    borderColor: "#cccccc",
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 10,
  },
  inputText: { color: "#333333", fontSize: 14 },
  placeholder: { color: "#777777", fontSize: 14 },
  menu: {
    borderColor: "#cccccc",
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 4,
    maxHeight: 180,
  },
  option: { borderBottomColor: "#eeeeee", borderBottomWidth: 1, padding: 10 },
});

export default EventDropdown;
