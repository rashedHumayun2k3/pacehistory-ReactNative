import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { achievementBadges } from "../../helpers/constantValues";

interface AchievementBadgeShowProps {
  achievements?: string | null;
}

const AchievementBadgeShow: React.FC<AchievementBadgeShowProps> = ({ achievements }) => {
  const achievementParts = achievements
    ?.split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const getCategoryStyle = (achievementName: string) => {
    const name = achievementName.split(":")[0].trim();
    const badge = achievementBadges.find(
      (item) => item.achievementBadgeName === name
    );

    return categoryStyleMap[badge?.categoryClass ?? ""] ?? styles.customBadge;
  };

  if (!achievementParts || achievementParts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {achievementParts.map((part, index) => (
        <Text key={`${part}-${index}`} style={[styles.badge, getCategoryStyle(part)]}>
          {part}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  badge: {
    borderRadius: 16,
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  trainerBadge: { backgroundColor: "#198754" },
  runningBadge: { backgroundColor: "#0d6efd" },
  ultraRunningBadge: { backgroundColor: "#fd7e14" },
  trailRunningBadge: { backgroundColor: "#364fc7" },
  cyclingBadge: { backgroundColor: "#6f42c1" },
  swimmingBadge: { backgroundColor: "#0aa2c0" },
  triathlonBadge: { backgroundColor: "#dc3545" },
  adventureRacingBadge: { backgroundColor: "#8b4513" },
  winterSportsBadge: { backgroundColor: "#4682b4" },
  obstacleRacingBadge: { backgroundColor: "#800080" },
  customBadge: { backgroundColor: "#555555" },
});

const categoryStyleMap: Record<string, object> = {
  trainer: styles.trainerBadge,
  running: styles.runningBadge,
  "ul-running": styles.ultraRunningBadge,
  "t-running": styles.trailRunningBadge,
  cycling: styles.cyclingBadge,
  swimming: styles.swimmingBadge,
  triathlon: styles.triathlonBadge,
  adventureRacing: styles.adventureRacingBadge,
  winterSports: styles.winterSportsBadge,
  obstacelRacing: styles.obstacleRacingBadge,
  "custom-class": styles.customBadge,
};

export default AchievementBadgeShow;
