import { motion } from 'framer-motion';
import { useAnimatedValue } from '@/hooks/useAnimatedValue';

interface CO2MeterProps {
  reductionPercentage: number;
}

export const CO2Meter = ({ reductionPercentage }: CO2MeterProps) => {
  const clamped = Math.min(100, Math.max(0, Number.isFinite(reductionPercentage) ? reductionPercentage : 0));
  const animated = useAnimatedValue(clamped, { duration: 650, decimals: 0 });
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-1" role="meter"
      aria-label="Illustrative carbon policy score" aria-valuemin={0} aria-valuemax={100}
      aria-valuenow={Math.round(clamped)} aria-valuetext={`${Math.round(clamped)} percent of model maximum`}>
      <div className="mt-1 text-center text-[10px] font-extrabold uppercase tracking-wide text-slate-800 dark:text-slate-100">Policy<br/>score</div>
      <div className="text-lg font-black tabular-nums text-slate-900 dark:text-white">{Math.round(animated)}<span className="text-[10px]">%</span></div>
      <div className="relative w-10 min-h-[80px] flex-1 overflow-hidden rounded-full border border-slate-300 bg-slate-200/90 shadow-inner dark:border-slate-600 dark:bg-slate-800">
        <motion.div
          className="absolute bottom-0 inset-x-0 rounded-b-full bg-gradient-to-t from-teal-600 via-emerald-400 to-lime-300"
          initial={false}
          animate={{ height: `${clamped}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 22 }}
        />
        {[25,50,75].map(position => (
          <span key={position} className="pointer-events-none absolute inset-x-0 border-t border-slate-500/25 dark:border-white/20" style={{ bottom: `${position}%` }} />
        ))}
      </div>
      <div className="pb-1 text-center text-[9px] font-bold uppercase leading-tight tracking-wide text-slate-600 dark:text-slate-300">Model<br/>maximum</div>
    </div>
  );
};
