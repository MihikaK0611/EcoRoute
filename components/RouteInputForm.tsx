import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, PermissionsAndroid, Platform } from 'react-native';
import type { RoutePreference } from '../types';
import { LocationIcon } from './Icons';

interface RouteInputFormProps {
  onSearch: (start: string, destination: string, preference: RoutePreference) => void;
  isLoading: boolean;
}

export const RouteInputForm: React.FC<RouteInputFormProps> = ({ onSearch, isLoading }) => {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [preference, setPreference] = useState<RoutePreference>('greenest');
  const [geoStatus, setGeoStatus] = useState<string>('');

  const handleUseCurrentLocation = async () => {
    setGeoStatus('Fetching location...');
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'EcoRoute needs access to your location to find routes from your current position.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setGeoStatus('Location permission denied.');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setStart('My Current Location');
          setGeoStatus('Location found!');
        },
        (error) => {
          console.log(error);
          setGeoStatus('Unable to retrieve location.');
          Alert.alert('Location Error', 'Could not retrieve your location. Please ensure location services are enabled.');
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    } else {
      setGeoStatus('Geolocation is not supported on this device.');
    }
  };

  const handleSubmit = () => {
    onSearch(start, destination, preference);
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={start}
            onChangeText={setStart}
            placeholder="Start location"
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity onPress={handleUseCurrentLocation} style={styles.locationButton}>
            <LocationIcon size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
        {geoStatus ? <Text style={styles.geoStatusText}>{geoStatus}</Text> : null}
        <TextInput
          style={styles.input}
          value={destination}
          onChangeText={setDestination}
          placeholder="Destination"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.preferenceContainer}>
        <TouchableOpacity
          onPress={() => setPreference('greenest')}
          style={[styles.preferenceButton, preference === 'greenest' && styles.preferenceActive]}
        >
          <Text style={[styles.preferenceText, preference === 'greenest' && styles.preferenceActiveText]}>
            Greenest
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPreference('fastest')}
          style={[styles.preferenceButton, preference === 'fastest' && styles.preferenceActive]}
        >
          <Text style={[styles.preferenceText, preference === 'fastest' && styles.preferenceActiveText]}>
            Fastest
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isLoading}
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
      >
        <Text style={styles.submitButtonText}>
          {isLoading ? 'Finding routes...' : 'Find My Eco-Route'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    gap: 16,
  },
  inputGroup: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#1f2937',
    height: 50,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
  },
  locationButton: {
    position: 'absolute',
    right: 0,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  geoStatusText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: -12,
    paddingLeft: 4,
  },
  preferenceContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    padding: 4,
  },
  preferenceButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
  },
  preferenceActive: {
    backgroundColor: '#16a34a',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  preferenceText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#4b5563',
  },
  preferenceActiveText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
