import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { TransportMode, type RouteOption } from '../types';
import { WalkIcon, BikeIcon, BusIcon, CarIcon, MultiModalIcon, ShareIcon } from './Icons';

interface RouteCardProps {
  route: RouteOption;
}

const getModeDetails = (mode: TransportMode) => {
  switch (mode) {
    case TransportMode.Walking:
      return { Icon: WalkIcon, color: '#16a34a', bgColor: '#dcfce7' };
    case TransportMode.Cycling:
      return { Icon: BikeIcon, color: '#0284c7', bgColor: '#e0f2fe' };
    case TransportMode.PublicTransport:
      return { Icon: BusIcon, color: '#7c3aed', bgColor: '#f3e8ff' };
    case TransportMode.Driving:
      return { Icon: CarIcon, color: '#dc2626', bgColor: '#fee2e2' };
    case TransportMode.MultiModal:
      return { Icon: MultiModalIcon, color: '#f97316', bgColor: '#ffedd5' };
    default:
      return { Icon: null, color: '#4b5563', bgColor: '#f3f4f6' };
  }
};

const getCarbonBadgeStyle = (carbonFootprint: number) => {
    if (carbonFootprint <= 10) return { backgroundColor: '#bbf7d0', color: '#166534'};
    if (carbonFootprint <= 500) return { backgroundColor: '#fef08a', color: '#854d0e'};
    return { backgroundColor: '#fecaca', color: '#991b1b'};
}

export const RouteCard: React.FC<RouteCardProps> = ({ route }) => {
  const { Icon, color, bgColor } = getModeDetails(route.mode);
  const carbonBadgeStyle = getCarbonBadgeStyle(route.carbonFootprint);

  const handleShare = async () => {
    const shareText = `Check out this eco-friendly route on EcoRoute!\nMode: ${route.mode}\nDuration: ${route.duration}\nDistance: ${route.distance}\nCarbon Footprint: ${route.carbonFootprint}g CO₂e`;
    try {
      await Share.share({
        title: 'EcoRoute Recommendation',
        message: shareText,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.card}>
      <View style={[styles.header, { backgroundColor: bgColor }]}>
        <View style={styles.headerContent}>
          {Icon && (
            <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
              <Icon size={24} color={color} />
            </View>
          )}
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
                <Text style={[styles.carbonText, {color: carbonBadgeStyle.color}]}>
                    {route.carbonFootprint}g
                </Text>
             </View>
            <Text style={styles.detailLabel}>CO₂e</Text>
          </View>
        </View>

        {route.steps && route.steps.length > 0 && (
          <View style={styles.stepsContainer}>
            <Text style={styles.stepsTitle}>Steps:</Text>
            {route.steps.map((step, i) => (
              <Text key={i} style={styles.stepItem}>• {step}</Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
    padding: 8,
    borderRadius: 999,
  },
  headerText: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    color: '#4b5563',
    fontSize: 14,
    marginTop: 2,
  },
  shareButton: {
    padding: 8,
  },
  detailsContainer: {
    padding: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  carbonBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 4,
  },
  carbonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepsContainer: {
    marginTop: 16,
  },
  stepsTitle: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  stepItem: {
    color: '#4b5563',
    fontSize: 14,
    marginBottom: 4,
  },
});
