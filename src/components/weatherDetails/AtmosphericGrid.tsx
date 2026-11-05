import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Thermometer,
  Droplets,
  Wind,
  Compass,
  Gauge,
  Eye,
  Sun,
  Cloud,
  CloudRain,
  Sunrise,
  Sunset,
} from 'lucide-react-native';
import { CurrentWeather, DailyForecastItem } from '../../types/weather';
import { AppSettings } from '../../types/settings';
import { ColorTheme } from '../../constants/theme';
import {
  formatTemperature,
  formatWindSpeed,
  formatPressure,
  getWindDirectionCardinal,
  calculateDewPoint,
  getUvCategory,
} from '../../utils/weatherCalculations';
import { formatTimeAmPm } from '../../utils/dateFormatting';

interface AtmosphericGridProps {
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
  settings: AppSettings;
  theme: ColorTheme;
}

export const AtmosphericGrid: React.FC<AtmosphericGridProps> = ({
  current,
  todayDaily,
  settings,
  theme,
}) => {
  const dewPoint = calculateDewPoint(current.temperature, current.relativeHumidity);
  const formattedDewPoint = formatTemperature(dewPoint, settings.temperatureUnit);
  const formattedTemp = formatTemperature(current.temperature, settings.temperatureUnit);
  const formattedFeels = formatTemperature(current.apparentTemperature, settings.temperatureUnit);
  const formattedWind = formatWindSpeed(current.windSpeed, settings.windSpeedUnit);
  const formattedPressure = formatPressure(current.pressureMsl, settings.pressureUnit);
  const cardinal = getWindDirectionCardinal(current.windDirection);
  const uvMax = todayDaily?.uvIndexMax ?? 0;
  const uvInfo = getUvCategory(uvMax);
  const sunriseStr = todayDaily?.sunrise ? formatTimeAmPm(todayDaily.sunrise) : '--:--';
  const sunsetStr = todayDaily?.sunset ? formatTimeAmPm(todayDaily.sunset) : '--:--';

  const metrics = [
    {
      label: 'FEELS LIKE',
      value: formattedFeels,
      subtext: `Actual temp: ${formattedTemp}`,
      icon: <Thermometer size={16} color={theme.accent} strokeWidth={1.8} />,
    },
    {
      label: 'HUMIDITY',
      value: `${current.relativeHumidity}%`,
      subtext: `Dew point: ${formattedDewPoint}`,
      icon: <Droplets size={16} color={theme.accent} strokeWidth={1.8} />,
    },
    {
      label: 'WIND SPEED',
      value: formattedWind,
      subtext: `Direction: ${cardinal} (${Math.round(current.windDirection)}°)`,
      icon: <Wind size={16} color={theme.accent} strokeWidth={1.8} />,
    },
    {
      label: 'PRESSURE',
      value: formattedPressure,
      subtext: 'Mean sea level barometric',
      icon: <Gauge size={16} color={theme.textSecondary} strokeWidth={1.8} />,
    },
    {
      label: 'UV INDEX',
      value: `${uvMax.toFixed(1)}`,
      subtext: `${uvInfo.label} exposure danger`,
      icon: <Sun size={16} color={theme.warning} strokeWidth={1.8} />,
    },
    {
      label: 'VISIBILITY',
      value: `10+ km`,
      subtext: 'Clear line of sight',
      icon: <Eye size={16} color={theme.textSecondary} strokeWidth={1.8} />,
    },
    {
      label: 'CLOUD COVER',
      value: `${current.cloudCover}%`,
      subtext: current.cloudCover > 60 ? 'Predominantly overcast' : 'Clear intervals',
      icon: <Cloud size={16} color={theme.textSecondary} strokeWidth={1.8} />,
    },
    {
      label: 'RAIN CHANCE',
      value: `${todayDaily?.precipitationProbabilityMax ?? 0}%`,
      subtext: current.precipitation > 0 ? `${current.precipitation} mm accumulated` : 'No precipitation now',
      icon: <CloudRain size={16} color={theme.accent} strokeWidth={1.8} />,
    },
    {
      label: 'SUNRISE',
      value: sunriseStr,
      subtext: 'Dawn ephemeris',
      icon: <Sunrise size={16} color={theme.accent} strokeWidth={1.8} />,
    },
    {
      label: 'SUNSET',
      value: sunsetStr,
      subtext: 'Dusk ephemeris',
      icon: <Sunset size={16} color={theme.warning} strokeWidth={1.8} />,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ATMOSPHERIC METRICS</Text>

      <View style={styles.grid}>
        {metrics.map((m) => (
          <View
            key={m.label}
            style={[styles.tile, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <View style={styles.tileHeader}>
              <Text style={[styles.tileLabel, { color: theme.textSecondary }]}>{m.label}</Text>
              {m.icon}
            </View>

            <Text style={[styles.tileValue, { color: theme.textPrimary }]}>{m.value}</Text>
            <Text style={[styles.tileSubtext, { color: theme.textTertiary }]} numberOfLines={1}>
              {m.subtext}
            </Text>
          </View>
        ))}
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
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    fontFamily: 'System',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    width: '48.5%',
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    justifyContent: 'space-between',
    minHeight: 94,
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tileLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    fontFamily: 'System',
  },
  tileValue: {
    fontSize: 22,
    fontFamily: 'System',
    fontWeight: '400',
    marginVertical: 4,
  },
  tileSubtext: {
    fontSize: 11,
    fontFamily: 'System',
  },
});
