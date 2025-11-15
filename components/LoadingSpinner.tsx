import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export const LoadingSpinner: React.FC = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#16a34a" />
    <Text style={styles.loadingText}>Calculating the greenest paths...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  loadingText: {
    marginTop: 16,
    color: '#15803d', // text-green-700
    fontSize: 16,
  },
});
