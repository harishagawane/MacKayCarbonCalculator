import type { EmissionsResult, Category } from '@/types';
import { BASELINE_EMISSIONS } from '@/types';
import { levers } from './levers';

export const calculateEmissions = (levels: number[]): EmissionsResult => {
  const leverImpacts = levers.map((lever, index) => {
    const level = levels[index] || 1;
    const levelData = lever.levels.find(l => l.level === level);
    return levelData?.emissionsImpact || 0;
  });

  const totalRawReduction = leverImpacts.reduce((sum, impact) => sum + impact, 0);
  const totalReduction = Math.min(totalRawReduction, 100);
  const remainingEmissions = BASELINE_EMISSIONS * (1 - totalReduction / 100);

  const categoryBreakdown: Record<Category, number> = {
    transport: 0, buildings: 0, industry: 0, electricity: 0, land: 0,
  };

  levers.forEach((lever, index) => {
    categoryBreakdown[lever.category] += leverImpacts[index];
  });

  return { totalReduction, remainingEmissions, categoryBreakdown, leverImpacts };
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

export const encodeLevelsToUrl = (levels: number[]): string => 
  levels.map(l => Math.min(Math.max(l, 1), 4)).join('');

export const decodeLevelsFromUrl = (encoded: string): number[] => {
  const levels = encoded.split('').map(c => parseInt(c, 10));
  const valid = levels.map(l => (isNaN(l) || l < 1 || l > 4 ? 1 : l));
  while (valid.length < 15) valid.push(1);
  return valid.slice(0, 15);
};

export const getEmissionsChartData = (levels: number[]) => {
  const scenario = calculateEmissions(levels);
  return [
    { category: 'Total', reference: 100, scenario: 100 - scenario.totalReduction },
    { category: 'Transport', reference: 25, scenario: 25 - (scenario.categoryBreakdown.transport * 0.25) },
    { category: 'Buildings', reference: 20, scenario: 20 - (scenario.categoryBreakdown.buildings * 0.20) },
    { category: 'Industry', reference: 15, scenario: 15 - (scenario.categoryBreakdown.industry * 0.15) },
    { category: 'Energy Supply', reference: 25, scenario: 25 - (scenario.categoryBreakdown.electricity * 0.25) },
    { category: 'Agriculture & Waste', reference: 15, scenario: 15 - (scenario.categoryBreakdown.land * 0.15) },
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
