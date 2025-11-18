export enum TransportMode {
  Walking = 'Walking',
  Cycling = 'Cycling',
  Driving = 'Driving',
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Location {
  label: string;
  coordinates: Coordinates;
}

export interface RouteOption {
  mode: TransportMode;
  duration: string;
  distance: string; // This is a formatted string like "10.5 km"
  carbonFootprint: number; // in grams of CO2e
  description: string;
  overview_polyline: string; 
}

// --- New Types for Dashboard & Challenges ---

export interface UserStats {
  totalDistanceKm: number;
  weeklyDistanceKm: number;
  carbonSavedKg: number;
  badges: string[]; // Array of badge IDs
}

export interface Badge {
    id: string;
    name: string;
    icon: React.ComponentType<any>; // A react component for the icon
    description: string;
    milestone: number; // in km
}
