export type AqiCategory = 'Good' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';

export interface PollutantDetail {
  code: 'pm2_5' | 'pm10' | 'ozone' | 'nitrogen_dioxide' | 'carbon_monoxide' | 'sulphur_dioxide';
  name: string;
  chemicalFormula: string;
  value: number;
  unit: string;
  status: 'Good' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  description: string;
}

export interface AirQualityData {
  aqi: number; // US AQI scale 0-500
  europeanAqi: number; // 0-100+
  category: AqiCategory;
  categoryColor: string;
  explanation: string;
  healthRecommendations: {
    general: string;
    sensitive: string;
    outdoors: string;
    ventilation: string;
  };
  pollutants: {
    pm2_5: number;
    pm10: number;
    ozone: number;
    nitrogen_dioxide: number;
    carbon_monoxide: number;
    sulphur_dioxide: number;
  };
  pollutantBreakdown: PollutantDetail[];
  hourlyAqi: {
    time: string;
    formattedTime: string;
    aqi: number;
  }[];
  lastUpdated: string;
}
