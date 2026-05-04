import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import ProfileDetails from '../components/profile/ProfileDetails';
import { routes } from '../routes/routes';

type MyProfilePageProps = {
  navigate: (path: string) => void;
};

type StoredProfile = {
  id?: number | string;
  profileName?: string | null;
  user?: StoredProfile;
  userProfile?: StoredProfile;
};

const MyProfilePage = ({ navigate }: MyProfilePageProps) => {
  const [profileCode, setProfileCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      const storedUser = await AsyncStorage.getItem('userProfile');

      if (!token || !storedUser || storedUser === '[]') {
        navigate(routes.login);
        return;
      }

      try {
        const userProfile = JSON.parse(storedUser) as StoredProfile;
        const profile = userProfile.userProfile || userProfile.user || userProfile;
        const resolvedProfileCode = profile.profileName || profile.id?.toString() || null;

        if (!resolvedProfileCode) {
          navigate(routes.login);
          return;
        }

        setProfileCode(resolvedProfileCode);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#337ab7" />
      </View>
    );
  }

  if (!profileCode) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Profile not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileDetails
        profileName={profileCode}
        onActivityPress={activity =>
          navigate(`/profile/${encodeURIComponent(profileCode)}/eventdetails/${activity.resultId}`)
        }
      />
    </View>
  );
};

export default MyProfilePage;

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  message: {
    color: '#111111',
    fontSize: 16,
  },
});
