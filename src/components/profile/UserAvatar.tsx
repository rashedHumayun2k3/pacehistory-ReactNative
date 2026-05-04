import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { UserProfile } from '../../types/user/userProfile.interface';

const UserAvatar = () => {
  const [userDetails, setUserDetails] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      let storedUser: string | null = null;

      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        storedUser = window.localStorage.getItem('userProfile');
      }

      if (!storedUser) {
        storedUser = await AsyncStorage.getItem('userProfile');
      }

      if (storedUser && storedUser !== '[]') {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.id) {
          setUserDetails(parsedUser);
        }
      }
    };

    loadUser();
  }, []);

  const initials = `${userDetails?.firstName?.charAt(0) || ''}${userDetails?.lastName?.charAt(0) || ''}`.toUpperCase();

  return (
    <View style={styles.avatar}>
      {userDetails?.profilePicture ? (
        <Image
          resizeMode="cover"
          source={{ uri: userDetails.profilePicture }}
          style={styles.avatarImage}
        />
      ) : (
        <Text style={styles.initials}>{initials}</Text>
      )}
    </View>
  );
};

export default UserAvatar;

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 64,
  },
  avatarImage: {
    height: '100%',
    width: '100%',
  },
  initials: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
});
