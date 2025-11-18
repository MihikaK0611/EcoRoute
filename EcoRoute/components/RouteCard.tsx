import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { TransportMode, type RouteOption } from '../types';
import { WalkIcon, BikeIcon, CarIcon, ShareIcon } from './Icons';
import { updateDistance, addBadge } from '../services/storageService';
import { checkNewBadges } from '../constants/badges';

interface RouteCardProps {
  route: RouteOption;
  isSelected: boolean;
}

const getModeDetails = (mode: TransportMode) => {
  switch (mode) {
    case TransportMode.Walking:
      return { Icon: WalkIcon, color: '#16a34a', bgColor: '#dcfce7' };
    case TransportMode.Cycling:
      return { Icon: BikeIcon, color: '#0284c7', bgColor: '#e0f2fe' };
    case TransportMode.Driving:
      return { Icon: CarIcon, color: '#dc2626', bgColor: '#fee2e2' };
    default:
      return { Icon: CarIcon, color: '#4b5563', bgColor: '#f3f4f6' };
  }
};

const getCarbonBadgeStyle = (carbonFootprint: number) => {
    if (carbonFootprint <= 10) return { backgroundColor: '#bbf7d0', color: '#166534'};
    if (carbonFootprint <= 500) return { backgroundColor: '#fef08a', color: '#854d0e'};
    return { backgroundColor: '#fecaca', color: '#991b1b'};
}

export const RouteCard: React.FC<RouteCardProps> = ({ route, isSelected }) => {
  const { Icon, color, bgColor } = getModeDetails(route.mode);
  const carbonBadgeStyle = getCarbonBadgeStyle(route.carbonFootprint);
  const [isTracking, setIsTracking] = useState(false);
  const router = useRouter();

  const isEcoFriendly = route.mode === TransportMode.Walking || route.mode === TransportMode.Cycling;

  const handleShare = async () => {
    const shareText = `Check out this eco-friendly route on EcoRoute!\nMode: ${route.mode}\nDuration: ${route.duration}\nDistance: ${route.distance}\nCarbon Footprint: ${route.carbonFootprint}g CO₂e`;
    try {
      await Share.share({ title: 'EcoRoute Recommendation', message: shareText });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const handleStartRoute = () => {
    setIsTracking(true);
  };

  const handleFinishRoute = async () => {
    const distanceKm = parseFloat(route.distance.split(' ')[0]);
    if (isNaN(distanceKm)) return;

    try {
      const updatedStats = await updateDistance(distanceKm);
      const earnedBadge = checkNewBadges(updatedStats.totalDistanceKm, updatedStats.badges);

      setIsTracking(false);

      if (earnedBadge) {
        await addBadge(earnedBadge.id);
        Alert.alert(
          'Badge Earned!',
          `Congratulations! You\'ve unlocked the ${earnedBadge.name} badge.`,
          [{ text: 'View Dashboard', onPress: () => router.push('/dashboard') }]
        );
      } else {
        Alert.alert(
          'Route Finished!',
          `Great job! You\'ve added ${distanceKm.toFixed(2)} km to your stats.`,
          [{ text: 'View Dashboard', onPress: () => router.push('/dashboard') }]
        );
      }

    } catch (error) {
      setIsTracking(false);
      Alert.alert('Error', 'Failed to save your progress.');
    }
  };

  return (
    <View style={[styles.card, isSelected && styles.selectedCard]}>
      <View style={[styles.header, { backgroundColor: bgColor }]}>
        <View style={styles.headerContent}>
          {Icon && <Icon size={24} color={color} style={styles.iconContainer} />}
          <View style={styles.headerText}>
            <Text style={[styles.modeTitle, { color }]}>{route.mode}</Text>
            <Text style={styles.description}>{route.description}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <ShareIcon size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>{route.duration}</Text>
            <Text style={styles.detailLabel}>Duration</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>{route.distance}</Text>
            <Text style={styles.detailLabel}>Distance</Text>
          </View>
          <View style={styles.detailItem}>
             <View style={[styles.carbonBadge, {backgroundColor: carbonBadgeStyle.backgroundColor}]}>
                <Text style={[styles.carbonText, {color: carbonBadgeStyle.color}]}>{route.carbonFootprint}g</Text>
             </View>
            <Text style={styles.detailLabel}>CO₂e</Text>
          </View>
        </View>

        {isEcoFriendly && isSelected && (
          <View style={styles.actionsContainer}>
            {!isTracking ? (
              <TouchableOpacity style={styles.startButton} onPress={handleStartRoute}>
                <Text style={styles.buttonText}>Start Route</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.finishButton} onPress={handleFinishRoute}>
                <Text style={styles.buttonText}>Finish Route</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2 },
  selectedCard: { borderColor: '#16a34a', borderWidth: 2, shadowColor: '#16a34a', shadowOpacity: 0.3, shadowRadius: 5 },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { marginRight: 16 },
  headerText: { flex: 1 },
  modeTitle: { fontSize: 20, fontWeight: 'bold' },
  description: { color: '#4b5563', fontSize: 14, marginTop: 2 },
  shareButton: { padding: 8 },
  detailsContainer: { padding: 16 },
  detailsGrid: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12 },
  detailItem: { alignItems: 'center', flex: 1 },
  detailValue: { fontSize: 18, fontWeight: 'bold', color: '#374151' },
  detailLabel: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  carbonBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, marginBottom: 4 },
  carbonText: { fontSize: 18, fontWeight: 'bold' },
  actionsContainer: { marginTop: 16, borderTopColor: '#f3f4f6', borderTopWidth: 1, paddingTop: 16 },
  startButton: { backgroundColor: '#22c55e', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  finishButton: { backgroundColor: '#ef4444', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
