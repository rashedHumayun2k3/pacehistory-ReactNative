import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchuserEventResult } from "../../store/slices/eventResultSlice";
import { AppDispatch, RootState } from "../../store/store";
import { ParticipatedEventResult, UserMedals } from "../../types/user/userProfile.interface";

interface MedalPopupProps {
  medals: UserMedals[];
  selectedMadel: UserMedals | null;
  fileServerDomain?: string;
  navigation?: { navigate: (screenName: string, params?: Record<string, unknown>) => void };
  onSeeFullResults?: (eventDetails: ParticipatedEventResult) => void;
}

const getImageUrl = (path?: string | null, fileServerDomain = "") => {
  const server =
    fileServerDomain ||
    process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
    process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
    "";

  return path ? `${server}${path}` : `${server}/images/medal-default-image.png`;
};

const MedalPopup: React.FC<MedalPopupProps> = ({
  selectedMadel,
  fileServerDomain,
  navigation,
  onSeeFullResults,
}) => {
  const { userEventResult } = useSelector((state: RootState) => state.eventResult);
  const [medalEventDetails, setMedalEventDetails] = useState<ParticipatedEventResult>();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (selectedMadel) {
      dispatch(
        fetchuserEventResult({
          userId: selectedMadel?.userId?.toString() ?? "0",
          eventId: selectedMadel?.eventId?.toString() ?? "0",
        })
      );
    }
  }, [dispatch, selectedMadel]);

  useEffect(() => {
    if (userEventResult?.[0]) {
      setMedalEventDetails(userEventResult[0]);
    }
  }, [userEventResult]);

  const handleSeeFullResults = () => {
    if (!medalEventDetails) return;

    if (onSeeFullResults) {
      onSeeFullResults(medalEventDetails);
      return;
    }

    navigation?.navigate("EventDetails", {
      userId: medalEventDetails.userId,
      eventId: medalEventDetails.eventId,
    });
  };

  if (!selectedMadel) {
    return <Text style={styles.emptyText}>No medal selected</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: getImageUrl(selectedMadel.medelPictureLink, fileServerDomain) }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.details}>
        <Detail label="Event Name" value={medalEventDetails?.eventName || "N/A"} />
        <Detail label="Year" value={medalEventDetails?.eventYear || "N/A"} />
        <Detail label="Distance" value={medalEventDetails?.raceDistance || "Unknown"} />
        <Detail label="Pace" value={medalEventDetails?.pace || "N/A"} />
        <Detail label="Finish Time(ex: hh:mm:ss)" value={medalEventDetails?.finishTime || "N/A"} />
        <Detail label="Race Ranking" value={medalEventDetails?.raceScore || "N/A"} />
        {medalEventDetails?.isPersonalBest ? <Text style={styles.highlight}>Personal Best!</Text> : null}
        {medalEventDetails?.isBigAchievement ? <Text style={styles.highlight}>Big Achievement!</Text> : null}
        <Pressable style={styles.primaryButton} onPress={handleSeeFullResults}>
          <Text style={styles.primaryButtonText}>See Full Results</Text>
        </Pressable>
      </View>
    </View>
  );
};

const Detail = ({ label, value }: { label: string; value: string | number }) => (
  <Text style={styles.detailText}>
    <Text style={styles.detailLabel}>{label}: </Text>
    {value}
  </Text>
);

const styles = StyleSheet.create({
  container: { gap: 12 },
  emptyText: { color: "#555555", padding: 12 },
  image: { alignSelf: "center", borderRadius: 8, height: 220, width: 170 },
  details: { gap: 7 },
  detailText: { color: "#333333", fontSize: 13 },
  detailLabel: { color: "#111111", fontWeight: "800" },
  highlight: {
    backgroundColor: "#fff3cd",
    borderRadius: 6,
    color: "#664d03",
    fontSize: 13,
    fontWeight: "800",
    padding: 8,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#0d6efd",
    borderRadius: 6,
    marginTop: 8,
    paddingVertical: 10,
  },
  primaryButtonText: { color: "#ffffff", fontWeight: "800" },
});

export default MedalPopup;
