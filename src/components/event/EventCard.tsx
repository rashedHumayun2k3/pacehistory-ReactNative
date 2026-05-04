import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IEvent } from "../../types/event/eventType.interface";

interface EventProps {
  event: IEvent;
  onPress?: (event: IEvent) => void;
}

const FILE_SERVER =
  process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
  process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
  "";

const defaultImageUri = `${FILE_SERVER}/images/running-event-default-picture.png`;
const organizerImageUri =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpYJQKSoM7S75P_KMRtQHqAAIPh133CSxByw&usqp=CAU";

const formatEventDate = (value: IEvent["eventDate"]) => {
  const eventDate = value ? new Date(value) : new Date();

  if (Number.isNaN(eventDate.getTime())) {
    return "Date unavailable";
  }

  return eventDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const EventCard: React.FC<EventProps> = ({ event, onPress }) => {
  const formattedDate = formatEventDate(event.eventDate);
  const imageUri = event.imageEventProfilePicture
    ? `${FILE_SERVER}${event.imageEventProfilePicture}`
    : defaultImageUri;

  return (
    <Pressable onPress={() => onPress?.(event)} style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.cardBanner}>
          <Image source={{ uri: imageUri }} resizeMode="cover" style={styles.bannerImg} />
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.eventHashtag}>AIMS Certified</Text>
          <Text style={styles.eventTitle}>{event.eventName || "Untitled Event"}</Text>
          <Text style={styles.eventSchedule}>Date: {formattedDate}</Text>
          <Text style={styles.eventVenue}>Venue: {event.venueDetails || "Venue unavailable"}</Text>
          <View style={styles.cardProfile}>
            <Image source={{ uri: organizerImageUri }} style={styles.eventProfileImg} />
            <View style={styles.cardProfileInfo}>
              <View style={styles.eventOrganizer}>
                <Text style={styles.eventOrganizerName}>Run Bangladesh</Text>
              </View>
              <View style={styles.eventProfileFollowers}>
                <Text style={styles.followerText}>
                  {event.totalInterestedCount ?? "5.2k"} interested
                </Text>
                <Text style={styles.followerText}>{event.totalGoingCount ?? "3k"} going</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Text style={styles.actionButton}>Interested</Text>
            <Text style={styles.actionButton}>Going</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#e9e9e9",
    borderRadius: 8,
    elevation: 4,
    margin: 16,
    overflow: "hidden",
    width: 350,
  },
  cardBanner: { height: 224, position: "relative" },
  bannerImg: { height: 224, position: "absolute", width: "100%" },
  cardBody: { borderTopColor: "#a7a7a7", borderTopWidth: 1, margin: 16 },
  eventHashtag: { color: "#4d97b2", fontSize: 16, fontWeight: "500" },
  eventTitle: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    marginVertical: 4,
    textAlign: "center",
  },
  eventSchedule: { color: "#222222", fontSize: 13, marginBottom: 4 },
  eventVenue: { fontSize: 10, textAlign: "center" },
  cardProfile: {
    alignItems: "center",
    borderTopColor: "#cfcfcf",
    borderTopWidth: 1,
    flexDirection: "row",
    marginTop: 8,
    paddingTop: 4,
  },
  eventProfileImg: { borderRadius: 20, height: 40, width: 40 },
  cardProfileInfo: { flex: 1, flexDirection: "row", paddingBottom: 10 },
  eventOrganizer: { paddingLeft: 10, width: "50%" },
  eventOrganizerName: { fontSize: 12 },
  eventProfileFollowers: { alignItems: "flex-end", width: "50%" },
  followerText: { color: "#616b74", fontSize: 13 },
  buttonContainer: {
    borderColor: "#dcdcdc",
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: "row",
    width: "100%",
  },
  actionButton: {
    backgroundColor: "#f0ad4e",
    color: "#ffffff",
    flex: 1,
    fontSize: 14,
    padding: 8,
    textAlign: "center",
  },
});

export default EventCard;
