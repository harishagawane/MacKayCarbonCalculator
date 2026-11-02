/**
 * UK Territorial Greenhouse Gas Emissions (MtCO₂e)
 * Rounded educational sample points, not a complete official time series.
 * 1990 is rounded to 800 MtCO₂e; 2025 is provisional. Excludes IAS.
 * Source: https://www.gov.uk/government/collections/uk-territorial-greenhouse-gas-emissions-statistics
 */
export interface HistoricalDataPoint {
  year: number;
  emissions: number; // MtCO₂e
  reductionFrom1990: number; // percentage
}

export const UK_HISTORICAL_EMISSIONS: HistoricalDataPoint[] = [
  { year: 1990, emissions: 800, reductionFrom1990: 0 },
  { year: 1995, emissions: 720, reductionFrom1990: 10 },
  { year: 2000, emissions: 680, reductionFrom1990: 15 },
  { year: 2005, emissions: 675, reductionFrom1990: 16 },
  { year: 2010, emissions: 600, reductionFrom1990: 25 },
  { year: 2015, emissions: 500, reductionFrom1990: 38 },
  { year: 2018, emissions: 450, reductionFrom1990: 44 },
  { year: 2019, emissions: 435, reductionFrom1990: 46 },
  { year: 2020, emissions: 410, reductionFrom1990: 49 },
  { year: 2021, emissions: 425, reductionFrom1990: 47 },
  { year: 2022, emissions: 410, reductionFrom1990: 49 },
  { year: 2023, emissions: 384, reductionFrom1990: 52 },
  { year: 2024, emissions: 373, reductionFrom1990: 53 }, // final (rounded)
  { year: 2025, emissions: 367, reductionFrom1990: 54 }, // provisional
];

/**
 * UK Carbon Budgets (legally binding 5-year caps)
 * Values in MtCO₂e total over the period.
 * Available for future carbon budget tracker feature.
 */
export const UK_CARBON_BUDGETS = [
  { period: '2008-2012', cap: 3018, actual: 3000, label: '1st Carbon Budget' },
  { period: '2013-2017', cap: 2782, actual: 2500, label: '2nd Carbon Budget' },
  { period: '2018-2022', cap: 2544, actual: 2125, label: '3rd Carbon Budget' },
  { period: '2023-2027', cap: 1950, label: '4th Carbon Budget' },
  { period: '2028-2032', cap: 1725, label: '5th Carbon Budget' },
  { period: '2033-2037', cap: 965, label: '6th Carbon Budget' },
];

/**
 * Key milestones:
 * - 1990: Baseline year (800 MtCO₂e)
 * - 2008: Climate Change Act passed (80% reduction by 2050 target)
 * - 2019: Net Zero by 2050 target legislated
 * - 2020: COVID-19 caused temporary dip in emissions
 * - 2023: Emissions at ~52% below 1990 levels
 */
