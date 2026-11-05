export interface ColorTheme {
  background: string;
  surface: string;
  surfaceSubtle: string;
  surfaceElevated: string;
  border: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentLight: string;
  accentForeground: string;
  warning: string;
  warningSurface: string;
  critical: string;
  criticalSurface: string;
  aqiGood: string;
  aqiModerate: string;
  aqiPoor: string;
  aqiVeryPoor: string;
  aqiSevere: string;
  cardHighlight: string;
}

export const lightTheme: ColorTheme = {
  background: '#F7F7F2',
  surface: '#FFFFFF',
  surfaceSubtle: '#F0EFEA',
  surfaceElevated: '#FFFFFF',
  border: '#E3E3DC',
  borderSubtle: '#ECECE5',
  textPrimary: '#202321',
  textSecondary: '#666C64',
  textTertiary: '#9BA098',
  accent: '#5E7D61',
  accentLight: '#E8EFE9',
  accentForeground: '#FFFFFF',
  warning: '#D97736',
  warningSurface: '#FDF4EC',
  critical: '#C84B4B',
  criticalSurface: '#FDF0F0',
  aqiGood: '#5E9B66',
  aqiModerate: '#D09E2B',
  aqiPoor: '#D97736',
  aqiVeryPoor: '#C84B4B',
  aqiSevere: '#803248',
  cardHighlight: 'rgba(0, 0, 0, 0.02)',
};

export const darkTheme: ColorTheme = {
  background: '#171A18',
  surface: '#1F2420',
  surfaceSubtle: '#262C27',
  surfaceElevated: '#28302A',
  border: '#2C342E',
  borderSubtle: '#242A25',
  textPrimary: '#ECEFEA',
  textSecondary: '#A0A79E',
  textTertiary: '#697268',
  accent: '#7D9F80',
  accentLight: '#243427',
  accentForeground: '#171A18',
  warning: '#E28A4B',
  warningSurface: '#2F231A',
  critical: '#D96161',
  criticalSurface: '#301F1F',
  aqiGood: '#6EB277',
  aqiModerate: '#E2B13C',
  aqiPoor: '#E28A4B',
  aqiVeryPoor: '#D96161',
  aqiSevere: '#A64660',
  cardHighlight: 'rgba(255, 255, 255, 0.03)',
};

export const layout = {
  radiusSm: 6,
  radiusMd: 10,
  radiusLg: 12,
  dividerWidth: 1,
  paddingHorizontal: 20,
};
