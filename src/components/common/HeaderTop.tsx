import React from 'react';

const { Image, Pressable, StyleSheet, View } = require('react-native');

type ImageSource = number | { uri: string };

export type StoredUserProfile = {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  imageProfilePicture?: string | null;
};

type HeaderTopProps = {
  currentEnvironment?: string | null;
  databaseName?: string;
  fallbackProfileSource?: ImageSource;
  fetchDBName?: () => void;
  logoSource?: ImageSource;
  onLogoPress?: () => void;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  userProfile?: StoredUserProfile | null;
};

class HeaderTop extends React.PureComponent<HeaderTopProps> {
  componentDidMount() {
    this.props.fetchDBName?.();
  }

  private getProfileSource(): ImageSource | null {
    const { currentEnvironment, fallbackProfileSource, userProfile } = this.props;

    if (!userProfile?.id) {
      return null;
    }

    if (userProfile.imageProfilePicture) {
      return {
        uri: `${currentEnvironment ?? ''}${userProfile.imageProfilePicture}`,
      };
    }

    return fallbackProfileSource ?? null;
  }

  render() {
    const { databaseName, logoSource, onLogoPress, onMenuPress, onProfilePress } = this.props;
    const profileSource = this.getProfileSource();
    const isSportsMan = databaseName === 'SportsMan';

    return (
      <View style={[styles.headerTop, isSportsMan && styles.sportsmanHeaderTop]}>
        <View style={styles.row}>
          <View style={styles.full}>
            <View style={styles.logoGroup}>
              {onMenuPress ? (
                <Pressable
                  accessibilityLabel="Open navigation menu"
                  accessibilityRole="button"
                  onPress={onMenuPress}
                  style={styles.menuButton}
                >
                  <View style={styles.menuLine} />
                  <View style={styles.menuLine} />
                  <View style={styles.menuLine} />
                </Pressable>
              ) : null}

              <Pressable
                accessibilityLabel="Go to home"
                accessibilityRole="button"
                disabled={!onLogoPress}
                onPress={onLogoPress}
                style={styles.logo}
              >
                {logoSource ? (
                  <Image
                    accessibilityIgnoresInvertColors
                    resizeMode="contain"
                    source={logoSource}
                    style={styles.logoImage}
                  />
                ) : null}
              </Pressable>
            </View>

            {profileSource ? (
              <Pressable
                accessibilityLabel="Open profile"
                accessibilityRole="button"
                disabled={!onProfilePress}
                onPress={onProfilePress}
                style={styles.profileButton}
              >
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="cover"
                  source={profileSource}
                  style={styles.userSmallLogo}
                />
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

export default HeaderTop;

const styles = StyleSheet.create({
  headerTop: {
    marginBottom: 10,
    width: '100%',
  },
  sportsmanHeaderTop: {
    width: '100%',
  },
  row: {
    width: '100%',
  },
  full: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 80,
    position: 'relative',
    width: '100%',
  },
  logoGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  menuButton: {
    alignItems: 'center',
    borderColor: '#334155',
    borderRadius: 8,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 42,
  },
  menuLine: {
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    height: 2,
    marginVertical: 2,
    width: 18,
  },
  logo: {
    marginLeft: 0,
    paddingBottom: 6,
    paddingTop: 7,
  },
  logoImage: {
    height: 60,
    width: 200,
  },
  profileButton: {
    padding: 5,
    position: 'absolute',
    right: 0,
  },
  userSmallLogo: {
    borderRadius: 40,
    height: 80,
    width: 80,
  },
});
