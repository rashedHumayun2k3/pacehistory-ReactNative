import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AchievementDetailsLog from './AchievementDetailsLog';
import ActivityEventDetails, { FILE_SERVER } from './ActivityEventDetails';
import { AppDispatch, RootState } from '../../store/store';
import { fetchActivityLogList } from '../../store/slices/activityLogSlice';

const DEFAULT_IMAGE =
  'https://ui-avatars.com/api/?name=Pace+History&background=dbeafe&color=1d4ed8';

export type ActivityLogItem = {
  activityLogId: string | number;
  activityCreator: string;
  activityCreatorProfilePicture?: string | null;
  activityDetails: string;
  createdDate: string | number | Date;
  relatedEntityType?: 'Event' | 'Achievement' | string | null;
  detailedActivityDetails?: string | null;
  detailedActivityBannerImage?: string | null;
};

type ActivityLogHistoryProps = {
  activityLogList?: ActivityLogItem[];
  loading?: boolean;
  error?: string | null;
  onBack?: () => void;
  onEndReached?: () => void;
};

const demoActivityLogList: ActivityLogItem[] = [
  {
    activityLogId: 1,
    activityCreator: 'Ari Thompson',
    activityDetails: 'completed a morning tempo run.',
    createdDate: new Date(Date.now() - 1000 * 60 * 38),
    relatedEntityType: 'Event',
    detailedActivityDetails: '8.2 km ▷ 39:54 total time ▷ 4:52/km average pace',
    detailedActivityBannerImage: null,
  },
  {
    activityLogId: 2,
    activityCreator: 'PaceHistory Team',
    activityDetails: 'unlocked a monthly streak achievement.',
    createdDate: new Date(Date.now() - 1000 * 60 * 60 * 26),
    relatedEntityType: 'Achievement',
    detailedActivityDetails: 'Consistency Club ▷ 4 active weeks ▷ 32 sessions logged',
    detailedActivityBannerImage: null,
  },
];

const ActivityLogHistory = ({
  activityLogList,
  loading,
  error,
  onBack,
  onEndReached,
}: ActivityLogHistoryProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    activityLogList: reduxActivityLogList,
    loading: reduxLoading,
    error: reduxError,
    hasMore,
  } = useSelector((state: RootState) => state.activityLog);
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const resolvedActivityLogList =
    activityLogList ?? (reduxActivityLogList.length > 0 ? reduxActivityLogList : demoActivityLogList);
  const resolvedLoading = loading ?? reduxLoading.isActivityLogListLoad;
  const resolvedError = error ?? reduxError;

  useEffect(() => {
    if (activityLogList) {
      return;
    }

    dispatch(
      fetchActivityLogList({
        pageIndex,
        pageSize,
        loggedInUserId: 0,
      })
    );
  }, [activityLogList, dispatch, pageIndex]);

  const handleEndReached = () => {
    if (onEndReached) {
      onEndReached();
      return;
    }

    if (!resolvedLoading && hasMore) {
      setPageIndex((current) => current + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.brand}>PaceHistory</Text>
          {resolvedActivityLogList.length > 0 ? (
            <Text style={styles.title}>Recent Activities</Text>
          ) : null}
        </View>

        {onBack ? (
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Home</Text>
          </Pressable>
        ) : null}
      </View>

      {resolvedError ? <Text style={styles.errorText}>{resolvedError}</Text> : null}

      <FlatList
        contentContainerStyle={styles.listContent}
        data={resolvedActivityLogList}
        keyExtractor={item => String(item.activityLogId)}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              {loading ? 'Loading activities...' : 'No activity yet'}
            </Text>
            {!loading ? (
              <Text style={styles.emptyCopy}>Recent workouts and achievements will appear here.</Text>
            ) : null}
          </View>
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <Pressable accessibilityRole="button" style={styles.activityCard}>
            <View style={styles.activityRow}>
              <Image
                source={{
                  uri: item.activityCreatorProfilePicture
                    ? `${FILE_SERVER}${item.activityCreatorProfilePicture}`
                    : DEFAULT_IMAGE,
                }}
                style={styles.avatar}
              />

              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  <Text style={styles.creatorName}>{item.activityCreator}</Text>{' '}
                  {item.activityDetails}
                </Text>

                <Text style={styles.timeText}>{timeAgo(item.createdDate)}</Text>

                {item.relatedEntityType === 'Event' ? (
                  <ActivityEventDetails
                    detailedActivityDetails={item.detailedActivityDetails}
                    detailedActivityBannerImage={item.detailedActivityBannerImage}
                  />
                ) : null}

                {item.relatedEntityType === 'Achievement' ? (
                  <AchievementDetailsLog
                    detailedActivityDetails={item.detailedActivityDetails}
                    detailedActivityBannerImage={item.detailedActivityBannerImage}
                  />
                ) : null}
              </View>
            </View>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

function timeAgo(value: ActivityLogItem['createdDate']) {
  const date = new Date(value);
  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) {
    return '';
  }

  const seconds = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);

    if (count >= 1) {
      return `${count} ${interval.label}${count === 1 ? '' : 's'} ago`;
    }
  }

  return 'just now';
}

export default ActivityLogHistory;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flex: 1,
    maxWidth: 760,
    width: '100%',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerCopy: {
    flex: 1,
  },
  brand: {
    color: '#7dd3fc',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  backButton: {
    alignItems: 'center',
    borderColor: '#7dd3fc',
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  backButtonText: {
    color: '#e0f2fe',
    fontSize: 14,
    fontWeight: '900',
  },
  errorText: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    color: '#991b1b',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
    padding: 12,
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  activityRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  avatar: {
    backgroundColor: '#dbeafe',
    borderRadius: 24,
    height: 48,
    marginRight: 12,
    width: 48,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    color: '#334155',
    fontSize: 15,
    lineHeight: 22,
  },
  creatorName: {
    color: '#0f172a',
    fontWeight: '700',
  },
  timeText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 24,
  },
  emptyTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '900',
  },
  emptyCopy: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
    textAlign: 'center',
  },
});
