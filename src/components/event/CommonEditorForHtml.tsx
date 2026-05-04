import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface CommonEditorForHtmlProps {
  name: string;
  value: string;
  placeholder?: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
}

const CommonEditorForHtml: React.FC<CommonEditorForHtmlProps> = ({
  name,
  value,
  placeholder,
  onChange,
}) => (
  <View style={styles.editorShell}>
    <TextInput
      value={value}
      onChangeText={(text) => onChange({ target: { name, value: text } })}
      multiline
      placeholder={placeholder}
      textAlignVertical="top"
      style={styles.editor}
    />
  </View>
);

const styles = StyleSheet.create({
  editorShell: {
    width: "100%",
  },
  editor: {
    borderColor: "#dddddd",
    borderRadius: 4,
    borderWidth: 1,
    minHeight: 120,
    paddingHorizontal: 10,
    paddingTop: 10,
    width: "100%",
  },
});

export default CommonEditorForHtml;
