import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ColorTheme } from '../../constants/theme';

interface DividerProps {
  theme: ColorTheme;
  marginVertical?: number;
}

export const Divider: React.FC<DividerProps> = ({ theme, marginVertical = 16 }) => {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: theme.border,
          marginVertical,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
  },
});
