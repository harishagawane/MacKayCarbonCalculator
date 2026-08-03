import { motion, AnimatePresence } from 'framer-motion';
import type { PresetScenario } from '@/data/presets';

interface PresetsBarProps {
  presets: PresetScenario[];
  activePreset: string | null;
  onSelect: (preset: PresetScenario) => void;
  disabled?: boolean;
}

export const PresetsBar = ({ presets, activePreset, onSelect, disabled }: PresetsBarProps) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {presets.map((preset, idx) => (
        <motion.button
          key={preset.id}
          onClick={() => onSelect(preset)}
          disabled={disabled}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
            activePreset === preset.id
              ? 'bg-[#1A5276] text-white border-[#1A5276] shadow-md'
              : 'border-gray-200 bg-white text-gray-700 hover:border-[#1A5276]/30 hover:bg-[#EBF5FB] dark:border-slate-600 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:border-sky-400/50 dark:hover:bg-slate-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 * idx, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          whileHover={!disabled ? { y: -1 } : {}}
          whileTap={!disabled ? { scale: 0.96 } : {}}
          title={preset.description}
        >
          <span className="text-sm">{preset.icon}</span>
          <span>{preset.name}</span>
          {activePreset === preset.id && (
            <AnimatePresence>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="ml-0.5 w-1.5 h-1.5 rounded-full bg-white"
              />
            </AnimatePresence>
          )}
        </motion.button>
      ))}
    </div>
  );
};
