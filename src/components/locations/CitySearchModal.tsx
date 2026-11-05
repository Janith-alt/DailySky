import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Search, X, MapPin, Plus } from 'lucide-react-native';
import { CitySearchResult, LocationData } from '../../types/location';
import { ColorTheme } from '../../constants/theme';
import { searchCities } from '../../services/api';

interface CitySearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCity: (location: LocationData) => void;
  theme: ColorTheme;
}

export const CitySearchModal: React.FC<CitySearchModalProps> = ({
  visible,
  onClose,
  onSelectCity,
  theme,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setQuery('');
      setResults([]);
      setError(null);
      return;
    }
  }, [visible]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchCities(trimmed);
        setResults(data);
      } catch (err: any) {
        setError(err.message || 'Failed to search cities');
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handlePick = (item: CitySearchResult) => {
    const loc: LocationData = {
      id: `city-${item.id}-${item.latitude.toFixed(2)}`,
      name: item.name,
      admin1: item.admin1,
      country: item.country,
      countryCode: item.countryCode,
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone,
      isCurrentLocation: false,
    };
    onSelectCity(loc);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Search size={18} color={theme.textSecondary} strokeWidth={2} style={styles.searchIcon} />
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              placeholder="Search cities worldwide (e.g. Paris, Tokyo, Sydney)..."
              placeholderTextColor={theme.textTertiary}
              value={query}
              onChangeText={setQuery}
              autoFocus
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
                <X size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={[styles.closeText, { color: theme.accent }]}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Content list */}
        {isLoading && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="small" color={theme.accent} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Searching global cities...</Text>
          </View>
        )}

        {error && (
          <View style={styles.centerBox}>
            <Text style={[styles.errorText, { color: theme.warning }]}>{error}</Text>
          </View>
        )}

        {!isLoading && results.length === 0 && query.trim().length >= 2 && (
          <View style={styles.centerBox}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No matching cities found.</Text>
          </View>
        )}

        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.resultItem,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
              onPress={() => handlePick(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.itemIconBox, { backgroundColor: theme.surfaceSubtle }]}>
                <MapPin size={18} color={theme.accent} strokeWidth={1.8} />
              </View>

              <View style={styles.itemInfo}>
                <Text style={[styles.cityName, { color: theme.textPrimary }]}>{item.name}</Text>
                <Text style={[styles.countrySubtitle, { color: theme.textSecondary }]}>
                  {[item.admin1, item.country].filter(Boolean).join(', ')}
                </Text>
              </View>

              <Plus size={16} color={theme.accent} strokeWidth={2} />
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'System',
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
  closeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  closeText: {
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    gap: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  itemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 15,
    fontFamily: 'System',
    fontWeight: '500',
  },
  countrySubtitle: {
    fontSize: 12,
    fontFamily: 'System',
    marginTop: 2,
  },
  centerBox: {
    padding: 40,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: 'System',
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'System',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'System',
  },
});
