import React from 'react';

const { ActivityIndicator, StyleSheet, Text, View } = require('react-native');

interface StatusHandlerProps {
  isLoading: boolean;
  error: string | null;
  children: React.ReactNode;
}

const StatusHandler: React.FC<StatusHandlerProps> = ({ isLoading, error, children }) => {
  if (isLoading) {
    return (
      <View style={styles.activityFeedWrapper}>
        <View style={styles.statusContainer}>
          <ActivityIndicator color="#337ab7" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.activityFeedWrapper}>
        <View style={styles.statusContainer}>
          <Text style={styles.noRecordsMessage}>
            We sincerely apologize for the inconvenience. Our system is
            currently experiencing an unexpected issue. Rest assured, our team
            is actively working to resolve it as quickly as possible. Thank you
            for your patience and understanding. We will provide an update soon.
          </Text>
        </View>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  activityFeedWrapper: {
    width: '100%',
  },
  statusContainer: {
    alignItems: 'center',
    height: 200,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    color: '#333333',
    fontSize: 14,
    marginTop: 8,
  },
  noRecordsMessage: {
    color: '#6c757d',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
});

export default StatusHandler;
