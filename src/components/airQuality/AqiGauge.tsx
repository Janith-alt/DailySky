import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ColorTheme } from '../../constants/theme';
import { AQI_LEVELS, getAqiLevel } from '../../constants/aqiStandards';

interface AqiGaugeProps {
  aqi: number;
  europeanAqi: number;
  theme: ColorTheme;
}

export const AqiGauge: React.FC<AqiGaugeProps> = ({ aqi, europeanAqi, theme }) => {
  const currentLevel = getAqiLevel(aqi);
  const color = currentLevel.getColor(theme);

  // Position between 0% and 100% on a 0-300 scale
  const progressPercent = Math.min(100, Math.max(0, (aqi / 300) * 100));

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.scaleTitle, { color: theme.textSecondary }]}>CURRENT AIR QUALITY INDEX</Text>
          <View style={styles.aqiReadoutRow}>
            <Text style={[styles.aqiHuge, { color: theme.textPrimary }]}>{aqi}</Text>
            <View style={styles.badgeColumn}>
              <View style={[styles.categoryBadge, { backgroundColor: color + '22', borderColor: color }]}>
                <Text style={[styles.categoryText, { color }]}>{currentLevel.category}</Text>
              </View>
              <Text style={[styles.subScaleText, { color: theme.textSecondary }]}>
                European AQI: {europeanAqi}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Clean Scale Visualization */}
      <View style={styles.scaleContainer}>
        <View style={styles.track}>
          <View style={[styles.segment, { backgroundColor: theme.aqiGood }]} />
          <View style={[styles.segment, { backgroundColor: theme.aqiModerate }]} />
          <View style={[styles.segment, { backgroundColor: theme.aqiPoor }]} />
          <View style={[styles.segment, { backgroundColor: theme.aqiVeryPoor }]} />
          <View style={[styles.segment, { backgroundColor: theme.aqiSevere }]} />
        </View>

        {/* Pointer indicator */}
        <View
          style={[
            styles.indicatorPointer,
            {
              left: `${progressPercent}%`,
              borderColor: theme.surface,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      {/* Scale Threshold Numbers */}
      <View style={styles.thresholdRow}>
        <Text style={[styles.thresholdText, { color: theme.textTertiary }]}>0</Text>
        <Text style={[styles.thresholdText, { color: theme.textTertiary }]}>50</Text>
        <Text style={[styles.thresholdText, { color: theme.textTertiary }]}>100</Text>
        <Text style={[styles.thresholdText, { color: theme.textTertiary }]}>150</Text>
        <Text style={[styles.thresholdText, { color: theme.textTertiary }]}>200</Text>
        <Text style={[styles.thresholdText, { color: theme.textTertiary }]}>300+</Text>
      </View>

      <Text style={[styles.summaryText, { color: theme.textPrimary }]}>
        {currentLevel.summary}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  headerRow: {
    marginBottom: 14,
  },
  scaleTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    fontFamily: 'System',
    marginBottom: 6,
  },
  aqiReadoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  aqiHuge: {
    fontSize: 52,
    fontFamily: 'System',
    fontWeight: '300',
    letterSpacing: -1.5,
  },
  badgeColumn: {
    gap: 4,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 13,
    fontFamily: 'System',
    fontWeight: '600',
  },
  subScaleText: {
    fontSize: 11,
    fontFamily: 'System',
  },
  scaleContainer: {
    marginVertical: 12,
    position: 'relative',
    height: 18,
    justifyContent: 'center',
  },
  track: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    gap: 2,
  },
  segment: {
    flex: 1,
  },
  indicatorPointer: {
    position: 'absolute',
    top: 1,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    marginLeft: -8,
  },
  thresholdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginBottom: 8,
  },
  thresholdText: {
    fontSize: 10,
    fontFamily: 'System',
  },
  summaryText: {
    fontSize: 13,
    fontFamily: 'System',
    lineHeight: 18,
    marginTop: 4,
  },
});
