import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
} from "react-native";

const EventPriceMoney: React.FC = () => {
  const [value, setValue] = useState("");

  return (
    <View style={styles.editorContainer}>
      <TextInput
        multiline
        value={value}
        onChangeText={setValue}
        style={styles.editor}
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  editorContainer: {
    borderColor: "#cccccc",
    borderWidth: 1,
    minHeight: 200,
    padding: 10,
  },
  editor: { flex: 1, minHeight: 180 },
});

export default EventPriceMoney;
