import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserStats } from '../types';

const STATS_STORAGE_KEY = 'eco_route_user_stats';

const defaultStats: UserStats = {
  totalDistanceKm: 0,
  weeklyDistanceKm: 0,
  carbonSavedKg: 0,
  badges: [],
};

/**
 * Retrieves the user's stats from AsyncStorage.
 * If no stats are found, it initializes and returns the default stats.
 */
export const getStats = async (): Promise<UserStats> => {
  try {
    const statsJson = await AsyncStorage.getItem(STATS_STORAGE_KEY);
    if (statsJson) {
      return JSON.parse(statsJson);
    } else {
      // If no stats exist, initialize them
      await AsyncStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(defaultStats));
      return defaultStats;
    }
  } catch (error) {
    console.error("Failed to retrieve stats:", error);
    return defaultStats; // Return default stats on error
  }
};

/**
 * Updates the total and weekly distance, recalculates carbon saved, and saves to storage.
 */
export const updateDistance = async (distanceToAddKm: number): Promise<UserStats> => {
  const currentStats = await getStats();
  const newTotalDistance = currentStats.totalDistanceKm + distanceToAddKm;
  const newWeeklyDistance = currentStats.weeklyDistanceKm + distanceToAddKm;

  // Using the formula: carbon saved (kg) = distance (km) * 0.12
  const newCarbonSaved = newTotalDistance * 0.12;

  const updatedStats: UserStats = {
    ...currentStats,
    totalDistanceKm: newTotalDistance,
    weeklyDistanceKm: newWeeklyDistance,
    carbonSavedKg: newCarbonSaved,
  };

  await AsyncStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updatedStats));
  return updatedStats;
};

/**
 * Adds a new badge to the user's collection, if it doesn't already exist.
 */
export const addBadge = async (badgeId: string): Promise<UserStats> => {
  const currentStats = await getStats();
  if (currentStats.badges.includes(badgeId)) {
    return currentStats; // Badge already earned
  }

  const updatedStats: UserStats = {
    ...currentStats,
    badges: [...currentStats.badges, badgeId],
  };

  await AsyncStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updatedStats));
  console.log(`Badge earned: ${badgeId}`);
  return updatedStats;
};

/**
 * Resets only the weekly distance stats.
 */
export const resetWeeklyStats = async (): Promise<UserStats> => {
  const currentStats = await getStats();
  const updatedStats: UserStats = {
    ...currentStats,
    weeklyDistanceKm: 0,
  };

  await AsyncStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updatedStats));
  return updatedStats;
};
