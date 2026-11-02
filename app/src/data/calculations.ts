import type { EmissionsResult, Category } from '@/types';
import { BASELINE_EMISSIONS } from '@/types';
import { levers } from './levers';
import { UK_HISTORICAL_EMISSIONS } from './ukEmissions';

// Independent educational score, not the official MacKay energy-system model.
const categories: Category[] = ['transport','buildings','industry','electricity','land'];
const maximumByCategory: Record<Category, number> = {transport:0,buildings:0,industry:0,electricity:0,land:0};
levers.forEach(lever => { maximumByCategory[lever.category] += Math.max(...lever.levels.map(level => level.emissionsImpact)); });
export const MAX_RAW_IMPACT = Object.values(maximumByCategory).reduce((a,b) => a+b,0);
export const IMPACT_TO_SCORE = 100 / MAX_RAW_IMPACT;
export const validLevels = (input: unknown): input is number[] =>
  Array.isArray(input) && input.length === levers.length &&
  input.every(n => Number.isInteger(n) && n >= 1 && n <= 4);
export const safeLevels = (input: unknown): number[] =>
  validLevels(input) ? [...input] : levers.map(() => 1);

export const calculateEmissions = (levels: number[]): EmissionsResult => {
  const safe = safeLevels(levels);
  const leverImpacts = levers.map((lever,index) =>
    (lever.levels.find(v => v.level === safe[index])?.emissionsImpact ?? 0) * IMPACT_TO_SCORE
  );
  const totalReduction = Math.min(100, leverImpacts.reduce((a,b) => a+b,0));
  const remainingEmissions = Math.max(0, BASELINE_EMISSIONS * (1-totalReduction/100));
  const categoryBreakdown: Record<Category,number> = {transport:0,buildings:0,industry:0,electricity:0,land:0};
  levers.forEach((lever,index) => {categoryBreakdown[lever.category] += leverImpacts[index];});
  return { totalReduction, remainingEmissions, categoryBreakdown, leverImpacts };
};

// Smooth interpolation, anchored at the latest published emissions figure.
// This is illustrative, not a validated 2050 forecast.
export const getProjectedPathway = (score: number) => {
  const start = UK_HISTORICAL_EMISSIONS[UK_HISTORICAL_EMISSIONS.length-1];
  const endpoint = BASELINE_EMISSIONS * (1 - Math.min(100,Math.max(0,score))/100);
  return [start.year,2030,2035,2040,2045,2050].map(year => {
    const t = (year-start.year)/(2050-start.year);
    const eased = t < .5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;
    return {year,emissions:Math.round(start.emissions+(endpoint-start.emissions)*eased)};
  });
};

export type FreightCargoId = 'biomass' | 'hydrogen' | 'timber' | 'coal' | 'containers';

export interface FreightCargoInfo {
  id: FreightCargoId;
  label: string;
  emoji: string;
  color: string;
  detail: string;
  conditions: string[];
}

export interface RailFleetInfo {
  engine: string;
  emoji: string;
  detail: string;
  level: number;
}

// The freight train's cargo is chosen by the other policy levers — shared between
// the animated scene and the Results page so they always agree.
export const getFreightCargoInfo = (levels: number[]): FreightCargoInfo => {
  const bioenergy = levels[14] || 1;
  const hydrogen = levels[8] || 1;
  const forestry = levels[13] || 1;
  const industry = levels[6] || 1;
  const carbonCapture = levels[7] || 1;

  if (bioenergy >= 2) {
    return {
      id: 'biomass', label: 'Biomass bales', emoji: '🌾', color: '#27AE60',
      detail: 'Sustainable biomass for energy is moved by rail in bales.',
      conditions: [`Bioenergy at level ${bioenergy} (≥ 2)`],
    };
  }
  if (hydrogen >= 3) {
    return {
      id: 'hydrogen', label: 'Hydrogen tankers', emoji: '💧', color: '#5DADE2',
      detail: 'Pressurised hydrogen tankers supply the hydrogen economy.',
      conditions: [`Hydrogen at level ${hydrogen} (≥ 3)`],
    };
  }
  if (forestry >= 3) {
    return {
      id: 'timber', label: 'Timber logs', emoji: '🌲', color: '#8D6E63',
      detail: 'Expanded forestry brings harvested timber to market by rail.',
      conditions: [`Forestry at level ${forestry} (≥ 3)`],
    };
  }
  if (industry >= 2 && carbonCapture <= 1) {
    return {
      id: 'coal', label: 'Coal', emoji: '⛏️', color: '#4D5656',
      detail: 'Unabated industry still burns coal — captured when Carbon Capture rises.',
      conditions: [`Industry at level ${industry} (≥ 2)`, `Carbon Capture at level ${carbonCapture} (≤ 1)`],
    };
  }
  return {
    id: 'containers', label: 'Mixed containers', emoji: '📦', color: '#E67E22',
    detail: 'General containerised freight in a balanced 2050 economy.',
    conditions: ['No single cargo lever is dominant'],
  };
};

export const getRailFleetInfo = (levels: number[]): RailFleetInfo => {
  const level = levels[2] || 1;
  if (level >= 4) {
    return {
      engine: 'Hydrogen & electric rail', emoji: '⚡', level,
      detail: 'At Heavy Vehicles 4 the whole fleet turns clean — hydrogen livery on freight and electric passenger rail.',
    };
  }
  if (level >= 2) {
    return {
      engine: 'Electric passenger rail', emoji: '🚄', level,
      detail: 'Heavy Vehicles 2+ electrifies passenger trains; freight stays mixed.',
    };
  }
  return {
    engine: 'Diesel freight trains', emoji: '🚂', level,
    detail: 'At Heavy Vehicles 1 the railway is present-day diesel freight.',
  };
};

export interface LeverOpportunity {
  id: string;
  name: string;
  category: Category;
  currentLevel: number;
  remainingPoints: number;
}

/** Score-point headroom if a lever moves to its highest defined ambition level. */
export const getTopRemainingLevers = (levels: number[], limit = 3): LeverOpportunity[] => {
  const selected = safeLevels(levels);
  const count = Number.isFinite(limit) ? Math.max(0, Math.min(levers.length, Math.trunc(limit))) : 0;
  return levers.map((lever, index) => {
    const current = lever.levels.find(option => option.level === selected[index]);
    const maximum = Math.max(...lever.levels.map(option => option.emissionsImpact));
    return {
      id: lever.id,
      name: lever.name,
      category: lever.category,
      currentLevel: selected[index],
      remainingPoints: Math.max(0, (maximum - (current?.emissionsImpact ?? 0)) * IMPACT_TO_SCORE),
    };
  })
    .filter(option => option.remainingPoints > 0.000001)
    .sort((a, b) => b.remainingPoints - a.remainingPoints || a.name.localeCompare(b.name))
    .slice(0, count);
};

export const encodeLevelsToUrl = (levels: number[]): string => safeLevels(levels).join('');
export const validEncodedLevels = (encoded: string): boolean =>
  new RegExp('^[1-4]{' + levers.length + '}$').test(encoded);

export const decodeLevelsFromUrl = (encoded: string): number[] =>
  validEncodedLevels(encoded) ? encoded.split('').map(Number) : levers.map(() => 1);
export const getEmissionsChartData = (levels: number[]) => {
  const scenario = calculateEmissions(levels);
  const labels: Record<Category,string> = {
    transport:'Transport', buildings:'Buildings', industry:'Industry',
    electricity:'Energy Supply', land:'Agriculture & Waste'
  };
  return [
    {category:'Total', reference:100, scenario:100-scenario.totalReduction},
    ...categories.map(category => {
      const reference=maximumByCategory[category]*IMPACT_TO_SCORE;
      return {category:labels[category],reference,scenario:Math.max(0,reference-scenario.categoryBreakdown[category])};
    })
  ];
};

export const getEnergyChartData = (levels: number[]) => {
  const base2015 = { transport: 649, buildings: 701, industry: 332, fossilFuels: 1978, bioenergy: 143, nuclear: 180, renewables: 53 };
  const scenario = calculateEmissions(levels);
  const rf = 1 - (scenario.totalReduction / 100);

  return [
    { category: 'Transport', value2015: base2015.transport, value2050: Math.round(base2015.transport * (0.9 + rf * 0.1)) },
    { category: 'Building', value2015: base2015.buildings, value2050: Math.round(base2015.buildings * (0.8 + rf * 0.2)) },
    { category: 'Industry & Agriculture', value2015: base2015.industry, value2050: Math.round(base2015.industry * (0.85 + rf * 0.15)) },
    { category: 'Fossil Fuels', value2015: base2015.fossilFuels, value2050: Math.round(base2015.fossilFuels * rf) },
    { category: 'Bioenergy', value2015: base2015.bioenergy, value2050: Math.round(base2015.bioenergy * (1 + (1 - rf) * 0.5)) },
    { category: 'Nuclear', value2015: base2015.nuclear, value2050: Math.round(base2015.nuclear * (1 + (levels[9] - 1) * 0.5)) },
    { category: 'Renewables', value2015: base2015.renewables, value2050: Math.round(base2015.renewables * (1 + (1 - rf) * 10)) },
  ];
};
