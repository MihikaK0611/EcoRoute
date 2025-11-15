
export enum TransportMode {
  Walking = 'Walking',
  Cycling = 'Cycling',
  PublicTransport = 'Public Transport',
  Driving = 'Driving',
  MultiModal = 'Multi-modal',
}

export interface RouteOption {
  mode: TransportMode;
  duration: string;
  distance: string;
  carbonFootprint: number; // in grams of CO2e
  description: string;
  steps: string[];
}

export type RoutePreference = 'greenest' | 'fastest';
