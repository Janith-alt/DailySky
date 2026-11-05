import { WeatherData, CurrentWeather, HourlyForecastItem, DailyForecastItem } from '../types/weather';
import { AirQualityData } from '../types/airQuality';
import { CitySearchResult } from '../types/location';
import { getWeatherInfo } from '../constants/weatherCodes';
import { getAqiLevel } from '../constants/aqiStandards';
import { buildPollutantBreakdown } from '../utils/aqiCalculations';
import { formatHourShort, formatDayName } from '../utils/dateFormatting';

const TIMEOUT_MS = 12000;

async function fetchWithTimeout(url: string, timeout = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Network request timed out. Please check your connection.');
    }
    throw error;
  }
}

export async function fetchWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,uv_index,visibility,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;

  const response = await fetchWithTimeout(url);
  const json = await response.json();

  if (!json.current || !json.hourly || !json.daily) {
    throw new Error('Malformed weather response from API');
  }

  const rawCurrent = json.current;
  const weatherInfo = getWeatherInfo(rawCurrent.weather_code, rawCurrent.is_day === 1);

  const current: CurrentWeather = {
    temperature: rawCurrent.temperature_2m,
    apparentTemperature: rawCurrent.apparent_temperature,
    relativeHumidity: rawCurrent.relative_humidity_2m,
    weatherCode: rawCurrent.weather_code,
    weatherCondition: weatherInfo.label,
    isDay: rawCurrent.is_day === 1,
    precipitation: rawCurrent.precipitation ?? 0,
    cloudCover: rawCurrent.cloud_cover ?? 0,
    pressureMsl: rawCurrent.pressure_msl ?? 1013,
    windSpeed: rawCurrent.wind_speed_10m ?? 0,
    windDirection: rawCurrent.wind_direction_10m ?? 0,
    time: rawCurrent.time,
  };

  // Process next 24-36 hourly records starting from current hour
  const hourlyTimes: string[] = json.hourly.time || [];
  const currentIso = rawCurrent.time;
  let startIndex = hourlyTimes.findIndex((t) => t >= currentIso);
  if (startIndex === -1) startIndex = 0;

  const hourly: HourlyForecastItem[] = [];
  const maxHours = Math.min(hourlyTimes.length, startIndex + 36);

  for (let i = startIndex; i < maxHours; i++) {
    const t = hourlyTimes[i];
    hourly.push({
      time: t,
      formattedTime: i === startIndex ? 'Now' : formatHourShort(t),
      temperature: json.hourly.temperature_2m?.[i] ?? current.temperature,
      weatherCode: json.hourly.weather_code?.[i] ?? current.weatherCode,
      precipitationProbability: json.hourly.precipitation_probability?.[i] ?? 0,
      uvIndex: json.hourly.uv_index?.[i] ?? 0,
      visibility: json.hourly.visibility?.[i] ? Math.round(json.hourly.visibility[i] / 1000) : 10,
      relativeHumidity: json.hourly.relative_humidity_2m?.[i] ?? current.relativeHumidity,
      windSpeed: json.hourly.wind_speed_10m?.[i] ?? current.windSpeed,
    });
  }

  // Process daily records (up to 7-10 days)
  const dailyTimes: string[] = json.daily.time || [];
  const daily: DailyForecastItem[] = [];

  for (let i = 0; i < Math.min(dailyTimes.length, 7); i++) {
    const t = dailyTimes[i];
    daily.push({
      date: t,
      dayName: formatDayName(t, i),
      weatherCode: json.daily.weather_code?.[i] ?? 0,
      temperatureMax: json.daily.temperature_2m_max?.[i] ?? 0,
      temperatureMin: json.daily.temperature_2m_min?.[i] ?? 0,
      precipitationProbabilityMax: json.daily.precipitation_probability_max?.[i] ?? 0,
      sunrise: json.daily.sunrise?.[i] ?? '',
      sunset: json.daily.sunset?.[i] ?? '',
      uvIndexMax: json.daily.uv_index_max?.[i] ?? 0,
    });
  }

  return {
    current,
    hourly,
    daily,
    timezone: json.timezone || 'UTC',
    elevation: json.elevation,
    lastUpdated: new Date().toISOString(),
  };
}

export async function fetchAirQualityData(latitude: number, longitude: number): Promise<AirQualityData> {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=us_aqi,pm2_5,pm10&timezone=auto`;

  const response = await fetchWithTimeout(url);
  const json = await response.json();

  if (!json.current) {
    throw new Error('Malformed air quality response from API');
  }

  const rawCurrent = json.current;
  const usAqi = Math.round(rawCurrent.us_aqi ?? 40);
  const aqiLevel = getAqiLevel(usAqi);

  const pollutants = {
    pm2_5: rawCurrent.pm2_5 ?? 10,
    pm10: rawCurrent.pm10 ?? 20,
    ozone: rawCurrent.ozone ?? 40,
    nitrogen_dioxide: rawCurrent.nitrogen_dioxide ?? 15,
    carbon_monoxide: rawCurrent.carbon_monoxide ?? 200,
    sulphur_dioxide: rawCurrent.sulphur_dioxide ?? 2,
  };

  const pollutantBreakdown = buildPollutantBreakdown(pollutants);

  // Hourly AQI timeline
  const hourlyTimes: string[] = json.hourly?.time || [];
  const hourlyAqiValues: number[] = json.hourly?.us_aqi || [];
  const currentIso = rawCurrent.time;
  let startIndex = hourlyTimes.findIndex((t) => t >= currentIso);
  if (startIndex === -1) startIndex = 0;

  const hourlyAqi = [];
  const maxHours = Math.min(hourlyTimes.length, startIndex + 24);
  for (let i = startIndex; i < maxHours; i++) {
    const t = hourlyTimes[i];
    hourlyAqi.push({
      time: t,
      formattedTime: i === startIndex ? 'Now' : formatHourShort(t),
      aqi: Math.round(hourlyAqiValues[i] ?? usAqi),
    });
  }

  return {
    aqi: usAqi,
    europeanAqi: Math.round(rawCurrent.european_aqi ?? usAqi * 0.7),
    category: aqiLevel.category,
    categoryColor: '#5E9B66', // fallback, will be assigned from theme
    explanation: aqiLevel.summary,
    healthRecommendations: aqiLevel.recommendations,
    pollutants,
    pollutantBreakdown,
    hourlyAqi,
    lastUpdated: new Date().toISOString(),
  };
}

export async function searchCities(query: string): Promise<CitySearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;
  const response = await fetchWithTimeout(url, 8000);
  const json = await response.json();

  if (!json.results || !Array.isArray(json.results)) {
    return [];
  }

  return json.results.map((item: any) => ({
    id: item.id,
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
    country: item.country || '',
    countryCode: item.country_code || '',
    admin1: item.admin1,
    timezone: item.timezone,
    elevation: item.elevation,
  }));
}
