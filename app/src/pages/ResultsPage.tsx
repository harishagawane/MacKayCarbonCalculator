import { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { EmissionsChart } from '@/components/charts/EmissionsChart';
import { EnergyChart } from '@/components/charts/EnergyChart';
import { TimelineChart } from '@/components/charts/TimelineChart';
import { calculateEmissions, getEmissionsChartData, getEnergyChartData, getFreightCargoInfo, getRailFleetInfo } from '@/data/calculations';
import { FeasibilityWarnings } from '@/components/FeasibilityWarnings';
import { SensitivityAnalysis } from '@/components/SensitivityAnalysis';
import { ExportButton } from '@/components/ExportButton';
import { ComparisonView } from '@/components/ComparisonView';
import { levers } from '@/data/levers';
import { CATEGORY_NAMES } from '@/types';
import { ArrowLeft, Share2, Check } from 'lucide-react';

interface ResultsPageProps {
  levels: number[];
  onBack: () => void;
  getShareUrl: () => string;
  comparisonLevels?: number[] | null;
}

const levelColors: Record<number, string> = {
  1: '#F44336',
  2: '#FF9800',
  3: '#FFC107',
  4: '#4CAF50',
};

export const ResultsPage = ({ levels, onBack, getShareUrl, comparisonLevels }: ResultsPageProps) => {
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const emissions = useMemo(() => calculateEmissions(levels), [levels]);
  const emissionsChartData = useMemo(() => getEmissionsChartData(levels), [levels]);
  const energyChartData = useMemo(() => getEnergyChartData(levels), [levels]);
  const freightCargo = useMemo(() => getFreightCargoInfo(levels), [levels]);
  const railFleet = useMemo(() => getRailFleetInfo(levels), [levels]);

  const hasComparison = !!comparisonLevels;

  const handleShare = async () => {
    const link = getShareUrl();
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch { window.prompt('Copy your scenario link:', link); }
  };

  const leverDetails = useMemo(() => {
    return levers.map((lever, index) => {
      const level = levels[index];
      const levelData = lever.levels.find(l => l.level === level);
      return {
        ...lever,
        currentLevel: level,
        levelDescription: levelData?.description || '',
        levelImpact: emissions.leverImpacts[index],
      };
    });
  }, [levels, emissions.leverImpacts]);

  const groupedLevers = useMemo(() => {
    const groups: Record<string, typeof leverDetails> = {};
    leverDetails.forEach(lever => {
      if (!groups[lever.category]) groups[lever.category] = [];
      groups[lever.category].push(lever);
    });
    return groups;
  }, [leverDetails]);

  return (
    <motion.div
      className="min-h-screen bg-gray-100 dark:bg-gray-900"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
    >
      {/* Header */}
      <motion.header
        className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 dark:text-gray-300">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">My Scenario</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Results in a glimpse</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ExportButton targetRef={resultsRef} />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleShare}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    copied ? 'bg-green-600 hover:bg-green-700' : 'bg-[#1565C0] hover:bg-[#0D47A1]'
                  }`}
                >
                  <motion.div initial={false} animate={copied ? { rotate: [0, 360] } : {}} transition={{ duration: 0.5 }}>
                    {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  </motion.div>
                  {copied ? 'Copied!' : 'Share Scenario'}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <div ref={resultsRef}>
        {/* Stats */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
              whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <motion.div
                className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2"
                key={emissions.totalReduction}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {Math.round(emissions.totalReduction)}%
              </motion.div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Illustrative Policy Score</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">normalised 15-lever index</div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 300 }}
              whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <motion.div
                className="text-4xl font-bold text-[#EF5350] mb-2"
                key={emissions.remainingEmissions}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {Math.round(emissions.remainingEmissions)}
              </motion.div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Illustrative Residual Emissions</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">MtCO₂e/year (illustrative)</div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 300 }}
              whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <motion.div
                className={`text-4xl font-bold mb-2 ${emissions.totalReduction >= 100 ? 'text-green-600' : 'text-amber-500'}`}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {emissions.totalReduction >= 100 ? '✓ Maximum Score' : `${Math.round(100 - emissions.totalReduction)}%`}
              </motion.div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {emissions.totalReduction >= 100 ? 'Model Maximum' : 'Remaining to Model Maximum'}
              </div>
            </motion.div>
          </div>

          <p role="note" className="mt-4 rounded-lg bg-sky-50 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">Independent educational index only. Residual emissions, sector allocation and future energy are illustrative, not scientific forecasts or official MacKay model results.</p>
          <motion.div className="mt-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <FeasibilityWarnings levels={levels} totalReduction={emissions.totalReduction} />
          </motion.div>

          {/* Freight & Rail breakdown */}
          <motion.div
            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            {/* Cargo card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm flex items-start gap-4">
              <motion.div
                className="text-4xl"
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.5 }}
              >
                {freightCargo.emoji}
              </motion.div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Freight on the railway</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{freightCargo.label}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{freightCargo.detail}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {freightCargo.conditions.map((c) => (
                    <span
                      key={c}
                      className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${freightCargo.color}22`, color: freightCargo.color }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Rail fleet card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm flex items-start gap-4">
              <motion.div
                className="text-4xl"
                initial={{ scale: 0, rotate: 12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.55 }}
              >
                {railFleet.emoji}
              </motion.div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Rail fleet</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{railFleet.engine}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{railFleet.detail}</p>
                <div className="mt-3">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                    Heavy Vehicles · Level {railFleet.level}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Tabs */}
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <Tabs defaultValue={hasComparison ? 'compare' : 'emissions'} className="w-full">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <TabsList className="w-full bg-white dark:bg-gray-800 border dark:border-gray-700 mb-6 flex-wrap h-auto">
                {hasComparison && (
                  <TabsTrigger value="compare" className="flex-1 min-w-[120px]">📊 Compare</TabsTrigger>
                )}
                <TabsTrigger value="emissions" className="flex-1 min-w-[120px]">Policy Scores</TabsTrigger>
                <TabsTrigger value="energy" className="flex-1 min-w-[120px]">Energy</TabsTrigger>
                <TabsTrigger value="timeline" className="flex-1 min-w-[120px]">Pathway</TabsTrigger>
                <TabsTrigger value="sensitivity" className="flex-1 min-w-[120px]">Sensitivity</TabsTrigger>
                <TabsTrigger value="details" className="flex-1 min-w-[120px]">Scenario</TabsTrigger>
              </TabsList>
            </motion.div>

            {hasComparison && comparisonLevels && (
              <TabsContent value="compare">
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <ComparisonView currentLevels={levels} savedLevels={comparisonLevels} />
                </motion.div>
              </TabsContent>
            )}

            <TabsContent value="emissions">
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Illustrative Policy Impact by Lever Group
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  These normalised scores are not measured UK sectoral emissions.
                </p>
                <EmissionsChart data={emissionsChartData} />
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="text-left py-2 text-gray-600 dark:text-gray-400">Category</th>
                        <th className="text-right py-2 text-gray-600 dark:text-gray-400">Reference (%)</th>
                        <th className="text-right py-2 text-gray-600 dark:text-gray-400">Your Scenario (%)</th>
                        <th className="text-right py-2 text-gray-600 dark:text-gray-400">Reduction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emissionsChartData.map((row, idx) => (
                        <motion.tr key={row.category} className="border-b dark:border-gray-700"
                          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.05 }}>
                          <td className="py-2 text-gray-900 dark:text-gray-200">{row.category}</td>
                          <td className="text-right text-gray-500 dark:text-gray-400">{row.reference.toFixed(0)}%</td>
                          <td className="text-right text-[#42A5F5]">{row.scenario.toFixed(0)}%</td>
                          <td className="text-right text-green-600">-{(row.reference - row.scenario).toFixed(0)}%</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="energy">
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Illustrative Energy Indicators: 2015 and 2050
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Simplified energy indicators, not a reconciled energy-system forecast.
                </p>
                <EnergyChart data={energyChartData} />
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="text-left py-2 text-gray-600 dark:text-gray-400">Category</th>
                        <th className="text-right py-2 text-gray-600 dark:text-gray-400">2015 (TWh)</th>
                        <th className="text-right py-2 text-gray-600 dark:text-gray-400">2050 (TWh)</th>
                        <th className="text-right py-2 text-gray-600 dark:text-gray-400">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {energyChartData.map((row, idx) => (
                        <motion.tr key={row.category} className="border-b dark:border-gray-700"
                          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.05 }}>
                          <td className="py-2 text-gray-900 dark:text-gray-200">{row.category}</td>
                          <td className="text-right text-gray-500 dark:text-gray-400">{row.value2015}</td>
                          <td className="text-right text-[#42A5F5]">{row.value2050}</td>
                          <td className={`text-right ${row.value2050 > row.value2015 ? 'text-red-500' : 'text-green-600'}`}>
                            {row.value2050 > row.value2015 ? '+' : ''}
                            {((row.value2050 - row.value2015) / row.value2015 * 100).toFixed(0)}%
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="timeline">
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Emissions Pathway to 2050
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Rounded published emissions through 2025 (2025 provisional), then illustrative interpolation.
                </p>
                <TimelineChart totalReduction={emissions.totalReduction} showHistorical />
              </motion.div>
            </TabsContent>

            <TabsContent value="sensitivity">
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <SensitivityAnalysis levels={levels} />
              </motion.div>
            </TabsContent>

            <TabsContent value="details">
              <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}>
                {Object.entries(groupedLevers).map(([category, catLevers], catIdx) => (
                  <motion.div key={category} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                    initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.5 + catIdx * 0.1, type: 'spring', stiffness: 300 }}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      {CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES]}
                    </h3>
                    <div className="space-y-4">
                      {catLevers.map((lever, idx) => (
                        <motion.div key={lever.id} className="border-b dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                          initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + idx * 0.05 }}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">{lever.name}</h4>
                            <div className="flex items-center gap-2">
                              <motion.span className="text-xs px-2 py-1 rounded-full font-medium text-white"
                                style={{ backgroundColor: levelColors[lever.currentLevel] }}
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 500, delay: 0.7 + idx * 0.05 }}>
                                Level {lever.currentLevel}
                              </motion.span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">+{lever.levelImpact.toFixed(1)} score pts</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{lever.levelDescription}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </motion.div>
  );
};
