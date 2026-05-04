import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFollower, followUser, unfollowUser } from '../../store/slices/userFollowerSlice';
import { AppDispatch, RootState } from '../../store/store';
import { UserProfile } from '../../types/user/userProfile.interface';

interface UserInfoProps {
  userProfile: UserProfile;
}

const Follower = ({ userProfile }: UserInfoProps) => {
  const [id, setId] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { userFollower, loading } = useSelector((state: RootState) => state.userFollowUnfollow);
  const [isFollowing, setIsFollowing] = useState(false);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [totalFollowing, setTotalFollowing] = useState(0);

  useEffect(() => {
    setId(userProfile.id);
  }, [userProfile]);

  useEffect(() => {
    if (userFollower) {
      setIsFollowing(userFollower.totalFollowing > 0);
      setTotalFollowers(userFollower.totalFollowers);
      setTotalFollowing(userFollower.totalFollowing);
    }
  }, [userFollower]);

  useEffect(() => {
    if (id) {
      dispatch(fetchFollower(id));
    }
  }, [dispatch, id]);

  const handleFollowToggle = () => {
    if (!id) {
      return;
    }

    if (isFollowing) {
      dispatch(unfollowUser(id));
    } else {
      dispatch(followUser(id));
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={handleFollowToggle}
        style={[styles.followButton, isFollowing && styles.unfollowButton]}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.followText}>{isFollowing ? 'Unfollow' : '+ Follow'}</Text>
        )}
      </Pressable>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Following</Text>
          <Text style={styles.statValue}>{totalFollowing}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Followers</Text>
          <Text style={styles.statValue}>{totalFollowers}</Text>
        </View>
      </View>
    </View>
  );
};

export default Follower;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  followButton: {
    alignItems: 'center',
    backgroundColor: 'blue',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  unfollowButton: {
    backgroundColor: 'gray',
  },
  followText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#555555',
    fontSize: 12,
  },
  statValue: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '800',
  },
});
