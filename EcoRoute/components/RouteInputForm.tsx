import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Location as LocationType } from '../types';
import { AddressSearchModal } from './AddressSearchModal';
// Correcting the import for the icons
import { LocationIcon, SearchIcon } from './Icons'; 

interface RouteInputFormProps {
  onSearch: (start: LocationType, destination: LocationType) => void;
  isLoading: boolean;
}

export const RouteInputForm: React.FC<RouteInputFormProps> = ({ onSearch, isLoading }) => {
  const [start, setStart] = useState<LocationType | null>(null);
  const [destination, setDestination] = useState<LocationType | null>(null);
  const [isStartModalVisible, setIsStartModalVisible] = useState(false);
  const [isDestModalVisible, setIsDestModalVisible] = useState(false);
  const [geoStatus, setGeoStatus] = useState<string>('');

  const handleUseCurrentLocation = async () => {
    setGeoStatus('Fetching location...');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setGeoStatus('Permission denied');
      Alert.alert('Permission Denied', 'Please enable location access.');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const addressResponse = await Location.reverseGeocodeAsync(location.coords);
      if (addressResponse && addressResponse.length > 0) {
        const addr = addressResponse[0];
        const selectedLocation: LocationType = {
          label: [addr.name, addr.street, addr.city, addr.region].filter(Boolean).join(', '),
          coordinates: { lat: location.coords.latitude, lon: location.coords.longitude },
        };
        setStart(selectedLocation);
        setGeoStatus('Current location set as start.');
      }
    } catch (error) {
      setGeoStatus('Failed to get location.');
    }
  };

  const handleSubmit = () => {
    if (start && destination) {
      onSearch(start, destination);
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <TouchableOpacity style={styles.inputButton} onPress={() => setIsStartModalVisible(true)}>
            <SearchIcon size={20} color={start ? '#1f2937' : '#9ca3af'} />
            <Text style={[styles.inputText, !start && styles.placeholderText]}>
                {start ? start.label : 'Choose starting point'}
            </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inputButton} onPress={() => setIsDestModalVisible(true)}>
            <SearchIcon size={20} color={destination ? '#1f2937' : '#9ca3af'} />
            <Text style={[styles.inputText, !destination && styles.placeholderText]}>
                {destination ? destination.label : 'Choose destination'}
            </Text>
        </TouchableOpacity>
         <TouchableOpacity onPress={handleUseCurrentLocation} style={styles.currentLocationButton}>
            <LocationIcon size={18} color="#6b7280" />
            <Text style={styles.currentLocationText}>Use My Location</Text>
        </TouchableOpacity>
        {geoStatus ? <Text style={styles.geoStatusText}>{geoStatus}</Text> : null}
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isLoading || !start || !destination}
        style={[styles.submitButton, (isLoading || !start || !destination) && styles.submitButtonDisabled]}
      >
        <Text style={styles.submitButtonText}>{isLoading ? 'Finding routes...' : 'Find My Eco-Route'}</Text>
      </TouchableOpacity>

      <AddressSearchModal
        isVisible={isStartModalVisible}
        onClose={() => setIsStartModalVisible(false)}
        onLocationSelect={(location) => { setStart(location); setIsStartModalVisible(false); }}
      />
      <AddressSearchModal
        isVisible={isDestModalVisible}
        onClose={() => setIsDestModalVisible(false)}
        onLocationSelect={(location) => { setDestination(location); setIsDestModalVisible(false); }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: { backgroundColor: '#fff', padding: 24, borderRadius: 16, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, gap: 20 },
  inputGroup: { gap: 16 },
  inputButton: { flexDirection: 'row', alignItems: 'center', borderColor: '#d1d5db', borderWidth: 1, borderRadius: 8, height: 50, paddingHorizontal: 16, gap: 12 },
  inputText: { flex: 1, fontSize: 16, color: '#1f2937' },
  placeholderText: { color: '#9ca3af' },
  currentLocationButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 8 },
  currentLocationText: { fontSize: 14, color: '#6b7280', fontWeight: '600' },
  geoStatusText: { fontSize: 12, color: '#6b7280', textAlign: 'center', marginTop: -8 },
  submitButton: { backgroundColor: '#16a34a', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  submitButtonDisabled: { backgroundColor: '#9ca3af' },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
