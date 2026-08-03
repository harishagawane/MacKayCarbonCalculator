export type Category = 'transport' | 'buildings' | 'industry' | 'electricity' | 'land';

export interface Level {
  level: 1 | 2 | 3 | 4;
  description: string;
  emissionsImpact: number;
}

export interface Lever {
  id: string;
  name: string;
  shortName: string;
  category: Category;
  description: string;
  levels: Level[];
}

export interface EmissionsResult {
  totalReduction: number;
  remainingEmissions: number;
  categoryBreakdown: Record<Category, number>;
  leverImpacts: number[];
}

export const BASELINE_EMISSIONS = 800;

export const CATEGORY_NAMES: Record<Category, string> = {
  transport: 'TRANSPORT',
  buildings: 'BUILDINGS',
  industry: 'INDUSTRY, CCS & HYDROGEN',
  electricity: 'LOW CARBON ELECTRICITY',
  land: 'LAND, BIOENERGY & WASTE',
};
