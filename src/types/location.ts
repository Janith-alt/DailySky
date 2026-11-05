export interface LocationData {
  id: string; // unique key, e.g. "tokyo-35.68-139.69" or "current"
  name: string;
  admin1?: string; // state / province
  country: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  isCurrentLocation?: boolean;
}

export interface CitySearchResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  admin1?: string;
  timezone?: string;
  elevation?: number;
}
