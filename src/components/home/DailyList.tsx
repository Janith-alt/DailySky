import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Droplet } from 'lucide-react-native';
import { DailyForecastItem } from '../../types/weather';
import { AppSettings } from '../../types/settings';
import { ColorTheme } from '../../constants/theme';
import { WeatherIcon } from '../common/WeatherIcon';
import { getWeatherInfo } from '../../constants/weatherCodes';
import { formatTemperature } from '../../utils/weatherCalculations';

interface DailyListProps {
  daily: DailyForecastItem[];
  settings: AppSettings;
  theme: ColorTheme;
}

export const DailyList: React.FC<DailyListProps> = ({ daily, settings, theme }) => {
  // Find global min and max for the 7-day range bar
  let globalMin = Infinity;
  let globalMax = -Infinity;

  daily.forEach((day) => {
    if (day.temperatureMin < globalMin) globalMin = day.temperatureMin;
    if (day.temperatureMax > globalMax) globalMax = day.temperatureMax;
  });

  const rangeSpan = Math.max(1, globalMax - globalMin);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>7-DAY OUTLOOK</Text>

      <View style={[styles.tableContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {daily.slice(0, 7).map((item, index) => {
          const isToday = index === 0;
          const info = getWeatherInfo(item.weatherCode, true);
          const minTemp = formatTemperature(item.temperatureMin, settings.temperatureUnit);
          const maxTemp = formatTemperature(item.temperatureMax, settings.temperatureUnit);
          const hasRain = item.precipitationProbabilityMax > 0;

          // Bar calculation
          const leftPercent = Math.max(0, Math.min(100, ((item.temperatureMin - globalMin) / rangeSpan) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((globalMax - item.temperatureMax) / rangeSpan) * 100));

          return (
            <View
              key={item.date}
              style={[
                styles.rowItem,
                index < daily.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.borderSubtle },
              ]}
            >
              <View style={styles.dayCol}>
                <Text
                  style={[
                    styles.dayName,
                    {
                      color: isToday ? theme.accent : theme.textPrimary,
                      fontWeight: isToday ? '600' : '400',
                    },
                  ]}
                >
                  {item.dayName}
                </Text>
              </View>

              <View style={styles.conditionCol}>
                <WeatherIcon
                  name={info.iconName}
                  size={18}
                  color={isToday ? theme.accent : theme.textPrimary}
                  strokeWidth={1.75}
                />
                {hasRain ? (
                  <View style={styles.rainBadge}>
                    <Droplet size={10} color={theme.accent} strokeWidth={2} />
                    <Text style={[styles.rainText, { color: theme.accent }]}>
                      {item.precipitationProbabilityMax}%
                    </Text>
                  </View>
                ) : (
                  <View style={{ width: 38 }} />
                )}
              </View>

              {/* Temperature Bar & Values */}
              <View style={styles.tempCol}>
                <Text style={[styles.tempValMin, { color: theme.textSecondary }]}>{minTemp}</Text>

                <View style={[styles.rangeBarTrack, { backgroundColor: theme.surfaceSubtle }]}>
                  <View
                    style={[
                      styles.rangeBarFill,
                      {
                        left: `${leftPercent}%`,
                        right: `${rightPercent}%`,
                        backgroundColor: isToday ? theme.accent : theme.textTertiary,
                      },
                    ]}
                  />
                </View>

                <Text style={[styles.tempValMax, { color: theme.textPrimary }]}>{maxTemp}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    fontFamily: 'System',
    marginBottom: 10,
  },
  tableContainer: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dayCol: {
    width: 78,
  },
  dayName: {
    fontSize: 14,
    fontFamily: 'System',
  },
  conditionCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 66,
  },
  rainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    width: 38,
  },
  rainText: {
    fontSize: 11,
    fontFamily: 'System',
    fontWeight: '500',
  },
  tempCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  tempValMin: {
    fontSize: 13,
    fontFamily: 'System',
    width: 28,
    textAlign: 'right',
  },
  rangeBarTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: 4,
  },
  rangeBarFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 2,
  },
  tempValMax: {
    fontSize: 13,
    fontFamily: 'System',
    fontWeight: '600',
    width: 28,
    textAlign: 'right',
  },
});
