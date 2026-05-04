import { StyleSheet, Text, View } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.copy}>PaceHistory</Text>
      <Text style={styles.meta}>Track progress. Keep moving.</Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderTopColor: '#26364d',
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  copy: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '900',
  },
  meta: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
});
