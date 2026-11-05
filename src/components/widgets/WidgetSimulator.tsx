import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Smartphone, Check, RefreshCw, Sun, Moon } from 'lucide-react-native';
import { WeatherData } from '../../types/weather';
import { AirQualityData } from '../../types/airQuality';
import { LocationData } from '../../types/location';
import { AppSettings } from '../../types/settings';
import { ColorTheme, lightTheme, darkTheme } from '../../constants/theme';
import { WeatherIcon } from '../common/WeatherIcon';
import { getWeatherInfo } from '../../constants/weatherCodes';
import { formatTemperature } from '../../utils/weatherCalculations';
import { formatRelativeTime } from '../../utils/dateFormatting';
import { syncWidgetsData } from '../../services/widgetService';

interface WidgetSimulatorProps {
  location: LocationData;
  weather: WeatherData;
  airQuality: AirQualityData | null;
  settings: AppSettings;
  theme: ColorTheme;
}

export const WidgetSimulator: React.FC<WidgetSimulatorProps> = ({
  location,
  weather,
  airQuality,
  settings,
  theme,
}) => {
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('small');
  const [widgetThemeMode, setWidgetThemeMode] = useState<'light' | 'dark'>('light');
  const [isSynced, setIsSynced] = useState(false);

  const previewTheme = widgetThemeMode === 'light' ? lightTheme : darkTheme;
  const current = weather.current;
  const today = weather.daily[0];
  const info = getWeatherInfo(current.weatherCode, current.isDay);

  const tempStr = formatTemperature(current.temperature, settings.temperatureUnit);
  const feelsLikeStr = formatTemperature(current.apparentTemperature, settings.temperatureUnit);
  const highStr = today ? formatTemperature(today.temperatureMax, settings.temperatureUnit) : '--';
  const lowStr = today ? formatTemperature(today.temperatureMin, settings.temperatureUnit) : '--';
  const aqiVal = airQuality?.aqi ?? 38;
  const aqiCat = airQuality?.category ?? 'Good';

  const handleSync = async () => {
    await syncWidgetsData(location, weather, airQuality, settings);
    setIsSynced(true);
    setTimeout(() => setIsSynced(false), 2500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            ANDROID HOME-SCREEN WIDGETS
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textTertiary }]}>
            Native Android Glance & RemoteViews preview
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.syncButton, { backgroundColor: isSynced ? theme.accent : theme.surfaceSubtle, borderColor: theme.border }]}
          onPress={handleSync}
          activeOpacity={0.7}
        >
          {isSynced ? (
            <Check size={14} color="#FFF" strokeWidth={2.5} />
          ) : (
            <RefreshCw size={14} color={theme.textPrimary} strokeWidth={2} />
          )}
          <Text
            style={[
              styles.syncButtonText,
              { color: isSynced ? '#FFF' : theme.textPrimary },
            ]}
          >
            {isSynced ? 'Synced' : 'Sync Widgets'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Size and Theme Switcher Row */}
      <View style={styles.controlRow}>
        <View style={[styles.sizeSelector, { backgroundColor: theme.surfaceSubtle }]}>
          {(['small', 'medium', 'large'] as const).map((sz) => (
            <TouchableOpacity
              key={sz}
              style={[
                styles.sizeTab,
                selectedSize === sz && [styles.sizeTabActive, { backgroundColor: theme.surface }],
              ]}
              onPress={() => setSelectedSize(sz)}
            >
              <Text
                style={[
                  styles.sizeTabText,
                  {
                    color: selectedSize === sz ? theme.accent : theme.textSecondary,
                    fontWeight: selectedSize === sz ? '600' : '400',
                  },
                ]}
              >
                {sz.charAt(0).toUpperCase() + sz.slice(1)} (
                {sz === 'small' ? '2×2' : sz === 'medium' ? '4×2' : '4×4'})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.themeToggle, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}
          onPress={() => setWidgetThemeMode(widgetThemeMode === 'light' ? 'dark' : 'light')}
        >
          {widgetThemeMode === 'light' ? (
            <Moon size={15} color={theme.textPrimary} strokeWidth={2} />
          ) : (
            <Sun size={15} color={theme.warning} strokeWidth={2} />
          )}
        </TouchableOpacity>
      </View>

      {/* Widget Display Preview Area */}
      <View style={[styles.previewArea, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
        {selectedSize === 'small' && (
          <View
            style={[
              styles.widgetSmallBox,
              {
                backgroundColor: previewTheme.background,
                borderColor: previewTheme.border,
              },
            ]}
          >
            <View style={styles.widgetHeader}>
              <Text style={[styles.widgetLocation, { color: previewTheme.textSecondary }]} numberOfLines={1}>
                {location.name}
              </Text>
              <WeatherIcon name={info.iconName} size={20} color={previewTheme.accent} strokeWidth={1.8} />
            </View>

            <Text style={[styles.widgetSmallTemp, { color: previewTheme.textPrimary }]}>{tempStr}</Text>
            <Text style={[styles.widgetCondition, { color: previewTheme.textPrimary }]} numberOfLines={1}>
              {current.weatherCondition}
            </Text>

            <View style={styles.widgetFooter}>
              <Text style={[styles.widgetUpdated, { color: previewTheme.textTertiary }]}>
                {formatRelativeTime(weather.lastUpdated)}
              </Text>
            </View>
          </View>
        )}

        {selectedSize === 'medium' && (
          <View
            style={[
              styles.widgetMediumBox,
              {
                backgroundColor: previewTheme.background,
                borderColor: previewTheme.border,
              },
            ]}
          >
            <View style={styles.widgetMedLeft}>
              <Text style={[styles.widgetLocation, { color: previewTheme.textSecondary }]} numberOfLines={1}>
                {location.name}
              </Text>
              <Text style={[styles.widgetMedTemp, { color: previewTheme.textPrimary }]}>{tempStr}</Text>
              <Text style={[styles.widgetHighLow, { color: previewTheme.textSecondary }]}>
                H: {highStr}  L: {lowStr}
              </Text>
            </View>

            <View style={[styles.widgetDivider, { backgroundColor: previewTheme.border }]} />

            <View style={styles.widgetMedRight}>
              <View style={styles.medConditionRow}>
                <WeatherIcon name={info.iconName} size={18} color={previewTheme.accent} strokeWidth={1.8} />
                <Text style={[styles.widgetCondition, { color: previewTheme.textPrimary }]} numberOfLines={1}>
                  {current.weatherCondition}
                </Text>
              </View>

              <View style={[styles.aqiPill, { backgroundColor: previewTheme.accentLight }]}>
                <Text style={[styles.aqiPillText, { color: previewTheme.accent }]}>
                  AQI {aqiVal} · {aqiCat}
                </Text>
              </View>

              <Text style={[styles.widgetUpdated, { color: previewTheme.textTertiary }]}>
                {formatRelativeTime(weather.lastUpdated)}
              </Text>
            </View>
          </View>
        )}

        {selectedSize === 'large' && (
          <View
            style={[
              styles.widgetLargeBox,
              {
                backgroundColor: previewTheme.background,
                borderColor: previewTheme.border,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.widgetLargeHeader}>
              <Text style={[styles.widgetLocationLarge, { color: previewTheme.textPrimary }]} numberOfLines={1}>
                {location.name}
              </Text>
              <Text style={[styles.widgetUpdated, { color: previewTheme.textTertiary }]}>
                {formatRelativeTime(weather.lastUpdated)}
              </Text>
            </View>

            {/* Current details row */}
            <View style={styles.widgetLargeMainRow}>
              <Text style={[styles.widgetLargeTemp, { color: previewTheme.textPrimary }]}>{tempStr}</Text>

              <View style={styles.widgetLargeDetails}>
                <View style={styles.medConditionRow}>
                  <WeatherIcon name={info.iconName} size={16} color={previewTheme.accent} strokeWidth={1.8} />
                  <Text style={[styles.widgetCondition, { color: previewTheme.textPrimary }]}>
                    {current.weatherCondition}
                  </Text>
                </View>
                <Text style={[styles.widgetFeels, { color: previewTheme.textSecondary }]}>
                  Feels like {feelsLikeStr}
                </Text>
                <Text style={[styles.widgetHighLow, { color: previewTheme.textSecondary }]}>
                  H: {highStr}  L: {lowStr}
                </Text>
              </View>

              <View style={[styles.aqiPillLarge, { backgroundColor: previewTheme.accentLight }]}>
                <Text style={[styles.aqiPillText, { color: previewTheme.accent }]}>
                  AQI {aqiVal} · {aqiCat}
                </Text>
              </View>
            </View>

            <View style={[styles.largeDivider, { backgroundColor: previewTheme.border }]} />

            {/* Hourly row */}
            <View style={styles.hourlyPreviewRow}>
              {weather.hourly.slice(0, 5).map((h, i) => (
                <View key={h.time + i} style={styles.hourlyPreviewItem}>
                  <Text style={[styles.hourlyTime, { color: previewTheme.textSecondary }]}>{h.formattedTime}</Text>
                  <Text style={[styles.hourlyTemp, { color: previewTheme.textPrimary }]}>
                    {formatTemperature(h.temperature, settings.temperatureUnit)}
                  </Text>
                  {h.precipitationProbability > 0 ? (
                    <Text style={[styles.hourlyRain, { color: previewTheme.accent }]}>
                      {h.precipitationProbability}%
                    </Text>
                  ) : (
                    <View style={{ height: 12 }} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Guide Note */}
      <View style={[styles.guideNote, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Smartphone size={16} color={theme.accent} strokeWidth={2} style={styles.phoneIcon} />
        <Text style={[styles.guideText, { color: theme.textSecondary }]}>
          Built using native Android AppWidgetProvider with periodic WorkManager background refresh. To install on your Android home screen: long-press wallpaper → Widgets → DailySky.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    fontFamily: 'System',
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: 'System',
    marginTop: 2,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  syncButtonText: {
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '600',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    gap: 10,
  },
  sizeSelector: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    padding: 3,
  },
  sizeTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  sizeTabActive: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  sizeTabText: {
    fontSize: 11,
    fontFamily: 'System',
  },
  themeToggle: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewArea: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  widgetSmallBox: {
    width: 156,
    height: 156,
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  widgetLocation: {
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '500',
    flex: 1,
    marginRight: 6,
  },
  widgetSmallTemp: {
    fontSize: 38,
    fontFamily: 'System',
    fontWeight: '300',
    letterSpacing: -1,
  },
  widgetCondition: {
    fontSize: 13,
    fontFamily: 'System',
    fontWeight: '500',
  },
  widgetFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  widgetUpdated: {
    fontSize: 10,
    fontFamily: 'System',
  },
  widgetMediumBox: {
    width: '100%',
    maxWidth: 320,
    height: 140,
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
  },
  widgetMedLeft: {
    flex: 1,
    justifyContent: 'space-between',
  },
  widgetMedTemp: {
    fontSize: 36,
    fontFamily: 'System',
    fontWeight: '300',
    letterSpacing: -1,
  },
  widgetHighLow: {
    fontSize: 11,
    fontFamily: 'System',
  },
  widgetDivider: {
    width: 1,
    marginHorizontal: 12,
  },
  widgetMedRight: {
    flex: 1.1,
    justifyContent: 'space-between',
  },
  medConditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aqiPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  aqiPillText: {
    fontSize: 11,
    fontFamily: 'System',
    fontWeight: '600',
  },
  widgetLargeBox: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  widgetLargeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  widgetLocationLarge: {
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '600',
  },
  widgetLargeMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  widgetLargeTemp: {
    fontSize: 40,
    fontFamily: 'System',
    fontWeight: '300',
    letterSpacing: -1,
  },
  widgetLargeDetails: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
  },
  widgetFeels: {
    fontSize: 11,
    fontFamily: 'System',
  },
  aqiPillLarge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  largeDivider: {
    height: 1,
    marginVertical: 12,
  },
  hourlyPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  hourlyPreviewItem: {
    alignItems: 'center',
  },
  hourlyTime: {
    fontSize: 10,
    fontFamily: 'System',
  },
  hourlyTemp: {
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '600',
    marginVertical: 2,
  },
  hourlyRain: {
    fontSize: 10,
    fontFamily: 'System',
    fontWeight: '500',
  },
  guideNote: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginTop: 12,
    alignItems: 'flex-start',
  },
  phoneIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  guideText: {
    fontSize: 12,
    fontFamily: 'System',
    flex: 1,
    lineHeight: 17,
  },
});
