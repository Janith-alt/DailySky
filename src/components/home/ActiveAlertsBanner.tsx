import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react-native';
import { WeatherAlert } from '../../types/alerts';
import { ColorTheme } from '../../constants/theme';

interface ActiveAlertsBannerProps {
  alerts: WeatherAlert[];
  theme: ColorTheme;
}

export const ActiveAlertsBanner: React.FC<ActiveAlertsBannerProps> = ({ alerts, theme }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!alerts || alerts.length === 0) return null;

  return (
    <View style={styles.container}>
      {alerts.map((alert) => {
        const isCritical = alert.severity === 'critical';
        const borderColor = isCritical ? theme.critical : theme.warning;
        const bgColor = isCritical ? theme.criticalSurface : theme.warningSurface;
        const isExpanded = expandedId === alert.id;

        return (
          <View
            key={alert.id}
            style={[styles.alertCard, { backgroundColor: bgColor, borderColor }]}
          >
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => setExpandedId(isExpanded ? null : alert.id)}
              activeOpacity={0.8}
            >
              <View style={styles.titleRow}>
                <AlertTriangle size={18} color={borderColor} strokeWidth={2} style={styles.alertIcon} />
                <View style={styles.titleTextWrapper}>
                  <Text style={[styles.alertTitle, { color: theme.textPrimary }]}>
                    {alert.title}
                  </Text>
                  <Text style={[styles.durationText, { color: theme.textSecondary }]}>
                    {alert.duration}
                  </Text>
                </View>
              </View>

              {isExpanded ? (
                <ChevronUp size={18} color={theme.textSecondary} />
              ) : (
                <ChevronDown size={18} color={theme.textSecondary} />
              )}
            </TouchableOpacity>

            <Text style={[styles.descriptionText, { color: theme.textPrimary }]}>
              {alert.description}
            </Text>

            {isExpanded && (
              <View style={[styles.precautionsSection, { borderTopColor: borderColor + '44' }]}>
                <Text style={[styles.precautionsHeading, { color: theme.textSecondary }]}>
                  RECOMMENDED PRECAUTIONS
                </Text>
                {alert.precautions.map((precaution, idx) => (
                  <View key={idx} style={styles.precautionItem}>
                    <CheckCircle2 size={13} color={borderColor} strokeWidth={2} style={styles.checkIcon} />
                    <Text style={[styles.precautionText, { color: theme.textPrimary }]}>
                      {precaution}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
  },
  alertCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  alertIcon: {
    marginRight: 10,
  },
  titleTextWrapper: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '600',
  },
  durationText: {
    fontSize: 11,
    fontFamily: 'System',
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 12,
    fontFamily: 'System',
    lineHeight: 17,
    marginTop: 8,
  },
  precautionsSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 6,
  },
  precautionsHeading: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  precautionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  precautionText: {
    fontSize: 12,
    fontFamily: 'System',
    flex: 1,
    lineHeight: 16,
  },
});
