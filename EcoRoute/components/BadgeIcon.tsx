import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Badge } from '../types';

interface BadgeIconProps {
  badge: Badge;
  isUnlocked: boolean;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({ badge, isUnlocked }) => {
  const color = isUnlocked ? '#16a34a' : '#d1d5db';

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: isUnlocked ? '#dcfce7' : '#f3f4f6' }]}>
        <badge.icon size={40} color={color} />
      </View>
      <Text style={[styles.name, { color: isUnlocked ? '#1f2937' : '#9ca3af' }]}>
        {badge.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 100,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
