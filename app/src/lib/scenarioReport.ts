import { calculateEmissions, encodeLevelsToUrl, getTopRemainingLevers, safeLevels } from '@/data/calculations';
import { levers } from '@/data/levers';
import { BASELINE_EMISSIONS } from '@/types';

export const SCENARIO_MODEL_NOTE =
  'Independent educational weighted-lever score, not the UK government MacKay model or a validated carbon/emissions forecast.';

export interface ScenarioReport {
  schemaVersion: 1;
  createdAt: string;
  modelNote: string;
  encodedLevels: string;
  scorePercent: number;
  illustrativeResidualMtCO2e: number;
  illustrative1990BaselineMtCO2e: number;
  levers: Array<{
    id: string;
    name: string;
    category: string;
    level: number;
    scorePoints: number;
    remainingScorePoints: number;
  }>;
  comparison?: {
    encodedLevels: string;
    scorePercent: number;
    illustrativeResidualMtCO2e: number;
  };
}

/** Create a transparent, reproducible export without silently changing lever inputs. */
export const createScenarioReport = (
  levels: number[],
  comparisonLevels?: number[] | null,
  createdAt = new Date().toISOString(),
): ScenarioReport => {
  const selected = safeLevels(levels);
  const result = calculateEmissions(selected);
  const headroom = new Map(getTopRemainingLevers(selected, levers.length).map(row => [row.id, row.remainingPoints]));
  const report: ScenarioReport = {
    schemaVersion: 1,
    createdAt,
    modelNote: SCENARIO_MODEL_NOTE,
    encodedLevels: encodeLevelsToUrl(selected),
    scorePercent: result.totalReduction,
    illustrativeResidualMtCO2e: result.remainingEmissions,
    illustrative1990BaselineMtCO2e: BASELINE_EMISSIONS,
    levers: levers.map((lever, index) => ({
      id: lever.id,
      name: lever.name,
      category: lever.category,
      level: selected[index],
      scorePoints: result.leverImpacts[index],
      remainingScorePoints: headroom.get(lever.id) ?? 0,
    })),
  };
  if (comparisonLevels) {
    const compare = safeLevels(comparisonLevels);
    const summary = calculateEmissions(compare);
    report.comparison = {
      encodedLevels: encodeLevelsToUrl(compare),
      scorePercent: summary.totalReduction,
      illustrativeResidualMtCO2e: summary.remainingEmissions,
    };
  }
  return report;
};

const csvCell = (value: string | number): string => {
  const text = String(value);
  // Guard spreadsheet applications against CSV formula injection.
  const safe = /^[=+@\-\t\r]/.test(text) ? "'" + text : text;
  return '"' + safe.replace(/"/g, '""') + '"';
};

export const scenarioReportToCsv = (report: ScenarioReport): string => {
  const rows: Array<Array<string | number>> = [
    ['Field', 'Value'],
    ['Model', report.modelNote],
    ['Generated at', report.createdAt],
    ['Scenario code', report.encodedLevels],
    ['Illustrative score (%)', report.scorePercent],
    ['Illustrative residual (MtCO2e/year)', report.illustrativeResidualMtCO2e],
    ['Rounded 1990 baseline (MtCO2e/year)', report.illustrative1990BaselineMtCO2e],
  ];
  if (report.comparison) {
    rows.push(
      ['Comparison code', report.comparison.encodedLevels],
      ['Comparison score (%)', report.comparison.scorePercent],
      ['Comparison illustrative residual (MtCO2e/year)', report.comparison.illustrativeResidualMtCO2e],
    );
  }
  rows.push(
    [],
    ['Lever', 'Category', 'Level', 'Score points', 'Remaining potential score points'],
    ...report.levers.map(lever => [
      lever.name, lever.category, lever.level, lever.scorePoints, lever.remainingScorePoints,
    ]),
  );
  return '\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
};
