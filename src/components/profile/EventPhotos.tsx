import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface ProfileDetailsProps {
  params: Promise<{ id: string }> | { id: string };
}

const photos = [
  require('../../../assets/images/running-event-default-picture.png'),
  require('../../../assets/images/event-banner.jpg'),
  require('../../../assets/images/default-route2.jpg'),
];

const EventPhotos = ({ params }: ProfileDetailsProps) => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };

    unwrapParams();
  }, [params]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last Event Photos</Text>

      <View style={styles.grid}>
        {photos.map((photo, index) => (
          <Image
            accessibilityLabel={`Event Photo ${index + 1}`}
            key={`event-photo-${index}`}
            resizeMode="cover"
            source={photo}
            style={styles.photo}
          />
        ))}
      </View>

      {id ? <Text style={styles.profileHint}>Profile ID: {id}</Text> : null}
    </View>
  );
};

export default EventPhotos;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
  },
  photo: {
    borderRadius: 6,
    flex: 1,
    height: 96,
  },
  profileHint: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});
