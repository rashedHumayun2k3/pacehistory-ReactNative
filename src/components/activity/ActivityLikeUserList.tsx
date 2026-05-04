import { StyleSheet, Text, View } from 'react-native';

export type ActivityLikeUser = {
  id: string;
  name: string;
  handle?: string;
  initials?: string;
  likedAt?: string;
};

type ActivityLikeUserListProps = {
  users: ActivityLikeUser[];
};

export default function ActivityLikeUserList({ users }: ActivityLikeUserListProps) {
  if (users.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No likes yet</Text>
        <Text style={styles.emptyCopy}>Likes will appear here when teammates react.</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {users.map(user => (
        <View key={user.id} style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.initials || getInitials(user.name)}</Text>
          </View>

          <View style={styles.identity}>
            <Text style={styles.name}>{user.name}</Text>
            {user.handle ? <Text style={styles.handle}>{user.handle}</Text> : null}
          </View>

          {user.likedAt ? <Text style={styles.time}>{user.likedAt}</Text> : null}
        </View>
      ))}
    </View>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  row: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 64,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    marginRight: 12,
    width: 44,
  },
  avatarText: {
    color: '#1d4ed8',
    fontSize: 14,
    fontWeight: '800',
  },
  identity: {
    flex: 1,
  },
  name: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '800',
  },
  handle: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  time: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 10,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    padding: 18,
  },
  emptyTitle: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '800',
  },
  emptyCopy: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    textAlign: 'center',
  },
});
