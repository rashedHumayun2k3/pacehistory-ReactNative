import CallbackPage from "../components/auth/CallbackPage";

type PageProps = {
  navigate: (path: string) => void;
};

export default function AuthCallbackPage({ navigate }: PageProps) {
  return <CallbackPage navigate={navigate} />;
}
