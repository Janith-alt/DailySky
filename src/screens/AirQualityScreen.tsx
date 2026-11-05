import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text } from 'react-native';
import { AirQualityData } from '../types/airQuality';
import { LocationData } from '../types/location';
import { ColorTheme } from '../constants/theme';
import { AqiGauge } from '../components/airQuality/AqiGauge';
import { PollutantGrid } from '../components/airQuality/PollutantCard';
import { HealthAdviceList } from '../components/airQuality/HealthAdviceList';
import { Divider } from '../components/common/Divider';
import { formatRelativeTime } from '../utils/dateFormatting';

interface AirQualityScreenProps {
  location: LocationData;
  airQuality: AirQualityData | null;
  theme: ColorTheme;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const AirQualityScreen: React.FC<AirQualityScreenProps> = ({
  location,
  airQuality,
  theme,
  isRefreshing,
  onRefresh,
}) => {
  if (!airQuality) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Loading air quality sensor data...
        </Text>
      </View>
    );
  }

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
      {/* Editorial Header */}
      <View style={styles.headerArea}>
        <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Air Quality Report</Text>
        <Text style={[styles.screenSubtitle, { color: theme.textSecondary }]}>
          {location.name} · {formatRelativeTime(airQuality.lastUpdated)}
        </Text>
      </View>

      {/* Clean Scale Visualization & Current Value */}
      <AqiGauge
        aqi={airQuality.aqi}
        europeanAqi={airQuality.europeanAqi}
        theme={theme}
      />

      <Divider theme={theme} marginVertical={8} />

      {/* Health Guidelines */}
      <HealthAdviceList airQuality={airQuality} theme={theme} />

      <Divider theme={theme} marginVertical={8} />

      {/* Pollutant Breakdown (PM2.5, PM10, O3, NO2, CO, SO2) */}
      <PollutantGrid breakdown={airQuality.pollutantBreakdown} theme={theme} />

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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'System',
  },
});
