import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { levers } from '@/data/levers';
import { calculateEmissions } from '@/data/calculations';
import type { Lever } from '@/types';

interface SensitivityAnalysisProps {
  levels: number[];
}

interface LeverImpact {
  lever: Lever;
  currentLevel: number;
  maxPotential: number;
  currentImpact: number;
  percentageOfMax: number;
}

export const SensitivityAnalysis = ({ levels }: SensitivityAnalysisProps) => {
  const currentTotal = useMemo(() => calculateEmissions(levels).totalReduction, [levels]);

  const impacts: LeverImpact[] = useMemo(() => {
    return levers.map((lever, idx) => {
      const currentLevel = levels[idx];
      const levelData = lever.levels.find(l => l.level === currentLevel);
      const currentImpact = levelData?.emissionsImpact || 0;
      const maxLevel = lever.levels[lever.levels.length - 1];
      const maxPotential = maxLevel.emissionsImpact;
      return {
        lever,
        currentLevel,
        maxPotential,
        currentImpact,
        percentageOfMax: maxPotential > 0 ? (currentImpact / maxPotential) * 100 : 0,
      };
    });
  }, [levels]);

  // Sort by max potential (highest impact levers first)
  const sorted = useMemo(() => [...impacts].sort((a, b) => b.maxPotential - a.maxPotential), [impacts]);

  // Category aggregate
  const categoryImpact = useMemo(() => {
    const groups: Record<string, { max: number; current: number }> = {};
    impacts.forEach(i => {
      if (!groups[i.lever.category]) groups[i.lever.category] = { max: 0, current: 0 };
      groups[i.lever.category].max += i.maxPotential;
      groups[i.lever.category].current += i.currentImpact;
    });
    return groups;
  }, [impacts]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Sensitivity Analysis</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Which levers contribute most to your total emissions reduction.
        </p>
      </div>

      {/* Top levers by impact */}
      <div className="space-y-3">
        {sorted.map((item, idx) => (
          <motion.div
            key={item.lever.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.lever.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  Level {item.currentLevel} — {item.currentImpact}% of max {item.maxPotential}%
                </span>
              </div>
              <span className="text-xs font-semibold text-[#1A5276] dark:text-[#5DADE2]">
                {item.percentageOfMax.toFixed(0)}% utilized
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: item.maxPotential >= 10
                    ? 'linear-gradient(90deg, #E74C3C, #F39C12, #27AE60)'
                    : 'linear-gradient(90deg, #85C1E9, #2E86C1)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${item.percentageOfMax}%` }}
                transition={{ duration: 0.6, delay: idx * 0.04 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category summary */}
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Category Contribution to {Math.round(currentTotal)}% Reduction
        </h4>
        <div className="space-y-2">
          {Object.entries(categoryImpact).map(([cat, data]) => (
            <div key={cat} className="flex items-center gap-2">
              <span className="text-xs text-gray-600 dark:text-gray-400 w-24 capitalize">{cat}</span>
          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#1A5276] dark:bg-[#5DADE2] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${currentTotal > 0 ? (data.current / currentTotal) * 100 : 0}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 w-12 text-right">{data.current}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
