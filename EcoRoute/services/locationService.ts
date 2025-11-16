import { Alert } from 'react-native';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const OSRM_BASE_URL = 'http://router.project-osrm.org';

// Now exported to be used by the main service
export const geocodeAddress = async (address: string): Promise<{ lat: string; lon: string } | null> => {
  if (!address) return null;
  try {
    const response = await fetch(`${NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(address)}&format=json&limit=1`, {
      headers: {
        'User-Agent': 'EcoRouteApp/1.0' // Good practice to set a user-agent
      }
    });
    const data = await response.json();
    if (data && data.length > 0) {
      return { lat: data[0].lat, lon: data[0].lon };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Now takes coordinates instead of text addresses
export const getRealRoute = async (startCoords: { lat: string; lon: string }, destCoords: { lat: string; lon: string }, mode: 'car' | 'bike' | 'foot') => {
  const profile = mode;
  const url = `${OSRM_BASE_URL}/route/v1/${profile}/${startCoords.lon},${startCoords.lat};${destCoords.lon},${destCoords.lat}?overview=full&geometries=polyline`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        distance: (route.distance / 1000).toFixed(2), // in km
        duration: Math.round(route.duration / 60), // in minutes
        overview_polyline: route.geometry,
      };
    }
    return null;
  } catch (error) {
    console.error(`OSRM routing error for mode ${mode}:`, error);
    return null;
  }
};
