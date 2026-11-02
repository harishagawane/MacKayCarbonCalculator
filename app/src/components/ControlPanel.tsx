import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lever } from '@/types';
import { leverIcons } from './LeverIcons';
import { CATEGORY_NAMES } from '@/types';
import { Save, X } from 'lucide-react';

interface ControlPanelProps {
  levers: Lever[];
  levels: number[];
  onLevelChange: (index: number, level: number) => void;
  onLeverClick: (lever: Lever, index: number) => void;
  onResults: () => void;
  onReset: () => void;
  onSaveComparison?: () => void;
  hasComparison?: boolean;
  onClearComparison?: () => void;
}

const levelColors: Record<number, string> = {
  1: '#D5DBDB',
  2: '#85C1E9',
  3: '#5DADE2',
  4: '#2E86C1',
};

export const ControlPanel = ({
  levers,
  levels,
  onLevelChange,
  onLeverClick,
  onResults,
  onReset,
  onSaveComparison,
  hasComparison,
  onClearComparison,
}: ControlPanelProps) => {
  const categories = ['transport', 'buildings', 'industry', 'electricity', 'land'] as const;

  const getLeverIndex = (leverId: string) => levers.findIndex(l => l.id === leverId);

  const getCategoryLevers = (cat: string) => levers.filter(l => l.category === cat);

  const handleSliderKeyDown = (e: React.KeyboardEvent, globalIndex: number, currentLevel: number) => {
    // Stop arrow/home/end keys on the slider from activating its surrounding lever card.
    const increment = e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'PageUp';
    const decrement = e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'PageDown';
    if (!increment && !decrement && e.key !== 'Home' && e.key !== 'End') {
      if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const next = e.key === 'Home' ? 1 : e.key === 'End' ? 4
      : Math.min(4, Math.max(1, currentLevel + (increment ? 1 : -1)));
    if (next !== currentLevel) onLevelChange(globalIndex, next);
  };

  const handleLeverKeyDown = (e: React.KeyboardEvent, lever: Lever, globalIndex: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onLeverClick(lever, globalIndex);
    }
  };

  return (
    <div className="border-t-4 border-[#99A3A4] bg-[#D5D8DC]/95 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/95">
      {/* Lever controls - horizontally scrollable on mobile */}
      <p className="px-3 pt-2 text-center text-[11px] font-medium text-slate-700 dark:text-slate-300 md:hidden">
        Swipe sideways to explore all 15 policy levers · Use arrow keys on a focused slider
      </p>
      <div className="scene-controls-scroll overflow-x-auto scrollbar-thin">
        <div className="flex justify-center items-end px-2 py-2 sm:px-4 sm:py-4 gap-1 min-w-max md:min-w-0">
          {categories.map((cat, catIndex) => (
            <div key={cat} className="flex gap-1">
              {getCategoryLevers(cat).map((lever) => {
                const globalIndex = getLeverIndex(lever.id);
                const currentLevel = levels[globalIndex];
                const Icon = leverIcons[lever.id];

                return (
                  <motion.div
                    key={lever.id}
                    className="flex flex-col items-center cursor-pointer group rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    onClick={() => onLeverClick(lever, globalIndex)}
                    onKeyDown={(e) => handleLeverKeyDown(e, lever, globalIndex)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${lever.name} - Level ${currentLevel}`}
                    whileHover={{ y: -3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {/* Icon */}
                    <motion.div
                      className="w-8 h-8 sm:w-10 sm:h-10 mb-1"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      {Icon && <Icon className="w-full h-full" color="var(--lever-accent)" />}
                    </motion.div>

                    {/* Label */}
                    <div className="text-[9px] text-center text-[#1A5276] dark:text-sky-300 font-semibold leading-tight whitespace-pre-line h-7 mb-1">
                      {lever.shortName}
                    </div>

                    {/* Vertical Slider Track */}
                    <div className="relative h-24 sm:h-28 w-5 overflow-hidden rounded border-2 border-[#99A3A4] bg-white dark:border-slate-600 dark:bg-slate-800">
                      <div className="absolute inset-0 flex flex-col justify-between py-2 px-0.5">
                        <div className="h-px w-full bg-gray-300 dark:bg-slate-600" />
                        <div className="h-px w-full bg-gray-300 dark:bg-slate-600" />
                        <div className="h-px w-full bg-gray-300 dark:bg-slate-600" />
                      </div>

                      <motion.div
                        className="absolute bottom-0 left-0 right-0"
                        style={{ backgroundColor: levelColors[currentLevel] }}
                        initial={{ height: '25%' }}
                        animate={{ height: `${currentLevel * 25}%` }}
                        transition={{ type: 'spring', stiffness: 350, damping: 28, mass: 0.7 }}
                      />

                      <motion.div
                        className="absolute left-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer z-10 -ml-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                        style={{ backgroundColor: currentLevel >= 3 ? '#2E86C1' : '#5DADE2' }}
                        initial={{ bottom: '10%' }}
                        animate={{ bottom: `${(currentLevel - 1) * 25 + 6}%` }}
                        transition={{ type: 'spring', stiffness: 350, damping: 28, mass: 0.7 }}
                        whileHover={{ scale: 1.35, boxShadow: '0 0 12px rgba(46, 134, 193, 0.6)' }}
                        whileTap={{ scale: 0.88 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const newLevel = currentLevel >= 4 ? 1 : currentLevel + 1;
                          onLevelChange(globalIndex, newLevel);
                        }}
                        onKeyDown={(e) => handleSliderKeyDown(e, globalIndex, currentLevel)}
                        tabIndex={0}
                        role="slider"
                        aria-label={`${lever.name} level`}
                        aria-valuenow={currentLevel}
                        aria-valuemin={1}
                        aria-valuemax={4}
                        aria-valuetext={`Level ${currentLevel} of 4`}
                      >

                      </motion.div>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentLevel}
                        className="mt-1 text-xs font-bold text-[#1A5276] dark:text-sky-300"
                        initial={{ scale: 1.4, y: -6, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.6, y: 4, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      >
                        {currentLevel}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {catIndex < categories.length - 1 && (
                <div className="w-px h-44 bg-[#99A3A4] mx-1.5 self-center" />
              )}
            </div>
          ))}

          {/* Action buttons */}
          <div className="flex flex-col gap-2 ml-3">
            <motion.button
              onClick={onResults}
              className="rounded bg-[#1A5276] px-3 py-2.5 text-xs font-semibold text-white shadow-md transition-colors hover:bg-[#154360] dark:bg-sky-700 dark:hover:bg-sky-600 whitespace-nowrap"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              Go to<br />results
            </motion.button>
            <motion.button
              onClick={onReset}
              className="rounded bg-[#7F8C8D] px-3 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-[#616A6B] dark:bg-slate-700 dark:hover:bg-slate-600"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
            >
              Reset<br />levers
            </motion.button>
            {onSaveComparison && (
              <motion.button
                onClick={onSaveComparison}
                className="rounded border border-[#1A5276]/30 bg-white px-3 py-2 text-xs font-semibold text-[#1A5276] shadow-md transition-colors hover:bg-[#EBF5FB] dark:border-sky-400/40 dark:bg-slate-800 dark:text-sky-300 dark:hover:bg-slate-700"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                title="Save current scenario for comparison"
              >
                <Save className="w-3 h-3 inline mr-1" />
                Save for<br />compare
              </motion.button>
            )}
            {hasComparison && onClearComparison && (
              <motion.button
                onClick={onClearComparison}
                className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-400/30 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-950"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
              >
                <X className="w-3 h-3 inline mr-1" />
                Clear<br />compare
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Category labels */}
      <div className="scene-controls-scroll overflow-x-auto scrollbar-thin">
        <div className="flex justify-center pb-2 px-2 sm:px-4 gap-1 min-w-max md:min-w-0">
          {categories.map((cat, idx) => (
            <React.Fragment key={cat}>
              <motion.div
                className="text-center text-[10px] font-bold uppercase tracking-wide text-[#566573] dark:text-slate-400"
                style={{ width: `${getCategoryLevers(cat).length * 48}px` }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.08 }}
              >
                {CATEGORY_NAMES[cat]}
              </motion.div>
              {idx < categories.length - 1 && <div className="w-px mx-1.5" />}
            </React.Fragment>
          ))}
          <div className="w-20" />
        </div>
      </div>
    </div>
  );
};
