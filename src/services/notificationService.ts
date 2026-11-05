import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { WeatherData } from '../types/weather';
import { AirQualityData } from '../types/airQuality';
import { NotificationSettings } from '../types/settings';
import { WeatherAlert } from '../types/alerts';

// Configure notification presentation handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('weather_alerts', {
      name: 'Severe Weather & Air Quality',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#68866B',
      enableLights: true,
      enableVibrate: true,
      description: 'Timely advisories for severe weather events and hazardous air quality.',
    });
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (error) {
    console.warn('Error requesting notification permissions:', error);
    return false;
  }
}

export function evaluateSevereAlerts(
  weather: WeatherData,
  airQuality: AirQualityData | null,
  settings: NotificationSettings
): WeatherAlert[] {
  if (!settings.enabled) return [];

  const alerts: WeatherAlert[] = [];
  const current = weather.current;
  const todayDaily = weather.daily[0];

  // 1. Thunderstorms
  if (settings.thunderstorms) {
    if ([95, 96, 99].includes(current.weatherCode)) {
      alerts.push({
        id: 'storm-' + current.time,
        title: 'Active Thunderstorm Advisory',
        severity: 'critical',
        type: 'storm',
        description: 'Electrical thunderstorm activity detected in your immediate area.',
        duration: 'Expected for the next 2–3 hours',
        precautions: [
          'Seek shelter indoors immediately.',
          'Unplug sensitive electronics and stay away from metal fences.',
          'Avoid open fields, elevated areas, and bodies of water.',
        ],
        effectiveTime: current.time,
      });
    }
  }

  // 2. Heavy Rainfall
  if (settings.heavyRain) {
    const isHeavyCode = [65, 82].includes(current.weatherCode);
    const highRainProb = (todayDaily?.precipitationProbabilityMax ?? 0) >= 80;
    const isRainingHeavy = current.precipitation >= 6;

    if (isHeavyCode || (highRainProb && isRainingHeavy)) {
      alerts.push({
        id: 'rain-' + current.time,
        title: 'Heavy Rainfall Warning',
        severity: 'warning',
        type: 'rain',
        description: 'Persistent heavy downpours with reduced roadway visibility and localized pooling.',
        duration: 'Active over next 3–6 hours',
        precautions: [
          'Allow extra stopping distance when commuting.',
          'Avoid walking or driving through water-covered intersections.',
          'Check local drainage grates near residential basements.',
        ],
        effectiveTime: current.time,
      });
    }
  }

  // 3. Strong Winds
  if (settings.strongWinds && current.windSpeed >= 45) {
    alerts.push({
      id: 'wind-' + current.time,
      title: 'High Wind Warning',
      severity: current.windSpeed >= 65 ? 'critical' : 'warning',
      type: 'wind',
      description: `Sustained winds exceeding ${Math.round(current.windSpeed)} km/h with higher localized gusts.`,
      duration: 'Ongoing throughout afternoon',
      precautions: [
        'Secure light outdoor furniture and balcony planters.',
        'Exercise caution near tall trees and power line corridors.',
        'High-profile vehicles should reduce highway travel speeds.',
      ],
      effectiveTime: current.time,
    });
  }

  // 4. Heatwaves
  if (settings.heatwaves && (current.temperature >= 35 || (todayDaily && todayDaily.temperatureMax >= 37))) {
    alerts.push({
      id: 'heat-' + current.time,
      title: 'Excessive Heat Advisory',
      severity: current.temperature >= 38 ? 'critical' : 'warning',
      type: 'heat',
      description: `High heat conditions with peak temperature approaching ${Math.round(todayDaily?.temperatureMax || current.temperature)}°C.`,
      duration: 'Peak hours: 11:00 AM – 5:00 PM',
      precautions: [
        'Drink fluids consistently throughout the day.',
        'Reschedule rigorous physical activity to early morning or evening.',
        'Never leave vulnerable family members or pets inside parked cars.',
      ],
      effectiveTime: current.time,
    });
  }

  // 5. Extreme Cold
  if (settings.extremeCold && (current.temperature <= -8 || (todayDaily && todayDaily.temperatureMin <= -10))) {
    alerts.push({
      id: 'cold-' + current.time,
      title: 'Sub-Zero Cold Advisory',
      severity: 'warning',
      type: 'cold',
      description: `Temperatures dipping down to ${Math.round(todayDaily?.temperatureMin || current.temperature)}°C with severe frost hazard.`,
      duration: 'Overnight through early morning',
      precautions: [
        'Dress in multiple insulated windproof layers.',
        'Protect exposed skin against windchill frostbite.',
        'Check insulation on external water lines.',
      ],
      effectiveTime: current.time,
    });
  }

  // 6. Air Quality Alert
  if (settings.poorAirQuality && airQuality && airQuality.aqi >= 151) {
    alerts.push({
      id: 'aqi-' + airQuality.lastUpdated,
      title: airQuality.aqi >= 201 ? 'Severe Air Quality Alert' : 'Unhealthy Air Quality Advisory',
      severity: airQuality.aqi >= 201 ? 'critical' : 'warning',
      type: 'air_quality',
      description: `Current AQI reading is ${airQuality.aqi} (${airQuality.category}). Elevated particulate density detected.`,
      duration: 'Until atmospheric dispersal improves',
      precautions: [
        airQuality.healthRecommendations.sensitive,
        airQuality.healthRecommendations.outdoors,
        airQuality.healthRecommendations.ventilation,
      ],
      effectiveTime: airQuality.lastUpdated,
    });
  }

  return alerts;
}

export async function sendLocalAlertNotification(alert: WeatherAlert): Promise<void> {
  try {
    const hasPerm = await requestNotificationPermissions();
    if (!hasPerm) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: alert.title,
        body: `${alert.description} ${alert.duration}. Tap to view precautions.`,
        sound: true,
        priority: alert.severity === 'critical' ? Notifications.AndroidNotificationPriority.MAX : Notifications.AndroidNotificationPriority.HIGH,
        data: { alertId: alert.id, type: alert.type },
      },
      trigger: null, // trigger immediately
    });
  } catch (error) {
    console.warn('Could not dispatch local notification:', error);
  }
}

export async function triggerTestNotification(): Promise<boolean> {
  try {
    const hasPerm = await requestNotificationPermissions();
    if (!hasPerm) return false;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Weather & Air Quality Companion',
        body: 'Alerts are configured! You will receive timely advisories for severe weather and poor air quality.',
        sound: true,
      },
      trigger: null,
    });
    return true;
  } catch (error) {
    console.warn('Test notification failed:', error);
    return false;
  }
}
