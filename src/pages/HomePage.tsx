import { Pressable, Text, View } from 'react-native';
import HomeMiddle from '../components/home/HomeMiddle';
import { routes } from '../routes/routes';
import { pageStyles as styles } from '../styles/pageStyles';

type PageProps = {
  navigate: (path: string) => void;
};

type RouteButtonProps = {
  label: string;
  onPress: () => void;
  primary?: boolean;
};

export default function HomePage({ navigate }: PageProps) {
  return (
    <View style={styles.centeredContent}>
      <HomeMiddle />
    </View>
  );
}

function RouteButton({ label, onPress, primary = false }: RouteButtonProps) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      style={[styles.routeButton, primary && styles.routeButtonPrimary]}
    >
      <Text style={[styles.routeButtonText, primary && styles.routeButtonTextPrimary]}>
        {label}
      </Text>
    </Pressable>
  );
}
