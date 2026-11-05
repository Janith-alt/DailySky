import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { AlertCircle, RefreshCw } from 'lucide-react-native';

import { WeatherData } from './src/types/weather';
import { AirQualityData } from './src/types/airQuality';
import { LocationData } from './src/types/location';
import { AppSettings } from './src/types/settings';
import { WeatherAlert } from './src/types/alerts';
import { lightTheme, darkTheme, ColorTheme } from './src/constants/theme';

import { Header } from './src/components/common/Header';
import { TabBar, TabKey } from './src/components/common/TabBar';

import { HomeScreen } from './src/screens/HomeScreen';
import { AirQualityScreen } from './src/screens/AirQualityScreen';
import { WeatherDetailsScreen } from './src/screens/WeatherDetailsScreen';
import { LocationsScreen } from './src/screens/LocationsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

import { fetchWeatherData, fetchAirQualityData } from './src/services/api';
import {
  loadSettings,
  saveSettings,
  loadActiveLocation,
  saveActiveLocation,
  loadSavedLocations,
  saveSavedLocations,
  getCachedWeather,
  setCachedWeather,
  getCachedAirQuality,
  setCachedAirQuality,
  DEFAULT_LOCATIONS,
  DEFAULT_SETTINGS,
} from './src/services/storageService';
import {
  setupNotificationChannels,
  evaluateSevereAlerts,
  sendLocalAlertNotification,
} from './src/services/notificationService';
import { getCurrentDeviceLocation } from './src/services/locationService';
import { syncWidgetsData } from './src/services/widgetService';

export default function App() {
  const systemScheme = useColorScheme();

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [activeLocation, setActiveLocation] = useState<LocationData>(DEFAULT_LOCATIONS[0]);
  const [savedLocations, setSavedLocations] = useState<LocationData[]>(DEFAULT_LOCATIONS);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compute active theme
  const isDark =
    settings.theme === 'dark' || (settings.theme === 'system' && systemScheme === 'dark');
  const theme: ColorTheme = isDark ? darkTheme : lightTheme;

  // Initialize storage & notifications on mount
  useEffect(() => {
    async function init() {
      await setupNotificationChannels();
      const storedSettings = await loadSettings();
      setSettings(storedSettings);

      const storedSaved = await loadSavedLocations();
      setSavedLocations(storedSaved);

      const storedActive = await loadActiveLocation();
      setActiveLocation(storedActive);
    }
    init();
  }, []);

  // Fetch weather and air quality for active location
  const loadDataForLocation = useCallback(
    async (loc: LocationData, refresh = false) => {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorMessage(null);

      const locKey = `${loc.latitude.toFixed(2)}_${loc.longitude.toFixed(2)}`;

      try {
        // Parallel fetch real-time weather & real-time air quality
        const [weatherRes, aqiRes] = await Promise.all([
          fetchWeatherData(loc.latitude, loc.longitude),
          fetchAirQualityData(loc.latitude, loc.longitude).catch((err) => {
            console.warn('AQI fetch warning:', err);
            return null;
          }),
        ]);

        setWeather(weatherRes);
        setAirQuality(aqiRes);
        setIsOffline(false);

        // Update local cache
        await setCachedWeather(locKey, weatherRes);
        if (aqiRes) {
          await setCachedAirQuality(locKey, aqiRes);
        }

        // Evaluate severe alerts & push notifications
        const triggeredAlerts = evaluateSevereAlerts(weatherRes, aqiRes, settings.notifications);
        setAlerts(triggeredAlerts);

        if (triggeredAlerts.length > 0) {
          const critical = triggeredAlerts.find((a) => a.severity === 'critical') || triggeredAlerts[0];
          sendLocalAlertNotification(critical);
        }

        // Sync Android widget storage payload
        await syncWidgetsData(loc, weatherRes, aqiRes, settings);
      } catch (error: any) {
        console.warn('Network fetch error, falling back to cache:', error);
        // Fallback to cache
        const cachedW = await getCachedWeather(locKey);
        const cachedA = await getCachedAirQuality(locKey);

        if (cachedW) {
          setWeather(cachedW);
          setAirQuality(cachedA);
          setIsOffline(true);
          const triggeredAlerts = evaluateSevereAlerts(cachedW, cachedA, settings.notifications);
          setAlerts(triggeredAlerts);
        } else {
          setErrorMessage(
            error.message || 'Unable to connect to weather service. Please verify network connection.'
          );
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [settings]
  );

  useEffect(() => {
    if (activeLocation) {
      loadDataForLocation(activeLocation);
    }
  }, [activeLocation, loadDataForLocation]);

  const handleRefresh = () => {
    if (activeLocation) {
      loadDataForLocation(activeLocation, true);
    }
  };

  const handleDetectGps = async () => {
    setIsRefreshing(true);
    const gpsLoc = await getCurrentDeviceLocation();
    setIsRefreshing(false);

    if (gpsLoc) {
      setActiveLocation(gpsLoc);
      await saveActiveLocation(gpsLoc);

      // Add to saved locations if not already present
      const exists = savedLocations.some((s) => s.id === gpsLoc.id);
      if (!exists) {
        const next = [gpsLoc, ...savedLocations];
        setSavedLocations(next);
        await saveSavedLocations(next);
      }
    } else {
      Alert.alert(
        'Location Access Required',
        'Unable to detect GPS position. Please ensure location services are enabled on your device.'
      );
    }
  };

  const handleSelectLocation = async (loc: LocationData) => {
    setActiveLocation(loc);
    await saveActiveLocation(loc);
    setActiveTab('overview');
  };

  const handleAddLocation = async (loc: LocationData) => {
    const exists = savedLocations.some((s) => s.id === loc.id || (s.latitude === loc.latitude && s.longitude === loc.longitude));
    if (!exists) {
      const next = [...savedLocations, loc];
      setSavedLocations(next);
      await saveSavedLocations(next);
    }
  };

  const handleRemoveLocation = async (id: string) => {
    const next = savedLocations.filter((s) => s.id !== id);
    setSavedLocations(next);
    await saveSavedLocations(next);
    if (activeLocation.id === id && next.length > 0) {
      setActiveLocation(next[0]);
      await saveActiveLocation(next[0]);
    }
  };

  const handleUpdateSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    await saveSettings(newSettings);
    if (weather && activeLocation) {
      syncWidgetsData(activeLocation, weather, airQuality, newSettings);
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]}>
      <ExpoStatusBar style={isDark ? 'light' : 'dark'} />

      {/* Editorial Header */}
      <Header
        location={activeLocation}
        theme={theme}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onOpenLocations={() => setActiveTab('locations')}
        onOpenSettings={() => setActiveTab('settings')}
        onDetectLocation={handleDetectGps}
      />

      {/* Main View Area */}
      <View style={styles.contentArea}>
        {isLoading && !weather ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.accent} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Connecting to real-time meteorological feed...
            </Text>
          </View>
        ) : errorMessage && !weather ? (
          <View style={styles.errorContainer}>
            <AlertCircle size={36} color={theme.warning} strokeWidth={1.8} />
            <Text style={[styles.errorTitle, { color: theme.textPrimary }]}>Service Unreachable</Text>
            <Text style={[styles.errorSubtitle, { color: theme.textSecondary }]}>{errorMessage}</Text>
            <TouchableOpacity
              style={[styles.retryBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => loadDataForLocation(activeLocation)}
            >
              <RefreshCw size={14} color={theme.accent} strokeWidth={2} />
              <Text style={[styles.retryText, { color: theme.accent }]}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        ) : (
          weather && (
            <>
              {activeTab === 'overview' && (
                <HomeScreen
                  location={activeLocation}
                  weather={weather}
                  airQuality={airQuality}
                  alerts={alerts}
                  settings={settings}
                  theme={theme}
                  isRefreshing={isRefreshing}
                  isOffline={isOffline}
                  onRefresh={handleRefresh}
                  onNavigateAirQuality={() => setActiveTab('air_quality')}
                />
              )}

              {activeTab === 'air_quality' && (
                <AirQualityScreen
                  location={activeLocation}
                  airQuality={airQuality}
                  theme={theme}
                  isRefreshing={isRefreshing}
                  onRefresh={handleRefresh}
                />
              )}

              {activeTab === 'atmosphere' && (
                <WeatherDetailsScreen
                  location={activeLocation}
                  weather={weather}
                  settings={settings}
                  theme={theme}
                  isRefreshing={isRefreshing}
                  onRefresh={handleRefresh}
                />
              )}

              {activeTab === 'locations' && (
                <LocationsScreen
                  activeLocation={activeLocation}
                  savedLocations={savedLocations}
                  theme={theme}
                  onSelectLocation={handleSelectLocation}
                  onAddLocation={handleAddLocation}
                  onRemoveLocation={handleRemoveLocation}
                  onDetectGpsLocation={handleDetectGps}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsScreen
                  location={activeLocation}
                  weather={weather}
                  airQuality={airQuality}
                  settings={settings}
                  theme={theme}
                  onUpdateSettings={handleUpdateSettings}
                />
              )}
            </>
          )
        )}
      </View>

      {/* Editorial Navigation Tab Bar */}
      <TabBar activeTab={activeTab} onSelectTab={setActiveTab} theme={theme} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: 'System',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
  },
  errorTitle: {
    fontSize: 17,
    fontFamily: 'System',
    fontWeight: '600',
    marginTop: 4,
  },
  errorSubtitle: {
    fontSize: 13,
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: 18,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    marginTop: 8,
  },
  retryText: {
    fontSize: 13,
    fontFamily: 'System',
    fontWeight: '600',
  },
});
