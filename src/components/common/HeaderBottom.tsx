import React from 'react';
import { StyleSheet, View } from 'react-native';

const HeaderBottom = () => {
  return (
    <View style={styles.headerBottom}>
      <View style={styles.row}>
        <View style={styles.colMd12}>
          <View style={styles.full} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBottom: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  colMd12: {
    width: '100%',
  },
  full: {
    width: '100%',
  },
});

export default HeaderBottom;
