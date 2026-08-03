import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { levers } from '@/data/levers';
import { calculateEmissions } from '@/data/calculations';
import type { Lever } from '@/types';
import type { PresetScenario } from '@/data/presets';
import { IsometricBackground } from '@/components/IsometricBackground';
import { CO2Meter } from '@/components/CO2Meter';
import { ControlPanel } from '@/components/ControlPanel';
import { InfoModal } from '@/components/InfoModal';
import { LeverModal } from '@/components/LeverModal';
import { PresetsBar } from '@/components/PresetsBar';
import { OnboardingTour } from '@/components/OnboardingTour';
import { Info, Play } from 'lucide-react';

interface MainPageProps {
  levels: number[];
  onLevelChange: (index: number, level: number) => void;
  onReset: () => void;
  onResults: () => void;
  presets: PresetScenario[];
  activePreset: string | null;
  onApplyPreset: (preset: PresetScenario) => void;
  onSaveComparison?: () => void;
  hasComparison?: boolean;
  onClearComparison?: () => void;
}

export const MainPage = ({
  levels, onLevelChange, onReset, onResults,
  presets, activePreset, onApplyPreset,
  onSaveComparison, hasComparison, onClearComparison,
}: MainPageProps) => {
  const [selectedLever, setSelectedLever] = useState<Lever | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isLeverModalOpen, setIsLeverModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(() => {
    return !localStorage.getItem('my2050-info-dismissed');
  });

  const handleDismissInfo = useCallback(() => {
    localStorage.setItem('my2050-info-dismissed', 'true');
    setIsInfoModalOpen(false);
  }, []);

  const emissions = useMemo(() => calculateEmissions(levels), [levels]);

  const handleLeverClick = useCallback((lever: Lever, index: number) => {
    setSelectedLever(lever);
    setSelectedIndex(index);
    setIsLeverModalOpen(true);
  }, []);

  const handleLeverLevelChange = useCallback((level: number) => {
    if (selectedIndex >= 0) {
      onLevelChange(selectedIndex, level);
    }
  }, [selectedIndex, onLevelChange]);

  return (
    <motion.div
      className="h-dvh flex flex-col overflow-y-auto overflow-x-hidden bg-[#87CEEB] dark:bg-slate-950 transition-colors duration-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* min-h keeps the animation window visible on short screens; the footer scrolls into view instead of collapsing the scene. */}
      <div className="relative min-h-[180px] flex-1">
        <IsometricBackground levels={levels} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-transparent dark:bg-slate-950/30 transition-colors duration-500"
        />

        <motion.div
          className="absolute left-4 top-4 z-10 max-w-[calc(100%_-_7rem)]"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <PresetsBar presets={presets} activePreset={activePreset} onSelect={onApplyPreset} />
        </motion.div>

        <motion.aside
          aria-label="Scenario progress and quick actions"
          className="absolute right-3 top-20 bottom-32 z-20 flex w-[76px] flex-col items-center gap-2 rounded-2xl border border-white/70 bg-white/65 p-2 shadow-xl backdrop-blur-md dark:border-slate-600/70 dark:bg-slate-950/70 sm:right-4 sm:w-[84px]"
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex shrink-0 gap-1">
            <motion.button
              onClick={() => setIsInfoModalOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-700 shadow-sm transition-colors hover:bg-white dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-700"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              title="Information"
              aria-label="Information"
            >
              <Info className="h-4 w-4" />
            </motion.button>
            <motion.button
              onClick={onResults}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A5276] text-white shadow-sm transition-colors hover:bg-[#154360]"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              title="Go to Results"
              aria-label="Go to Results"
            >
              <Play className="ml-0.5 h-4 w-4" />
            </motion.button>
          </div>
          <CO2Meter reductionPercentage={emissions.totalReduction} />
        </motion.aside>
      </div>

      <motion.div
        className="shrink-0"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <ControlPanel
          levers={levers}
          levels={levels}
          onLevelChange={onLevelChange}
          onLeverClick={handleLeverClick}
          onResults={onResults}
          onReset={onReset}
          onSaveComparison={onSaveComparison}
          hasComparison={hasComparison}
          onClearComparison={onClearComparison}
        />
      </motion.div>

      <InfoModal isOpen={isInfoModalOpen} onClose={handleDismissInfo} />
      <LeverModal
        lever={selectedLever}
        currentLevel={selectedIndex >= 0 ? levels[selectedIndex] : 1}
        isOpen={isLeverModalOpen}
        onClose={() => setIsLeverModalOpen(false)}
        onLevelChange={handleLeverLevelChange}
      />
      <OnboardingTour />
    </motion.div>
  );
};
