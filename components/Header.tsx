import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LeafIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <LeafIcon size={32} color="#16a34a" />
      <Text style={styles.title}>EcoRoute</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for Android
    elevation: 4,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14532d', // text-green-800
    marginLeft: 12,
  },
});
