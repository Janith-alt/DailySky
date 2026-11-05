import { AqiCategory, PollutantDetail } from '../types/airQuality';
import { getAqiLevel } from '../constants/aqiStandards';

export function calculateAqiCategory(usAqi: number): AqiCategory {
  return getAqiLevel(usAqi).category;
}

export function buildPollutantBreakdown(pollutants: {
  pm2_5: number;
  pm10: number;
  ozone: number;
  nitrogen_dioxide: number;
  carbon_monoxide: number;
  sulphur_dioxide: number;
}): PollutantDetail[] {
  const getStatus = (val: number, goodMax: number, modMax: number, poorMax: number, vPoorMax: number): 'Good' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe' => {
    if (val <= goodMax) return 'Good';
    if (val <= modMax) return 'Moderate';
    if (val <= poorMax) return 'Poor';
    if (val <= vPoorMax) return 'Very Poor';
    return 'Severe';
  };

  return [
    {
      code: 'pm2_5',
      name: 'Fine Particles',
      chemicalFormula: 'PM2.5',
      value: Math.round(pollutants.pm2_5 * 10) / 10,
      unit: 'µg/m³',
      status: getStatus(pollutants.pm2_5, 12, 35.4, 55.4, 150.4),
      description: 'Microscopic particles smaller than 2.5 micrometers that penetrate deep into lung tissue.',
    },
    {
      code: 'pm10',
      name: 'Coarse Particles',
      chemicalFormula: 'PM10',
      value: Math.round(pollutants.pm10 * 10) / 10,
      unit: 'µg/m³',
      status: getStatus(pollutants.pm10, 54, 154, 254, 354),
      description: 'Inhalable dust, pollen, and debris that irritate respiratory passages.',
    },
    {
      code: 'ozone',
      name: 'Ground Ozone',
      chemicalFormula: 'O₃',
      value: Math.round(pollutants.ozone * 10) / 10,
      unit: 'µg/m³',
      status: getStatus(pollutants.ozone, 60, 120, 180, 240),
      description: 'Secondary gas formed when sunlight reacts with urban emissions.',
    },
    {
      code: 'nitrogen_dioxide',
      name: 'Nitrogen Dioxide',
      chemicalFormula: 'NO₂',
      value: Math.round(pollutants.nitrogen_dioxide * 10) / 10,
      unit: 'µg/m³',
      status: getStatus(pollutants.nitrogen_dioxide, 40, 90, 180, 280),
      description: 'Emitted from vehicular exhaust and power generation facilities.',
    },
    {
      code: 'carbon_monoxide',
      name: 'Carbon Monoxide',
      chemicalFormula: 'CO',
      value: Math.round(pollutants.carbon_monoxide * 10) / 10,
      unit: 'µg/m³',
      status: getStatus(pollutants.carbon_monoxide, 400, 1000, 2000, 5000),
      description: 'Colorless, odorless byproduct of incomplete fuel combustion.',
    },
    {
      code: 'sulphur_dioxide',
      name: 'Sulphur Dioxide',
      chemicalFormula: 'SO₂',
      value: Math.round(pollutants.sulphur_dioxide * 10) / 10,
      unit: 'µg/m³',
      status: getStatus(pollutants.sulphur_dioxide, 20, 80, 250, 500),
      description: 'Precursor gas emitted from industrial fossil fuel burning.',
    },
  ];
}
