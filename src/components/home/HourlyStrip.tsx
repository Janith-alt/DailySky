import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Droplet } from 'lucide-react-native';
import { HourlyForecastItem } from '../../types/weather';
import { AppSettings } from '../../types/settings';
import { ColorTheme } from '../../constants/theme';
import { WeatherIcon } from '../common/WeatherIcon';
import { getWeatherInfo } from '../../constants/weatherCodes';
import { formatTemperature } from '../../utils/weatherCalculations';

interface HourlyStripProps {
  hourly: HourlyForecastItem[];
  settings: AppSettings;
  theme: ColorTheme;
}

export const HourlyStrip: React.FC<HourlyStripProps> = ({ hourly, settings, theme }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>HOURLY FORECAST</Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textTertiary }]}>Next 24 Hours</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hourly.slice(0, 24).map((item, index) => {
          const isNow = index === 0;
          const info = getWeatherInfo(item.weatherCode, true);
          const temp = formatTemperature(item.temperature, settings.temperatureUnit);
          const hasRain = item.precipitationProbability > 0;

          return (
            <View
              key={item.time + index}
              style={[
                styles.hourlyCard,
                {
                  backgroundColor: isNow ? theme.surfaceSubtle : theme.surface,
                  borderColor: isNow ? theme.accent : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.timeText,
                  {
                    color: isNow ? theme.accent : theme.textSecondary,
                    fontWeight: isNow ? '600' : '400',
                  },
                ]}
              >
                {item.formattedTime}
              </Text>

              <View style={styles.iconWrapper}>
                <WeatherIcon
                  name={info.iconName}
                  size={22}
                  color={isNow ? theme.accent : theme.textPrimary}
                  strokeWidth={1.75}
                />
              </View>

              <Text style={[styles.tempText, { color: theme.textPrimary }]}>{temp}</Text>

              {hasRain ? (
                <View style={styles.rainProbRow}>
                  <Droplet size={10} color={theme.accent} strokeWidth={2} style={styles.dropIcon} />
                  <Text style={[styles.rainProbText, { color: theme.accent }]}>
                    {item.precipitationProbability}%
                  </Text>
                </View>
              ) : (
                <View style={styles.rainPlaceholder} />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    fontFamily: 'System',
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: 'System',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  hourlyCard: {
    width: 68,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 112,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'System',
  },
  iconWrapper: {
    marginVertical: 6,
  },
  tempText: {
    fontSize: 15,
    fontFamily: 'System',
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  rainProbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dropIcon: {
    marginRight: 2,
  },
  rainProbText: {
    fontSize: 11,
    fontFamily: 'System',
    fontWeight: '500',
  },
  rainPlaceholder: {
    height: 15,
  },
});
