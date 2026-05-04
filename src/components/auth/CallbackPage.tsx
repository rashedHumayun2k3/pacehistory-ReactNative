import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { routes } from "../../routes/routes";

interface CallbackPageProps {
  navigation?: { navigate: (screenName: string, params?: Record<string, unknown>) => void };
  navigate?: (path: string) => void;
}

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  "";

export default function CallbackPage({ navigation, navigate }: CallbackPageProps) {
  const [error, setError] = useState("");

  useEffect(() => {
    const processCallback = async () => {
      try {
        const backendUrl = getBackendUrl();

        if (!backendUrl) {
          navigate?.(routes.profileList);
          navigation?.navigate("Profile");
          return;
        }

        const response = await fetch(`${backendUrl}/Auth/callback`, {
          method: "POST",
        });

        if (response.ok) {
          navigate?.(routes.profileList);
          navigation?.navigate("Profile");
          return;
        }

        setError("Callback processing failed");
      } catch {
        setError("Callback processing failed");
      }
    };

    processCallback();
  }, [navigation, navigate]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{error || "Processing authentication..."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", flex: 1, justifyContent: "center", padding: 20 },
  text: { color: "#111111", fontSize: 14, textAlign: "center" },
});
