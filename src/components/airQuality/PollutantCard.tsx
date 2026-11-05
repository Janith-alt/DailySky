import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PollutantDetail } from '../../types/airQuality';
import { ColorTheme } from '../../constants/theme';

interface PollutantGridProps {
  breakdown: PollutantDetail[];
  theme: ColorTheme;
}

export const PollutantGrid: React.FC<PollutantGridProps> = ({ breakdown, theme }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good':
        return theme.aqiGood;
      case 'Moderate':
        return theme.aqiModerate;
      case 'Poor':
        return theme.aqiPoor;
      case 'Very Poor':
        return theme.aqiVeryPoor;
      case 'Severe':
        return theme.aqiSevere;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>POLLUTANT BREAKDOWN</Text>

      <View style={styles.gridContainer}>
        {breakdown.map((item) => {
          const color = getStatusColor(item.status);

          return (
            <View
              key={item.code}
              style={[
                styles.card,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[styles.chemicalText, { color: theme.textPrimary }]}>
                    {item.chemicalFormula}
                  </Text>
                  <Text style={[styles.pollutantName, { color: theme.textSecondary }]}>
                    {item.name}
                  </Text>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: color + '20', borderColor: color }]}>
                  <Text style={[styles.statusText, { color }]}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.valueRow}>
                <Text style={[styles.valueText, { color: theme.textPrimary }]}>{item.value}</Text>
                <Text style={[styles.unitText, { color: theme.textSecondary }]}>{item.unit}</Text>
              </View>

              <Text style={[styles.descriptionText, { color: theme.textTertiary }]} numberOfLines={2}>
                {item.description}
              </Text>
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
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    fontFamily: 'System',
    marginBottom: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48.5%',
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chemicalText: {
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '600',
  },
  pollutantName: {
    fontSize: 11,
    fontFamily: 'System',
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'System',
    fontWeight: '600',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginVertical: 8,
  },
  valueText: {
    fontSize: 22,
    fontFamily: 'System',
    fontWeight: '400',
  },
  unitText: {
    fontSize: 11,
    fontFamily: 'System',
  },
  descriptionText: {
    fontSize: 11,
    fontFamily: 'System',
    lineHeight: 15,
  },
});
