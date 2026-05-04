import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { achievementBadges } from "../../helpers/constantValues";
import { fetchAchievementBadge } from "../../store/slices/userProfile";
import { AppDispatch, RootState } from "../../store/store";
import { UserBadge } from "../../types/user/userProfile.interface";

interface AchievementBadgeSelectorProps {
  selectedUser: string;
  handleBadgeSelection: (selectedBadges: UserBadge[]) => void;
}

const categoryStyleMap: Record<string, object> = {
  trainer: { backgroundColor: "#233323" },
  running: { backgroundColor: "#2b2b2b" },
  "ul-running": { backgroundColor: "#2b2b2b" },
  "t-running": { backgroundColor: "#223323" },
  swimming: { backgroundColor: "#203247" },
  cycling: { backgroundColor: "#2d2634" },
  triathlon: { backgroundColor: "#263447" },
  adventureRacing: { backgroundColor: "#2f3323" },
  winterSports: { backgroundColor: "#26343a" },
  obstacelRacing: { backgroundColor: "#342626" },
};

const AchievementBadgeSelector: React.FC<AchievementBadgeSelectorProps> = ({
  selectedUser,
  handleBadgeSelection,
}) => {
  const [checkedBadges, setCheckedBadges] = useState<number[]>([]);
  const [badgeCounts, setBadgeCounts] = useState<Record<number, number>>({});
  const { badgeListForUser } = useSelector((state: RootState) => state.userProfile);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (selectedUser) dispatch(fetchAchievementBadge(parseInt(selectedUser, 10)));
  }, [dispatch, selectedUser]);

  useEffect(() => {
    if (!badgeListForUser) return;

    const counts = Object.fromEntries(
      badgeListForUser.map((record) => [record.achievementBadgeId, record.achievementCount])
    );
    setCheckedBadges(badgeListForUser.map((record) => record.achievementBadgeId));
    setBadgeCounts(counts);
  }, [badgeListForUser]);

  const emitSelection = (ids: number[], counts: Record<number, number>) => {
    handleBadgeSelection(
      ids.map((id) => ({ achievementBadgeId: id, achievementCount: counts[id] || 1 }))
    );
  };

  const handleCheckboxChange = (achievementBadgeId: number) => {
    const updatedCheckedBadges = checkedBadges.includes(achievementBadgeId)
      ? checkedBadges.filter((id) => id !== achievementBadgeId)
      : [...checkedBadges, achievementBadgeId];

    setCheckedBadges(updatedCheckedBadges);
    emitSelection(updatedCheckedBadges, badgeCounts);
  };

  const handleInputChange = (achievementBadgeId: number, achievementCount: number) => {
    const updatedCounts = { ...badgeCounts, [achievementBadgeId]: achievementCount };

    setBadgeCounts(updatedCounts);
    emitSelection(checkedBadges, updatedCounts);
  };

  return (
    <View style={styles.container}>
      {achievementBadges.map((badge) => {
        const selected = checkedBadges.includes(badge.achievementBadgeId);

        return (
          <View
            key={badge.achievementBadgeId}
            style={[styles.badgeRow, categoryStyleMap[badge.categoryClass] || null]}
          >
            <Pressable
              style={[styles.checkbox, selected && styles.checkboxSelected]}
              onPress={() => handleCheckboxChange(badge.achievementBadgeId)}
            >
              {selected ? <Text style={styles.checkMark}>Y</Text> : null}
            </Pressable>
            <Text style={styles.badgeName}>{badge.achievementBadgeName}</Text>
            {selected ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.countList}>
                {Array.from({ length: 20 }, (_, index) => index + 1).map((count) => {
                  const countSelected = (badgeCounts[badge.achievementBadgeId] || 1) === count;

                  return (
                    <Pressable
                      key={count}
                      style={[styles.countOption, countSelected && styles.countOptionSelected]}
                      onPress={() => handleInputChange(badge.achievementBadgeId, count)}
                    >
                      <Text style={[styles.countText, countSelected && styles.countTextSelected]}>{count}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 8, padding: 10, width: "100%" },
  badgeRow: {
    alignItems: "center",
    backgroundColor: "#222222",
    borderRadius: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 8,
  },
  checkbox: {
    alignItems: "center",
    borderColor: "#ffffff",
    borderRadius: 3,
    borderWidth: 1,
    height: 22,
    justifyContent: "center",
    width: 22,
  },
  checkboxSelected: { backgroundColor: "#198754" },
  checkMark: { color: "#ffffff", fontWeight: "700" },
  badgeName: {
    backgroundColor: "#111111",
    borderRadius: 4,
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  countList: { gap: 6 },
  countOption: {
    borderColor: "#ced4da",
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  countOptionSelected: { backgroundColor: "#0d6efd", borderColor: "#0d6efd" },
  countText: { color: "#ffffff", fontSize: 12 },
  countTextSelected: { fontWeight: "700" },
});

export default AchievementBadgeSelector;
