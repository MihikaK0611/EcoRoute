import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Polyline } from 'react-native-maps';
import { getEcoFriendlyRoutes } from './services/orsService'; // Corrected import
import type { RouteOption, Location } from './types';
import { Header } from './components/Header';
import { RouteInputForm } from './components/RouteInputForm';
import { RouteCard } from './components/RouteCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WelcomeMessage } from './components/WelcomeMessage';
import polyline from '@mapbox/polyline';

const App: React.FC = () => {
  const [routes, setRoutes] = useState<RouteOption[] | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const mapRef = useRef<MapView>(null);

  const handleSearch = useCallback(async (start: Location | null, destination: Location | null) => {
    if (!start || !destination) {
      setError('Please select both a starting point and a destination.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRoutes(null);
    setSelectedRoute(null);
    setShowWelcome(false);

    try {
      const result = await getEcoFriendlyRoutes(start.coordinates, destination.coordinates);
      const sortedResults = result.sort((a, b) => a.carbonFootprint - b.carbonFootprint);
      setRoutes(sortedResults);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unknown error occurred while fetching routes.');
      Alert.alert("Search Error", err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRouteSelect = (route: RouteOption) => {
    if (!route.overview_polyline) return;
    setSelectedRoute(route);
    const decodedPolyline = polyline.decode(route.overview_polyline).map(point => ({
      latitude: point[0],
      longitude: point[1],
    }));

    if (mapRef.current && decodedPolyline.length > 0) {
      mapRef.current.fitToCoordinates(decodedPolyline, {
        edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
        animated: true,
      });
    }
  };

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error && !routes) return <Text style={styles.errorText}>{error}</Text>;
    if (showWelcome) return <WelcomeMessage />;
    if (routes) {
      return (
        <View>
          <Text style={styles.routesHeader}>Your Eco-Friendly Routes</Text>
          {routes.map((item, index) => (
            <TouchableOpacity key={`${item.mode}-${index}`} onPress={() => handleRouteSelect(item)}>
              <RouteCard route={item} />
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />
      <Header />
      <View style={styles.container}>
        <MapView ref={mapRef} style={styles.map} initialRegion={{ latitude: 28.6139, longitude: 77.2090, latitudeDelta: 0.5, longitudeDelta: 0.5}}>
          {selectedRoute && selectedRoute.overview_polyline && (
            <Polyline
              coordinates={polyline.decode(selectedRoute.overview_polyline).map(point => ({ latitude: point[0], longitude: point[1] }))}
              strokeColor="#3b82f6"
              strokeWidth={5}
            />
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
  listContainer: { paddingHorizontal: 16, paddingVertical: 24 },
  routesHeader: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#166534', marginBottom: 16 },
  footer: { paddingVertical: 12, alignItems: 'center', backgroundColor: '#f0fdf4', borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  footerText: { fontSize: 12, color: '#6b7280' }
});

export default App;
