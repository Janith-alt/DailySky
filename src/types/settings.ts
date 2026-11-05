export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph';
export type PressureUnit = 'hPa' | 'inHg';
export type ThemePreference = 'system' | 'light' | 'dark';

export interface NotificationSettings {
  enabled: boolean;
  heavyRain: boolean;
  thunderstorms: boolean;
  strongWinds: boolean;
  heatwaves: boolean;
  extremeCold: boolean;
  poorAirQuality: boolean;
}

export interface AppSettings {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  pressureUnit: PressureUnit;
  theme: ThemePreference;
  notifications: NotificationSettings;
}
