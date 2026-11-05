import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { WeatherData } from '../types/weather';
import { AirQualityData } from '../types/airQuality';
import { LocationData } from '../types/location';
import { AppSettings } from '../types/settings';
import { WeatherAlert } from '../types/alerts';
import { ColorTheme } from '../constants/theme';
import { CurrentHero } from '../components/home/CurrentHero';
import { ActiveAlertsBanner } from '../components/home/ActiveAlertsBanner';
import { HourlyStrip } from '../components/home/HourlyStrip';
import { DailyList } from '../components/home/DailyList';
import { AqiPreviewCard } from '../components/home/AqiPreviewCard';
import { Divider } from '../components/common/Divider';

interface HomeScreenProps {
  location: LocationData;
  weather: WeatherData;
  airQuality: AirQualityData | null;
  alerts: WeatherAlert[];
  settings: AppSettings;
  theme: ColorTheme;
  isRefreshing: boolean;
  isOffline: boolean;
  onRefresh: () => void;
  onNavigateAirQuality: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  location,
  weather,
  airQuality,
  alerts,
  settings,
  theme,
  isRefreshing,
  isOffline,
  onRefresh,
  onNavigateAirQuality,
}) => {
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={theme.accent}
          colors={[theme.accent]}
        />
      }
    >
      {/* Offline Alert Strip */}
      {isOffline && (
        <View style={[styles.offlineBanner, { backgroundColor: theme.warningSurface, borderColor: theme.warning }]}>
          <WifiOff size={15} color={theme.warning} strokeWidth={2} style={styles.offlineIcon} />
          <Text style={[styles.offlineText, { color: theme.textPrimary }]}>
            Offline mode. Displaying cached weather data from your last successful connection.
          </Text>
        </View>
      )}

      {/* Severe Weather Alerts Banner (if any) */}
      <ActiveAlertsBanner alerts={alerts} theme={theme} />

      {/* Primary Hero Section */}
      <CurrentHero
        current={weather.current}
        todayDaily={weather.daily[0]}
        settings={settings}
        theme={theme}
        lastUpdated={weather.lastUpdated}
      />

      <Divider theme={theme} marginVertical={12} />

      {/* Hourly Forecast Strip */}
      <HourlyStrip hourly={weather.hourly} settings={settings} theme={theme} />

      <Divider theme={theme} marginVertical={12} />

      {/* 7-Day Forecast Outlook */}
      <DailyList daily={weather.daily} settings={settings} theme={theme} />

      <Divider theme={theme} marginVertical={12} />

      {/* Air Quality Summary Card */}
      <AqiPreviewCard
        airQuality={airQuality}
        theme={theme}
        onPressDetails={onNavigateAirQuality}
      />

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
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  offlineIcon: {
    marginRight: 8,
  },
  offlineText: {
    fontSize: 12,
    fontFamily: 'System',
    flex: 1,
    lineHeight: 16,
  },
});
