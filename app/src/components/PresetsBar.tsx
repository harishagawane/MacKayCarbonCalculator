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
    <div className="scene-controls-scroll flex items-center gap-2 overflow-x-auto pb-1 pr-2">
      {presets.map((preset, idx) => (
        <motion.button
          key={preset.id}
          onClick={() => onSelect(preset)}
          disabled={disabled}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur-md transition-colors ${
            activePreset === preset.id
              ? 'border-emerald-300/70 bg-emerald-500/90 text-slate-950'
              : 'border-white/40 bg-slate-900/65 text-white hover:bg-slate-800/85 dark:border-slate-500/40 dark:bg-slate-900/80 dark:text-white dark:hover:bg-slate-800'
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
