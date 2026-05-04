import React, { useEffect } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { categories } from "../../helpers/constantValues";
import { AppDispatch, RootState } from "../../store/store";
import { fetchAllGroups } from "../../store/slices/groupSlice";
import { IEvent } from "../../types/event/eventType.interface";

interface EventProps {
  event: IEvent;
  onPress?: (event: IEvent) => void;
}

const FILE_SERVER =
  process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
  process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
  "";

const formatEventDate = (value: IEvent["eventDate"]) => {
  const eventDate = value ? new Date(value) : new Date();

  if (Number.isNaN(eventDate.getTime())) {
    return null;
  }

  return eventDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatRaceDistance = (raceDistance?: string) =>
  raceDistance
    ?.split(",")
    .map((distance) => {
      const [value, fee, currency] = distance.trim().split(":");

      if (value && fee) return `${value} km (Reg.Fee: ${fee} ${currency ?? ""})`;
      return value ? `${value} km` : null;
    })
    .filter(Boolean)
    .join(" | ") || "Distance not specified";

const EventSummery: React.FC<EventProps> = ({ event, onPress }) => {
  const formattedDate = formatEventDate(event?.eventDate);
  const dispatch = useDispatch<AppDispatch>();
  const { groupList } = useSelector((state: RootState) => state.group);

  useEffect(() => {
    if (groupList.length === 0) {
      dispatch(fetchAllGroups());
    }
  }, [dispatch, groupList.length]);

  const organizerName =
    groupList.find((group) => group.groupID === event?.organizerId)?.groupName || "Unknown";
  const selectedCategory = categories.find((cat) => cat.EventCategoryId === event?.eventCategoryId);
  const imageUri = event?.imageEventProfilePicture
    ? `${FILE_SERVER}${event.imageEventProfilePicture}`
    : `${FILE_SERVER}/images/running-event-default-picture.png`;

  return (
    <Pressable style={styles.eventCardListing} onPress={() => onPress?.(event)}>
      <View style={styles.eventImageWrapper}>
        <Image source={{ uri: imageUri }} resizeMode="cover" style={styles.eventImageListing} />
        <Text style={styles.dateText}>
          {event?.eventStatusId && event.eventStatusId > 1 && formattedDate ? (
            <>
              <Text style={styles.eventDateDay}>{formattedDate.split(" ")[1]}</Text>{" "}
              <Text style={styles.eventDateMonth}>{formattedDate.split(" ")[0]}</Text>{" "}
              <Text style={styles.eventDateYear}>{formattedDate.split(", ")[1]}</Text>
            </>
          ) : (
            "Coming Soon..."
          )}
        </Text>
      </View>
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{event?.eventName || "Untitled Event"}</Text>
        <Text style={styles.textMuted}>
          {event?.eventTypeId !== 1 ? "Virtual" : "Location"}:{" "}
          {event?.venueDetails || "Location not specified"} | {formatRaceDistance(event?.raceDistance)}
        </Text>
        <Text style={styles.textMutedSmall}>
          Event Category: {selectedCategory?.CategoryName || "N/A"} | Surface: {event?.surfaceType || "N/A"}
        </Text>
        <View style={styles.badgeRow}>
          {event?.isCertified ? <Badge label="Certified" color="#198754" /> : null}
          {event?.eventTypeId === 1 ? <Badge label="Physical" color="#0d6efd" /> : null}
          {event?.eventTypeId === 2 ? <Badge label="Virtual" color="#0dcaf0" dark /> : null}
          {event?.eventTypeId === 3 ? <Badge label="Hybrid" color="#ffc107" dark /> : null}
          <EventStatusBadge statusId={event?.eventStatusId ?? 1} />
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.goingInfo}>Going ({event.totalGoingCount ?? 0})</Text>
          <Text style={styles.organizerText}>Organized by: {organizerName}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const Badge = ({ label, color, dark }: { label: string; color: string; dark?: boolean }) => (
  <Text style={[styles.badge, { backgroundColor: color, color: dark ? "#000000" : "#ffffff" }]}>
    {label}
  </Text>
);

const EventStatusBadge: React.FC<{ statusId: number }> = ({ statusId }) => {
  const statusMap: Record<number, { text: string; color: string }> = {
    1: { text: "Planning", color: "#ffcc00" },
    2: { text: "Registration Open", color: "#28a745" },
    3: { text: "Event Completed", color: "#080808" },
    4: { text: "Cancelled", color: "#dc3545" },
    5: { text: "Event Postponed", color: "#ffc107" },
    6: { text: "Event On Hold", color: "#17a2b8" },
    7: { text: "Pending", color: "#6f42c1" },
  };
  const status = statusMap[statusId] || statusMap[1];

  return <Text style={[styles.statusBadge, { backgroundColor: status.color }]}>{status.text}</Text>;
};

const styles = StyleSheet.create({
  eventCardListing: {
    backgroundColor: "#ffffff",
    borderColor: "#eeeeee",
    borderRadius: 4,
    borderWidth: 1,
    elevation: 4,
    marginBottom: 16,
    padding: 8,
    shadowColor: "#aabdc7",
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  eventImageWrapper: { width: "100%" },
  eventImageListing: { borderRadius: 10, height: 180, width: "100%" },
  dateText: { color: "#6c757d", fontSize: 12, marginTop: 4, textAlign: "center" },
  eventDateDay: { color: "#007bff", fontSize: 16, fontWeight: "700" },
  eventDateMonth: { color: "#6c757d", fontSize: 16, fontWeight: "700" },
  eventDateYear: { color: "#28a745", fontSize: 14, fontWeight: "700" },
  eventContent: { width: "100%" },
  eventTitle: { fontSize: 24, fontWeight: "700", marginBottom: 4 },
  textMuted: { color: "#6c757d", fontSize: 14 },
  textMutedSmall: { color: "#6c757d", fontSize: 12, marginBottom: 8 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  badge: {
    borderRadius: 3,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusBadge: {
    borderRadius: 3,
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    marginRight: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  footerRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 4 },
  goingInfo: {
    backgroundColor: "#9fe09f",
    borderColor: "#eeeeee",
    borderRadius: 4,
    borderWidth: 1,
    color: "#000000",
    fontSize: 12,
    paddingHorizontal: 10,
  },
  organizerText: { color: "#6c757d", fontSize: 12 },
});

export default EventSummery;
