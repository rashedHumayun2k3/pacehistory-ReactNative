import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { countries } from "../../helpers/common-for-all";
import { IEvent } from "../../types/event/eventType.interface";

interface EventDetailsProps {
  selectedEvent: IEvent | null;
  eventRaceDistanceDetails: string | null;
}

const ShowEventDetails: React.FC<EventDetailsProps> = ({ selectedEvent, eventRaceDistanceDetails }) => {
  if (!selectedEvent) {
    return <Text style={styles.infoText}>Select an event to view details.</Text>;
  }

  const eventDate = new Date(selectedEvent?.eventDate ?? new Date());
  const formattedDate = Number.isNaN(eventDate.getTime())
    ? ""
    : eventDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
  const dateParts = formattedDate.split(" ");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Event Details:</Text>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Event Name:</Text>
        <Text style={styles.value}>{selectedEvent?.eventName}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Event Date:</Text>
        <View style={styles.dateBox}>
          <Text style={styles.dateText}>{dateParts[1] || "--"}</Text>
          <Text style={styles.dateText}>{dateParts[0] || "---"}</Text>
          <Text style={styles.dateText}>{formattedDate.split(", ")[1] || "----"}</Text>
        </View>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Event Country:</Text>
        <Text style={styles.value}>
          {countries.find((country) => country.value === selectedEvent?.country)?.label || "Country not found"}
        </Text>
      </View>
      <View style={styles.distanceSection}>
        <Text style={styles.label}>Race Distance:</Text>
        <View style={styles.distanceContainer}>
          {eventRaceDistanceDetails ? (
            eventRaceDistanceDetails.split(",").map((item, index) => {
              const distance = item.split(":")[0].trim();
              return (
                <Text key={`${distance}-${index}`} style={styles.distanceItem}>
                  {distance}Km
                </Text>
              );
            })
          ) : (
            <View style={styles.noDataWrap}>
              <Text style={styles.noData}>not set</Text>
              <Text style={styles.infoText}>No worry, you can give your own race distance below</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 12, width: "100%" },
  title: { color: "#111111", fontSize: 12, fontWeight: "700", marginBottom: 8 },
  detailRow: { alignItems: "center", flexDirection: "row", gap: 8, marginBottom: 6 },
  label: { color: "#111111", fontSize: 12, fontWeight: "700" },
  value: { color: "#555555", flex: 1, fontSize: 12 },
  dateBox: {
    alignItems: "center",
    backgroundColor: "#111111",
    borderRadius: 4,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dateText: { color: "#ffffff", fontSize: 11, fontWeight: "700" },
  distanceSection: { gap: 6, marginTop: 4 },
  distanceContainer: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 6 },
  distanceItem: {
    backgroundColor: "#e9f5ff",
    borderColor: "#3498db",
    borderRadius: 4,
    borderWidth: 1,
    color: "#0d6efd",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  noDataWrap: { gap: 6 },
  noData: {
    alignSelf: "flex-start",
    backgroundColor: "#dc3545",
    borderRadius: 4,
    color: "#ffffff",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  infoText: { color: "#6c757d", fontSize: 12 },
});

export default ShowEventDetails;
