import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LeafIcon } from './Icons';

export const WelcomeMessage: React.FC = () => {
    return (
        <View style={styles.container}>
            <LeafIcon size={64} color="#22c55e" style={styles.icon} />
            <Text style={styles.title}>Welcome to EcoRoute</Text>
            <Text style={styles.subtitle}>Your personal guide to sustainable travel.</Text>
            <Text style={styles.description}>
                Enter your start and destination above to discover the best routes that are kind to our planet.
                Choose between the "Greenest" or "Fastest" options to find your perfect journey.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
        margin: 16,
    },
    icon: {
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#14532d',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#374151',
        textAlign: 'center',
    },
    description: {
        marginTop: 16,
        color: '#4b5563',
        textAlign: 'center',
        lineHeight: 22,
    },
});
