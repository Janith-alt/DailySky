import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wind, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react-native';
import { AirQualityData } from '../../types/airQuality';
import { ColorTheme } from '../../constants/theme';
import { getAqiLevel } from '../../constants/aqiStandards';

interface AqiPreviewCardProps {
  airQuality: AirQualityData | null;
  theme: ColorTheme;
  onPressDetails: () => void;
}

export const AqiPreviewCard: React.FC<AqiPreviewCardProps> = ({
  airQuality,
  theme,
  onPressDetails,
}) => {
  if (!airQuality) return null;

  const aqiVal = airQuality.aqi;
  const aqiLevel = getAqiLevel(aqiVal);
  const color = aqiLevel.getColor(theme);

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>AIR QUALITY</Text>
        <TouchableOpacity
          onPress={onPressDetails}
          style={styles.moreButton}
          activeOpacity={0.7}
        >
          <Text style={[styles.moreText, { color: theme.accent }]}>Detailed Breakdown</Text>
          <ArrowRight size={13} color={theme.accent} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={onPressDetails}
        activeOpacity={0.8}
      >
        <View style={styles.topRow}>
          <View style={styles.leftStat}>
            <Text style={[styles.aqiNumber, { color: theme.textPrimary }]}>{aqiVal}</Text>
            <View style={styles.badgeWrapper}>
              <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}>
                <Text style={[styles.badgeText, { color }]}>{aqiLevel.category}</Text>
              </View>
              <Text style={[styles.scaleText, { color: theme.textSecondary }]}>US AQI Scale</Text>
            </View>
          </View>

          <View style={[styles.iconBox, { backgroundColor: theme.surfaceSubtle }]}>
            <Wind size={26} color={color} strokeWidth={1.8} />
          </View>
        </View>

        {/* Color Scale Strip */}
        <View style={styles.scaleTrack}>
          <View style={[styles.scaleSegment, { backgroundColor: theme.aqiGood }]} />
          <View style={[styles.scaleSegment, { backgroundColor: theme.aqiModerate }]} />
          <View style={[styles.scaleSegment, { backgroundColor: theme.aqiPoor }]} />
          <View style={[styles.scaleSegment, { backgroundColor: theme.aqiVeryPoor }]} />
          <View style={[styles.scaleSegment, { backgroundColor: theme.aqiSevere }]} />

          {/* Current position marker */}
          <View
            style={[
              styles.scaleMarker,
              {
                left: `${Math.min(100, (Math.min(300, aqiVal) / 300) * 100)}%`,
                borderColor: theme.surface,
                backgroundColor: color,
              },
            ]}
          />
        </View>

        {/* Short explanation */}
        <Text style={[styles.explanationText, { color: theme.textPrimary }]}>
          {airQuality.explanation}
        </Text>

        {/* Health recommendation */}
        <View style={[styles.recommendationBox, { backgroundColor: theme.surfaceSubtle }]}>
          {aqiVal <= 100 ? (
            <ShieldCheck size={15} color={theme.accent} strokeWidth={2} style={styles.recIcon} />
          ) : (
            <AlertCircle size={15} color={color} strokeWidth={2} style={styles.recIcon} />
          )}
          <Text style={[styles.recommendationText, { color: theme.textSecondary }]}>
            {airQuality.healthRecommendations.general}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    fontFamily: 'System',
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moreText: {
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '500',
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aqiNumber: {
    fontSize: 44,
    fontFamily: 'System',
    fontWeight: '300',
    letterSpacing: -1,
  },
  badgeWrapper: {
    gap: 3,
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '600',
  },
  scaleText: {
    fontSize: 11,
    fontFamily: 'System',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleTrack: {
    flexDirection: 'row',
    height: 5,
    borderRadius: 2.5,
    overflow: 'visible',
    marginVertical: 14,
    position: 'relative',
    gap: 2,
  },
  scaleSegment: {
    flex: 1,
    borderRadius: 1,
  },
  scaleMarker: {
    position: 'absolute',
    top: -4,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 2,
    marginLeft: -6.5,
  },
  explanationText: {
    fontSize: 13,
    fontFamily: 'System',
    lineHeight: 18,
    marginBottom: 10,
  },
  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
  },
  recIcon: {
    marginRight: 8,
  },
  recommendationText: {
    fontSize: 12,
    fontFamily: 'System',
    flex: 1,
    lineHeight: 16,
  },
});
