import { UK_HISTORICAL_EMISSIONS } from '@/data/ukEmissions';

export const PATHWAY_YEARS = [2025, 2030, 2035, 2040, 2045, 2050] as const;
export const PATHWAY_BASELINE_EMISSIONS = 800;

export interface PathwayPoint {
  year: number;
  emissions: number;
  reduction: number;
}

export interface HistoricalPathwayPoint {
  year: number;
  historicalEmissions?: number;
  scenarioEmissions?: number;
  baselineEmissions: number;
}

/** Generate the app's S-curve projection from the shared baseline to 2050. */
export const generatePathway = (
  totalReduction: number,
  baselineEmissions = PATHWAY_BASELINE_EMISSIONS,
): PathwayPoint[] => {
  const reductionTarget = Math.min(Math.max(totalReduction, 0), 100);

  return PATHWAY_YEARS.map((year) => {
    const t = (year - PATHWAY_YEARS[0]) / (PATHWAY_YEARS[PATHWAY_YEARS.length - 1] - PATHWAY_YEARS[0]);
    const progress = t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const reduction = reductionTarget * progress;

    return {
      year,
      emissions: Math.round(baselineEmissions * (1 - reduction / 100)),
      reduction: Math.round(reduction),
    };
  });
};

/** Merge historical observations with one projected scenario without connecting gaps. */
export const mergeHistoricalWithPathway = (
  totalReduction: number,
  showHistorical = true,
): HistoricalPathwayPoint[] => {
  const pathway = generatePathway(totalReduction);

  if (!showHistorical) {
    return pathway.map((point) => ({
      year: point.year,
      scenarioEmissions: point.emissions,
      baselineEmissions: PATHWAY_BASELINE_EMISSIONS,
    }));
  }

  const result: HistoricalPathwayPoint[] = UK_HISTORICAL_EMISSIONS.map((point) => ({
    year: point.year,
    historicalEmissions: point.emissions,
    baselineEmissions: PATHWAY_BASELINE_EMISSIONS,
  }));

  pathway.forEach((point) => {
    const existing = result.find((item) => item.year === point.year);
    if (existing) {
      existing.scenarioEmissions = point.emissions;
    } else {
      result.push({
        year: point.year,
        scenarioEmissions: point.emissions,
        baselineEmissions: PATHWAY_BASELINE_EMISSIONS,
      });
    }
  });

  return result.sort((a, b) => a.year - b.year);
};

/** Linearly interpolate an estimated emissions value for a year in the pathway. */
export const estimatePathwayEmissions = (
  year: number,
  totalReduction: number,
  baselineEmissions = PATHWAY_BASELINE_EMISSIONS,
): number => {
  const points = generatePathway(totalReduction, baselineEmissions);
  if (year <= points[0].year) return points[0].emissions;
  if (year >= points[points.length - 1].year) return points[points.length - 1].emissions;

  const upperIndex = points.findIndex((point) => point.year >= year);
  const upper = points[upperIndex];
  const lower = points[upperIndex - 1];
  const progress = (year - lower.year) / (upper.year - lower.year);
  return lower.emissions + (upper.emissions - lower.emissions) * progress;
};

export const estimateBudgetPeriodEmissions = (
  startYear: number,
  endYear: number,
  totalReduction: number,
): number => {
  const years = Math.max(1, endYear - startYear + 1);
  let total = 0;
  for (let year = startYear; year <= endYear; year += 1) {
    total += estimatePathwayEmissions(year, totalReduction);
  }
  return Math.round(total / years * 5);
};
