import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { LocationData } from '../types/location';

export interface LocationPermissionState {
  granted: boolean;
  canAskAgain: boolean;
}

export async function checkLocationPermission(): Promise<LocationPermissionState> {
  try {
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
    return {
      granted: status === Location.PermissionStatus.GRANTED,
      canAskAgain,
    };
  } catch (error) {
    return { granted: false, canAskAgain: true };
  }
}

export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === Location.PermissionStatus.GRANTED;
  } catch (error) {
    console.warn('Location permission request failed:', error);
    return false;
  }
}

export async function getCurrentDeviceLocation(): Promise<LocationData | null> {
  try {
    // Check permission first
    const hasPerm = await requestLocationPermission();
    if (!hasPerm) return null;

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const latitude = loc.coords.latitude;
    const longitude = loc.coords.longitude;

    let cityName = 'Current Location';
    let country = '';
    let admin1: string | undefined = undefined;

    try {
      const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (reverse && reverse.length > 0) {
        const place = reverse[0];
        cityName = place.city || place.subregion || place.name || 'Current Location';
        country = place.country || '';
        admin1 = place.region || place.district || undefined;
      }
    } catch {
      // If native reverseGeocode fails (e.g. on web emulator)
      cityName = `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`;
    }

    return {
      id: 'current-gps',
      name: cityName,
      admin1,
      country,
      latitude,
      longitude,
      isCurrentLocation: true,
    };
  } catch (error) {
    console.warn('Failed to get current GPS location:', error);
    return null;
  }
}
