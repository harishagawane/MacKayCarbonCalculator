import { useState, useCallback, useMemo, useLayoutEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
import { useSoundFx } from '@/hooks/useSoundFx';
import { Info, Play, Volume2, VolumeX, ChevronDown, SlidersHorizontal, Maximize2 } from 'lucide-react';

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
  const [isDockOpen, setIsDockOpen] = useState(true);
  // The policy dock changes height with screen size, text wrapping and saved
  // comparison actions. Measure the real element instead of guessing a pixel
  // inset so the rail/road foreground stays visible on every viewport.
  const dockRef = useRef<HTMLDivElement>(null);
  const [dockHeight, setDockHeight] = useState(220);

  useLayoutEffect(() => {
    if (!isDockOpen || !dockRef.current) return;

    const element = dockRef.current;
    const measure = () => {
      const next = Math.ceil(element.getBoundingClientRect().height);
      if (next > 0) setDockHeight(previous => previous === next ? previous : next);
    };

    measure();
    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(measure)
      : null;
    observer?.observe(element);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [isDockOpen]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(() => {
    try {return !window.localStorage.getItem('my2050-info-dismissed');} catch {return true;}
  });

  const handleDismissInfo = useCallback(() => {
    try {window.localStorage.setItem('my2050-info-dismissed','true');}catch{/* optional */}
    setIsInfoModalOpen(false);
  }, []);

  const emissions = useMemo(() => calculateEmissions(levels), [levels]);
  const { muted, toggleMuted } = useSoundFx(levels);

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
      className="relative isolate h-dvh min-h-[440px] w-full overflow-hidden bg-[#7FB6D3] dark:bg-slate-950 transition-colors duration-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* The world remains full-page, but its foreground stays above the dock.
          The full-viewport backdrop prevents any exposed blank strip. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg,#6b9fc5 0%,#a8d0dc 48%,#96c49d 65%,#468b67 100%)' }} />
      <div className="absolute inset-0">
        <div
          className="absolute inset-x-0 top-0 overflow-hidden transition-[bottom] duration-300 ease-out"
          style={{ bottom: isDockOpen ? `${dockHeight + 32}px` : '0px' }}
        >
          <IsometricBackground levels={levels} foregroundFocus={isDockOpen} />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-slate-900/10 via-transparent to-slate-950/25 dark:from-slate-950/35 dark:to-slate-950/55" />

        <motion.div
          className="absolute left-3 right-32 top-3 z-20 sm:left-5 sm:right-40"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <PresetsBar presets={presets} activePreset={activePreset} onSelect={onApplyPreset} />
        </motion.div>

        <section
          aria-label="Scene introduction"
          className="pointer-events-none absolute left-4 top-[76px] z-10 max-w-[min(420px,calc(100%-130px))] rounded-2xl border border-white/20 bg-slate-900/55 p-4 text-white shadow-2xl backdrop-blur-md sm:left-6 sm:top-[88px] sm:p-5"
        >
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-200">Interactive pathway explorer · UK 2050</div>
          <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-3xl">Shape a living, lower-carbon world.</h1>
          <p className="mt-2 hidden text-sm leading-relaxed text-white/85 sm:block">
            Adjust a lever and watch the landscape respond — from railways and cleaner vehicles to forests and power generation.
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-300" />
            {Math.round(emissions.totalReduction)}% illustrative policy score
          </span>
        </section>

        <motion.aside
          aria-label="Scenario progress and quick actions"
          className="absolute right-3 top-[76px] z-20 flex h-[min(50dvh,430px)] w-[80px] flex-col items-center gap-2 rounded-[22px] border border-white/50 bg-white/80 p-2 shadow-2xl backdrop-blur-xl dark:border-slate-500/50 dark:bg-slate-900/80 sm:right-5 sm:top-[86px] sm:h-[min(55dvh,480px)] sm:w-[88px]"
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid shrink-0 grid-cols-2 items-center gap-1">
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
            <motion.button
              onClick={toggleMuted}
              className={`col-span-2 mx-auto flex h-8 w-8 items-center justify-center rounded-lg shadow-sm transition-colors ${
                muted
                  ? 'bg-slate-200/90 text-slate-500 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              title={muted ? 'Unmute lever sounds' : 'Mute lever sounds'}
              aria-label={muted ? 'Unmute lever sounds' : 'Mute lever sounds'}
              aria-pressed={!muted}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </motion.button>
          </div>
          <CO2Meter reductionPercentage={emissions.totalReduction} />
        </motion.aside>
      </div>

      {/* Render the entering dock immediately so ResizeObserver can measure it after reopening. */}
      <AnimatePresence initial={false} mode="sync">
        {isDockOpen ? (
          <motion.div
            key="immersive-policy-dock"
            ref={dockRef}
            className="absolute inset-x-3 bottom-3 z-30 mx-auto max-w-[1580px] overflow-hidden rounded-[22px] border border-white/25 bg-slate-900/80 text-white shadow-[0_20px_70px_rgba(5,26,40,0.45)] backdrop-blur-2xl dark:border-slate-600/50 dark:bg-slate-950/85 sm:inset-x-5 sm:bottom-5"
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                <span className="truncate text-xs font-bold uppercase tracking-[0.18em] text-slate-50 sm:text-sm">
                  Explore 15 policy levers
                </span>
                <span className="hidden text-xs text-white/60 md:inline">· Tap a lever name for details</span>
              </div>
              <button
                type="button"
                onClick={() => setIsDockOpen(false)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/20 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
                aria-label="Hide controls for a full-screen landscape"
              >
                <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" /> <span className="hidden sm:inline">Explore full screen</span><span className="sm:hidden">Hide</span>
              </button>
            </div>
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
        ) : (
          <motion.button
            key="open-policy-dock"
            type="button"
            onClick={() => setIsDockOpen(true)}
            className="absolute bottom-5 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/30 bg-slate-900/85 px-5 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur-xl hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
          >
            <SlidersHorizontal className="h-4 w-4 text-emerald-300" aria-hidden="true" /> Show policy levers <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

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
