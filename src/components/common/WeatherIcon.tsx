import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Wind,
} from 'lucide-react-native';

interface WeatherIconProps {
  name: 'sun' | 'moon' | 'cloud' | 'cloud-sun' | 'cloud-moon' | 'cloud-rain' | 'cloud-drizzle' | 'cloud-lightning' | 'cloud-snow' | 'cloud-fog' | 'wind' | string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  name,
  size = 24,
  color = '#202321',
  strokeWidth = 1.75,
}) => {
  switch (name) {
    case 'sun':
      return <Sun size={size} color={color} strokeWidth={strokeWidth} />;
    case 'moon':
      return <Moon size={size} color={color} strokeWidth={strokeWidth} />;
    case 'cloud':
      return <Cloud size={size} color={color} strokeWidth={strokeWidth} />;
    case 'cloud-sun':
      return <CloudSun size={size} color={color} strokeWidth={strokeWidth} />;
    case 'cloud-moon':
      return <CloudMoon size={size} color={color} strokeWidth={strokeWidth} />;
    case 'cloud-rain':
      return <CloudRain size={size} color={color} strokeWidth={strokeWidth} />;
    case 'cloud-drizzle':
      return <CloudDrizzle size={size} color={color} strokeWidth={strokeWidth} />;
    case 'cloud-lightning':
      return <CloudLightning size={size} color={color} strokeWidth={strokeWidth} />;
    case 'cloud-snow':
      return <CloudSnow size={size} color={color} strokeWidth={strokeWidth} />;
    case 'cloud-fog':
      return <CloudFog size={size} color={color} strokeWidth={strokeWidth} />;
    case 'wind':
      return <Wind size={size} color={color} strokeWidth={strokeWidth} />;
    default:
      return <Sun size={size} color={color} strokeWidth={strokeWidth} />;
  }
};
