import type { Badge } from '../types';
import { WalkIcon, LeafIcon, AwardIcon } from '../components/Icons'; // Assuming an AwardIcon exists or will be created

export const BADGES: Badge[] = [
  {
    id: 'eco_walker_5km',
    name: 'Eco Walker',
    icon: WalkIcon,
    description: 'Walk or cycle 5 km and start your journey!',
    milestone: 5,
  },
  {
    id: 'carbon_saver_10km',
    name: 'Carbon Saver',
    icon: LeafIcon,
    description: 'Save the planet by covering 10 km on foot or bike.',
    milestone: 10,
  },
  {
    id: 'green_champion_25km',
    name: 'Green Champion',
    icon: AwardIcon, // This icon will need to be created
    description: 'Become a true champion by covering 25 km.',
    milestone: 25,
  },
];

/**
 * Checks if a new badge has been earned based on the total distance.
 * Returns the earned badge or null.
 */
export const checkNewBadges = (totalDistanceKm: number, oldBadges: string[]): Badge | null => {
  for (const badge of BADGES) {
    if (totalDistanceKm >= badge.milestone && !oldBadges.includes(badge.id)) {
      return badge;
    }
  }
  return null;
};
