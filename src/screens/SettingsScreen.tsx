import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Bell, BellRing, Sparkles, Check, Database } from 'lucide-react-native';
import { WeatherData } from '../types/weather';
import { AirQualityData } from '../types/airQuality';
import { LocationData } from '../types/location';
import { AppSettings, TemperatureUnit, WindSpeedUnit, PressureUnit, ThemePreference } from '../types/settings';
import { ColorTheme } from '../constants/theme';
import { WidgetSimulator } from '../components/widgets/WidgetSimulator';
import { Divider } from '../components/common/Divider';
import { triggerTestNotification } from '../services/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsScreenProps {
  location: LocationData;
  weather: WeatherData;
  airQuality: AirQualityData | null;
  settings: AppSettings;
  theme: ColorTheme;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  location,
  weather,
  airQuality,
  settings,
  theme,
  onUpdateSettings,
}) => {
  const [testSent, setTestSent] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value };
    onUpdateSettings(updated);
  };

  const updateNotificationSetting = <K extends keyof AppSettings['notifications']>(
    key: K,
    value: AppSettings['notifications'][K]
  ) => {
    const updated = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    };
    onUpdateSettings(updated);
  };

  const handleTestNotification = async () => {
    const success = await triggerTestNotification();
    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } else {
      Alert.alert(
        'Permission Required',
        'Notification permissions are currently disabled. Please enable notification permissions in your device settings.'
      );
    }
  };

  const handleClearCache = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((k) => k.startsWith('@weather_companion_cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 2500);
    } catch (err) {
      console.warn('Clear cache failed:', err);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerArea}>
        <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Preferences & Widgets</Text>
        <Text style={[styles.screenSubtitle, { color: theme.textSecondary }]}>
          Measurement units, notifications, and Android home-screen widgets
        </Text>
      </View>

      {/* Units Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>MEASUREMENT UNITS</Text>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Temperature */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Temperature</Text>
            <View style={[styles.segmentGroup, { backgroundColor: theme.surfaceSubtle }]}>
              {(['celsius', 'fahrenheit'] as TemperatureUnit[]).map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[
                    styles.segmentBtn,
                    settings.temperatureUnit === u && [styles.segmentActive, { backgroundColor: theme.surface }],
                  ]}
                  onPress={() => updateSetting('temperatureUnit', u)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      {
                        color: settings.temperatureUnit === u ? theme.accent : theme.textSecondary,
                        fontWeight: settings.temperatureUnit === u ? '600' : '400',
                      },
                    ]}
                  >
                    {u === 'celsius' ? '°C Celsius' : '°F Fahrenheit'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Divider theme={theme} marginVertical={10} />

          {/* Wind Speed */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Wind Speed</Text>
            <View style={[styles.segmentGroup, { backgroundColor: theme.surfaceSubtle }]}>
              {(['kmh', 'mph'] as WindSpeedUnit[]).map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[
                    styles.segmentBtn,
                    settings.windSpeedUnit === u && [styles.segmentActive, { backgroundColor: theme.surface }],
                  ]}
                  onPress={() => updateSetting('windSpeedUnit', u)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      {
                        color: settings.windSpeedUnit === u ? theme.accent : theme.textSecondary,
                        fontWeight: settings.windSpeedUnit === u ? '600' : '400',
                      },
                    ]}
                  >
                    {u.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Divider theme={theme} marginVertical={10} />

          {/* Pressure */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Atmospheric Pressure</Text>
            <View style={[styles.segmentGroup, { backgroundColor: theme.surfaceSubtle }]}>
              {(['hPa', 'inHg'] as PressureUnit[]).map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[
                    styles.segmentBtn,
                    settings.pressureUnit === u && [styles.segmentActive, { backgroundColor: theme.surface }],
                  ]}
                  onPress={() => updateSetting('pressureUnit', u)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      {
                        color: settings.pressureUnit === u ? theme.accent : theme.textSecondary,
                        fontWeight: settings.pressureUnit === u ? '600' : '400',
                      },
                    ]}
                  >
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Theme Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>APPEARANCE</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.segmentGroupFull, { backgroundColor: theme.surfaceSubtle }]}>
            {(['system', 'light', 'dark'] as ThemePreference[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.segmentBtnFull,
                  settings.theme === t && [styles.segmentActive, { backgroundColor: theme.surface }],
                ]}
                onPress={() => updateSetting('theme', t)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    {
                      color: settings.theme === t ? theme.accent : theme.textSecondary,
                      fontWeight: settings.theme === t ? '600' : '400',
                    },
                  ]}
                >
                  {t === 'system' ? 'System Match' : t === 'light' ? 'Warm Off-White' : 'Deep Charcoal'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Severe Weather Alerts Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
            SEVERE WEATHER NOTIFICATIONS
          </Text>
          <TouchableOpacity
            style={[styles.testBtn, { backgroundColor: testSent ? theme.accent : theme.surface, borderColor: theme.border }]}
            onPress={handleTestNotification}
          >
            {testSent ? (
              <Check size={13} color="#FFF" strokeWidth={2.5} />
            ) : (
              <BellRing size={13} color={theme.accent} strokeWidth={2} />
            )}
            <Text
              style={[
                styles.testBtnText,
                { color: testSent ? '#FFF' : theme.accent },
              ]}
            >
              {testSent ? 'Sent!' : 'Test Alert'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextContainer}>
              <Text style={[styles.toggleTitle, { color: theme.textPrimary }]}>Enable Notifications</Text>
              <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>Master push switch for severe weather & AQI alerts</Text>
            </View>
            <Switch
              value={settings.notifications.enabled}
              onValueChange={(val) => updateNotificationSetting('enabled', val)}
              trackColor={{ false: theme.border, true: theme.accent }}
            />
          </View>

          {settings.notifications.enabled && (
            <>
              <Divider theme={theme} marginVertical={8} />

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextContainer}>
                  <Text style={[styles.toggleTitle, { color: theme.textPrimary }]}>Heavy Rainfall</Text>
                  <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>Flooding risk and roadway visibility warnings</Text>
                </View>
                <Switch
                  value={settings.notifications.heavyRain}
                  onValueChange={(val) => updateNotificationSetting('heavyRain', val)}
                  trackColor={{ false: theme.border, true: theme.accent }}
                />
              </View>

              <Divider theme={theme} marginVertical={8} />

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextContainer}>
                  <Text style={[styles.toggleTitle, { color: theme.textPrimary }]}>Thunderstorms & Lightning</Text>
                  <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>Electrical storms and hail events</Text>
                </View>
                <Switch
                  value={settings.notifications.thunderstorms}
                  onValueChange={(val) => updateNotificationSetting('thunderstorms', val)}
                  trackColor={{ false: theme.border, true: theme.accent }}
                />
              </View>

              <Divider theme={theme} marginVertical={8} />

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextContainer}>
                  <Text style={[styles.toggleTitle, { color: theme.textPrimary }]}>Strong Winds</Text>
                  <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>Gale force winds exceeding 45 km/h</Text>
                </View>
                <Switch
                  value={settings.notifications.strongWinds}
                  onValueChange={(val) => updateNotificationSetting('strongWinds', val)}
                  trackColor={{ false: theme.border, true: theme.accent }}
                />
              </View>

              <Divider theme={theme} marginVertical={8} />

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextContainer}>
                  <Text style={[styles.toggleTitle, { color: theme.textPrimary }]}>Extreme Heat & Heatwaves</Text>
                  <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>High heat advisories above 35°C</Text>
                </View>
                <Switch
                  value={settings.notifications.heatwaves}
                  onValueChange={(val) => updateNotificationSetting('heatwaves', val)}
                  trackColor={{ false: theme.border, true: theme.accent }}
                />
              </View>

              <Divider theme={theme} marginVertical={8} />

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextContainer}>
                  <Text style={[styles.toggleTitle, { color: theme.textPrimary }]}>Poor & Severe Air Quality</Text>
                  <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>Advisories when AQI reaches unhealthy levels (150+)</Text>
                </View>
                <Switch
                  value={settings.notifications.poorAirQuality}
                  onValueChange={(val) => updateNotificationSetting('poorAirQuality', val)}
                  trackColor={{ false: theme.border, true: theme.accent }}
                />
              </View>
            </>
          )}
        </View>
      </View>

      {/* Android Native Home-Screen Widgets Section */}
      <WidgetSimulator
        location={location}
        weather={weather}
        airQuality={airQuality}
        settings={settings}
        theme={theme}
      />

      {/* Local Storage & Cache Maintenance */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>STORAGE & CACHE</Text>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Offline Weather Cache</Text>
              <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>
                Locally stored forecast payloads for offline availability
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.clearBtn, { borderColor: theme.border, backgroundColor: theme.surfaceSubtle }]}
              onPress={handleClearCache}
            >
              {cacheCleared ? (
                <Check size={14} color={theme.accent} strokeWidth={2.5} />
              ) : (
                <Database size={14} color={theme.textPrimary} strokeWidth={1.8} />
              )}
              <Text style={[styles.clearBtnText, { color: theme.textPrimary }]}>
                {cacheCleared ? 'Cleared' : 'Clear Cache'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  headerArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 6,
  },
  screenTitle: {
    fontSize: 22,
    fontFamily: 'System',
    fontWeight: '600',
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 12,
    fontFamily: 'System',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    fontFamily: 'System',
    marginBottom: 8,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '500',
  },
  segmentGroup: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
  },
  segmentGroupFull: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
  },
  segmentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  segmentBtnFull: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentActive: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  segmentText: {
    fontSize: 12,
    fontFamily: 'System',
  },
  testBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  testBtnText: {
    fontSize: 11,
    fontFamily: 'System',
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  toggleTitle: {
    fontSize: 13,
    fontFamily: 'System',
    fontWeight: '500',
  },
  toggleDesc: {
    fontSize: 11,
    fontFamily: 'System',
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    gap: 6,
  },
  clearBtnText: {
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '500',
  },
});
