import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Polyline, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { HourlyForecastItem } from '../../types/weather';
import { AppSettings } from '../../types/settings';
import { ColorTheme } from '../../constants/theme';
import { formatTemperatureValue } from '../../utils/weatherCalculations';

interface HourlyTempChartProps {
  hourly: HourlyForecastItem[];
  settings: AppSettings;
  theme: ColorTheme;
}

export const HourlyTempChart: React.FC<HourlyTempChartProps> = ({ hourly, settings, theme }) => {
  // Use first 12 hours for a clean, readable chart
  const data = hourly.slice(0, 12);
  if (data.length < 2) return null;

  const chartWidth = Math.min(Dimensions.get('window').width - 40, 480);
  const chartHeight = 160;
  const paddingX = 24;
  const paddingTop = 28;
  const paddingBottom = 32;

  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  // Temperature values in chosen unit
  const temps = data.map((d) => formatTemperatureValue(d.temperature, settings.temperatureUnit));
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempSpan = Math.max(2, maxTemp - minTemp);

  const stepX = innerWidth / (data.length - 1);

  // Compute (x, y) coordinates for temperature points
  const points = data.map((d, i) => {
    const x = paddingX + i * stepX;
    const tempVal = temps[i];
    const y = paddingTop + innerHeight - ((tempVal - minTemp) / tempSpan) * innerHeight;
    return { x, y, temp: tempVal, rain: d.precipitationProbability, label: d.formattedTime };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.chartHeader}>
        <Text style={[styles.chartTitle, { color: theme.textSecondary }]}>
          24-HOUR TEMPERATURE & PRECIPITATION TREND
        </Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.accent }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>Temp</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBar, { backgroundColor: theme.accent + '44' }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>Rain %</Text>
          </View>
        </View>
      </View>

      <Svg width={chartWidth} height={chartHeight} style={styles.svg}>
        {/* Subtle Horizontal grid guidelines */}
        <Line
          x1={paddingX}
          y1={paddingTop}
          x2={chartWidth - paddingX}
          y2={paddingTop}
          stroke={theme.border}
          strokeWidth={0.8}
          strokeDasharray="3 3"
        />
        <Line
          x1={paddingX}
          y1={paddingTop + innerHeight / 2}
          x2={chartWidth - paddingX}
          y2={paddingTop + innerHeight / 2}
          stroke={theme.border}
          strokeWidth={0.8}
          strokeDasharray="3 3"
        />
        <Line
          x1={paddingX}
          y1={paddingTop + innerHeight}
          x2={chartWidth - paddingX}
          y2={paddingTop + innerHeight}
          stroke={theme.border}
          strokeWidth={0.8}
        />

        {/* Rain probability columns at bottom */}
        {points.map((p, i) => {
          if (p.rain <= 0) return null;
          const barHeight = (p.rain / 100) * (innerHeight * 0.45);
          const barY = paddingTop + innerHeight - barHeight;
          return (
            <Rect
              key={'rain-' + i}
              x={p.x - 7}
              y={barY}
              width={14}
              height={barHeight}
              fill={theme.accent}
              opacity={0.25}
              rx={2}
            />
          );
        })}

        {/* Temperature polyline path */}
        <Polyline
          points={polylinePoints}
          fill="none"
          stroke={theme.accent}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Temperature points & text labels */}
        {points.map((p, i) => {
          // Display labels on alternate or key indices to avoid clutter
          const showLabel = i === 0 || i === points.length - 1 || i % 2 === 0;

          return (
            <React.Fragment key={'pt-' + i}>
              <Circle
                cx={p.x}
                cy={p.y}
                r={showLabel ? 3.5 : 2}
                fill={theme.surface}
                stroke={theme.accent}
                strokeWidth={2}
              />
              {showLabel && (
                <SvgText
                  x={p.x}
                  y={p.y - 8}
                  fontSize={11}
                  fontWeight="600"
                  fill={theme.textPrimary}
                  textAnchor="middle"
                >
                  {p.temp}°
                </SvgText>
              )}
              {showLabel && (
                <SvgText
                  x={p.x}
                  y={chartHeight - 10}
                  fontSize={10}
                  fill={theme.textSecondary}
                  textAnchor="middle"
                >
                  {p.label}
                </SvgText>
              )}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  chartHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    fontFamily: 'System',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendBar: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 11,
    fontFamily: 'System',
  },
  svg: {
    alignSelf: 'center',
  },
});
