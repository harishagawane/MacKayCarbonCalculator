import { motion } from 'framer-motion';
import { useAnimatedValue } from '@/hooks/useAnimatedValue';

interface CO2MeterProps {
  reductionPercentage: number;
}

export const CO2Meter = ({ reductionPercentage }: CO2MeterProps) => {
  const clamped = Math.min(Math.max(reductionPercentage, 0), 100);
  const animatedPercentage = useAnimatedValue(clamped, { duration: 650, decimals: 0 });

  const getFillColor = () => {
    if (animatedPercentage >= 100) return '#27AE60';
    if (animatedPercentage >= 80) return '#82E0AA';
    if (animatedPercentage >= 35) return '#F4D03F';
    return '#F7DC6F';
  };

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col items-center text-center">
      <div className="mb-1 rounded-md bg-slate-900/85 px-1.5 py-1 text-[8px] font-semibold tracking-wide text-white shadow-sm dark:bg-white/90 dark:text-slate-900">
        SCORE
      </div>

      <div className="mb-1 rounded bg-[#1A5276] px-1.5 py-0.5 text-[8px] font-semibold text-white shadow-sm">
        1990
      </div>

      <motion.div
        className="relative min-h-0 w-12 flex-1 overflow-hidden rounded-xl border border-white/80 bg-white/80 shadow-inner dark:border-slate-500 dark:bg-slate-800/90"
        initial={{ opacity: 0, scaleY: 0.92 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'bottom' }}
        aria-label={`Illustrative model score ${Math.round(animatedPercentage)} percent`}
      >
        <motion.div
          className="absolute inset-x-0 bottom-0"
          style={{ backgroundColor: getFillColor() }}
          initial={{ height: '0%' }}
          animate={{ height: `${clamped}%` }}
          transition={{ type: 'spring', stiffness: 75, damping: 18, mass: 0.8 }}
        />

        {[25, 50, 75].map((pos) => (
          <div
            key={pos}
            className="absolute inset-x-0 h-px bg-slate-500/20 dark:bg-white/20"
            style={{ bottom: `${pos}%` }}
          />
        ))}

        <div className="absolute inset-x-0 top-1 text-[7px] font-medium text-slate-500 dark:text-slate-300">
          Level 1 · 2050
        </div>

        <div className="absolute inset-x-0 top-[20%] flex justify-end">
          <span className="rounded-l bg-[#27AE60] px-1 py-0.5 text-[7px] font-semibold text-white">-80%</span>
        </div>
        <div className="absolute inset-x-0 top-[65%] flex justify-end">
          <span className="rounded-l bg-[#27AE60] px-1 py-0.5 text-[7px] font-semibold text-white">-35%</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-end">
          <span className="rounded-l bg-[#27AE60] px-1 py-0.5 text-[7px] font-semibold text-white">-100%</span>
        </div>

        <motion.div
          className="absolute inset-x-0 flex justify-center"
          initial={{ bottom: '0%' }}
          animate={{ bottom: `${clamped}%` }}
          transition={{ type: 'spring', stiffness: 75, damping: 18, mass: 0.8 }}
        >
          <span className="rounded-md bg-[#1A5276] px-1 py-0.5 text-[9px] font-bold text-white shadow-md">
            -{Math.round(animatedPercentage)}%
          </span>
        </motion.div>
      </motion.div>

      <div className="mt-1 text-[8px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
        Model max
      </div>
    </div>
  );
};
