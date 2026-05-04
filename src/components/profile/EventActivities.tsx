import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ParticipatedEventResult, UserProfile } from "../../types/user/userProfile.interface";

interface UserInfoProps {
  userDetails: UserProfile | null;
  userEventActivity: ParticipatedEventResult[];
  fileServerDomain?: string;
  navigation?: { navigate: (screenName: string, params?: Record<string, unknown>) => void };
  onActivityPress?: (activity: ParticipatedEventResult) => void;
}

const FILE_SERVER =
  process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
  process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
  "";

const fallbackEventImage = require("../../../assets/images/running-event-default-picture.png");

const getImageSource = (path?: string | null, fileServerDomain = FILE_SERVER) => {
  if (!path) {
    return fallbackEventImage;
  }

  return { uri: path.startsWith("http") ? path : `${fileServerDomain}${path}` };
};

const EventActivities = ({
  userEventActivity,
  userDetails,
  navigation,
  onActivityPress,
  fileServerDomain = FILE_SERVER,
}: UserInfoProps) => {
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const handleActivityPress = (activity: ParticipatedEventResult) => {
    if (onActivityPress) {
      onActivityPress(activity);
      return;
    }

    navigation?.navigate("EventDetails", {
      userId: userDetails?.id,
      eventId: activity.eventId,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Running Activities ({userEventActivity.length})</Text>
      <View style={styles.list}>
        {userEventActivity.slice(0, visibleCount).map((activity, index) =>
          activity.userId === userDetails?.id ? (
            <Pressable
              key={`${activity.resultId}-${index}`}
              style={styles.card}
              onPress={() => handleActivityPress(activity)}
            >
              <Image
                source={getImageSource(activity.imageEventFinisher || userDetails.imageProfileBanner, fileServerDomain)}
                style={styles.eventImage}
                resizeMode="cover"
              />
              {activity.imageMedalPicture ? (
                <Image
                  source={getImageSource(activity.imageMedalPicture, fileServerDomain)}
                  style={styles.medalImage}
                  resizeMode="cover"
                />
              ) : null}
              <View style={styles.details}>
                <Text style={styles.eventTitle}>
                  {activity.eventName} - {activity.eventYear}
                </Text>
                <Text style={styles.info}>
                  <Text style={styles.bold}>Distance:</Text>({activity.raceDistance}) |{" "}
                  <Text style={styles.bold}>Finishing Time:</Text> {activity.finishTime}
                </Text>
                <Text style={styles.info}>
                  <Text style={styles.bold}>Pace:</Text> {activity.pace} |{" "}
                  <Text style={styles.bold}>Race Score:</Text> {activity.raceScore}
                </Text>
              </View>
            </Pressable>
          ) : null
        )}
      </View>
      {userEventActivity.length > visibleCount ? (
        <Pressable style={styles.seeMoreButton} onPress={() => setVisibleCount((prevCount) => prevCount + 8)}>
          <Text style={styles.seeMoreText}>See More {userEventActivity.length - visibleCount}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  title: { color: "#111111", fontSize: 18, fontWeight: "800", marginBottom: 12 },
  list: { gap: 10 },
  card: { backgroundColor: "#ffffff", borderRadius: 8, elevation: 2, overflow: "hidden" },
  eventImage: { height: 150, width: "100%" },
  medalImage: {
    borderColor: "#ffffff",
    borderRadius: 28,
    borderWidth: 2,
    height: 56,
    position: "absolute",
    right: 10,
    top: 10,
    width: 56,
  },
  details: { padding: 10 },
  eventTitle: { color: "#111111", fontSize: 15, fontWeight: "800", marginBottom: 4 },
  info: { color: "#444444", fontSize: 12, marginTop: 2 },
  bold: { fontWeight: "800" },
  seeMoreButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#0d6efd",
    borderRadius: 6,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  seeMoreText: { color: "#ffffff", fontWeight: "800" },
});

export default EventActivities;
