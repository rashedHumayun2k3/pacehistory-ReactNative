import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useDispatch } from "react-redux";
import { achievementBadges } from "../../helpers/constantValues";
import { fetchUserDetails } from "../../store/slices/userManagementSlice";
import { AppDispatch } from "../../store/store";
import { UserProfile } from "../../types/user/userProfile.interface";
import ProfilePicture from "./ProfilePicture";

interface UserInfoProps {
  userDetails: UserProfile | null;
  showEditActivity?: boolean;
  currentDomain?: string;
}

const UserInfo = ({
  currentDomain = "https://pacehistory.com",
  userDetails,
  showEditActivity,
}: UserInfoProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const achievementParts = userDetails?.achievements?.split(",");

  const getCategoryStyle = (achievementName: string) => {
    const name = achievementName.split(":")[0].trim();
    const badge = achievementBadges.find((item) => item.achievementBadgeName === name);

    return badge?.categoryClass === "trainer"
      ? styles.badgeTrainer
      : badge?.categoryClass === "running"
        ? styles.badgeRunning
        : styles.badgeDefault;
  };

  const copyText = async (text: string, message: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied", message);
  };

  const editPopupClosed = (loggedInUserId: number) => {
    if (loggedInUserId > 0) {
      dispatch(fetchUserDetails(loggedInUserId.toString()));
    }
  };

  if (!userDetails) return <Text style={styles.loading}>Loading user data...</Text>;

  return (
    <View>
      <ProfilePicture
        userProfileDetails={userDetails}
        onClose={editPopupClosed}
        showEditActivity={showEditActivity}
      />
      <View style={styles.profileBox}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>
            {userDetails?.firstName} {userDetails?.lastName}
          </Text>
          {userDetails?.country ? <Text style={styles.country}>{userDetails.country}</Text> : null}
        </View>

        <Pressable
          style={styles.whiteButton}
          onPress={() =>
            copyText(
              `${currentDomain}/profile/${userDetails?.profileName}`,
              "Profile link copied to clipboard!"
            )
          }
        >
          <Text style={styles.whiteButtonText}>Profile Link</Text>
        </Pressable>

        <Pressable
          style={styles.orangeButton}
          onPress={() =>
            copyText(
              userDetails?.sportsTrackingProfileLink || "",
              "Sports tracking link copied to clipboard!"
            )
          }
        >
          <Text style={styles.whiteButtonText}>{userDetails?.sportsTrackingApp} Link</Text>
        </Pressable>

        {userDetails?.runningWebsiteHistory ? (
          <View style={styles.otherLinks}>
            <Text style={styles.otherLinksTitle}>Other Profile Links:</Text>
            {userDetails.runningWebsiteHistory.split("§").map((item, index) => {
              const [key, value] = item.split(":");
              return (
                <Text key={`${key}-${index}`} style={styles.otherLinkText}>
                  <Text style={styles.bold}>{key.trim()}</Text>: {value?.trim()}
                </Text>
              );
            })}
          </View>
        ) : null}

        <View style={styles.badgeWrap}>
          {(achievementParts || []).map((part, index) => (
            <Text key={`${part}-${index}`} style={[styles.badge, getCategoryStyle(part)]}>
              {part?.trim() || ""}
            </Text>
          ))}
        </View>

        {userDetails?.prHistory ? <Text style={styles.prHistory}>{userDetails.prHistory}</Text> : null}
        <Text style={styles.summary}>{userDetails?.profileSummery}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loading: { color: "#111111", padding: 10 },
  profileBox: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
    padding: 12,
  },
  nameRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  name: { color: "#111111", fontSize: 24, fontWeight: "900", textAlign: "center" },
  country: {
    backgroundColor: "#111111",
    borderRadius: 12,
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  whiteButton: {
    backgroundColor: "#ffffff",
    borderColor: "#dddddd",
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  orangeButton: {
    backgroundColor: "#ff8b2c",
    borderRadius: 6,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  whiteButtonText: { color: "#111111", fontSize: 13, fontWeight: "800" },
  otherLinks: {
    alignSelf: "stretch",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginTop: 10,
    padding: 10,
  },
  otherLinksTitle: { color: "#111111", fontSize: 13, fontWeight: "800", marginBottom: 4 },
  otherLinkText: { color: "#333333", fontSize: 12 },
  bold: { fontWeight: "800" },
  badgeWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "center",
    marginTop: 10,
  },
  badge: {
    borderRadius: 16,
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeTrainer: { backgroundColor: "#198754" },
  badgeRunning: { backgroundColor: "#0d6efd" },
  badgeDefault: { backgroundColor: "#555555" },
  prHistory: { color: "#111111", fontSize: 13, marginTop: 10, textAlign: "center" },
  summary: { color: "#6c757d", fontSize: 13, marginTop: 10, textAlign: "center" },
});

export default UserInfo;
