import { Pressable, Text, View } from 'react-native';
import { routes } from '../routes/routes';
import { pageStyles as styles } from '../styles/pageStyles';

export default function NotFoundPage({ navigate, path }) {
  return (
    <View style={styles.centeredContent}>
      <View style={styles.header}>
        <Text style={styles.brand}>PaceHistory</Text>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.subtitle}>No route is registered for {path}.</Text>
      </View>

      <View style={styles.form}>
        <RouteButton label="Go home" onPress={() => navigate(routes.home)} primary />
        <RouteButton label="Login" onPress={() => navigate(routes.login)} />
      </View>
    </View>
  );
}

function RouteButton({ label, onPress, primary }) {
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
