import { TransportMode, type RouteOption, type Location } from '../types';
import polyline from '@mapbox/polyline';

// --- Config --- //
const ORS_API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY;
const ORS_BASE_URL = 'https://api.openrouteservice.org';

if (!ORS_API_KEY) {
  throw new Error("EXPO_PUBLIC_ORS_API_KEY is not set. Please check your .env file.");
}

const orsHeaders = {
  'Authorization': ORS_API_KEY,
  'Content-Type': 'application/json',
};

// --- API Functions --- //

export const searchForAddress = async (query: string): Promise<Location[]> => {
  if (!query || query.length < 3) return [];
  const url = `${ORS_BASE_URL}/geocode/search?text=${encodeURIComponent(query)}&size=5`;
  try {
    const response = await fetch(url, { headers: orsHeaders });
    if (!response.ok) {
      console.error('ORS Search Geocode request failed with status:', response.status);
      return [];
    }
    const data = await response.json();
    return data.features?.map((feature: any) => ({
      label: feature.properties.label,
      coordinates: {
        lon: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1],
      },
    })) || [];
  } catch (error: any) {
    console.error('ORS Search Geocode Error:', error.message);
    return [];
  }
};

export const getEcoFriendlyRoutes = async (
  startCoords: { lat: number; lon: number },
  destCoords: { lat: number; lon: number },
): Promise<RouteOption[]> => {
  const modes: Array<{name: TransportMode, profile: 'foot-walking' | 'cycling-regular' | 'driving-car', emissionFactor: number}> = [
    { name: TransportMode.Walking, profile: 'foot-walking', emissionFactor: 0 },
    { name: TransportMode.Cycling, profile: 'cycling-regular', emissionFactor: 0 },
    { name: TransportMode.Driving, profile: 'driving-car', emissionFactor: 171 }, // g/km
  ];

  const getRoute = async (profile: string) => {
    const url = `${ORS_BASE_URL}/v2/directions/${profile}/geojson`;
    const payload = { coordinates: [[startCoords.lon, startCoords.lat], [destCoords.lon, destCoords.lat]] };
    try {
      const response = await fetch(url, { method: 'POST', body: JSON.stringify(payload), headers: orsHeaders });
      if (response.ok) return response.json();
      return null;
    } catch (error) {
      return null;
    }
  };

  const results = await Promise.all(modes.map(mode => getRoute(mode.profile)));
  const finalRoutes: RouteOption[] = [];

  results.forEach((result, i) => {
    if (result && result.features?.[0]) {
      const feature = result.features[0];
      const summary = feature.properties.summary;
      const distanceKm = summary.distance / 1000;
      const durationMin = Math.round(summary.duration / 60);

      finalRoutes.push({
        mode: modes[i].name,
        distance: `${distanceKm.toFixed(2)} km`,
        duration: `${durationMin} mins`,
        carbonFootprint: Math.round(distanceKm * modes[i].emissionFactor),
        description: `A ${modes[i].name.toLowerCase()} route with minimal environmental impact.`,
        overview_polyline: polyline.encode(feature.geometry.coordinates.map((c: number[]) => [c[1], c[0]])),
      });
    }
  });

  if (finalRoutes.length === 0) {
    throw new Error("Could not find any routes. The locations may be too far apart for some modes.");
  }

  return finalRoutes;
};
