export type AlertSeverity = 'advisory' | 'warning' | 'critical';

export interface WeatherAlert {
  id: string;
  title: string;
  severity: AlertSeverity;
  type: 'rain' | 'storm' | 'wind' | 'heat' | 'cold' | 'air_quality';
  description: string;
  duration: string;
  precautions: string[];
  effectiveTime: string;
}
