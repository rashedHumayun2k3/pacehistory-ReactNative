import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface RegistrationFeeSelectorProps {
  selectedDistanceValue: string;
  onValueChange: (updatedFees: string) => void;
}

const RegistrationFeeSelector: React.FC<RegistrationFeeSelectorProps> = ({
  selectedDistanceValue,
  onValueChange,
}) => {
  const distances = useMemo(
    () => selectedDistanceValue.split(",").map((distance) => distance.trim()).filter(Boolean),
    [selectedDistanceValue]
  );
  const [fees, setFees] = useState<Record<string, string>>(
    distances.reduce((acc: Record<string, string>, distance: string) => {
      acc[distance] = "";
      return acc;
    }, {})
  );

  const handleInputChange = (distance: string, value: string) => {
    const updatedFees = { ...fees, [distance]: value };

    setFees(updatedFees);
    onValueChange(JSON.stringify(updatedFees));
  };

  return (
    <View style={styles.container}>
      {distances.map((distance) => (
        <View key={distance} style={styles.row}>
          <Text style={styles.label}>{distance} Km</Text>
          <TextInput
            value={fees[distance]}
            onChangeText={(value) => handleInputChange(distance, value)}
            placeholder="Registration Fee"
            style={styles.input}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 12 },
  row: { alignItems: "center", flexDirection: "row", gap: 8 },
  label: { fontWeight: "600", width: 80 },
  input: {
    borderColor: "#cccccc",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 38,
    paddingHorizontal: 10,
  },
});

export default RegistrationFeeSelector;
