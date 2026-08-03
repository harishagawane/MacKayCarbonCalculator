import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
  LineChart, Line, ReferenceLine
} from 'recharts';
import { calculateEmissions, getEmissionsChartData } from '@/data/calculations';
import { UK_HISTORICAL_EMISSIONS } from '@/data/ukEmissions';

interface ComparisonViewProps {
  currentLevels: number[];
  savedLevels: number[];
}

interface PathwayPoint {
  year: number;
  historicalEmissions: number | undefined;
  currentEmissions: number | undefined;
  savedEmissions: number | undefined;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{label}</p>
        {payload.map((entry: any, idx: number) => {
          const val = entry.value;
          return (
            <p key={idx} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof val === 'number' ? val.toFixed(0) : val}
              {entry.name.includes('Historical') || entry.name.includes('Pathway') ? ' MtCO₂e' : '%'}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

/** Generate S-curve pathway projection from 2025 to 2050 */
const generatePathway = (totalReduction: number): { year: number; emissions: number }[] => {
  const years = [2025, 2030, 2035, 2040, 2045, 2050];
  return years.map(year => {
    const t = (year - 2025) / 25;
    const progress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    return {
      year,
      emissions: Math.round(800 * (1 - (totalReduction * progress) / 100)),
    };
  });
};

export const ComparisonView = ({ currentLevels, savedLevels }: ComparisonViewProps) => {
  const currentEmissions = useMemo(() => calculateEmissions(currentLevels), [currentLevels]);
  const savedEmissions = useMemo(() => calculateEmissions(savedLevels), [savedLevels]);
  const currentChartData = useMemo(() => getEmissionsChartData(currentLevels), [currentLevels]);
  const savedChartData = useMemo(() => getEmissionsChartData(savedLevels), [savedLevels]);

  const combinedEmissionsData = useMemo(() =>
    currentChartData.map((row, idx) => ({
      category: row.category,
      current: row.scenario,
      saved: savedChartData[idx]?.scenario ?? row.reference,
      reference: row.reference,
    })),
  [currentChartData, savedChartData]);

  const pathwayData: PathwayPoint[] = useMemo(() => {
    const currentPathway = generatePathway(currentEmissions.totalReduction);
    const savedPathway = generatePathway(savedEmissions.totalReduction);

    // Start with historical data
    const result: PathwayPoint[] = UK_HISTORICAL_EMISSIONS.map(h => ({
      year: h.year,
      historicalEmissions: h.emissions,
      currentEmissions: undefined,
      savedEmissions: undefined,
    }));

    // Add current scenario projections
    currentPathway.forEach(p => {
      const existing = result.find(r => r.year === p.year);
      if (existing) {
        existing.currentEmissions = p.emissions;
      } else {
        result.push({ year: p.year, historicalEmissions: undefined, currentEmissions: p.emissions, savedEmissions: undefined });
      }
    });

    // Add saved scenario projections
    savedPathway.forEach(p => {
      const existing = result.find(r => r.year === p.year);
      if (existing) {
        existing.savedEmissions = p.emissions;
      } else {
        result.push({ year: p.year, historicalEmissions: undefined, currentEmissions: undefined, savedEmissions: p.emissions });
      }
    });

    return result.sort((a, b) => a.year - b.year);
  }, [currentEmissions.totalReduction, savedEmissions.totalReduction]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-2 border-[#42A5F5]"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}>
          <div className="text-xs text-[#42A5F5] font-semibold mb-1">CURRENT SCENARIO</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{Math.round(currentEmissions.totalReduction)}%</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">reduction from 1990</div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{Math.round(currentEmissions.remainingEmissions)} MtCO₂e remaining</div>
        </motion.div>
        <motion.div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-2 border-[#9E9E9E]"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}>
          <div className="text-xs text-gray-500 font-semibold mb-1">SAVED SCENARIO</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{Math.round(savedEmissions.totalReduction)}%</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">reduction from 1990</div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{Math.round(savedEmissions.remainingEmissions)} MtCO₂e remaining</div>
        </motion.div>
      </div>

      <motion.div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Emissions Comparison by Category</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Side-by-side comparison of emissions across categories for both scenarios.</p>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={combinedEmissionsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="category" stroke="var(--chart-text)" tick={{ fill: 'var(--chart-text)', fontSize: 11 }} />
              <YAxis stroke="var(--chart-text)" tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                label={{ value: 'Emissions (% of 1990)', angle: -90, position: 'insideLeft', fill: 'var(--chart-text)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="reference" name="Reference (no action)" fill="#E0E0E0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saved" name="Saved Scenario" fill="#9E9E9E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="current" name="Current Scenario" fill="#42A5F5" radius={[4, 4, 0, 0]}>
                {combinedEmissionsData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.current < entry.reference ? '#42A5F5' : '#EF5350'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Emissions Pathway with Historical Data</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">UK historical emissions (1990-2023) with projected pathways for both scenarios to 2050.</p>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pathwayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="year" stroke="var(--chart-text)" tick={{ fill: 'var(--chart-text)', fontSize: 12 }} />
              <YAxis stroke="var(--chart-text)" tick={{ fill: 'var(--chart-text)', fontSize: 12 }} domain={[0, 800]}
                label={{ value: 'Emissions (MtCO₂e)', angle: -90, position: 'insideLeft', fill: 'var(--chart-text)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <ReferenceLine y={0} stroke="#4CAF50" strokeWidth={2} strokeDasharray="5 5"
                label={{ value: 'Net Zero', position: 'right', fill: '#4CAF50', fontSize: 11 }} />
              <ReferenceLine x={2023} stroke="#9E9E9E" strokeWidth={1.5} strokeDasharray="4 4"
                label={{ value: 'Now', position: 'top', fill: '#9E9E9E', fontSize: 10 }} />
              <Line type="monotone" dataKey="historicalEmissions" name="UK Historical Emissions"
                stroke="#4CAF50" strokeWidth={3} dot={{ fill: '#4CAF50', r: 3 }} connectNulls={false} />
              <Line type="monotone" dataKey="savedEmissions" name="Saved Scenario Pathway"
                stroke="#9E9E9E" strokeWidth={2.5} dot={{ fill: '#9E9E9E', r: 4 }} strokeDasharray="8 4" connectNulls={false} />
              <Line type="monotone" dataKey="currentEmissions" name="Current Scenario Pathway"
                stroke="#42A5F5" strokeWidth={3} dot={{ fill: '#42A5F5', r: 5 }} connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-6 mt-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#4CAF50]" /><span>Historical (actual)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#42A5F5]" /><span>Projected</span></div>
        </div>
      </motion.div>

      <motion.div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Scenario Comparison Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-[#42A5F5]">{Math.round(currentEmissions.totalReduction)}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Current Reduction</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className={`text-2xl font-bold ${
              currentEmissions.totalReduction > savedEmissions.totalReduction ? 'text-green-600' :
              currentEmissions.totalReduction < savedEmissions.totalReduction ? 'text-red-500' : 'text-gray-500'
            }`}>
              {currentEmissions.totalReduction > savedEmissions.totalReduction ? '↑' :
               currentEmissions.totalReduction < savedEmissions.totalReduction ? '↓' : '='}
              {Math.abs(currentEmissions.totalReduction - savedEmissions.totalReduction).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Difference</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-gray-500">{Math.round(savedEmissions.totalReduction)}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Saved Reduction</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
