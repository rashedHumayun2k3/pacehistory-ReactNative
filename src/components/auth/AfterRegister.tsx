import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { routes } from "../../routes/routes";

interface AfterRegisterProps {
  route?: { params?: { username?: string; email?: string } };
  navigation?: {
    navigate: (screenName: string, params?: Record<string, unknown>) => void;
  };
  navigate?: (path: string) => void;
}

const AfterRegister: React.FC<AfterRegisterProps> = ({ route, navigation, navigate }) => {
  const username = route?.params?.username || "[User's Name]";
  const email = route?.params?.email || "example@gmail.com";

  const goHome = () => {
    if (navigate) {
      navigate(routes.home);
      return;
    }

    navigation?.navigate("Home");
  };

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.content}>
      <View style={styles.messageBox}>
        <Text style={styles.title}>Account Registration Successful</Text>

        <Text style={styles.paragraph}>
          Dear {username}, your account has been created successfully, but it is currently marked as{" "}
          <Text style={styles.inactive}>Inactive</Text>.
        </Text>

        <Text style={styles.paragraph}>
          We have sent a verification link to <Text style={styles.bold}>{email}</Text> titled{" "}
          <Text style={styles.bold}>PaceHistory Support</Text>. Please click the link to activate your
          account. Once activated, your account will be marked as <Text style={styles.active}>Active</Text>.
        </Text>

        <Text style={styles.highlight}>Please check your inbox and spam folder</Text>
        <Text style={styles.paragraph}>
          for the email. Click the confirmation link to activate your account.
        </Text>

        <Text style={styles.paragraph}>
          Until then, you cannot access your personal account, but feel free to explore other available
          options.
        </Text>

        <Pressable style={styles.primaryButton} onPress={goHome}>
          <Text style={styles.primaryButtonText}>OK</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: { backgroundColor: "#f4f4f4", flex: 1 },
  content: { flexGrow: 1, justifyContent: "center", padding: 16 },
  messageBox: { backgroundColor: "#ffffff", borderRadius: 8, elevation: 3, padding: 16 },
  title: {
    color: "#111111",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
    textAlign: "center",
  },
  paragraph: { color: "#333333", fontSize: 14, lineHeight: 21, marginBottom: 10 },
  inactive: { color: "#dc3545", fontWeight: "900" },
  active: { color: "#198754", fontWeight: "900" },
  bold: { fontWeight: "900" },
  highlight: {
    alignSelf: "flex-start",
    backgroundColor: "#ffcc00",
    color: "#111111",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
    padding: 4,
  },
  primaryButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#0d6efd",
    borderRadius: 6,
    marginTop: 8,
    minWidth: 120,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryButtonText: { color: "#ffffff", fontWeight: "800" },
});

export default AfterRegister;
