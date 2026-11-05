export type WeatherCode = number;

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  weatherCode: WeatherCode;
  weatherCondition: string;
  isDay: boolean;
  precipitation: number;
  cloudCover: number;
  pressureMsl: number;
  windSpeed: number;
  windDirection: number;
  time: string;
}

export interface HourlyForecastItem {
  time: string; // ISO string
  formattedTime: string; // e.g. "12 PM"
  temperature: number;
  weatherCode: WeatherCode;
  precipitationProbability: number;
  uvIndex?: number;
  visibility?: number;
  relativeHumidity?: number;
  windSpeed?: number;
}

export interface DailyForecastItem {
  date: string; // ISO string
  dayName: string; // e.g. "Today", "Thu", "Fri"
  weatherCode: WeatherCode;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbabilityMax: number;
  sunrise: string;
  sunset: string;
  uvIndexMax?: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  timezone: string;
  elevation?: number;
  lastUpdated: string; // ISO string
}
