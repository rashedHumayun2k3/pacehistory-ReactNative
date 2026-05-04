import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchEventDetails } from '../../store/slices/eventSlice';
import { fetchuserEventResult } from '../../store/slices/eventResultSlice';
import { fetchUserDetails } from '../../store/slices/userManagementSlice';
import { AppDispatch, RootState } from '../../store/store';
import { ParticipatedEventResult, UserProfile } from '../../types/user/userProfile.interface';
import ParticipatedEventEntry from './edit-participatedEvent';
import ImageWithModal from './ImageWithModal';

const fallbackImage = require('../../../assets/images/image-not-found.png');
const recordNotFoundImage = require('../../../assets/images/record-not-found.png');

type EventResultDetailsProps = {
  params: Promise<{
    id: string;
    resultID: string;
  }> | {
    id: string;
    resultID: string;
  };
  fileServerDomain?: string;
  navigation?: { navigate: (screenName: string, params?: Record<string, unknown>) => void };
  onBack?: () => void;
  onEditResult?: (activity: ParticipatedEventResult) => void;
  onLoginRequired?: () => void;
};

const FILE_SERVER = process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME || 'https://pacehistory.com';

const EventResultDetails = ({
  params,
  fileServerDomain = FILE_SERVER,
  navigation,
  onBack,
  onEditResult,
  onLoginRequired,
}: EventResultDetailsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loggedInUserInfo, setLoggedInUserInfo] = useState<UserProfile | null>(null);
  const [showEditButton, setShowEditButton] = useState(false);
  const [participatedEventDetails, setParticipatedEventDetails] =
    useState<ParticipatedEventResult | null>(null);
  const [selectedActivityResult, setSelectedActivityResult] = useState<
    ParticipatedEventResult | undefined
  >(undefined);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showEditActivity, setShowEditActivity] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string; resultID: string } | null>(null);

  const { userEventResult, loading } = useSelector((state: RootState) => state.eventResult);
  const { userDetails } = useSelector((state: RootState) => state.userManagement);
  const { eventDetails } = useSelector((state: RootState) => state.event);

  useEffect(() => {
    const loadStoredUser = async () => {
      const storedUser = await AsyncStorage.getItem('userProfile');

      if (storedUser && storedUser !== '[]') {
        try {
          const user = JSON.parse(storedUser);
          if (user?.id) {
            setLoggedInUserInfo(user);
            return;
          }
        } catch (error) {
          console.error('Error parsing user profile from AsyncStorage:', error);
        }
      }

      if (onLoginRequired) {
        onLoginRequired();
      } else {
        navigation?.navigate('Login');
      }
    };

    loadStoredUser();
  }, [navigation, onLoginRequired]);

  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const nextParams = await params;
        setResolvedParams(nextParams);
        dispatch(fetchuserEventResult({ userId: nextParams.id, eventId: nextParams.resultID }));
        dispatch(fetchUserDetails(nextParams.id));
        dispatch(fetchEventDetails(nextParams.resultID));
      } catch (error) {
        console.error('Error loading user params:', error);
      }
    };

    unwrapParams();
  }, [dispatch, params]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (userEventResult.length > 0) {
      setParticipatedEventDetails(userEventResult[0]);
    } else {
      setParticipatedEventDetails(null);
    }
  }, [userEventResult]);

  useEffect(() => {
    if (participatedEventDetails && loggedInUserInfo?.id === participatedEventDetails.userId) {
      setShowEditButton(true);
    } else {
      setShowEditButton(false);
    }
  }, [loggedInUserInfo, participatedEventDetails]);

  const eventDate = new Date(eventDetails?.eventDate ?? new Date());
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  if (initialLoading || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#337ab7" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!participatedEventDetails) {
    return (
      <View style={styles.recordNotFound}>
        <Image resizeMode="contain" source={recordNotFoundImage} style={styles.recordNotFoundImage} />
      </View>
    );
  }

  if (showEditActivity) {
    return (
      <ParticipatedEventEntry
        actionTitle="Edit Participated Event"
        actionType="Edit"
        loggedInUser={loggedInUserInfo}
        onClose={() => setShowEditActivity(false)}
        selectedActivityResult={selectedActivityResult}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.activityFeedWrapper}>
      {showEditButton ? (
        <View style={styles.eventEditButtonContainer}>
          {onBack ? (
            <Pressable onPress={onBack} style={styles.smallPrimaryButton}>
              <Text style={styles.primaryButtonText}>Back</Text>
            </Pressable>
          ) : navigation ? (
            <Pressable
              onPress={() =>
                navigation.navigate('Profile', { profileName: userDetails?.profileName ?? resolvedParams?.id })
              }
              style={styles.smallPrimaryButton}
            >
              <Text style={styles.primaryButtonText}>Back</Text>
            </Pressable>
          ) : null}

          <Pressable
            onPress={() => {
              onEditResult?.(participatedEventDetails);
              setSelectedActivityResult(participatedEventDetails);
              setShowEditActivity(true);
            }}
            style={styles.editButton}
          >
            <Text style={styles.primaryButtonText}>Edit Result</Text>
          </Pressable>
        </View>
      ) : null}

      <Text style={styles.pageTitle}>Result Details of {participatedEventDetails.userName}</Text>

      <View style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <View style={styles.eventResultImageContainer}>
            <Image
              resizeMode="cover"
              source={getImageSource(
                participatedEventDetails.imageEventFinisher,
                fileServerDomain,
                fallbackImage,
              )}
              style={styles.postThumbnail}
            />
          </View>

          <View style={styles.profileBox}>
            <View style={styles.flexCenter}>
              <Text style={styles.profileTitle}>
                Event Results for {userDetails?.firstName} {userDetails?.lastName}
              </Text>
              {userDetails?.country ? (
                <View style={styles.roundBoxFill}>
                  <Text style={styles.roundBoxText}>{userDetails.country}</Text>
                </View>
              ) : null}
            </View>

          <Text style={styles.profileLinkText}>
              PaceHistory profile: /profile/{userDetails?.profileName ?? resolvedParams?.id}
          </Text>
            <Text style={styles.profileLinkText}>
              Tracking link: {userDetails?.sportsTrackingProfileLink || 'not set'}
            </Text>
            <Text style={styles.profileLinkText}>
              Published result: {participatedEventDetails.eventResultLink || 'not set'}
            </Text>
          </View>
        </View>

        <View style={styles.headerTheme}>
          <View style={styles.headerThemeTop}>
            <Text style={styles.headerThemeTitle}>
              {participatedEventDetails.eventName} ({eventDetails?.country})
            </Text>
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceBadgeText}>{participatedEventDetails.raceDistance} km</Text>
            </View>
          </View>

          <Text style={styles.headerThemeMeta}>
            {formattedDate} {eventDetails?.venueDetails ? ` | ${eventDetails.venueDetails}` : ''}
          </Text>

          <View style={styles.elevationRow}>
            {participatedEventDetails.elevationGain ? (
              <Text style={styles.headerThemeMeta}>
                Elevation Gain: {participatedEventDetails.elevationGain}
              </Text>
            ) : null}
            {participatedEventDetails.elevationLoss ? (
              <Text style={styles.headerThemeMeta}>
                Elevation Loss: {participatedEventDetails.elevationLoss}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.eventDetails}>
          <View style={styles.achievementList}>
            <StatCard
              label="Finish Time(ex: hh:mm:ss)"
              value={participatedEventDetails.finishTime?.trim() || 'not set'}
            />
            <StatCard
              label="Average Pace"
              value={
                participatedEventDetails.pace?.trim()
                  ? `${participatedEventDetails.pace}/km`
                  : 'not set'
              }
            />
            <StatCard
              label="Bib Number"
              value={participatedEventDetails.bibNumber?.trim() || 'not set'}
            />
            {participatedEventDetails.raceScore > 0 ? (
              <StatCard label="Rank (General)" value={String(participatedEventDetails.raceScore)} />
            ) : null}
            {participatedEventDetails.ageGroupRank > 0 ? (
              <StatCard
                label="Rank (Age Group)"
                value={String(participatedEventDetails.ageGroupRank)}
              />
            ) : null}
            {participatedEventDetails.genderWiseRank > 0 ? (
              <StatCard
                label="Rank (Gender Wise)"
                value={String(participatedEventDetails.genderWiseRank)}
              />
            ) : null}
          </View>

          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.badgeRow}>
            {participatedEventDetails.isPersonalBest ? (
              <Badge label="This is my personal best record" variant="success" />
            ) : null}
            {participatedEventDetails.isAgeGroupWinner ? (
              <Badge label="I am age group winner" variant="warning" />
            ) : null}
            {participatedEventDetails.isBigAchievement ? (
              <Badge label="This is my major achievement" variant="blue" />
            ) : null}
            {participatedEventDetails.isPacer ? (
              <Badge label="I am pacer of this race" variant="maroon" />
            ) : null}
          </View>

          <View style={styles.imageGrid}>
            <ImageWithModal
              fileServerDomain={fileServerDomain}
              imageUrl={participatedEventDetails.imageEventFinisher}
            />
            <ImageWithModal
              fileServerDomain={fileServerDomain}
              imageUrl={participatedEventDetails.imageCertificate}
            />
            <ImageWithModal
              fileServerDomain={fileServerDomain}
              imageUrl={participatedEventDetails.imageMedalPicture}
            />
          </View>

          <Text style={styles.sectionTitle}>Personal Comment</Text>
          <Text style={styles.bodyText}>{participatedEventDetails.personalComment || 'not set'}</Text>

          <Text style={styles.sectionTitle}>History of Achievement</Text>
          <Text style={styles.bodyText}>
            {participatedEventDetails.historyOfTheAchievement || 'not set'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.achievementCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const Badge = ({ label, variant }: { label: string; variant: 'success' | 'warning' | 'blue' | 'maroon' }) => (
  <View style={[styles.achievementBadge, styles[`badge_${variant}`]]}>
    <Text style={styles.achievementBadgeText}>{label}</Text>
  </View>
);

const getImageSource = (path?: string | null, fileServerDomain = FILE_SERVER, fallback?: number) => {
  if (path) {
    return { uri: path.startsWith('http') ? path : `${fileServerDomain}${path}` };
  }

  return fallback ?? fallbackImage;
};

export default EventResultDetails;

const styles = StyleSheet.create({
  activityFeedWrapper: {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    flexGrow: 1,
    maxWidth: 750,
    padding: 10,
    width: '100%',
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    minHeight: 200,
  },
  loadingText: {
    color: '#333333',
    marginTop: 8,
  },
  recordNotFound: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    minHeight: 220,
  },
  recordNotFoundImage: {
    height: 140,
    width: 220,
  },
  eventEditButtonContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pageTitle: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  eventHeader: {
    backgroundColor: '#ffffff',
  },
  eventResultImageContainer: {
    height: 180,
    width: '100%',
  },
  postThumbnail: {
    height: '100%',
    width: '100%',
  },
  profileBox: {
    alignItems: 'center',
    padding: 12,
  },
  flexCenter: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  profileTitle: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  roundBoxFill: {
    backgroundColor: '#000000',
    borderRadius: 2,
    marginLeft: 10,
    paddingHorizontal: 5,
  },
  roundBoxText: {
    color: '#ffffff',
    fontSize: 10,
  },
  profileLinkText: {
    color: '#475569',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  headerTheme: {
    backgroundColor: '#152238',
    padding: 12,
  },
  headerThemeTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  headerThemeTitle: {
    color: '#ffffff',
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
  },
  distanceBadge: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  distanceBadgeText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '900',
  },
  headerThemeMeta: {
    color: '#dbeafe',
    fontSize: 12,
    marginTop: 8,
  },
  elevationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  eventDetails: {
    padding: 12,
  },
  achievementList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achievementCard: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    flexGrow: 1,
    minWidth: 145,
    padding: 10,
  },
  statLabel: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  statValue: {
    color: '#2563eb',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 18,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  achievementBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  achievementBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  badge_success: {
    backgroundColor: '#15803d',
  },
  badge_warning: {
    backgroundColor: '#f59e0b',
  },
  badge_blue: {
    backgroundColor: '#2563eb',
  },
  badge_maroon: {
    backgroundColor: '#7f1d1d',
  },
  imageGrid: {
    gap: 10,
    marginTop: 14,
  },
  bodyText: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 21,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#337ab7',
    borderRadius: 4,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 12,
  },
  smallPrimaryButton: {
    alignItems: 'center',
    backgroundColor: '#337ab7',
    borderRadius: 4,
    height: 36,
    justifyContent: 'center',
    minWidth: 100,
    paddingHorizontal: 12,
  },
  editButton: {
    alignItems: 'center',
    backgroundColor: '#337ab7',
    borderRadius: 4,
    height: 36,
    justifyContent: 'center',
    minWidth: 150,
    paddingHorizontal: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  mutedText: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
    textAlign: 'center',
  },
});
