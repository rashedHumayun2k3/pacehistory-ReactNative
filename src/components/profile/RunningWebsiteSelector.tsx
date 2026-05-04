import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { runningWebsites } from "../../helpers/constantValues";

interface RunningWebsiteSelectorProps {
  handleWebsiteSelection: (selectedWebsites: Record<string, string>) => void;
  initialSelectedWebsites: string;
}

const RunningWebsiteSelector: React.FC<RunningWebsiteSelectorProps> = ({
  handleWebsiteSelection,
  initialSelectedWebsites,
}) => {
  const [selectedWebsites, setSelectedWebsites] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!initialSelectedWebsites) {
      setSelectedWebsites({});
      handleWebsiteSelection({});
      return;
    }

    const parsed: Record<string, string> = {};
    initialSelectedWebsites.split("§").forEach((pair) => {
      const [key, ...rest] = pair.split(":");
      const websiteName = key?.trim();
      const profileLink = rest.join(":").trim();

      if (websiteName && profileLink && runningWebsites.some((website) => website.ShortName === websiteName)) {
        parsed[websiteName] = profileLink;
      }
    });

    setSelectedWebsites(parsed);
    handleWebsiteSelection(parsed);
  }, [initialSelectedWebsites]);

  const handleCheckboxChange = (websiteName: string) => {
    const updatedWebsites = { ...selectedWebsites };

    if (websiteName in updatedWebsites) delete updatedWebsites[websiteName];
    else updatedWebsites[websiteName] = "";

    setSelectedWebsites(updatedWebsites);
    handleWebsiteSelection(updatedWebsites);
  };

  const handleInputChange = (websiteName: string, profileLink: string) => {
    const updatedWebsites = { ...selectedWebsites, [websiteName]: profileLink };

    setSelectedWebsites(updatedWebsites);
    handleWebsiteSelection(updatedWebsites);
  };

  return (
    <View style={styles.container}>
      {runningWebsites.map((website) => {
        const selected = website.ShortName in selectedWebsites;

        return (
          <View key={website.WebsiteId} style={styles.websiteRow}>
            <View style={styles.rowHeader}>
              <Pressable
                style={[styles.checkbox, selected && styles.checkboxSelected]}
                onPress={() => handleCheckboxChange(website.ShortName)}
              >
                {selected ? <Text style={styles.checkMark}>Y</Text> : null}
              </Pressable>
              <Text style={styles.badge}>{website.ShortName}</Text>
            </View>
            {selected ? (
              <TextInput
                value={selectedWebsites[website.ShortName]}
                onChangeText={(value) => handleInputChange(website.ShortName, value)}
                placeholder="Enter profile ID or profile link"
                placeholderTextColor="#777777"
                maxLength={200}
                style={styles.input}
                autoCapitalize="none"
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 10, padding: 10, width: "100%" },
  websiteRow: { backgroundColor: "#2f3f2f", borderRadius: 6, padding: 10, width: "100%" },
  rowHeader: { alignItems: "center", flexDirection: "row", gap: 8 },
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
  checkMark: { color: "#ffffff", fontSize: 14, fontWeight: "700" },
  badge: {
    backgroundColor: "#111111",
    borderRadius: 4,
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    color: "#111111",
    marginTop: 10,
    minHeight: 42,
    paddingHorizontal: 10,
  },
});

export default RunningWebsiteSelector;
