import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sunrise, Sunset, Clock } from 'lucide-react-native';
import { CurrentWeather, DailyForecastItem } from '../../types/weather';
import { AppSettings } from '../../types/settings';
import { ColorTheme } from '../../constants/theme';
import { WeatherIcon } from '../common/WeatherIcon';
import { getWeatherInfo } from '../../constants/weatherCodes';
import { formatTemperature } from '../../utils/weatherCalculations';
import { formatRelativeTime, formatTimeAmPm } from '../../utils/dateFormatting';

interface CurrentHeroProps {
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
  settings: AppSettings;
  theme: ColorTheme;
  lastUpdated: string;
}

export const CurrentHero: React.FC<CurrentHeroProps> = ({
  current,
  todayDaily,
  settings,
  theme,
  lastUpdated,
}) => {
  const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);
  const formattedTemp = formatTemperature(current.temperature, settings.temperatureUnit);
  const formattedFeelsLike = formatTemperature(current.apparentTemperature, settings.temperatureUnit);
  const highTemp = todayDaily ? formatTemperature(todayDaily.temperatureMax, settings.temperatureUnit) : '--';
  const lowTemp = todayDaily ? formatTemperature(todayDaily.temperatureMin, settings.temperatureUnit) : '--';

  const sunriseTime = todayDaily?.sunrise ? formatTimeAmPm(todayDaily.sunrise) : '--:--';
  const sunsetTime = todayDaily?.sunset ? formatTimeAmPm(todayDaily.sunset) : '--:--';

  return (
    <View style={styles.container}>
      {/* Top Status Bar: Condition & Last Updated */}
      <View style={styles.statusRow}>
        <View style={styles.conditionTag}>
          <Text style={[styles.conditionText, { color: theme.textSecondary }]}>
            {weatherInfo.label.toUpperCase()}
          </Text>
        </View>
        <View style={styles.updateRow}>
          <Clock size={12} color={theme.textTertiary} strokeWidth={1.8} style={styles.clockIcon} />
          <Text style={[styles.updateText, { color: theme.textSecondary }]}>
            {formatRelativeTime(lastUpdated)}
          </Text>
        </View>
      </View>

      {/* Main Temperature & Weather Icon Section */}
      <View style={styles.mainTempRow}>
        <View style={styles.tempLeft}>
          <Text style={[styles.temperatureText, { color: theme.textPrimary }]}>
            {formattedTemp}
          </Text>
          <View style={styles.feelsLikeRow}>
            <Text style={[styles.feelsLikeText, { color: theme.textSecondary }]}>
              Feels like {formattedFeelsLike}
            </Text>
            <Text style={[styles.dotSeparator, { color: theme.textTertiary }]}>•</Text>
            <Text style={[styles.highLowText, { color: theme.textSecondary }]}>
              H: {highTemp}  L: {lowTemp}
            </Text>
          </View>
        </View>

        <View style={[styles.iconContainer, { backgroundColor: theme.surfaceSubtle }]}>
          <WeatherIcon
            name={weatherInfo.iconName}
            size={56}
            color={theme.accent}
            strokeWidth={1.6}
          />
        </View>
      </View>

      {/* Ephemeris Bar: Sunrise & Sunset */}
      <View style={[styles.ephemerisBar, { backgroundColor: theme.surfaceSubtle, borderColor: theme.border }]}>
        <View style={styles.ephemerisItem}>
          <Sunrise size={16} color={theme.accent} strokeWidth={1.8} style={styles.sunIcon} />
          <Text style={[styles.ephemerisLabel, { color: theme.textSecondary }]}>Sunrise</Text>
          <Text style={[styles.ephemerisValue, { color: theme.textPrimary }]}>{sunriseTime}</Text>
        </View>

        <View style={[styles.ephemerisDivider, { backgroundColor: theme.border }]} />

        <View style={styles.ephemerisItem}>
          <Sunset size={16} color={theme.warning} strokeWidth={1.8} style={styles.sunIcon} />
          <Text style={[styles.ephemerisLabel, { color: theme.textSecondary }]}>Sunset</Text>
          <Text style={[styles.ephemerisValue, { color: theme.textPrimary }]}>{sunsetTime}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  conditionTag: {
    paddingVertical: 2,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    fontFamily: 'System',
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    marginRight: 4,
  },
  updateText: {
    fontSize: 12,
    fontFamily: 'System',
  },
  mainTempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  tempLeft: {
    flex: 1,
  },
  temperatureText: {
    fontSize: 68,
    fontFamily: 'System',
    fontWeight: '300',
    letterSpacing: -2,
    lineHeight: 74,
  },
  feelsLikeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  feelsLikeText: {
    fontSize: 14,
    fontFamily: 'System',
  },
  dotSeparator: {
    marginHorizontal: 8,
    fontSize: 12,
  },
  highLowText: {
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '500',
  },
  iconContainer: {
    width: 84,
    height: 84,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ephemerisBar: {
    flexDirection: 'row',
    marginTop: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  ephemerisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sunIcon: {
    marginRight: 2,
  },
  ephemerisLabel: {
    fontSize: 12,
    fontFamily: 'System',
  },
  ephemerisValue: {
    fontSize: 13,
    fontFamily: 'System',
    fontWeight: '600',
  },
  ephemerisDivider: {
    width: 1,
    height: 18,
  },
});
