import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text } from 'react-native';
import { WeatherData } from '../types/weather';
import { LocationData } from '../types/location';
import { AppSettings } from '../types/settings';
import { ColorTheme } from '../constants/theme';
import { HourlyTempChart } from '../components/weatherDetails/HourlyTempChart';
import { AtmosphericGrid } from '../components/weatherDetails/AtmosphericGrid';
import { Divider } from '../components/common/Divider';
import { formatRelativeTime } from '../utils/dateFormatting';

interface WeatherDetailsScreenProps {
  location: LocationData;
  weather: WeatherData;
  settings: AppSettings;
  theme: ColorTheme;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const WeatherDetailsScreen: React.FC<WeatherDetailsScreenProps> = ({
  location,
  weather,
  settings,
  theme,
  isRefreshing,
  onRefresh,
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
      {/* Header Area */}
      <View style={styles.headerArea}>
        <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Atmospheric Details</Text>
        <Text style={[styles.screenSubtitle, { color: theme.textSecondary }]}>
          {location.name} · {formatRelativeTime(weather.lastUpdated)}
        </Text>
      </View>

      {/* Hourly Temperature & Precipitation Chart */}
      <HourlyTempChart hourly={weather.hourly} settings={settings} theme={theme} />

      <Divider theme={theme} marginVertical={8} />

      {/* Atmospheric Metrics Grid (Humidity, Wind, Pressure, UV, Visibility, Cloud, etc.) */}
      <AtmosphericGrid
        current={weather.current}
        todayDaily={weather.daily[0]}
        settings={settings}
        theme={theme}
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
  headerArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
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
});
