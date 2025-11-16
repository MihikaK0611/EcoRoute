import React, { useState, useEffect } from 'react';
import { View, Modal, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Keyboard } from 'react-native';
import { searchForAddress } from '../services/orsService'; // Corrected import
import type { Location } from '../types';

interface AddressSearchModalProps {
  isVisible: boolean;
  onClose: () => void;
  onLocationSelect: (location: Location) => void;
}

export const AddressSearchModal: React.FC<AddressSearchModalProps> = ({ isVisible, onClose, onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      searchForAddress(debouncedQuery).then(setResults);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleSelect = (location: Location) => {
    setQuery('');
    setResults([]);
    Keyboard.dismiss();
    onLocationSelect(location);
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Search for a Location</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Type an address, landmark, or place..."
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.label}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultItem} onPress={() => handleSelect(item)}>
              <Text style={styles.resultText}>{item.label}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noResultsText}>No results yet. Keep typing!</Text>}
          keyboardShouldPersistTaps="handled"
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  closeButton: { padding: 8 },
  closeButtonText: { fontSize: 16, color: '#16a34a', fontWeight: '600' },
  searchInput: { height: 50, borderColor: '#d1d5db', borderWidth: 1, borderRadius: 8, margin: 16, paddingHorizontal: 16, fontSize: 16 },
  resultItem: { paddingVertical: 16, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  resultText: { fontSize: 16, color: '#374151' },
  noResultsText: { textAlign: 'center', marginTop: 40, color: '#6b7280' },
});
