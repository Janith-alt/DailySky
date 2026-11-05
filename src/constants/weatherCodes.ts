export interface WeatherCodeInfo {
  label: string;
  iconName: 'sun' | 'moon' | 'cloud' | 'cloud-sun' | 'cloud-moon' | 'cloud-rain' | 'cloud-drizzle' | 'cloud-lightning' | 'cloud-snow' | 'cloud-fog' | 'wind';
  isPrecipitation: boolean;
  isSevere: boolean;
}

export function getWeatherInfo(code: number, isDay: boolean = true): WeatherCodeInfo {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        iconName: isDay ? 'sun' : 'moon',
        isPrecipitation: false,
        isSevere: false,
      };
    case 1:
      return {
        label: isDay ? 'Mainly Sunny' : 'Mainly Clear',
        iconName: isDay ? 'cloud-sun' : 'cloud-moon',
        isPrecipitation: false,
        isSevere: false,
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        iconName: isDay ? 'cloud-sun' : 'cloud-moon',
        isPrecipitation: false,
        isSevere: false,
      };
    case 3:
      return {
        label: 'Overcast',
        iconName: 'cloud',
        isPrecipitation: false,
        isSevere: false,
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        iconName: 'cloud-fog',
        isPrecipitation: false,
        isSevere: false,
      };
    case 51:
      return {
        label: 'Light Drizzle',
        iconName: 'cloud-drizzle',
        isPrecipitation: true,
        isSevere: false,
      };
    case 53:
      return {
        label: 'Moderate Drizzle',
        iconName: 'cloud-drizzle',
        isPrecipitation: true,
        isSevere: false,
      };
    case 55:
      return {
        label: 'Dense Drizzle',
        iconName: 'cloud-drizzle',
        isPrecipitation: true,
        isSevere: false,
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        iconName: 'cloud-drizzle',
        isPrecipitation: true,
        isSevere: true,
      };
    case 61:
      return {
        label: 'Slight Rain',
        iconName: 'cloud-rain',
        isPrecipitation: true,
        isSevere: false,
      };
    case 63:
      return {
        label: 'Moderate Rain',
        iconName: 'cloud-rain',
        isPrecipitation: true,
        isSevere: false,
      };
    case 65:
      return {
        label: 'Heavy Rain',
        iconName: 'cloud-rain',
        isPrecipitation: true,
        isSevere: true,
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        iconName: 'cloud-rain',
        isPrecipitation: true,
        isSevere: true,
      };
    case 71:
      return {
        label: 'Slight Snowfall',
        iconName: 'cloud-snow',
        isPrecipitation: true,
        isSevere: false,
      };
    case 73:
      return {
        label: 'Moderate Snowfall',
        iconName: 'cloud-snow',
        isPrecipitation: true,
        isSevere: false,
      };
    case 75:
      return {
        label: 'Heavy Snowfall',
        iconName: 'cloud-snow',
        isPrecipitation: true,
        isSevere: true,
      };
    case 77:
      return {
        label: 'Snow Grains',
        iconName: 'cloud-snow',
        isPrecipitation: true,
        isSevere: false,
      };
    case 80:
      return {
        label: 'Slight Rain Showers',
        iconName: 'cloud-rain',
        isPrecipitation: true,
        isSevere: false,
      };
    case 81:
      return {
        label: 'Moderate Showers',
        iconName: 'cloud-rain',
        isPrecipitation: true,
        isSevere: false,
      };
    case 82:
      return {
        label: 'Violent Rain Showers',
        iconName: 'cloud-rain',
        isPrecipitation: true,
        isSevere: true,
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        iconName: 'cloud-snow',
        isPrecipitation: true,
        isSevere: false,
      };
    case 95:
      return {
        label: 'Thunderstorm',
        iconName: 'cloud-lightning',
        isPrecipitation: true,
        isSevere: true,
      };
    case 96:
    case 99:
      return {
        label: 'Thunderstorm with Hail',
        iconName: 'cloud-lightning',
        isPrecipitation: true,
        isSevere: true,
      };
    default:
      return {
        label: 'Partly Cloudy',
        iconName: isDay ? 'cloud-sun' : 'cloud-moon',
        isPrecipitation: false,
        isSevere: false,
      };
  }
}
