import { StyleSheet, View } from 'react-native';
import EventResultDetails from '../components/profile/EventResultDetails';

type ProfileEventDetailsPageProps = {
  id: string;
  resultID: string;
  navigate: (path: string) => void;
};

const ProfileEventDetailsPage = ({ id, resultID, navigate }: ProfileEventDetailsPageProps) => {
  return (
    <View style={styles.container}>
      <EventResultDetails
        params={{ id, resultID }}
        onBack={() => navigate(`/profile/${encodeURIComponent(id)}`)}
      />
    </View>
  );
};

export default ProfileEventDetailsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
