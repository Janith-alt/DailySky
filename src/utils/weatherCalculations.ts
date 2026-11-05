import { TemperatureUnit, WindSpeedUnit, PressureUnit } from '../types/settings';

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    const f = Math.round((celsius * 9) / 5 + 32);
    return `${f}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function formatTemperatureValue(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatWindSpeed(kmh: number, unit: WindSpeedUnit): string {
  if (unit === 'mph') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatPressure(hPa: number, unit: PressureUnit): string {
  if (unit === 'inHg') {
    const inHg = (hPa * 0.02953).toFixed(2);
    return `${inHg} inHg`;
  }
  return `${Math.round(hPa)} hPa`;
}

export function getWindDirectionCardinal(degrees: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW',
  ];
  const normalized = (degrees % 360 + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return directions[index];
}

export function calculateDewPoint(celsius: number, relativeHumidity: number): number {
  const a = 17.27;
  const b = 237.7;
  const rh = Math.max(0.01, Math.min(100, relativeHumidity));
  const alpha = ((a * celsius) / (b + celsius)) + Math.log(rh / 100);
  const dewPoint = (b * alpha) / (a - alpha);
  return Math.round(dewPoint * 10) / 10;
}

export function getUvCategory(uvIndex: number): { label: string; severity: 'low' | 'moderate' | 'high' | 'very_high' | 'extreme' } {
  if (uvIndex < 3) return { label: 'Low', severity: 'low' };
  if (uvIndex < 6) return { label: 'Moderate', severity: 'moderate' };
  if (uvIndex < 8) return { label: 'High', severity: 'high' };
  if (uvIndex < 11) return { label: 'Very High', severity: 'very_high' };
  return { label: 'Extreme', severity: 'extreme' };
}
