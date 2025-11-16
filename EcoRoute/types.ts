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
  distance: string;
  carbonFootprint: number; // in grams of CO2e
  description: string;
  overview_polyline: string; // Encoded polyline string for the route path
}
