import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { sportsApplicationList } from "../../helpers/constantValues";

const SportsAppSelector: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<string>(sportsApplicationList[0]?.appName ?? "");
  const [link, setLink] = useState<string>("");

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.appList}>
        {sportsApplicationList.map((app) => {
          const selected = selectedApp === app.appName;
          return (
            <Pressable
              key={app.runningAppID}
              style={[styles.appOption, selected && styles.appOptionSelected]}
              onPress={() => setSelectedApp(app.appName)}
            >
              <Text style={[styles.appText, selected && styles.appTextSelected]}>{app.appName}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <TextInput
        value={link}
        onChangeText={setLink}
        placeholder="Enter the link"
        placeholderTextColor="#777777"
        style={styles.input}
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 0, width: "100%" },
  appList: { gap: 8, paddingBottom: 10 },
  appOption: {
    borderColor: "#d1d5db",
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  appOptionSelected: { backgroundColor: "#0d6efd", borderColor: "#0d6efd" },
  appText: { color: "#111827", fontSize: 14 },
  appTextSelected: { color: "#ffffff", fontWeight: "700" },
  input: {
    borderColor: "#d1d5db",
    borderRadius: 6,
    borderWidth: 1,
    color: "#111827",
    minHeight: 44,
    paddingHorizontal: 12,
  },
});

export default SportsAppSelector;
