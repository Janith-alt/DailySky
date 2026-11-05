import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types/settings';
import { LocationData } from '../types/location';
import { WeatherData } from '../types/weather';
import { AirQualityData } from '../types/airQuality';

const SETTINGS_KEY = '@weather_companion_settings';
const ACTIVE_LOCATION_KEY = '@weather_companion_active_location';
const SAVED_LOCATIONS_KEY = '@weather_companion_saved_locations';
const CACHE_PREFIX_WEATHER = '@weather_companion_cache_w_';
const CACHE_PREFIX_AQI = '@weather_companion_cache_aqi_';

export const DEFAULT_SETTINGS: AppSettings = {
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kmh',
  pressureUnit: 'hPa',
  theme: 'system',
  notifications: {
    enabled: true,
    heavyRain: true,
    thunderstorms: true,
    strongWinds: true,
    heatwaves: true,
    extremeCold: true,
    poorAirQuality: true,
  },
};

export const DEFAULT_LOCATIONS: LocationData[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    admin1: 'Tokyo Prefecture',
    country: 'Japan',
    countryCode: 'JP',
    latitude: 35.6895,
    longitude: 139.6917,
    timezone: 'Asia/Tokyo',
  },
  {
    id: 'london',
    name: 'London',
    admin1: 'England',
    country: 'United Kingdom',
    countryCode: 'GB',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
  },
  {
    id: 'new_york',
    name: 'New York',
    admin1: 'New York',
    country: 'United States',
    countryCode: 'US',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
  },
];

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export async function loadActiveLocation(): Promise<LocationData> {
  try {
    const raw = await AsyncStorage.getItem(ACTIVE_LOCATION_KEY);
    if (raw) return JSON.parse(raw);
    return DEFAULT_LOCATIONS[0];
  } catch {
    return DEFAULT_LOCATIONS[0];
  }
}

export async function saveActiveLocation(location: LocationData): Promise<void> {
  try {
    await AsyncStorage.setItem(ACTIVE_LOCATION_KEY, JSON.stringify(location));
  } catch (error) {
    console.error('Failed to save active location:', error);
  }
}

export async function loadSavedLocations(): Promise<LocationData[]> {
  try {
    const raw = await AsyncStorage.getItem(SAVED_LOCATIONS_KEY);
    if (!raw) return DEFAULT_LOCATIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_LOCATIONS;
  } catch {
    return DEFAULT_LOCATIONS;
  }
}

export async function saveSavedLocations(locations: LocationData[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(locations));
  } catch (error) {
    console.error('Failed to save locations:', error);
  }
}

export async function getCachedWeather(locKey: string): Promise<WeatherData | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_PREFIX_WEATHER + locKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function setCachedWeather(locKey: string, data: WeatherData): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_PREFIX_WEATHER + locKey, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to cache weather:', error);
  }
}

export async function getCachedAirQuality(locKey: string): Promise<AirQualityData | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_PREFIX_AQI + locKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function setCachedAirQuality(locKey: string, data: AirQualityData): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_PREFIX_AQI + locKey, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to cache AQI:', error);
  }
}
