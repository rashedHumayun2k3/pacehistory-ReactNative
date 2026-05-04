import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { routes } from '../../routes/routes';
import HeaderBottom from './HeaderBottom';
import HeaderTop, { StoredUserProfile } from './HeaderTop';

const logoSource = require('../../../assets/images/logo-tr.png');
const fallbackProfileSource = require('../../../assets/images/user-profile.jpg');

type HeaderProps = {
  currentEnvironment?: string;
  loginAs?: 'Athletes' | 'Group Owner' | string;
  loggedInUserProfileImage?: string | null;
  navigate?: (path: string) => void;
  path?: string;
  systemDBName?: string | null;
};

export default function Header({
  currentEnvironment,
  loginAs,
  loggedInUserProfileImage,
  navigate,
  path = routes.home,
  systemDBName,
}: HeaderProps) {
  const [storedUserProfile, setStoredUserProfile] = useState<StoredUserProfile | null>(null);
  const isGroupOwner = loginAs === 'Group Owner';
  const userProfile =
    storedUserProfile && loggedInUserProfileImage
      ? { ...storedUserProfile, imageProfilePicture: loggedInUserProfileImage }
      : storedUserProfile;

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    const storedUser = window.localStorage.getItem('userProfile');

    if (!storedUser || storedUser === '[]') {
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as StoredUserProfile;

      if (parsedUser?.id) {
        setStoredUserProfile(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing user profile from localStorage:', error);
    }
  }, []);

  return (
    <View style={[styles.header, isGroupOwner && styles.headerGroupOwner]}>
      <View style={styles.headerParent}>
        <HeaderTop
          currentEnvironment={currentEnvironment}
          databaseName={systemDBName ?? undefined}
          fallbackProfileSource={fallbackProfileSource}
          logoSource={logoSource}
          onLogoPress={() => navigate?.(routes.home)}
          userProfile={userProfile}
        />
        <HeaderBottom />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0f172a',
    borderBottomColor: '#26364d',
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerGroupOwner: {
    backgroundColor: '#111827',
    borderBottomColor: '#4f46e5',
  },
  headerParent: {
    alignSelf: 'center',
    maxWidth: 1100,
    width: '100%',
  },
});
