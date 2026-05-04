import { Platform } from "react-native";
import AfterRegister from "../components/auth/AfterRegister";

type PageProps = {
  navigate: (path: string) => void;
  email?: string;
  username?: string;
};

const getQueryValue = (key: string) => {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return "";
  }

  return new URLSearchParams(window.location.search).get(key) ?? "";
};

export default function AfterRegisterPage({ navigate, email, username }: PageProps) {
  const route = {
    params: {
      username: username || getQueryValue("username") || undefined,
      email: email || getQueryValue("email") || undefined,
    },
  };

  return <AfterRegister route={route} navigate={navigate} />;
}
