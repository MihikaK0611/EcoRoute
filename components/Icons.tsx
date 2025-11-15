import React from 'react';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
  style?: object;
};

export const LeafIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', style }) => (
  <Svg height={size} width={size} viewBox="0 0 24 24" fill={color} style={style}>
    <Path d="M17 8C8 10 5.9 16.17 3.82 21.32a.5.5 0 0 1-.94-.32A19.32 19.32 0 0 1 12 3c4 0 5 1.5 5 5z" />
    <Path d="M12.24 13.5A6.5 6.5 0 0 0 17 8c0-1.42-.34-2.73-.93-3.87a8.5 8.5 0 0 1-6.84 12.37A6.5 6.5 0 0 0 12.24 13.5z" />
  </Svg>
);

export const WalkIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', style }) => (
  <Svg height={size} width={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M12.5 4a2 2 0 1 0-5 0 2 2 0 0 0 5 0z" />
    <Path d="M17.5 21 15 14l-2.5 3.5-3-3.5-2 5" />
    <Path d="M10 13l-1.5-1.5" />
  </Svg>
);

export const BikeIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', style }) => (
  <Svg height={size} width={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="5.5" cy="17.5" r="3.5" />
    <Circle cx="18.5" cy="17.5" r="3.5" />
    <Path d="M15 17.5h-5.5l1.5-4 2-2 3 4h2" />
    <Path d="m 5.5,14 l 1.5,-4 h 3.5" />
  </Svg>
);

export const BusIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', style }) => (
  <Svg height={size} width={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Rect x="3" y="11" width="18" height="10" rx="2" ry="2"></Rect>
    <Line x1="8" y1="21" x2="8" y2="11"></Line>
    <Line x1="16" y1="21" x2="16" y2="11"></Line>
    <Path d="M3 11V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5"></Path>
    <Line x1="3" y1="11" x2="21" y2="11"></Line>
    <Path d="M12 4h-2"></Path>
  </Svg>
);

export const CarIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', style }) => (
  <Svg height={size} width={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L2.2 12c-.3.4-.4.8-.4 1.3V17c0 .6.4 1 1 1h2" />
    <Circle cx="7" cy="17" r="2" />
    <Circle cx="17" cy="17" r="2" />
    <Path d="M9 17h6" />
    <Path d="M22 12H2" />
  </Svg>
);

export const MultiModalIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', style }) => (
  <Svg height={size} width={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="m18 19-3-3 3-3" />
    <Path d="m18 13-3-3 3-3" />
    <Path d="m6 5 3 3-3 3" />
    <Path d="m6 11 3 3-3 3" />
    <Line x1="3" x2="21" y1="12" y2="12" />
  </Svg>
);

export const ShareIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', style }) => (
  <Svg height={size} width={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="18" cy="5" r="3" />
    <Circle cx="6" cy="12" r="3" />
    <Circle cx="18" cy="19" r="3" />
    <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </Svg>
);

export const LocationIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', style }) => (
  <Svg height={size} width={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="12" cy="12" r="3" />
    <Path d="M12 21.32a9.14 9.14 0 0 0 9-9.14A9.14 9.14 0 0 0 12 3a9.14 9.14 0 0 0-9 9.18c0 4.56 3.22 8.44 7.5 9.11" />
  </Svg>
);
