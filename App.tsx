import React, { useState, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, StatusBar, FlatList, Alert } from 'react-native';
import { getEcoFriendlyRoutes } from './services/geminiService';
import type { RouteOption, RoutePreference } from './types';
import { Header } from './components/Header';
import { RouteInputForm } from './components/RouteInputForm';
import { RouteCard } from './components/RouteCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WelcomeMessage } from './components/WelcomeMessage';

const App: React.FC = () => {
  const [routes, setRoutes] = useState<RouteOption[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  const handleSearch = useCallback(async (start: string, destination: string, preference: RoutePreference) => {
    if (!start || !destination) {
      setError('Please provide both a starting point and a destination.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRoutes(null);
    setShowWelcome(false);

    try {
      const result = await getEcoFriendlyRoutes(start, destination, preference);
      const sortedResults = result.sort((a, b) => a.carbonFootprint - b.carbonFootprint);
      setRoutes(sortedResults);
    } catch (err) {
      console.error(err);
      setError('Sorry, we couldn\'t find any routes. Please try a different search.');
      Alert.alert("Search Failed", "Sorry, we couldn't find any routes. Please try a different search.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error && !routes) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
    if (showWelcome) {
      return <WelcomeMessage />;
    }
    if (routes) {
      return (
        <FlatList
          data={routes}
          renderItem={({ item }) => <RouteCard route={item} />}
          keyExtractor={(item, index) => `${item.mode}-${index}`}
          ListHeaderComponent={<Text style={styles.routesHeader}>Your Eco-Friendly Routes</Text>}
          contentContainerStyle={styles.listContainer}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />
      <Header />
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <RouteInputForm onSearch={handleSearch} isLoading={isLoading} />
        </View>
        <View style={styles.contentArea}>
          {renderContent()}
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Travel sustainably with EcoRoute.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0fdf4', // bg-green-50
  },
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  contentArea: {
    flex: 1,
    marginTop: 8,
  },
  errorText: {
    textAlign: 'center',
    color: '#ef4444', // text-red-500
    backgroundColor: '#fee2e2', // bg-red-100
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  routesHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#166534', // text-green-800
    marginBottom: 16,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280', // text-gray-500
  }
});

export default App;
