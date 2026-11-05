import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MapPin, Navigation, RefreshCw, SlidersHorizontal, Search } from 'lucide-react-native';
import { ColorTheme } from '../../constants/theme';
import { LocationData } from '../../types/location';
import { formatFullDate } from '../../utils/dateFormatting';

interface HeaderProps {
  location: LocationData;
  theme: ColorTheme;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenLocations: () => void;
  onOpenSettings: () => void;
  onDetectLocation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  location,
  theme,
  isRefreshing,
  onRefresh,
  onOpenLocations,
  onOpenSettings,
  onDetectLocation,
}) => {
  return (
    <View style={[styles.headerContainer, { borderBottomColor: theme.border }]}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.locationSelector}
          onPress={onOpenLocations}
          activeOpacity={0.7}
        >
          <View style={styles.locationTitleRow}>
            {location.isCurrentLocation ? (
              <Navigation size={17} color={theme.accent} strokeWidth={2} style={styles.pinIcon} />
            ) : (
              <MapPin size={17} color={theme.accent} strokeWidth={2} style={styles.pinIcon} />
            )}
            <Text style={[styles.cityName, { color: theme.textPrimary }]} numberOfLines={1}>
              {location.name}
            </Text>
          </View>
          <Text style={[styles.dateText, { color: theme.textSecondary }]}>
            {formatFullDate()} · {location.country || (location.admin1 ?? '')}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.iconButton, { borderColor: theme.border, backgroundColor: theme.surface }]}
            onPress={onDetectLocation}
            accessibilityLabel="Detect GPS Location"
          >
            <Navigation size={16} color={theme.textPrimary} strokeWidth={1.8} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, { borderColor: theme.border, backgroundColor: theme.surface }]}
            onPress={onRefresh}
            disabled={isRefreshing}
            accessibilityLabel="Refresh weather"
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color={theme.accent} />
            ) : (
              <RefreshCw size={16} color={theme.textPrimary} strokeWidth={1.8} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, { borderColor: theme.border, backgroundColor: theme.surface }]}
            onPress={onOpenSettings}
            accessibilityLabel="App Settings"
          >
            <SlidersHorizontal size={16} color={theme.textPrimary} strokeWidth={1.8} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationSelector: {
    flex: 1,
    paddingRight: 12,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    marginRight: 6,
  },
  cityName: {
    fontSize: 20,
    fontFamily: 'System',
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'System',
    marginTop: 2,
    letterSpacing: -0.1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
