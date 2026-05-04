import React, { useEffect, useState } from "react";
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
import { useDispatch } from "react-redux";
import { achievementBadges, sportsApplicationList } from "../../helpers/constantValues";
import { updateUserProfile } from "../../store/slices/updateUserProfile";
import { AppDispatch } from "../../store/store";
import { UserBadge, UserProfile } from "../../types/user/userProfile.interface";
import AchievementBadgeSelector from "./AchievementBadgeSelector";
import RunningWebsiteSelector from "./RunningWebsiteSelector";

interface EditProfileProps {
  userDetails: UserProfile | null;
  onClose: () => void;
}

const getDatePart = (date: string | null | undefined, index: number) => date?.split("T")[0]?.split("-")[index] || "";
const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

const EditProfile: React.FC<EditProfileProps> = ({ userDetails, onClose }) => {
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    id: 0,
    profilePicture: "",
    profileBannerPicture: "",
    firstName: "",
    lastName: "",
    profileSummery: "",
    achievements: "",
    dateOfBirth: "",
    gender: "",
    country: "bd",
    district_State: "",
    imageProfilePicture: "",
    imageProfileBanner: "",
    isTrainer: false,
    sportsTrackingApp: "Strava",
    sportsTrackingProfileLink: "",
    badges: [],
    runningWebsiteHistory: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const [showWebsiteSelector, setShowWebsiteSelector] = useState(false);

  useEffect(() => {
    setProfile({
      id: userDetails?.id || 0,
      profileBannerPicture: userDetails?.profileBannerPicture || "",
      profilePicture: userDetails?.profilePicture || "",
      firstName: userDetails?.firstName || "",
      lastName: userDetails?.lastName || "",
      profileSummery: userDetails?.profileSummery || "",
      achievements: userDetails?.achievements || "",
      dateOfBirth: userDetails?.dateOfBirth || "",
      gender: userDetails?.gender || "",
      country: userDetails?.country || "",
      district_State: userDetails?.district_State || "",
      historyOfLife: userDetails?.historyOfLife || "",
      imageProfilePicture: userDetails?.imageProfilePicture || "",
      imageProfileBanner: userDetails?.imageProfileBanner || "",
      isTrainer: userDetails?.isTrainer,
      sportsTrackingApp: userDetails?.sportsTrackingApp,
      sportsTrackingProfileLink: userDetails?.sportsTrackingProfileLink,
      badges: userDetails?.badges || [],
      runningWebsiteHistory: userDetails?.runningWebsiteHistory,
    });
  }, [userDetails]);

  useEffect(() => {
    setShowWebsiteSelector(Boolean(profile?.runningWebsiteHistory && profile.runningWebsiteHistory.length > 0));
  }, [profile.runningWebsiteHistory]);

  const setDate = (part: "day" | "month" | "year", value: string) => {
    const year = part === "year" ? value : getDatePart(profile.dateOfBirth, 0);
    const month = part === "month" ? value.padStart(2, "0") : getDatePart(profile.dateOfBirth, 1);
    const day = part === "day" ? value.padStart(2, "0") : getDatePart(profile.dateOfBirth, 2);
    setProfile({ ...profile, dateOfBirth: `${year}-${month}-${day}T00:00:00` });
  };

  const handleSaveChanges = () => {
    if (!profile.firstName?.trim() || !profile.lastName?.trim() || !profile.profileSummery?.trim() || !profile.dateOfBirth?.trim() || !profile.gender?.trim() || !profile.country?.trim()) {
      Alert.alert("Required fields", "Please complete all required fields: First Name, Last Name, Profile Summary, Date of Birth, Gender, and Country.");
      return;
    }
    dispatch(updateUserProfile(profile));
    onClose();
  };

  const handleBadgeSelection = (selectedBadges: UserBadge[]) => {
    const result = selectedBadges
      .map((badge) => {
        const achievement = achievementBadges.find((ab) => ab.achievementBadgeId === badge.achievementBadgeId);
        return achievement ? `${achievement.achievementBadgeName}: ${badge.achievementCount}` : null;
      })
      .filter(Boolean)
      .join(", ");

    setProfile((prev) => ({ ...prev, achievements: result, badges: selectedBadges }));
  };

  const handleWebsiteSelection = (websites: Record<string, string>) => {
    const selectedWebsites = Object.entries(websites)
      .filter(([, value]) => value && value.trim() !== "")
      .map(([key, value]) => `${key}: ${value}`)
      .join("§");
    setProfile((prev) => ({ ...prev, runningWebsiteHistory: selectedWebsites }));
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={styles.actionRow}>
            <Pressable style={styles.primaryButton} onPress={handleSaveChanges}>
              <Text style={styles.buttonText}>Save Profile Information</Text>
            </Pressable>
            <Pressable style={styles.dangerButton} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>First Name</Text>
          <TextInput style={styles.input} placeholder="First Name" maxLength={40} value={profile.firstName ?? ""} onChangeText={(value) => setProfile({ ...profile, firstName: value })} />

          <Text style={styles.label}>Last Name</Text>
          <TextInput style={styles.input} placeholder="Last Name" maxLength={40} value={profile.lastName ?? ""} onChangeText={(value) => setProfile({ ...profile, lastName: value })} />

          <Text style={styles.label}>Profile Summary</Text>
          <TextInput style={[styles.input, styles.textArea]} multiline maxLength={1000} placeholder="please give your profile summery" value={profile.profileSummery ?? ""} onChangeText={(value) => setProfile({ ...profile, profileSummery: value })} />

          <View style={styles.blackSection}>
            <Text style={styles.whiteLabel}>Date of Birth(DD/MM/YYYY)</Text>
            <View style={styles.dateRow}>
              <ScrollSelector values={Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"))} selected={getDatePart(profile.dateOfBirth, 2)} onSelect={(value) => setDate("day", value)} />
              <ScrollSelector values={Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"))} selected={getDatePart(profile.dateOfBirth, 1)} onSelect={(value) => setDate("month", value)} />
              <ScrollSelector values={years.map(String)} selected={getDatePart(profile.dateOfBirth, 0)} onSelect={(value) => setDate("year", value)} />
            </View>

            <Text style={styles.whiteLabel}>Gender</Text>
            <View style={styles.segmentRow}>
              {["Male", "Female", "Other"].map((gender) => (
                <Pressable key={gender} style={[styles.segment, profile.gender === gender && styles.segmentSelected]} onPress={() => setProfile({ ...profile, gender })}>
                  <Text style={[styles.segmentText, profile.gender === gender && styles.segmentTextSelected]}>{gender}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.whiteLabel}>Country</Text>
            <TextInput style={styles.input} value={profile.country ?? ""} onChangeText={(value) => setProfile({ ...profile, country: value })} />
            <Text style={styles.whiteLabel}>District/State</Text>
            <TextInput style={styles.input} maxLength={20} value={profile.district_State ?? ""} onChangeText={(value) => setProfile({ ...profile, district_State: value })} />
          </View>

          <View style={styles.darkSection}>
            <Text style={styles.whiteLabel}>Add Badge</Text>
            <View style={styles.checkRow}>
              <Pressable style={[styles.checkbox, profile.isTrainer && styles.checkboxSelected]} onPress={() => setProfile({ ...profile, isTrainer: !profile.isTrainer })}>
                {profile.isTrainer ? <Text style={styles.checkMark}>Y</Text> : null}
              </Pressable>
              <Text style={styles.badge}>Is Trainer</Text>
            </View>
            <AchievementBadgeSelector selectedUser={userDetails?.id?.toString() ?? "0"} handleBadgeSelection={handleBadgeSelection} />
          </View>

          <View style={styles.orangeSection}>
            <Text style={styles.label}>Select your tracker app</Text>
            <ScrollSelector values={sportsApplicationList.map((app) => app.appName)} selected={profile.sportsTrackingApp ?? ""} onSelect={(value) => setProfile({ ...profile, sportsTrackingApp: value })} />
            <TextInput style={styles.input} maxLength={500} placeholder="Enter your Strava or Garmin Connect profile link" value={profile.sportsTrackingProfileLink ?? ""} onChangeText={(value) => setProfile({ ...profile, sportsTrackingProfileLink: value })} />
          </View>

          <Pressable style={styles.greenToggle} onPress={() => setShowWebsiteSelector((value) => !value)}>
            <View style={[styles.checkbox, showWebsiteSelector && styles.checkboxSelected]}>{showWebsiteSelector ? <Text style={styles.checkMark}>Y</Text> : null}</View>
            <Text style={styles.toggleText}>Other Profile Links</Text>
          </Pressable>
          {showWebsiteSelector ? <RunningWebsiteSelector handleWebsiteSelection={handleWebsiteSelection} initialSelectedWebsites={profile.runningWebsiteHistory ?? ""} /> : null}

          <Pressable style={[styles.primaryButton, styles.fullButton]} onPress={handleSaveChanges}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const ScrollSelector = ({ values, selected, onSelect }: { values: string[]; selected: string; onSelect: (value: string) => void }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorList}>
    {values.map((value) => (
      <Pressable key={value} style={[styles.selectorOption, selected === value && styles.selectorSelected]} onPress={() => onSelect(value)}>
        <Text style={[styles.selectorText, selected === value && styles.selectorTextSelected]}>{value}</Text>
      </Pressable>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  container: { backgroundColor: "#111111", flex: 1 },
  content: { padding: 12 },
  headerRow: { gap: 10, marginBottom: 12 },
  title: { color: "#ffffff", fontSize: 22, fontWeight: "800" },
  actionRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: { backgroundColor: "#ffffff", borderRadius: 8, elevation: 3, padding: 12 },
  label: { color: "#111111", fontSize: 13, fontWeight: "700", marginBottom: 6, marginTop: 10 },
  whiteLabel: { color: "#ffffff", fontSize: 13, fontWeight: "700", marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: "#ffffff", borderColor: "#ced4da", borderRadius: 6, borderWidth: 1, color: "#111111", minHeight: 42, paddingHorizontal: 10 },
  textArea: { minHeight: 110, paddingTop: 10, textAlignVertical: "top" },
  blackSection: { backgroundColor: "#000000", borderRadius: 6, marginTop: 12, padding: 10 },
  darkSection: { backgroundColor: "#181818", borderRadius: 6, marginTop: 12, padding: 10 },
  orangeSection: { backgroundColor: "rgb(255, 139, 44)", borderRadius: 6, marginTop: 12, padding: 10 },
  dateRow: { gap: 8 },
  segmentRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  segment: { borderColor: "#ffffff", borderRadius: 6, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  segmentSelected: { backgroundColor: "#0d6efd", borderColor: "#0d6efd" },
  segmentText: { color: "#ffffff" },
  segmentTextSelected: { color: "#ffffff", fontWeight: "700" },
  selectorList: { gap: 6, paddingBottom: 8 },
  selectorOption: { backgroundColor: "#ffffff", borderColor: "#ced4da", borderRadius: 5, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8 },
  selectorSelected: { backgroundColor: "#0d6efd", borderColor: "#0d6efd" },
  selectorText: { color: "#111111", fontSize: 12 },
  selectorTextSelected: { color: "#ffffff", fontWeight: "700" },
  checkRow: { alignItems: "center", flexDirection: "row", gap: 8 },
  checkbox: { alignItems: "center", borderColor: "#ffffff", borderRadius: 3, borderWidth: 1, height: 22, justifyContent: "center", width: 22 },
  checkboxSelected: { backgroundColor: "#198754" },
  checkMark: { color: "#ffffff", fontWeight: "700" },
  badge: { backgroundColor: "#111111", borderRadius: 4, color: "#ffffff", fontSize: 12, fontWeight: "700", paddingHorizontal: 8, paddingVertical: 5 },
  greenToggle: { alignItems: "center", backgroundColor: "#d9f2d9", borderRadius: 6, flexDirection: "row", gap: 10, marginTop: 12, padding: 10 },
  toggleText: { color: "#111111", fontSize: 13, fontWeight: "700" },
  primaryButton: { alignItems: "center", backgroundColor: "#0d6efd", borderRadius: 6, minHeight: 42, justifyContent: "center", paddingHorizontal: 14 },
  dangerButton: { alignItems: "center", backgroundColor: "#dc3545", borderRadius: 6, minHeight: 42, justifyContent: "center", paddingHorizontal: 14 },
  fullButton: { marginTop: 12, width: "100%" },
  buttonText: { color: "#ffffff", fontSize: 13, fontWeight: "700" },
});

export default EditProfile;
