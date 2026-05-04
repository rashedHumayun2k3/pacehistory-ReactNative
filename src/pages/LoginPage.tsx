import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import GoogleLoginPage from "../components/auth/google/GoogleLoginPage";
import { routes } from "../routes/routes";
import { setLoginAs } from "../store/slices/authSlice";
import { loginUser } from "../store/slices/userProfile";
import { AppDispatch } from "../store/store";

type PageProps = {
  navigate: (path: string) => void;
};

type LoginAs = "Athletes" | "Group Owner";

export default function LoginPage({ navigate }: PageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModalTerms, setShowModalTerms] = useState(false);
  const [showModalPrivacy, setShowModalPrivacy] = useState(false);
  const [selectedLoginAs, setSelectedLoginAs] = useState<LoginAs>("Athletes");
  const dispatch = useDispatch<AppDispatch>();

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  useEffect(() => {
    const setDefaultLoginAs = async () => {
      await AsyncStorage.setItem("loginAs", "Athletes");
      dispatch(setLoginAs("Athletes"));
    };

    setDefaultLoginAs();
  }, [dispatch]);

  const handleSelection = async (value: LoginAs) => {
    setSelectedLoginAs(value);
    await AsyncStorage.setItem("loginAs", value);
    dispatch(setLoginAs(value));
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert("Email required", "Email is required.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    if (!password) {
      Alert.alert("Password required", "Password is required.");
      return;
    }

    try {
      await dispatch(loginUser({ email: trimmedEmail, password, loginAs: selectedLoginAs })).unwrap();
      navigate(routes.home);
    } catch {
      Alert.alert("Login failed", "Please check your credentials.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.logoText}>PACE HISTORY</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777777"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#777777"
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
            />
            <Pressable style={styles.eyeButton} onPress={() => setShowPassword((value) => !value)}>
              <Text style={styles.eyeText}>{showPassword ? "Hide" : "Show"}</Text>
            </Pressable>
          </View>

          <View style={styles.loginAsBox}>
            <Text style={styles.loginAsTitle}>Login As:</Text>
            <View style={styles.radioRow}>
              <RadioOption
                label="Athletes"
                value="Athletes"
                selected={selectedLoginAs}
                onSelect={handleSelection}
              />
              <RadioOption
                label="Group Owner"
                value="Group Owner"
                selected={selectedLoginAs}
                onSelect={handleSelection}
              />
            </View>
          </View>

          <Pressable style={styles.linkRight} onPress={() => navigate(routes.forgotPassword)}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </Pressable>

          <Text style={styles.termsText}>
            By selecting "Sign In" button, you agree to PaceHistory's{" "}
            <Text style={styles.termsLink} onPress={() => setShowModalTerms(true)}>
              Terms of Use
            </Text>{" "}
            and{" "}
            <Text style={styles.termsLink} onPress={() => setShowModalPrivacy(true)}>
              Privacy Policy
            </Text>
            .
          </Text>

          <Pressable style={styles.signInButton} onPress={handleLogin}>
            <Text style={styles.signInText}>Sign In</Text>
          </Pressable>

          <Text style={styles.orText}>or</Text>
          <GoogleLoginPage navigate={navigate} />

          <Text style={styles.registerText}>
            Don't have an account?{" "}
            <Text style={styles.termsLink} onPress={() => navigate(routes.signup)}>
              Register
            </Text>
          </Text>
        </View>
      </ScrollView>

      <InfoModal
        visible={showModalTerms}
        title="Terms and Conditions"
        onClose={() => setShowModalTerms(false)}
        sections={termsSections}
      />
      <InfoModal
        visible={showModalPrivacy}
        title="Privacy Policy"
        onClose={() => setShowModalPrivacy(false)}
        sections={privacySections}
      />
    </KeyboardAvoidingView>
  );
}

const RadioOption = ({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string;
  value: LoginAs;
  selected: string;
  onSelect: (value: LoginAs) => void;
}) => (
  <Pressable style={styles.radioOption} onPress={() => onSelect(value)}>
    <View style={[styles.radioCircle, selected === value && styles.radioSelected]} />
    <Text style={styles.radioText}>{label}</Text>
  </Pressable>
);

const InfoModal = ({
  visible,
  title,
  sections,
  onClose,
}: {
  visible: boolean;
  title: string;
  sections: string[];
  onClose: () => void;
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>x</Text>
          </Pressable>
        </View>
        <ScrollView style={styles.modalScroll}>
          {sections.map((section, index) => (
            <Text key={`${title}-${index}`} style={styles.modalParagraph}>
              {section}
            </Text>
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const termsSections = [
  "1. Acceptance of Terms: By accessing or using the PaceHistory Services, you agree to be legally bound by these Terms and our Privacy Policy.",
  "2. User Content and Public Display: Your personal information, achievements, and event data may be displayed publicly on the PaceHistory platform.",
  "3. User Responsibilities: You must provide accurate information and must not upload offensive, false, illegal, harassing, adult, explicit, or misleading content.",
  "4. Account Management: PaceHistory may deactivate accounts for violations. You may request closure by contacting info.pacehistory@gmail.com.",
  "5. Data Collection and Usage: Google account data may include first name, last name, email, gender, date of birth, and country if required.",
  "6. Intellectual Property: PaceHistory content, designs, graphics, and code are protected property of PaceHistory.",
  "7. Disclaimer of Liability: Services are provided as is and PaceHistory is not liable for damages from use of the Services.",
  "8. Prohibited Activities: Do not use the Services unlawfully, attempt to disrupt the platform, or share misleading information.",
  "9. Changes to Terms: PaceHistory may update these Terms at any time.",
  "10. Contact Us: info.pacehistory@gmail.com, 01723111252.",
  "By using PaceHistory, you confirm that you have read, understood, and agreed to these Terms and Conditions.",
];

const privacySections = [
  "At PaceHistory, we are committed to protecting your privacy.",
  "1. Information We Collect: Personal information, achievement information, device information, and cookies.",
  "2. How We Use Your Information: To display achievements, improve the website, comply with obligations, and send related updates.",
  "3. Information Sharing: We may share information with users, service providers, and regulatory bodies when required by law.",
  "4. Data Retention: We retain data as long as necessary for the purposes in this policy or legal obligations.",
  "5. Your Rights: Access, review, correct, update, withdraw consent, and request deletion.",
  "6. Security Measures: We use security measures, but no system is completely secure.",
  "7. Updates to This Policy: We may update this Privacy Policy periodically.",
  "8. Contact Us: info.pacehistory@gmail.com.",
  "Last Updated: 11 April 2025",
];

const styles = StyleSheet.create({
  wrapper: { backgroundColor: "#f4f4f4", flex: 1 },
  content: { flexGrow: 1, justifyContent: "center", padding: 16 },
  card: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 3,
    padding: 16,
    width: "100%",
  },
  logoText: {
    color: "#ffcc00",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 10,
  },
  input: {
    borderColor: "#ced4da",
    borderRadius: 6,
    borderWidth: 1,
    color: "#111111",
    marginBottom: 8,
    minHeight: 48,
    paddingHorizontal: 12,
    width: "100%",
  },
  passwordRow: {
    alignItems: "center",
    borderColor: "#ced4da",
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 8,
    width: "100%",
  },
  passwordInput: { color: "#111111", flex: 1, minHeight: 48, paddingHorizontal: 12 },
  eyeButton: {
    borderLeftColor: "#ced4da",
    borderLeftWidth: 1,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 12,
  },
  eyeText: { color: "#111111", fontSize: 12, fontWeight: "700" },
  loginAsBox: { backgroundColor: "#000000", borderRadius: 6, padding: 10, width: "100%" },
  loginAsTitle: { color: "#ffffff", fontSize: 16, fontWeight: "800", marginBottom: 8 },
  radioRow: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  radioOption: { alignItems: "center", flexDirection: "row", gap: 6 },
  radioCircle: { borderColor: "#ffffff", borderRadius: 7, borderWidth: 1, height: 14, width: 14 },
  radioSelected: { backgroundColor: "#ffcc00" },
  radioText: { color: "#ffffff", fontSize: 13 },
  linkRight: { alignSelf: "flex-end", marginTop: 8 },
  linkText: { color: "#0d6efd", fontSize: 13, fontWeight: "700" },
  termsText: {
    color: "#6c757d",
    fontSize: 12,
    lineHeight: 18,
    marginVertical: 8,
    textAlign: "center",
  },
  termsLink: { color: "#0d6efd", fontWeight: "800" },
  signInButton: {
    alignItems: "center",
    backgroundColor: "#ffcc00",
    borderRadius: 6,
    justifyContent: "center",
    minHeight: 44,
    width: "100%",
  },
  signInText: { color: "#111111", fontWeight: "900" },
  orText: { color: "#111111", marginVertical: 6 },
  registerText: { color: "#6c757d", fontSize: 13, marginTop: 12 },
  overlay: { backgroundColor: "rgba(0,0,0,0.55)", flex: 1, justifyContent: "center", padding: 16 },
  modal: { backgroundColor: "#ffffff", borderRadius: 8, maxHeight: "90%", overflow: "hidden" },
  modalHeader: {
    alignItems: "center",
    borderBottomColor: "#eeeeee",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  modalTitle: { color: "#111111", fontSize: 18, fontWeight: "900" },
  closeButton: { alignItems: "center", height: 34, justifyContent: "center", width: 34 },
  closeText: { color: "#111111", fontSize: 18, fontWeight: "900" },
  modalScroll: { padding: 12 },
  modalParagraph: { color: "#333333", fontSize: 12, lineHeight: 18, marginBottom: 10 },
});
