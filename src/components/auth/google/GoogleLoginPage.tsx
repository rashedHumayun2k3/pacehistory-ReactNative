import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { routes } from "../../../routes/routes";
import { fetchUserProfileByEmail } from "../../../store/slices/userProfile";
import { AppDispatch, RootState } from "../../../store/store";

interface GoogleLoginPageProps {
  navigation?: { navigate: (screenName: string, params?: Record<string, unknown>) => void };
  navigate?: (path: string) => void;
  googleCredential?: string;
}

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  "";

const GoogleLoginPage: React.FC<GoogleLoginPageProps> = ({
  navigation,
  navigate,
  googleCredential,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userProfile } = useSelector((state: RootState) => state.userProfile);
  const { loginAs } = useSelector((state: RootState) => state.authStore);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const persistUser = async () => {
      if (!userProfile) return;

      await AsyncStorage.setItem("userProfile", JSON.stringify(userProfile));

      if (navigate) {
        navigate(routes.home);
        return;
      }

      navigation?.navigate("Home");
    };

    persistUser();
  }, [navigate, navigation, userProfile]);

  const handleLoginSuccess = async (credential?: string) => {
    setIsLoading(true);

    if (!credential) {
      Alert.alert("Google login", "No Google credential received.");
      setIsLoading(false);
      return;
    }

    try {
      const backendUrl = getBackendUrl();

      if (!backendUrl) {
        throw new Error("Backend URL is not configured.");
      }

      const googleLoginResponse = await fetch(`${backendUrl}/Auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential, loginAs }),
      });

      if (!googleLoginResponse.ok) {
        const errorDetails = await googleLoginResponse.text();
        throw new Error(`Google login failed: ${errorDetails}`);
      }

      const data = await googleLoginResponse.json();

      if (data.accessToken) {
        await AsyncStorage.setItem("accessToken", data.accessToken);
      }

      if (data?.email) {
        dispatch(fetchUserProfileByEmail(data.email));
      } else {
        console.warn("No email returned from Google login response");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      Alert.alert("Google login failed", "Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.loader}>Signing you in...</Text>
      ) : (
        <Pressable style={styles.googleButton} onPress={() => handleLoginSuccess(googleCredential)}>
          <Text style={styles.googleText}>Continue with Google</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 10, width: "100%" },
  loader: { color: "#111111", fontSize: 14, textAlign: "center" },
  googleButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#dadce0",
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 44,
  },
  googleText: { color: "#111111", fontSize: 14, fontWeight: "700" },
});

export default GoogleLoginPage;
