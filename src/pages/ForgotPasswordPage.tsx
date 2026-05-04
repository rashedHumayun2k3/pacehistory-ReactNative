import ForgotPassword from "../components/auth/ForgotPassword";

type PageProps = {
  navigate: (path: string) => void;
};

export default function ForgotPasswordPage({ navigate }: PageProps) {
  return <ForgotPassword navigate={navigate} />;
}
