import { StyleSheet, View } from 'react-native';
import ProfileDetails from '../components/profile/ProfileDetails';

type ProfileDetailsPageProps = {
  id: string;
  navigate: (path: string) => void;
};

const ProfileDetailsPage = ({ id, navigate }: ProfileDetailsPageProps) => {
  return (
    <View style={styles.container}>
      <ProfileDetails
        params={{ id }}
        onActivityPress={activity =>
          navigate(`/profile/${encodeURIComponent(id)}/eventdetails/${activity.resultId}`)
        }
      />
    </View>
  );
};

export default ProfileDetailsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
