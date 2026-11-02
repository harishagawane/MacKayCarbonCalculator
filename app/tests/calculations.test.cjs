const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Compile the actual TypeScript source in memory. No mock model or extra test
// runner dependency: this checks the shipping calculation modules directly.
const root = path.resolve(__dirname, '..');
const cache = new Map();
function loadSource(relative) {
  if (cache.has(relative)) return cache.get(relative).exports;
  const filename = path.join(root, relative);
  const js = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    fileName: filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    reportDiagnostics: true,
  });
  const errors = js.diagnostics?.filter(d => d.category === ts.DiagnosticCategory.Error) ?? [];
  assert.equal(errors.length, 0, 'Cannot transpile ' + relative);
  const module = { exports: {} };
  cache.set(relative, module);
  const localRequire = name => {
    if (name === '@/types') return loadSource('src/types/index.ts');
    if (name === './levers') return loadSource('src/data/levers.ts');
    if (name === './ukEmissions') return loadSource('src/data/ukEmissions.ts');
    if (name === '@/data/calculations') return loadSource('src/data/calculations.ts');
    if (name === '@/data/levers') return loadSource('src/data/levers.ts');
    throw new Error('Unexpected test import: ' + name);
  };
  const execute = new Function('require', 'module', 'exports', js.outputText);
  execute(localRequire, module, module.exports);
  return module.exports;
}
const { levers } = loadSource('src/data/levers.ts');
const model = loadSource('src/data/calculations.ts');
const exporter = loadSource('src/lib/scenarioReport.ts');

const base = levers.map(() => 1);
const max = levers.map(() => 4);
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, a + ' != ' + b);

test('all 15 levers have valid levels and coherent endpoints', () => {
  assert.equal(levers.length, 15);
  for (const lever of levers) {
    assert.deepEqual(lever.levels.map(item => item.level), [1, 2, 3, 4]);
    for (const option of lever.levels) assert.ok(Number.isFinite(option.emissionsImpact));
  }
  close(model.calculateEmissions(base).totalReduction, 0);
  close(model.calculateEmissions(max).totalReduction, 100);
});

test('shared URL validation rejects malformed and non-integer values', () => {
  const encoded = model.encodeLevelsToUrl(base);
  assert.equal(encoded, '1'.repeat(15));
  assert.deepEqual(model.decodeLevelsFromUrl(encoded), base);
  for (const bad of ['123', '4'.repeat(16), '0'.repeat(15), 'a'.repeat(15), '2'.repeat(14) + '5']) {
    assert.equal(model.validEncodedLevels(bad), false);
  }
  assert.equal(model.validLevels([NaN, ...base.slice(1)]), false);
  assert.deepEqual(model.safeLevels([2, NaN, ...base.slice(2)]), base);
});

test('category model scores reconcile with the headline for 256 scenarios', () => {
  for (let seed = 0; seed < 256; seed++) {
    const selected = base.map((_, index) => 1 + ((seed * 7 + index * 3 + (seed >>> (index % 8))) % 4));
    const result = model.calculateEmissions(selected);
    const rows = model.getEmissionsChartData(selected);
    close(Object.values(result.categoryBreakdown).reduce((a, b) => a + b, 0), result.totalReduction);
    close(rows.slice(1).reduce((sum, row) => sum + row.reference, 0), 100);
    close(rows.slice(1).reduce((sum, row) => sum + row.scenario, 0), 100 - result.totalReduction);
    assert.ok(result.totalReduction >= 0 && result.totalReduction <= 100);
    assert.ok(result.remainingEmissions >= 0);
    for (const row of rows) assert.ok(row.scenario >= -1e-8 && row.scenario <= row.reference + 1e-8);
  }
});

test('score opportunities are sorted, deterministic, and empty at maximum effort', () => {
  const suggestions = model.getTopRemainingLevers(base);
  assert.equal(suggestions.length, 3);
  for (let i = 1; i < suggestions.length; i++) {
    assert.ok(suggestions[i-1].remainingPoints >= suggestions[i].remainingPoints);
  }
  assert.deepEqual(model.getTopRemainingLevers(max), []);
});

test('illustrative 2025 pathway starts at published estimate and ends at selected model score', () => {
  for (const selected of [base, max, base.map((_, i) => 1 + (i % 4))]) {
    const score = model.calculateEmissions(selected).totalReduction;
    const path = model.getProjectedPathway(score);
    assert.equal(path[0].year, 2025);
    assert.equal(path[0].emissions, 367);
    assert.equal(path.at(-1).year, 2050);
    assert.equal(path.at(-1).emissions, Math.round(800 * (1-score/100)));
  }
});

test('CSV and JSON report use the same actual 15-lever model inputs', () => {
  const report = exporter.createScenarioReport(base, max, '2026-11-02T00:00:00.000Z');
  assert.equal(report.levers.length, 15);
  assert.equal(report.encodedLevels, '1'.repeat(15));
  close(report.scorePercent, 0);
  close(report.comparison.scorePercent, 100);
  assert.equal(report.createdAt, '2026-11-02T00:00:00.000Z');
  assert.ok(exporter.scenarioReportToCsv(report).includes('Score points'));
  assert.ok(JSON.stringify(report).includes(report.modelNote));
});
