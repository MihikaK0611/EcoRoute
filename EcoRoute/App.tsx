import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, Alert, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Polyline, LatLng } from 'react-native-maps';
import { getEcoFriendlyRoutes } from './services/orsService';
import type { RouteOption, Location, UserStats } from './types';
import { Header } from './components/Header';
import { RouteInputForm } from './components/RouteInputForm';
import { RouteCard } from './components/RouteCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WelcomeMessage } from './components/WelcomeMessage';
import { BadgeGrid } from './components/BadgeGrid';
import { WeeklyProgressBar } from './components/WeeklyProgressBar';
import { getStats, resetWeeklyStats } from './services/storageService';
import { ShareIcon } from './components/Icons';
import polyline from '@mapbox/polyline';

const App: React.FC = () => {
  const [routes, setRoutes] = useState<RouteOption[] | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const mapRef = useRef<MapView>(null);

  const fetchStats = useCallback(async () => {
    const userStats = await getStats();
    setStats(userStats);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSearch = useCallback(async (start: Location | null, destination: Location | null) => {
    if (!start || !destination) {
      setError('Please select both a starting point and a destination.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRoutes(null);
    setSelectedRoute(null);
    setRouteCoordinates([]);
    setShowWelcome(false);

    try {
      const result = await getEcoFriendlyRoutes(start.coordinates, destination.coordinates);
      const sortedResults = result.sort((a, b) => a.carbonFootprint - b.carbonFootprint);
      setRoutes(sortedResults);
      if (sortedResults.length > 0) {
        handleRouteSelect(sortedResults[0]);
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      Alert.alert("Search Error", err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRouteSelect = (route: RouteOption) => {
    if (!route.overview_polyline) {
      setRouteCoordinates([]);
      return;
    }
    setSelectedRoute(route);
    const decoded: LatLng[] = polyline.decode(route.overview_polyline).map(point => ({
      latitude: point[0],
      longitude: point[1],
    }));
    setRouteCoordinates(decoded);
  };

  useEffect(() => {
    if (routeCoordinates.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(routeCoordinates, {
        edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
        animated: true,
      });
    }
  }, [routeCoordinates]);

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

  const handleShareDashboard = async () => {
    if (!stats) return;
    const message = `Check out my EcoRoute stats!\n\nTotal Distance: ${stats.totalDistanceKm.toFixed(2)} km\nCarbon Saved: ${stats.carbonSavedKg.toFixed(2)} kg\n\nJoin me in traveling sustainably!`;
    try {
      await Share.share({ title: 'My EcoRoute Progress', message });
    } catch (error: any) {
      Alert.alert('Share Error', error.message);
    }
  };

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error && !routes) return <Text style={styles.errorText}>{error}</Text>;
    if (routes) {
      return (
        <View>
          <Text style={styles.routesHeader}>Your Eco-Friendly Routes</Text>
          {routes.map((item, index) => (
            <TouchableOpacity key={`${item.mode}-${index}`} onPress={() => handleRouteSelect(item)}>
              <RouteCard route={item} isSelected={selectedRoute?.mode === item.mode} />
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    if (stats) {
        return (
            <View style={styles.dashboardContainer}>
                 <View style={styles.dashboardHeader}>
                    <View style={styles.headerSide} />
                    <Text style={styles.title}>Your Eco Dashboard</Text>
                     <View style={[styles.headerSide, { alignItems: 'flex-end' }]}>
                        <TouchableOpacity onPress={handleShareDashboard} style={styles.shareDashboardButton}>
                            <ShareIcon size={24} color="#166534" />
                        </TouchableOpacity>
                    </View>
                </View>
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
            </View>
        )
    }
    return <WelcomeMessage />;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />
      <Header />
      <View style={styles.container}>
        <MapView ref={mapRef} style={styles.map} initialRegion={{ latitude: 28.6139, longitude: 77.2090, latitudeDelta: 0.5, longitudeDelta: 0.5}}>
          {routeCoordinates.length > 0 && (
            <Polyline coordinates={routeCoordinates} strokeColor="#3b82f6" strokeWidth={6} />
          )}
        </MapView>
        <View style={styles.contentWrapper}>
            <View style={styles.formContainer}>
                <RouteInputForm onSearch={handleSearch} isLoading={isLoading} />
            </View>
            <ScrollView style={styles.contentArea} contentContainerStyle={styles.listContainer}>
                {renderContent()}
            </ScrollView>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Travel sustainably with EcoRoute.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0fdf4' },
  container: { flex: 1, flexDirection: 'column' },
  map: { height: '40%', width: '100%' },
  contentWrapper: { flex: 1, backgroundColor: '#f9fafb' },
  formContainer: { paddingHorizontal: 16, paddingTop:16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  contentArea: { flex: 1 },
  errorText: { textAlign: 'center', color: '#ef4444', backgroundColor: '#fee2e2', padding: 16, borderRadius: 8, margin: 16 },
  listContainer: { paddingHorizontal: 16, paddingVertical: 24, paddingBottom: 50 },
  routesHeader: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#166534', marginBottom: 16 },
  footer: { paddingVertical: 12, alignItems: 'center', backgroundColor: '#f0fdf4', borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  footerText: { fontSize: 12, color: '#6b7280' },
  dashboardContainer: { padding: 24, gap: 24, paddingBottom: 50 },
  dashboardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, },
  title: { fontSize: 28, fontWeight: 'bold', color: '#166534', textAlign: 'center' },
  headerSide: { flex: 1 },
  shareDashboardButton: { padding: 8 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', gap: 16 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 16, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  statValue: { fontSize: 26, fontWeight: 'bold', color: '#15803d' },
  statLabel: { fontSize: 14, color: '#4b5563', marginTop: 4 },
  resetButton: { backgroundColor: '#ef4444', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 32 },
  resetButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default App;
