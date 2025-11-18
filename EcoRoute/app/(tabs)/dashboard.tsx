import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getStats, resetWeeklyStats } from '../../services/storageService';
import type { UserStats } from '../../types';
import { Header } from '../../components/Header';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { BadgeGrid } from '../../components/BadgeGrid';
import { WeeklyProgressBar } from '../../components/WeeklyProgressBar';

const DashboardScreen = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    const userStats = await getStats();
    setStats(userStats);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  const handleResetWeekly = () => {
    Alert.alert(
      'Reset Weekly Progress',
      'Are you sure you want to reset your distance for the week?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: async () => {
            const updatedStats = await resetWeeklyStats();
            setStats(updatedStats);
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (isLoading || !stats) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Your Eco Dashboard</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalDistanceKm.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Distance (km)</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.carbonSavedKg.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Carbon Saved (kg)</Text>
          </View>
        </View>

        <WeeklyProgressBar weeklyDistance={stats.weeklyDistanceKm} />
        
        <BadgeGrid earnedBadges={stats.badges} />

        <TouchableOpacity onPress={handleResetWeekly} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset Weekly Stats</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0fdf4' },
  container: { flex: 1 },
  contentContainer: { padding: 24, gap: 24, paddingBottom: 50 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#166534', textAlign: 'center', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', gap: 16 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 16, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  statValue: { fontSize: 26, fontWeight: 'bold', color: '#15803d' },
  statLabel: { fontSize: 14, color: '#4b5563', marginTop: 4 },
  resetButton: { backgroundColor: '#ef4444', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 32 },
  resetButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default DashboardScreen;
