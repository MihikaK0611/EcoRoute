import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WEEKLY_GOAL_KM = 10;

interface WeeklyProgressBarProps {
  weeklyDistance: number;
}

export const WeeklyProgressBar: React.FC<WeeklyProgressBarProps> = ({ weeklyDistance }) => {
  const progress = Math.min((weeklyDistance / WEEKLY_GOAL_KM) * 100, 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Goal Progress</Text>
      <View style={styles.barBackground}>
        <View style={[styles.barForeground, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {`${weeklyDistance.toFixed(1)} / ${WEEKLY_GOAL_KM} km`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  barBackground: {
    height: 20,
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barForeground: {
    height: '100%',
    backgroundColor: '#22c55e', // green-500
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
});
