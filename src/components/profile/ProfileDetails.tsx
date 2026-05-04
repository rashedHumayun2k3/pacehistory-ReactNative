import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { achievementBadges } from '../../helpers/constantValues';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchUserCertificateList,
  fetchUserMedalList,
} from '../../store/slices/medalListSlice';
import { fetchUserEventSummary } from '../../store/slices/eventSummarySlice';
import { fetchUserDetailByProfileName } from '../../store/slices/userManagementSlice';
import {
  EventCertificate,
  ParticipatedEventResult,
  UserMedals,
  UserProfile,
} from '../../types/user/userProfile.interface';

const {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} = require('react-native');

type ImageSource = number | { uri: string };

interface ProfileDetailsProps {
  params?: { id?: string };
  profileName?: string;
  accessToken?: string | null;
  currentDomain?: string;
  fileServerDomain?: string;
  fallbackBannerSource?: ImageSource;
  fallbackProfileSource?: ImageSource;
  fallbackMedalSource?: ImageSource;
  onCopyProfileLink?: (profileLink: string) => void;
  onCopySportsLink?: (sportsLink: string) => void;
  onActivityPress?: (activity: ParticipatedEventResult) => void;
}

const defaultBannerSource = require('../../../assets/images/profile-banner.jpg');
const defaultProfileSource = require('../../../assets/images/user-profile.jpg');
const defaultMedalSource = require('../../../assets/images/medal-default-image.png');
const FILE_SERVER = 'https://pacehistory.com';
const BACKEND_URL = '';

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  params,
  profileName,
  accessToken,
  currentDomain = 'https://pacehistory.com',
  fileServerDomain = FILE_SERVER,
  fallbackBannerSource = defaultBannerSource,
  fallbackProfileSource = defaultProfileSource,
  fallbackMedalSource = defaultMedalSource,
  onCopyProfileLink,
  onCopySportsLink,
  onActivityPress,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const profileCode = profileName ?? params?.id;

  const { userDetails, loadingUserDetails } = useSelector(
    (state: RootState) => state.userManagement,
  );
  const { userMadelList, certificateList, loading: medalLoading } = useSelector(
    (state: RootState) => state.medalList,
  );
  const { userEventSummery, loading: summaryLoading } = useSelector(
    (state: RootState) => state.userEventSummeryOutput,
  );

  const [activities, setActivities] = useState<ParticipatedEventResult[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedMedal, setSelectedMedal] = useState<UserMedals | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<EventCertificate | null>(null);

  useEffect(() => {
    if (profileCode) {
      dispatch(fetchUserDetailByProfileName(profileCode.toString()));
    }
  }, [dispatch, profileCode]);

  useEffect(() => {
    if (!userDetails?.id) {
      return;
    }

    dispatch(fetchUserMedalList(userDetails.id));
    dispatch(fetchUserCertificateList(userDetails.id));
    dispatch(fetchUserEventSummary(userDetails.id));
  }, [dispatch, userDetails?.id]);

  useEffect(() => {
    const loadActivities = async () => {
      if (!profileCode || !BACKEND_URL) {
        setActivities(createSampleActivities(Number(userDetails?.id) || 101));
        return;
      }

      setActivitiesLoading(true);
      try {
        const response = await fetch(
          `${BACKEND_URL}/UserProfile/ParticipatedEventResultByCode?userCode=${profileCode}`,
          {
            headers: {
              ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.ok) {
          setActivities(await response.json());
        }
      } catch (error) {
        console.error('Error loading profile activities:', error);
      } finally {
        setActivitiesLoading(false);
      }
    };

    loadActivities();
  }, [accessToken, profileCode, userDetails?.id]);

  const newparams = useMemo(
    () => (userDetails?.id ? { id: userDetails.id, selectionType: 'LIST' } : null),
    [userDetails?.id],
  );

  if (loadingUserDetails || !newparams || !userDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#337ab7" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.activityFeedWrapper}>
      <Text style={styles.pageTitle}>Profile Details</Text>

      <ProfileHeader
        currentDomain={currentDomain}
        fallbackBannerSource={fallbackBannerSource}
        fallbackProfileSource={fallbackProfileSource}
        fileServerDomain={fileServerDomain}
        isDesktop={isDesktop}
        onCopyProfileLink={onCopyProfileLink}
        onCopySportsLink={onCopySportsLink}
        userDetails={userDetails}
      />

      <MedalsSection
        fallbackMedalSource={fallbackMedalSource}
        fileServerDomain={fileServerDomain}
        isLoading={medalLoading.userMadelList}
        medals={userMadelList}
        onSelectMedal={setSelectedMedal}
      />

      <CertificatesSection
        certificates={certificateList}
        fileServerDomain={fileServerDomain}
        isLoading={medalLoading.userCertificateList}
        onSelectCertificate={setSelectedCertificate}
      />

      <ProfileSummarySection
        isLoading={summaryLoading.userEventSummery}
        summary={userEventSummery}
      />

      <ActivitiesSection
        activities={activities}
        fallbackBannerSource={fallbackBannerSource}
        fileServerDomain={fileServerDomain}
        isLoading={activitiesLoading}
        onActivityPress={onActivityPress}
        onSeeMore={() => setVisibleCount(count => count + 8)}
        userDetails={userDetails}
        visibleCount={visibleCount}
      />

      <MedalDetailsModal
        fileServerDomain={fileServerDomain}
        medal={selectedMedal}
        onClose={() => setSelectedMedal(null)}
      />

      <ImageModal
        fileServerDomain={fileServerDomain}
        imagePath={selectedCertificate?.imageCertificate ?? null}
        onClose={() => setSelectedCertificate(null)}
        title="Certificate"
      />
    </ScrollView>
  );
};

const ProfileHeader = ({
  currentDomain,
  fallbackBannerSource,
  fallbackProfileSource,
  fileServerDomain,
  isDesktop,
  onCopyProfileLink,
  onCopySportsLink,
  userDetails,
}: {
  currentDomain: string;
  fallbackBannerSource?: ImageSource;
  fallbackProfileSource?: ImageSource;
  fileServerDomain: string;
  isDesktop: boolean;
  onCopyProfileLink?: (profileLink: string) => void;
  onCopySportsLink?: (sportsLink: string) => void;
  userDetails: UserProfile;
}) => {
  const achievements = userDetails.achievements?.split(',').filter(Boolean) ?? [];
  const profileLink = `${currentDomain}/profile/${userDetails.profileName ?? ''}`;
  const sportsLink = userDetails.sportsTrackingProfileLink ?? '';

  return (
    <>
      <View style={[styles.bannerPart, isDesktop && styles.bannerPartDesktop]}>
        <View style={styles.bannerImageParent}>
          <Image
            resizeMode="cover"
            source={getImageSource(userDetails.imageProfileBanner, fileServerDomain, fallbackBannerSource)}
            style={[styles.profileBanner, isDesktop && styles.profileBannerDesktop]}
          />
        </View>

        <View style={styles.thumbnailParent}>
          <Image
            resizeMode="cover"
            source={getImageSource(userDetails.imageProfilePicture, fileServerDomain, fallbackProfileSource)}
            style={[styles.runnerThumbnail, isDesktop && styles.runnerThumbnailDesktop]}
          />
        </View>
      </View>

      <View style={styles.profileBox}>
        <View style={styles.flexCenter}>
          <Text style={styles.profileName}>
            {userDetails.firstName} {userDetails.lastName}
          </Text>
          {userDetails.country ? (
            <View style={styles.roundBoxFill}>
              <Text style={styles.roundBoxText}>{userDetails.country}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.profileLink}>
          <Pressable onPress={() => onCopyProfileLink?.(profileLink)} style={styles.copyContainer}>
            <Text style={styles.standardWhiteButton}>Profile Link</Text>
          </Pressable>
        </View>

        <View style={styles.profileLink}>
          <Pressable onPress={() => onCopySportsLink?.(sportsLink)} style={styles.orangeShadow}>
            <Text style={styles.standardWhiteButton}>
              {userDetails.sportsTrackingApp} Link
            </Text>
          </Pressable>
        </View>

        {userDetails.runningWebsiteHistory ? (
          <View style={styles.otherProfileSection}>
            <Text style={styles.otherProfileTitle}>Other Profile Links:</Text>
            {userDetails.runningWebsiteHistory.split('§').map((item, index) => {
              const [key, value] = item.split(':');
              return (
                <Text key={`${item}-${index}`} style={styles.otherProfileText}>
                  <Text style={styles.bold}>{key?.trim()}</Text>: {value?.trim()}
                </Text>
              );
            })}
          </View>
        ) : null}

        <View style={styles.badgeWrap}>
          {achievements.map((achievement, index) => (
            <View
              key={`${achievement}-${index}`}
              style={[styles.roundedFull, getAchievementStyle(achievement)]}
            >
              <Text style={styles.badgeText}>{achievement.trim()}</Text>
            </View>
          ))}
        </View>

        {userDetails.prHistory ? <Text style={styles.prHistory}>{userDetails.prHistory}</Text> : null}

        <Text style={styles.textMuted}>{userDetails.profileSummery}</Text>
      </View>
    </>
  );
};

const MedalsSection = ({
  fallbackMedalSource,
  fileServerDomain,
  isLoading,
  medals,
  onSelectMedal,
}: {
  fallbackMedalSource?: ImageSource;
  fileServerDomain: string;
  isLoading: boolean;
  medals: UserMedals[];
  onSelectMedal: (medal: UserMedals) => void;
}) => {
  const { groupedMedals, specialMedals } = useMemo(() => {
    return medals.reduce(
      (acc, medal) => {
        const key = medal.eventYear;
        if (medal.isSpecial) {
          acc.specialMedals[key] = acc.specialMedals[key] || [];
          acc.specialMedals[key].push(medal);
        } else {
          acc.groupedMedals[key] = acc.groupedMedals[key] || [];
          acc.groupedMedals[key].push(medal);
        }
        return acc;
      },
      {
        groupedMedals: {} as Record<number, UserMedals[]>,
        specialMedals: {} as Record<number, UserMedals[]>,
      },
    );
  }, [medals]);

  if (isLoading) return <LoadingText />;

  const specialList = Object.values(specialMedals).flatMap(item => item);
  const yearGroups = Object.entries(groupedMedals).sort(
    ([yearA], [yearB]) => Number(yearB) - Number(yearA),
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Medals</Text>
      {medals.length === 0 ? (
        <EmptyState />
      ) : (
        <View style={styles.medalsSectionContainer}>
          {specialList.length > 0 ? <Text style={styles.tinyHeading}>Special</Text> : null}
          {specialList.length > 0 ? (
            <View style={[styles.medalsGrid, styles.medalsSectionSpecial]}>
              {specialList.map((medal, index) => (
                <MedalItem
                  fallbackMedalSource={fallbackMedalSource}
                  fileServerDomain={fileServerDomain}
                  key={`${medal.eventMadelId}-${index}`}
                  medal={medal}
                  onPress={() => onSelectMedal(medal)}
                />
              ))}
            </View>
          ) : null}

          {yearGroups.map(([year, yearMedals]) => (
            <View key={year} style={styles.yearGroup}>
              <Text style={styles.tinyHeading}>Event Year: {year}</Text>
              <View style={styles.medalsGrid}>
                {yearMedals.map((medal, index) => (
                  <MedalItem
                    fallbackMedalSource={fallbackMedalSource}
                    fileServerDomain={fileServerDomain}
                    key={`${medal.eventMadelId}-${index}`}
                    medal={medal}
                    onPress={() => onSelectMedal(medal)}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const MedalItem = ({
  fallbackMedalSource,
  fileServerDomain,
  medal,
  onPress,
}: {
  fallbackMedalSource?: ImageSource;
  fileServerDomain: string;
  medal: UserMedals;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress} style={styles.medalItem}>
    <Image
      resizeMode="cover"
      source={getImageSource(medal.medelPictureLink, fileServerDomain, fallbackMedalSource)}
      style={styles.medalImageList}
    />
  </Pressable>
);

const CertificatesSection = ({
  certificates,
  fileServerDomain,
  isLoading,
  onSelectCertificate,
}: {
  certificates: EventCertificate[];
  fileServerDomain: string;
  isLoading: boolean;
  onSelectCertificate: (certificate: EventCertificate) => void;
}) => {
  if (isLoading) return <LoadingText />;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Certificate</Text>
      {certificates.length === 0 ? (
        <EmptyState />
      ) : (
        <View style={[styles.medalsGrid, styles.certificateGrid]}>
          {certificates.map(certificate => (
            <Pressable
              key={certificate.resultId}
              onPress={() => onSelectCertificate(certificate)}
              style={styles.certificateItem}
            >
              <Image
                resizeMode="cover"
                source={getImageSource(certificate.imageCertificate, fileServerDomain)}
                style={styles.certificateImage}
              />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const ProfileSummarySection = ({ isLoading, summary }: { isLoading: boolean; summary: any }) => {
  if (isLoading) return <LoadingText />;

  const cards = [
    { icon: 'R', label: 'Finished Races', value: summary?.totalRaces ?? 0 },
    { icon: 'D', label: 'Longest Distance', value: `${summary?.longestDistance ?? 0} km` },
    { icon: 'E', label: 'Highest Elevation Gain', value: `${summary?.highestElevationGain ?? 0} m` },
    { icon: 'P', label: 'Personal Best Count', value: summary?.personalBestCount ?? 0 },
    { icon: 'W', label: 'Age Group Winner', value: summary?.ageGroupWinsCount ?? 0 },
    { icon: 'A', label: 'Big Achievement Count', value: summary?.bigAchievementsCount ?? 0 },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Profile Summary</Text>
      <View style={styles.achievementGrid}>
        {cards.map(card => (
          <View key={card.label} style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>{card.icon}</Text>
            <View style={styles.achievementTextParent}>
              <Text style={styles.achievementText}>{card.label}</Text>
              <Text style={styles.achievementValue}>{card.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const ActivitiesSection = ({
  activities,
  fallbackBannerSource,
  fileServerDomain,
  isLoading,
  onActivityPress,
  onSeeMore,
  userDetails,
  visibleCount,
}: {
  activities: ParticipatedEventResult[];
  fallbackBannerSource?: ImageSource;
  fileServerDomain: string;
  isLoading: boolean;
  onActivityPress?: (activity: ParticipatedEventResult) => void;
  onSeeMore: () => void;
  userDetails: UserProfile;
  visibleCount: number;
}) => {
  if (isLoading) {
    return (
      <View style={styles.activityLoading}>
        <LoadingText />
      </View>
    );
  }

  const visibleActivities = activities
    .filter(activity => activity.userId === userDetails.id)
    .slice(0, visibleCount);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Running Activities ({activities.length})</Text>
      <View style={styles.profileActivityList}>
        {visibleActivities.map((activity, index) => (
          <Pressable
            key={`${activity.resultId}-${index}`}
            onPress={() => onActivityPress?.(activity)}
            style={styles.eventCardActivityList}
          >
            <Image
              resizeMode="cover"
              source={getImageSource(
                activity.imageEventFinisher || userDetails.imageProfileBanner,
                fileServerDomain,
                fallbackBannerSource,
              )}
              style={styles.eventActivityImage}
            />

            {activity.imageMedalPicture ? (
              <Image
                resizeMode="contain"
                source={getImageSource(activity.imageMedalPicture, fileServerDomain)}
                style={styles.medalImageShortCircle}
              />
            ) : null}

            <View style={styles.eventDetailsActivityList}>
              <Text style={styles.eventTitleActivityList}>
                {activity.eventName} - {activity.eventYear}
              </Text>
              <Text style={styles.eventInfoActivityList}>
                <Text style={styles.bold}>Distance:</Text>({activity.raceDistance}) |{' '}
                <Text style={styles.bold}>Finishing Time:</Text> {activity.finishTime}
              </Text>
              <Text style={styles.eventInfoActivityList}>
                <Text style={styles.bold}>Pace:</Text> {activity.pace} |{' '}
                <Text style={styles.bold}>Race Score:</Text> {activity.raceScore}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {activities.length > visibleCount ? (
        <View style={styles.seeMoreButtonContainer}>
          <Pressable onPress={onSeeMore} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>See More {activities.length - visibleCount}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

const MedalDetailsModal = ({
  fileServerDomain,
  medal,
  onClose,
}: {
  fileServerDomain: string;
  medal: UserMedals | null;
  onClose: () => void;
}) => (
  <Modal animationType="fade" transparent visible={!!medal} onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalPopup}>
        <View style={styles.modalTopBar}>
          <Text style={styles.modalHeaderText}>Medal Details</Text>
          <Pressable onPress={onClose} style={styles.rightCrossButton}>
            <Text style={styles.rightCrossButtonText}>x</Text>
          </Pressable>
        </View>
        {medal ? (
          <View style={styles.modalBody}>
            <Image
              resizeMode="contain"
              source={getImageSource(medal.medelPictureLink, fileServerDomain)}
              style={styles.selectedMedalImage}
            />
            <Text style={styles.modalTitle}>{medal.titleOfMadelPicture ?? medal.eventName}</Text>
            <Text style={styles.modalText}>Event Year: {medal.eventYear}</Text>
            {medal.uploadedBy ? <Text style={styles.modalText}>Uploaded By: {medal.uploadedBy}</Text> : null}
          </View>
        ) : null}
      </View>
    </View>
  </Modal>
);

const ImageModal = ({
  fileServerDomain,
  imagePath,
  onClose,
  title,
}: {
  fileServerDomain: string;
  imagePath: string | null;
  onClose: () => void;
  title: string;
}) => (
  <Modal animationType="fade" transparent visible={!!imagePath} onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalPopup}>
        <View style={styles.modalTopBar}>
          <Text style={styles.modalHeaderText}>{title}</Text>
          <Pressable onPress={onClose} style={styles.rightCrossButton}>
            <Text style={styles.rightCrossButtonText}>x</Text>
          </Pressable>
        </View>
        <Image
          resizeMode="contain"
          source={getImageSource(imagePath, fileServerDomain)}
          style={styles.modalImage}
        />
      </View>
    </View>
  </Modal>
);

const LoadingText = () => (
  <View style={styles.inlineLoading}>
    <ActivityIndicator color="#337ab7" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const EmptyState = () => (
  <View style={styles.noMedals}>
    <Text style={styles.noMedalsText}>No achievements added yet</Text>
  </View>
);

const getImageSource = (
  path?: string | null,
  fileServerDomain: string = FILE_SERVER,
  fallbackSource?: ImageSource,
): ImageSource => {
  if (path) {
    return { uri: path.startsWith('http') ? path : `${fileServerDomain}${path}` };
  }

  return fallbackSource ?? defaultProfileSource;
};

const getAchievementStyle = (achievementName: string) => {
  const name = achievementName.split(':')[0].trim();
  const badge = achievementBadges.find(item => item.achievementBadgeName === name);
  const categoryClass = badge?.categoryClass || 'custom-class';
  return achievementClassStyles[categoryClass] ?? achievementClassStyles['custom-class'];
};

const createSampleActivities = (userId: number): ParticipatedEventResult[] => [
  {
    resultId: 1,
    userId,
    userName: 'Ari Thompson',
    eventId: 1001,
    eventName: 'City 10K',
    eventYear: 2026,
    bibNumber: 'A101',
    raceDistance: '10K',
    finishTime: '48:20',
    pace: '4:50/km',
    raceScore: 82,
    isBigAchievement: false,
    isPersonalBest: true,
    isAgeGroupWinner: false,
    difficulty: 'Medium',
    personalComment: 'Strong finish with even pacing.',
    historyOfTheAchievement: '',
    trackingAppName: 'Strava',
    trackingRecordLink: '',
    eventResultLink: '',
    isPacer: false,
    isRaceAmbassador: false,
    imageEventFinisher: '',
    imageCertificate: '',
    imageMedalPicture: '',
    eventMadelId: 1,
    ageGroupRank: 7,
    genderWiseRank: 24,
    elevationGain: 82,
    elevationLoss: 80,
    achievementBadgeId: 2,
  },
  {
    resultId: 2,
    userId,
    userName: 'Ari Thompson',
    eventId: 1002,
    eventName: 'Spring Half Marathon',
    eventYear: 2025,
    bibNumber: 'B202',
    raceDistance: '21.1K',
    finishTime: '1:49:12',
    pace: '5:10/km',
    raceScore: 79,
    isBigAchievement: true,
    isPersonalBest: false,
    isAgeGroupWinner: false,
    difficulty: 'Hard',
    personalComment: 'Solid half marathon effort.',
    historyOfTheAchievement: '',
    trackingAppName: 'Strava',
    trackingRecordLink: '',
    eventResultLink: '',
    isPacer: false,
    isRaceAmbassador: false,
    imageEventFinisher: '',
    imageCertificate: '',
    imageMedalPicture: '',
    eventMadelId: 2,
    ageGroupRank: 12,
    genderWiseRank: 48,
    elevationGain: 180,
    elevationLoss: 175,
    achievementBadgeId: 2,
  },
];

const achievementClassStyles: Record<string, object> = {
  running: { backgroundColor: '#ffcc006b' },
  'ul-running': { backgroundColor: '#ff880086' },
  't-running': { backgroundColor: '#001aff50' },
  swimming: { backgroundColor: '#b9d9f7' },
  cycling: { backgroundColor: '#b6edb6' },
  triathlon: { backgroundColor: '#ff6347' },
  adventureRacing: { backgroundColor: '#8b45138f' },
  winterSports: { backgroundColor: '#4682b4' },
  obstacelRacing: { backgroundColor: '#8000806e' },
  'custom-class': { backgroundColor: '#dfd3d3' },
};

const styles = StyleSheet.create({
  activityFeedWrapper: {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    flexGrow: 1,
    maxWidth: 750,
    minHeight: '100%',
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
  pageTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 0,
    textAlign: 'center',
  },
  bannerPart: {
    height: 180,
    marginBottom: 1,
    position: 'relative',
  },
  bannerPartDesktop: {
    height: 370,
  },
  bannerImageParent: {
    position: 'relative',
  },
  profileBanner: {
    borderColor: '#afafaf',
    borderRadius: 10,
    borderWidth: 1,
    height: 150,
    width: '100%',
  },
  profileBannerDesktop: {
    height: 300,
  },
  thumbnailParent: {
    alignItems: 'center',
    marginTop: -50,
  },
  runnerThumbnail: {
    borderColor: '#636363',
    borderRadius: 40,
    borderWidth: 1,
    height: 80,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    width: 80,
  },
  runnerThumbnailDesktop: {
    borderRadius: 60,
    height: 120,
    width: 120,
  },
  profileBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  flexCenter: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 28,
    fontWeight: '600',
    margin: 0,
    padding: 0,
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
  profileLink: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  copyContainer: {
    backgroundColor: '#297b2a',
    borderRadius: 5,
  },
  orangeShadow: {
    backgroundColor: '#b75800',
    borderRadius: 3,
    minWidth: 80,
  },
  standardWhiteButton: {
    color: '#ffffff',
    fontSize: 11,
    height: 30,
    paddingHorizontal: 10,
    paddingTop: 7,
  },
  otherProfileSection: {
    backgroundColor: '#f0f2f5',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    width: '100%',
  },
  otherProfileTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  otherProfileText: {
    color: '#333333',
    fontSize: 13,
  },
  badgeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  roundedFull: {
    borderRadius: 10,
    marginBottom: 5,
    marginRight: 4,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#000000',
    fontSize: 12,
  },
  prHistory: {
    backgroundColor: 'gold',
    borderRadius: 15,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  textMuted: {
    color: '#6c757d',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  medalsSectionContainer: {
    width: '100%',
  },
  medalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0,
    padding: 3,
  },
  medalsSectionSpecial: {
    backgroundColor: '#630101',
  },
  tinyHeading: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 0,
  },
  yearGroup: {
    marginTop: 16,
  },
  medalItem: {
    borderColor: '#eeeeee',
    borderWidth: 1,
    height: 42,
    width: '12.5%',
  },
  medalImageList: {
    height: '100%',
    maxWidth: 100,
    width: '100%',
  },
  noMedals: {
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 5,
    padding: 10,
  },
  noMedalsText: {
    color: '#6c757d',
    fontSize: 14,
  },
  certificateGrid: {
    gap: 3,
  },
  certificateItem: {
    borderColor: '#eeeeee',
    borderRadius: 4,
    borderWidth: 1,
    height: 90,
    overflow: 'hidden',
    width: '24%',
  },
  certificateImage: {
    height: '100%',
    width: '100%',
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  achievementCard: {
    backgroundColor: '#ffffff',
    borderColor: '#c7c7c7',
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '48%',
    flexGrow: 1,
    overflow: 'hidden',
  },
  achievementIcon: {
    fontSize: 30,
    textAlign: 'center',
  },
  achievementTextParent: {
    backgroundColor: '#000000',
    height: 86,
    paddingHorizontal: 10,
  },
  achievementText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  achievementValue: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  activityLoading: {
    minHeight: 120,
  },
  profileActivityList: {
    gap: 5,
  },
  eventCardActivityList: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    elevation: 4,
    height: 200,
    marginBottom: 20,
    minWidth: 300,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#adadad',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 7,
  },
  eventActivityImage: {
    height: 120,
    width: '100%',
  },
  medalImageShortCircle: {
    borderColor: '#ff0000',
    borderRadius: 50,
    borderWidth: 2,
    height: 100,
    left: 5,
    position: 'absolute',
    top: 5,
    width: 100,
  },
  eventDetailsActivityList: {
    alignItems: 'center',
    left: 0,
    padding: 10,
    position: 'absolute',
    right: 0,
    top: 120,
  },
  eventTitleActivityList: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  eventInfoActivityList: {
    fontSize: 13,
    textAlign: 'center',
  },
  seeMoreButtonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#337ab7',
    borderColor: '#2e6da4',
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  inlineLoading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 40,
  },
  loadingText: {
    color: '#333333',
    marginLeft: 8,
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  modalPopup: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    maxWidth: 520,
    overflow: 'hidden',
    width: '100%',
  },
  modalTopBar: {
    alignItems: 'center',
    backgroundColor: '#adadad',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  modalHeaderText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  rightCrossButton: {
    backgroundColor: '#af0000',
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rightCrossButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  modalBody: {
    alignItems: 'center',
    padding: 10,
  },
  selectedMedalImage: {
    borderColor: '#eeeeee',
    borderWidth: 2,
    height: 260,
    padding: 10,
    width: '100%',
  },
  modalImage: {
    height: 420,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
  modalText: {
    color: '#333333',
    fontSize: 14,
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
  },
});

export default ProfileDetails;
