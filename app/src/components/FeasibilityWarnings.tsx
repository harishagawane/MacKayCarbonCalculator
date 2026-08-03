import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface FeasibilityWarningsProps {
  levels: number[];
  totalReduction: number;
}

interface Warning {
  type: 'info' | 'warning' | 'success';
  message: string;
}

export const FeasibilityWarnings = ({ levels, totalReduction }: FeasibilityWarningsProps) => {
  const warnings = useMemo((): Warning[] => {
    const result: Warning[] = [];

    // Check for all level 4s (technically unrealistic)
    const all4s = levels.filter(l => l === 4).length;
    if (all4s === 15) {
      result.push({ type: 'warning', message: 'All levers at maximum — this is likely technically and economically infeasible.' });
    } else if (all4s >= 10) {
      result.push({ type: 'warning', message: `${all4s} levers at maximum effort — this may be politically challenging to achieve simultaneously.` });
    }

    // Check if nuclear is high but no CCS
    if (levels[9] >= 3 && levels[7] <= 1) {
      result.push({ type: 'info', message: 'High nuclear without carbon capture — consider pairing with CCS for industrial emissions.' });
    }

    // Check if electrification is high but renewables are low
    const electrification = levels[1] + levels[2] + levels[5]; // cars, heavy vehicles, heating
    const renewables = levels[10] + levels[11] + levels[12]; // wind, solar, wave
    if (electrification >= 9 && renewables <= 5) {
      result.push({ type: 'warning', message: 'High electrification with low renewables — where will the clean electricity come from?' });
    }

    // Check land use balance
    if (levels[13] >= 3 && levels[14] >= 3) {
      result.push({ type: 'info', message: 'Both forestry and bioenergy at high levels — be mindful of land-use competition.' });
    }

    // Net zero achieved (uses actual emissions reduction)
    if (totalReduction >= 100) {
      result.push({ type: 'success', message: 'This pathway achieves Net Zero by 2050. Well done!' });
    } else if (totalReduction >= 80) {
      result.push({ type: 'success', message: `This pathway achieves ${Math.round(totalReduction)}% reduction — very close to Net Zero.` });
    }

    // Low effort warning
    if (totalReduction <= 20) {
      result.push({ type: 'warning', message: 'Very low ambition — emissions will remain high. The UK is legally committed to Net Zero by 2050.' });
    }

    // Carbon budget alignment
    if (totalReduction >= 60 && totalReduction < 80) {
      result.push({ type: 'info', message: 'This pathway makes good progress but may fall short of the UK\'s 6th Carbon Budget (2033-2037).' });
    }

    return result;
  }, [levels, totalReduction]);

  if (warnings.length === 0) return null;

  const colorMap = {
    warning: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-800 dark:text-amber-200', icon: AlertTriangle, iconColor: 'text-amber-500' },
    info: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-800 dark:text-blue-200', icon: AlertTriangle, iconColor: 'text-blue-500' },
    success: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-800 dark:text-green-200', icon: CheckCircle, iconColor: 'text-green-500' },
  };

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {warnings.map((w, idx) => {
          const style = colorMap[w.type];
          const Icon = style.icon;
          return (
            <motion.div
              key={`${w.type}-${idx}`}
              className={`flex items-start gap-2 p-3 rounded-lg border ${style.bg} ${style.border}`}
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${style.iconColor}`} />
              <p className={`text-sm ${style.text}`}>{w.message}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
