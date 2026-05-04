import { Image, StyleSheet, Text, View } from 'react-native';
import { FILE_SERVER } from './ActivityEventDetails';

type AchievementDetailsLogProps = {
  detailedActivityDetails?: string | null;
  detailedActivityBannerImage?: string | null;
};

const AchievementDetailsLog = ({
  detailedActivityDetails,
  detailedActivityBannerImage,
}: AchievementDetailsLogProps) => {
  const parts = (detailedActivityDetails ?? '')
    .split('▷')
    .filter(part => part.trim() !== '');

  return (
    <View style={styles.container}>
      {parts.length > 0 ? <Text style={styles.details}>{parts.join(' ◆ ')}</Text> : null}

      {detailedActivityBannerImage ? (
        <Image
          source={{ uri: `${FILE_SERVER}${detailedActivityBannerImage}` }}
          style={styles.banner}
        />
      ) : null}
    </View>
  );
};

export default AchievementDetailsLog;

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 12,
  },
  details: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
  banner: {
    borderRadius: 8,
    height: 180,
    width: '100%',
  },
});
