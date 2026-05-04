import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

const triathlonData: Record<string, { title: string; lines: Array<[string, string]> }> = {
  sprint_triathlon: {
    title: "Sprint Triathlon:",
    lines: [
      ["Swim:", "750 meters (0.47 miles)"],
      ["Bike:", "20 km (12.4 miles)"],
      ["Run:", "5 km (3.1 miles)"],
      ["Total Distance:", "25.75 km (16 miles)"],
    ],
  },
  olympic_triathlon: {
    title: "Olympic Triathlon:",
    lines: [
      ["Swim:", "1.5 km (0.93 miles)"],
      ["Bike:", "40 km (24.8 miles)"],
      ["Run:", "10 km (6.2 miles)"],
      ["Total Distance:", "51.5 km (32 miles)"],
    ],
  },
  half_ironman: {
    title: "Half Ironman (70.3):",
    lines: [
      ["Swim:", "1.9 km (1.2 miles)"],
      ["Bike:", "90 km (56 miles)"],
      ["Run:", "21.1 km (13.1 miles)"],
      ["Total Distance:", "113 km (70.3 miles)"],
    ],
  },
  full_ironman: {
    title: "Full Ironman:",
    lines: [
      ["Swim:", "3.8 km (2.4 miles)"],
      ["Bike:", "180 km (112 miles)"],
      ["Run:", "42.2 km (26.2 miles)"],
      ["Total Distance:", "226 km (140.6 miles)"],
    ],
  },
  winter_triathlon: {
    title: "Winter Triathlon:",
    lines: [
      ["Run:", "8-10 km (5-6 miles)"],
      ["Mountain Bike:", "12-14 km (7.5-8.7 miles)"],
      ["Cross-Country Ski:", "10-12 km (6.2-7.5 miles)"],
      ["Total Distance:", "Approximately 30-36 km (18.6-22.4 miles)"],
    ],
  },
};

const TriathlonDistance = ({ categoryCode }: { categoryCode: string | null }) => {
  const data = categoryCode ? triathlonData[categoryCode] : null;
  if (!data) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>
      {data.lines.map(([label, value]) => (
        <Text key={label} style={styles.line}>
          <Text style={styles.bold}>{label}</Text> <Text style={styles.value}>{value}</Text>
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    elevation: 2,
    marginBottom: 5,
    padding: 10,
  },
  title: { color: "#2c3e50", fontSize: 14, fontWeight: "700" },
  line: { fontSize: 12, lineHeight: 20, paddingVertical: 2 },
  bold: { fontWeight: "700" },
  value: { color: "#3498db" },
});

export default TriathlonDistance;
