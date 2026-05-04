import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserEventSummary } from "../../store/slices/eventSummarySlice";
import { AppDispatch, RootState } from "../../store/store";

interface UserInfoProps {
  newparams: { id: number; selectionType: string } | null;
}

const BigAchievement = ({ newparams }: UserInfoProps) => {
  const { id } = newparams ?? {};
  const dispatch = useDispatch<AppDispatch>();
  const { userEventSummery, loading } = useSelector(
    (state: RootState) => state.userEventSummeryOutput
  );

  useEffect(() => {
    if (id != null) {
      dispatch(fetchUserEventSummary(id));
    }
  }, [dispatch, id]);

  if (loading.userEventSummery) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  const items = [
    ["Races", "Finished Races", userEventSummery?.totalRaces ?? 0],
    ["Distance", "Longest Distance", `${userEventSummery?.longestDistance ?? 0} km`],
    ["Elevation", "Highest Elevation Gain", `${userEventSummery?.highestElevationGain ?? 0} m`],
    ["PB", "Personal Best Count", userEventSummery?.personalBestCount ?? 0],
    ["Winner", "Age Group Winner", userEventSummery?.ageGroupWinsCount ?? 0],
    ["Major", "Big Achievement Count", userEventSummery?.bigAchievementsCount ?? 0],
  ] as const;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Summary</Text>
      <View style={styles.list}>
        {items.map(([icon, label, value]) => (
          <View key={label} style={styles.card}>
            <Text style={styles.icon}>{icon}</Text>
            <View style={styles.textWrap}>
              <Text style={styles.cardLabel}>{label}</Text>
              <Text style={styles.cardValue}>{value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 4 },
  loading: { color: "#111111", padding: 10 },
  title: { color: "#111111", fontSize: 18, fontWeight: "800", marginBottom: 8 },
  list: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  card: {
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    elevation: 1,
    flexDirection: "row",
    minWidth: "47%",
    padding: 10,
  },
  icon: { color: "#111111", fontSize: 13, fontWeight: "800", marginRight: 8, width: 64 },
  textWrap: { flex: 1 },
  cardLabel: { color: "#555555", fontSize: 12 },
  cardValue: { color: "#0d6efd", fontSize: 16, fontWeight: "800" },
});

export default BigAchievement;
