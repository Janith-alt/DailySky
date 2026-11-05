import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData } from '../types/weather';
import { AirQualityData } from '../types/airQuality';
import { LocationData } from '../types/location';
import { AppSettings } from '../types/settings';
import { formatTemperature } from '../utils/weatherCalculations';
import { formatRelativeTime } from '../utils/dateFormatting';

export const WIDGET_DATA_STORAGE_KEY = '@android_weather_widgets_data';

export interface WidgetPayloadSmall {
  locationName: string;
  temperature: string;
  condition: string;
  weatherCode: number;
  isDay: boolean;
  updatedAt: string;
  deepLink: string;
}

export interface WidgetPayloadMedium {
  locationName: string;
  temperature: string;
  highLow: string;
  condition: string;
  weatherCode: number;
  isDay: boolean;
  aqiValue: number;
  aqiCategory: string;
  updatedAt: string;
  deepLink: string;
}

export interface WidgetPayloadLarge {
  locationName: string;
  temperature: string;
  feelsLike: string;
  condition: string;
  weatherCode: number;
  isDay: boolean;
  highLow: string;
  aqiValue: number;
  aqiCategory: string;
  hourly: {
    time: string;
    temp: string;
    weatherCode: number;
    rainProb: number;
  }[];
  updatedAt: string;
  deepLink: string;
}

export interface AllWidgetsPayload {
  small: WidgetPayloadSmall;
  medium: WidgetPayloadMedium;
  large: WidgetPayloadLarge;
  timestamp: string;
}

export async function syncWidgetsData(
  location: LocationData,
  weather: WeatherData,
  airQuality: AirQualityData | null,
  settings: AppSettings
): Promise<AllWidgetsPayload> {
  const current = weather.current;
  const today = weather.daily[0];

  const tempStr = formatTemperature(current.temperature, settings.temperatureUnit);
  const highStr = today ? formatTemperature(today.temperatureMax, settings.temperatureUnit) : '--';
  const lowStr = today ? formatTemperature(today.temperatureMin, settings.temperatureUnit) : '--';
  const feelsLikeStr = formatTemperature(current.apparentTemperature, settings.temperatureUnit);
  const highLowStr = `H: ${highStr}  L: ${lowStr}`;
  const updatedRelative = formatRelativeTime(weather.lastUpdated);

  const aqiVal = airQuality?.aqi ?? 42;
  const aqiCat = airQuality?.category ?? 'Good';

  // Extract next 5 hourly slots for large widget
  const hourlySubset = weather.hourly.slice(0, 5).map((h) => ({
    time: h.formattedTime,
    temp: formatTemperature(h.temperature, settings.temperatureUnit),
    weatherCode: h.weatherCode,
    rainProb: h.precipitationProbability,
  }));

  const payload: AllWidgetsPayload = {
    small: {
      locationName: location.name,
      temperature: tempStr,
      condition: current.weatherCondition,
      weatherCode: current.weatherCode,
      isDay: current.isDay,
      updatedAt: updatedRelative,
      deepLink: 'weatherapp://home',
    },
    medium: {
      locationName: location.name,
      temperature: tempStr,
      highLow: highLowStr,
      condition: current.weatherCondition,
      weatherCode: current.weatherCode,
      isDay: current.isDay,
      aqiValue: aqiVal,
      aqiCategory: aqiCat,
      updatedAt: updatedRelative,
      deepLink: 'weatherapp://details',
    },
    large: {
      locationName: location.name,
      temperature: tempStr,
      feelsLike: `Feels like ${feelsLikeStr}`,
      condition: current.weatherCondition,
      weatherCode: current.weatherCode,
      isDay: current.isDay,
      highLow: highLowStr,
      aqiValue: aqiVal,
      aqiCategory: aqiCat,
      hourly: hourlySubset,
      updatedAt: updatedRelative,
      deepLink: 'weatherapp://home',
    },
    timestamp: new Date().toISOString(),
  };

  try {
    await AsyncStorage.setItem(WIDGET_DATA_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to sync widget storage payload:', err);
  }

  return payload;
}

export async function getStoredWidgetPayload(): Promise<AllWidgetsPayload | null> {
  try {
    const raw = await AsyncStorage.getItem(WIDGET_DATA_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
