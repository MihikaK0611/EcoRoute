import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BADGES } from '../constants/badges';
import { BadgeIcon } from './BadgeIcon'; // We will create this next

interface BadgeGridProps {
  earnedBadges: string[];
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({ earnedBadges }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Achievements</Text>
      <View style={styles.grid}>
        {BADGES.map((badge) => (
          <BadgeIcon
            key={badge.id}
            badge={badge}
            isUnlocked={earnedBadges.includes(badge.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 20,
  },
});
