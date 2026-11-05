import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CloudSun, Wind, Droplets, MapPin, SlidersHorizontal } from 'lucide-react-native';
import { ColorTheme } from '../../constants/theme';

export type TabKey = 'overview' | 'air_quality' | 'atmosphere' | 'locations' | 'settings';

interface TabBarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  theme: ColorTheme;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onSelectTab, theme }) => {
  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      key: 'overview',
      label: 'Weather',
      icon: (
        <CloudSun
          size={19}
          color={activeTab === 'overview' ? theme.accent : theme.textSecondary}
          strokeWidth={activeTab === 'overview' ? 2.2 : 1.6}
        />
      ),
    },
    {
      key: 'air_quality',
      label: 'Air Quality',
      icon: (
        <Wind
          size={19}
          color={activeTab === 'air_quality' ? theme.accent : theme.textSecondary}
          strokeWidth={activeTab === 'air_quality' ? 2.2 : 1.6}
        />
      ),
    },
    {
      key: 'atmosphere',
      label: 'Details',
      icon: (
        <Droplets
          size={19}
          color={activeTab === 'atmosphere' ? theme.accent : theme.textSecondary}
          strokeWidth={activeTab === 'atmosphere' ? 2.2 : 1.6}
        />
      ),
    },
    {
      key: 'locations',
      label: 'Cities',
      icon: (
        <MapPin
          size={19}
          color={activeTab === 'locations' ? theme.accent : theme.textSecondary}
          strokeWidth={activeTab === 'locations' ? 2.2 : 1.6}
        />
      ),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: (
        <SlidersHorizontal
          size={19}
          color={activeTab === 'settings' ? theme.accent : theme.textSecondary}
          strokeWidth={activeTab === 'settings' ? 2.2 : 1.6}
        />
      ),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onSelectTab(tab.key)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>{tab.icon}</View>
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive ? theme.accent : theme.textSecondary,
                  fontWeight: isActive ? '600' : '400',
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  iconContainer: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: 'System',
    marginTop: 3,
    letterSpacing: -0.1,
  },
});
