import { AqiCategory } from '../types/airQuality';
import { ColorTheme } from './theme';

export interface AqiScaleLevel {
  category: AqiCategory;
  min: number;
  max: number;
  getColor: (theme: ColorTheme) => string;
  shortLabel: string;
  summary: string;
  recommendations: {
    general: string;
    sensitive: string;
    outdoors: string;
    ventilation: string;
  };
}

export const AQI_LEVELS: AqiScaleLevel[] = [
  {
    category: 'Good',
    min: 0,
    max: 50,
    getColor: (t) => t.aqiGood,
    shortLabel: 'Good',
    summary: 'Air quality is satisfactory and poses little or no risk.',
    recommendations: {
      general: 'Great conditions for outdoor activities.',
      sensitive: 'No special precautions needed.',
      outdoors: 'Ideal for walking, cycling, and exercising.',
      ventilation: 'Safe to open windows and air out indoor spaces.',
    },
  },
  {
    category: 'Moderate',
    min: 51,
    max: 100,
    getColor: (t) => t.aqiModerate,
    shortLabel: 'Moderate',
    summary: 'Air quality is acceptable for most people.',
    recommendations: {
      general: 'Generally acceptable air quality.',
      sensitive: 'Unusually sensitive individuals should consider reducing prolonged exertion.',
      outdoors: 'Safe for normal daily outdoor activities.',
      ventilation: 'Acceptable to ventilate homes and offices.',
    },
  },
  {
    category: 'Poor',
    min: 101,
    max: 150,
    getColor: (t) => t.aqiPoor,
    shortLabel: 'Poor',
    summary: 'Sensitive groups may experience health effects.',
    recommendations: {
      general: 'General public is less likely to be affected immediately.',
      sensitive: 'Sensitive individuals should reduce prolonged outdoor activity.',
      outdoors: 'Take breaks during strenuous outdoor activities.',
      ventilation: 'Keep windows closed during peak traffic hours.',
    },
  },
  {
    category: 'Very Poor',
    min: 151,
    max: 200,
    getColor: (t) => t.aqiVeryPoor,
    shortLabel: 'Very Poor',
    summary: 'Health effects may be felt by everyone.',
    recommendations: {
      general: 'Limit outdoor exposure, especially vigorous cardio exercise.',
      sensitive: 'Avoid prolonged outdoor exertion; keep rescue inhalers accessible.',
      outdoors: 'Relocate high-intensity workouts indoors.',
      ventilation: 'Keep windows and doors closed; run air purifiers if available.',
    },
  },
  {
    category: 'Severe',
    min: 201,
    max: 500,
    getColor: (t) => t.aqiSevere,
    shortLabel: 'Severe',
    summary: 'Emergency health warning. Everyone is significantly affected.',
    recommendations: {
      general: 'Avoid outdoor physical activity entirely.',
      sensitive: 'Remain indoors in clean rooms and limit physical exertion.',
      outdoors: 'Wear an N95/FFP2 mask if outdoors is unavoidable.',
      ventilation: 'Seal doors and windows; run HEPA filtration units.',
    },
  },
];

export function getAqiLevel(aqi: number): AqiScaleLevel {
  const rounded = Math.round(Math.max(0, aqi));
  if (rounded <= 50) return AQI_LEVELS[0];
  if (rounded <= 100) return AQI_LEVELS[1];
  if (rounded <= 150) return AQI_LEVELS[2];
  if (rounded <= 200) return AQI_LEVELS[3];
  return AQI_LEVELS[4];
}
