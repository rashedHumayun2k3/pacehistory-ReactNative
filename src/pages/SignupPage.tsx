import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { routes } from "../routes/routes";
import { resentEmailToken, signUpUser } from "../store/slices/userProfile";
import { AppDispatch, RootState } from "../store/store";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  birthDate: string;
  googleId: string;
  signUpWay: string;
}

type PageProps = {
  navigate: (path: string) => void;
};

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  gender: "",
  birthDate: "",
  googleId: "n/a",
  signUpWay: "MANUAL",
};

export default function SignupPage({ navigate }: PageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, error, EmailTokenResentError, EmailTokenResent } = useSelector(
    (state: RootState) => state.userProfile
  );
  const [isAccountExist] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentRequiredField, setCurrentRequiredField] = useState<string>("");

  const setField = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateField = (field: keyof FormData): boolean => {
    const fieldLabels: Record<keyof FormData, string> = {
      firstName: "First name is required",
      lastName: "Last name is required",
      email: "Email is required",
      password: "Password is required",
      gender: "Gender is required",
      birthDate: "Birth date is required",
      googleId: "",
      signUpWay: "",
    };

    if (!formData[field]) {
      if (fieldLabels[field]) {
        Alert.alert("Required", fieldLabels[field]);
      }
      return false;
    }

    if (field === "password") {
      const password = formData.password;
      if (password.length < 8) {
        Alert.alert("Invalid password", "Password must be at least 8 characters long");
        return false;
      }
      if (!/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        Alert.alert(
          "Invalid password",
          "Password must contain at least one uppercase letter and one special character"
        );
        return false;
      }
    }

    if (field === "birthDate") {
      const inputDate = new Date(formData.birthDate);
      const inputYear = inputDate.getFullYear();
      const currentYear = new Date().getFullYear();

      if (Number.isNaN(inputDate.getTime())) {
        Alert.alert("Invalid birth date", "Please enter birth date in YYYY-MM-DD format");
        return false;
      }
      if (inputYear > currentYear) {
        Alert.alert("Invalid birth date", "Birth date cannot be in the future");
        return false;
      }
      if (currentYear - inputYear < 8) {
        Alert.alert("Invalid birth date", "You must be at least 8 years old");
        return false;
      }
    }

    return true;
  };

  const validateForm = () => {
    const fields: (keyof FormData)[] = [
      "firstName",
      "lastName",
      "email",
      "password",
      "gender",
      "birthDate",
      "googleId",
      "signUpWay",
    ];
    return fields.every(validateField);
  };

  const callTheAPI = () => {
    setCurrentRequiredField("");
    setUpdateError(null);
    dispatch(signUpUser(formData))
      .unwrap()
      .then(() => {
        navigate(`${routes.afterRegister}?username=${encodeURIComponent(formData.firstName)}&email=${encodeURIComponent(formData.email)}`);
      })
      .catch(() => {});
  };

  const handleSubmit = () => {
    if (validateForm()) callTheAPI();
  };

  const handleResendEmailToken = () => {
    if (validateForm()) dispatch(resentEmailToken(formData));
  };

  useEffect(() => {
    setSuccessMessage("Account created successfully!");
  }, [success]);

  useEffect(() => {
    if (error) setUpdateError(error);
  }, [error]);

  useEffect(() => {
    if (EmailTokenResentError) setUpdateError(EmailTokenResentError);
  }, [EmailTokenResentError]);

  useEffect(() => {
    if (EmailTokenResent?.message?.includes("Email verification token sent")) {
      setUpdateError(null);
      Alert.alert("Verification email", EmailTokenResent.message);
    }
  }, [EmailTokenResent]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          {isAccountExist && <Text style={styles.successBox}>{successMessage}</Text>}
          {currentRequiredField !== "" ? <Text style={styles.requiredBox}>{currentRequiredField}</Text> : null}
          <Text style={styles.logoText}>PACE HISTORY</Text>
          <Text style={styles.title}>Create your account</Text>

          <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#777777" value={formData.firstName} onChangeText={(value) => setField("firstName", value)} />
          <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#777777" value={formData.lastName} onChangeText={(value) => setField("lastName", value)} />
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#777777" value={formData.email} onChangeText={(value) => setField("email", value)} autoCapitalize="none" keyboardType="email-address" />

          <View style={styles.passwordRow}>
            <TextInput style={styles.passwordInput} placeholder="Password" placeholderTextColor="#777777" value={formData.password} secureTextEntry={!showPassword} onChangeText={(value) => setField("password", value)} />
            <Pressable style={styles.eyeButton} onPress={() => setShowPassword((value) => !value)}>
              <Text style={styles.eyeText}>{showPassword ? "Hide" : "Show"}</Text>
            </Pressable>
          </View>

          <View style={styles.segmentRow}>
            {["Male", "Female", "Other"].map((gender) => (
              <Pressable key={gender} style={[styles.segment, formData.gender === gender && styles.segmentSelected]} onPress={() => setField("gender", gender)}>
                <Text style={[styles.segmentText, formData.gender === gender && styles.segmentTextSelected]}>{gender}</Text>
              </Pressable>
            ))}
          </View>

          <TextInput style={styles.input} placeholder="Date Of Birth (YYYY-MM-DD)" placeholderTextColor="#777777" value={formData.birthDate} onChangeText={(value) => setField("birthDate", value)} />

          {loading && <Text style={styles.loadingText}>Saving your details and sending confirmation email. Please wait...</Text>}
          <Pressable style={[styles.createButton, loading && styles.disabled]} disabled={loading} onPress={handleSubmit}>
            <Text style={styles.createButtonText}>{loading ? "Creating..." : "Create Account"}</Text>
          </Pressable>

          {updateError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{updateError}</Text>
              {(updateError.includes("Your email address is not verified") || updateError.includes("User not found with your given information")) && (
                <Pressable style={styles.resendButton} onPress={handleResendEmailToken}>
                  <Text style={styles.resendText}>Resend Verification Email</Text>
                </Pressable>
              )}
            </View>
          )}

          <Text style={styles.signInText}>
            Already have an account? <Text style={styles.signInLink} onPress={() => navigate(routes.login)}>Sign in</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: "#f4f4f4", flex: 1 },
  content: { flexGrow: 1, justifyContent: "center", padding: 16 },
  card: { alignItems: "center", backgroundColor: "#ffffff", borderRadius: 8, elevation: 3, padding: 16, width: "100%" },
  successBox: { backgroundColor: "#d1e7dd", borderRadius: 6, color: "#0f5132", marginBottom: 8, padding: 8, width: "100%" },
  requiredBox: { backgroundColor: "#fff3cd", borderRadius: 6, color: "#664d03", marginBottom: 8, padding: 8, width: "100%" },
  logoText: { color: "#ffcc00", fontSize: 24, fontWeight: "900", marginBottom: 10 },
  title: { color: "#111111", fontSize: 18, fontWeight: "900", marginBottom: 12 },
  input: { borderColor: "#ced4da", borderRadius: 6, borderWidth: 1, color: "#111111", marginBottom: 8, minHeight: 44, paddingHorizontal: 12, width: "100%" },
  passwordRow: { alignItems: "center", borderColor: "#ced4da", borderRadius: 6, borderWidth: 1, flexDirection: "row", marginBottom: 8, width: "100%" },
  passwordInput: { color: "#111111", flex: 1, minHeight: 44, paddingHorizontal: 12 },
  eyeButton: { borderLeftColor: "#ced4da", borderLeftWidth: 1, justifyContent: "center", minHeight: 44, paddingHorizontal: 12 },
  eyeText: { color: "#111111", fontSize: 12, fontWeight: "700" },
  segmentRow: { flexDirection: "row", gap: 8, marginBottom: 8, width: "100%" },
  segment: { alignItems: "center", borderColor: "#ced4da", borderRadius: 6, borderWidth: 1, flex: 1, paddingVertical: 10 },
  segmentSelected: { backgroundColor: "#0d6efd", borderColor: "#0d6efd" },
  segmentText: { color: "#111111", fontSize: 13 },
  segmentTextSelected: { color: "#ffffff", fontWeight: "800" },
  loadingText: { color: "#0427df", fontSize: 13, marginBottom: 8, textAlign: "center" },
  createButton: { alignItems: "center", backgroundColor: "#ffcc00", borderRadius: 6, justifyContent: "center", minHeight: 44, width: "100%" },
  disabled: { opacity: 0.6 },
  createButtonText: { color: "#111111", fontWeight: "900" },
  errorBox: { marginTop: 10, width: "100%" },
  errorText: { color: "#dc3545", fontSize: 13, textAlign: "center" },
  resendButton: { alignItems: "center", backgroundColor: "#0d6efd", borderRadius: 6, marginTop: 8, paddingVertical: 10 },
  resendText: { color: "#ffffff", fontWeight: "800" },
  signInText: { color: "#555555", fontSize: 13, marginTop: 12 },
  signInLink: { color: "#0d6efd", fontWeight: "800" },
});
