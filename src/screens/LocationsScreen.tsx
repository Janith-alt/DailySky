import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Navigation, Plus, Trash2, Check } from 'lucide-react-native';
import { LocationData } from '../types/location';
import { ColorTheme } from '../constants/theme';
import { CitySearchModal } from '../components/locations/CitySearchModal';

interface LocationsScreenProps {
  activeLocation: LocationData;
  savedLocations: LocationData[];
  theme: ColorTheme;
  onSelectLocation: (location: LocationData) => void;
  onAddLocation: (location: LocationData) => void;
  onRemoveLocation: (id: string) => void;
  onDetectGpsLocation: () => void;
}

export const LocationsScreen: React.FC<LocationsScreenProps> = ({
  activeLocation,
  savedLocations,
  theme,
  onSelectLocation,
  onAddLocation,
  onRemoveLocation,
  onDetectGpsLocation,
}) => {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerArea}>
        <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Manage Locations</Text>
        <Text style={[styles.screenSubtitle, { color: theme.textSecondary }]}>
          Switch between saved regions or detect your GPS position
        </Text>
      </View>

      {/* GPS Location Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.gpsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={onDetectGpsLocation}
          activeOpacity={0.8}
        >
          <View style={[styles.gpsIconBox, { backgroundColor: theme.surfaceSubtle }]}>
            <Navigation size={18} color={theme.accent} strokeWidth={2} />
          </View>
          <View style={styles.gpsTextWrapper}>
            <Text style={[styles.gpsTitle, { color: theme.textPrimary }]}>Detect GPS Location</Text>
            <Text style={[styles.gpsSubtitle, { color: theme.textSecondary }]}>
              {activeLocation.isCurrentLocation ? `Active: ${activeLocation.name}` : 'Use current sensor coordinates'}
            </Text>
          </View>
          {activeLocation.isCurrentLocation && (
            <View style={[styles.activePill, { backgroundColor: theme.accentLight }]}>
              <Text style={[styles.activePillText, { color: theme.accent }]}>Active</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Saved Cities Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>SAVED LOCATIONS</Text>
          <TouchableOpacity
            style={[styles.addBtn, { borderColor: theme.border, backgroundColor: theme.surface }]}
            onPress={() => setSearchModalOpen(true)}
            activeOpacity={0.7}
          >
            <Plus size={14} color={theme.accent} strokeWidth={2.2} />
            <Text style={[styles.addBtnText, { color: theme.accent }]}>Add City</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.locationsList}>
          {savedLocations.map((loc) => {
            const isActive = activeLocation.id === loc.id;

            return (
              <TouchableOpacity
                key={loc.id}
                style={[
                  styles.locationCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: isActive ? theme.accent : theme.border,
                  },
                ]}
                onPress={() => onSelectLocation(loc)}
                activeOpacity={0.8}
              >
                <View style={styles.locLeft}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.locName, { color: theme.textPrimary }]}>{loc.name}</Text>
                    {isActive && (
                      <View style={[styles.checkCircle, { backgroundColor: theme.accent }]}>
                        <Check size={11} color="#FFF" strokeWidth={3} />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.locSub, { color: theme.textSecondary }]}>
                    {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                  </Text>
                </View>

                {savedLocations.length > 1 && (
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => onRemoveLocation(loc.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Trash2 size={16} color={theme.textTertiary} strokeWidth={1.8} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* City Search Modal */}
      <CitySearchModal
        visible={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectCity={(city) => {
          onAddLocation(city);
          onSelectLocation(city);
        }}
        theme={theme}
      />

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  headerArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  screenTitle: {
    fontSize: 22,
    fontFamily: 'System',
    fontWeight: '600',
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 12,
    fontFamily: 'System',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  gpsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  gpsIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gpsTextWrapper: {
    flex: 1,
  },
  gpsTitle: {
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '600',
  },
  gpsSubtitle: {
    fontSize: 12,
    fontFamily: 'System',
    marginTop: 1,
  },
  activePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 11,
    fontFamily: 'System',
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    fontFamily: 'System',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  addBtnText: {
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '600',
  },
  locationsList: {
    gap: 8,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  locLeft: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locName: {
    fontSize: 15,
    fontFamily: 'System',
    fontWeight: '600',
  },
  checkCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locSub: {
    fontSize: 12,
    fontFamily: 'System',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
  },
});
