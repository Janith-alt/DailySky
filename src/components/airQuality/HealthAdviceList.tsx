import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Users, HeartPulse, Bike, Home } from 'lucide-react-native';
import { AirQualityData } from '../../types/airQuality';
import { ColorTheme } from '../../constants/theme';

interface HealthAdviceListProps {
  airQuality: AirQualityData;
  theme: ColorTheme;
}

export const HealthAdviceList: React.FC<HealthAdviceListProps> = ({ airQuality, theme }) => {
  const recs = airQuality.healthRecommendations;

  const items = [
    {
      title: 'General Population',
      text: recs.general,
      icon: <Users size={16} color={theme.accent} strokeWidth={1.8} />,
    },
    {
      title: 'Sensitive Groups (Respiratory / Heart)',
      text: recs.sensitive,
      icon: <HeartPulse size={16} color={theme.warning} strokeWidth={1.8} />,
    },
    {
      title: 'Outdoor Exercise & Sports',
      text: recs.outdoors,
      icon: <Bike size={16} color={theme.accent} strokeWidth={1.8} />,
    },
    {
      title: 'Indoor Ventilation',
      text: recs.ventilation,
      icon: <Home size={16} color={theme.textSecondary} strokeWidth={1.8} />,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>HEALTH RECOMMENDATIONS</Text>

      <View style={[styles.listContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {items.map((item, index) => (
          <View
            key={item.title}
            style={[
              styles.rowItem,
              index < items.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.borderSubtle },
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: theme.surfaceSubtle }]}>
              {item.icon}
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>{item.title}</Text>
              <Text style={[styles.itemText, { color: theme.textSecondary }]}>{item.text}</Text>
            </View>
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
  listContainer: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  rowItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontFamily: 'System',
    fontWeight: '600',
    marginBottom: 2,
  },
  itemText: {
    fontSize: 12,
    fontFamily: 'System',
    lineHeight: 17,
  },
});
