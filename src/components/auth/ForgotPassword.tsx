import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { routes } from "../../routes/routes";
import { fetchforgotPassword } from "../../store/slices/userProfile";
import { AppDispatch, RootState } from "../../store/store";

interface ForgotPasswordProps {
  navigation?: { navigate: (screenName: string, params?: Record<string, unknown>) => void };
  navigate?: (path: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ navigation, navigate }) => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { loading, ForgotPasswordData, error } = useSelector((state: RootState) => state.userProfile);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!loading) {
      setMessage("");
      dispatch(fetchforgotPassword(trimmedEmail));
    }
  };

  const goToLogin = () => {
    if (navigate) {
      navigate(routes.login);
      return;
    }

    navigation?.navigate("Login");
  };

  useEffect(() => {
    if (ForgotPasswordData?.message) {
      Alert.alert("Forgot password", ForgotPasswordData.message);
      setEmail("");
    }
  }, [ForgotPasswordData]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.logoText}>PACE HISTORY</Text>
        <Text style={styles.title}>
          Lost your password? Enter your email, and we will help you get back into your account.
        </Text>

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#777777"
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
          onChangeText={setEmail}
        />

        <View style={styles.actions}>
          <Pressable style={[styles.warningButton, loading && styles.disabled]} disabled={loading} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{loading ? "Processing..." : "Send Password"}</Text>
          </Pressable>
          <Pressable style={styles.warningButton} onPress={goToLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: { backgroundColor: "#ffffff", borderRadius: 8, elevation: 3, padding: 16, width: "100%" },
  logoText: {
    alignSelf: "center",
    color: "#ffcc00",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 10,
  },
  title: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
  },
  label: { color: "#111111", fontSize: 13, fontWeight: "700", marginBottom: 6 },
  input: {
    borderColor: "#ced4da",
    borderRadius: 6,
    borderWidth: 1,
    color: "#111111",
    minHeight: 42,
    paddingHorizontal: 10,
  },
  actions: { flexDirection: "row", gap: 10, marginTop: 16 },
  warningButton: {
    alignItems: "center",
    backgroundColor: "#ffcc00",
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: 10,
  },
  disabled: { opacity: 0.6 },
  buttonText: { color: "#111111", fontWeight: "900" },
  message: { color: "#555555", fontSize: 13, marginTop: 12, textAlign: "center" },
  error: { color: "#dc3545", fontSize: 13, marginTop: 12, textAlign: "center" },
});

export default ForgotPassword;
