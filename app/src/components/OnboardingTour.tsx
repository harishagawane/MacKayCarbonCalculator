import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, HelpCircle, RotateCcw } from 'lucide-react';

const STEP_KEY = 'my2050-tour-step';

// Storage can throw in Safari private mode / blocked-storage contexts.
const safeGet = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const safeSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
};
const safeRemove = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
};

interface TourStep {
  title: string;
  description: string;
  target: string; // CSS selector or description
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to My2050',
    description: 'Create your own pathway to a low-carbon UK by 2050. Adjust 15 policy levers across 5 groups to explore illustrative choices, not official scientific forecasts.',
    target: 'center',
    position: 'center',
  },
  {
    title: 'Transport Levers',
    description: 'Start with TRANSPORT. Adjust how far we travel, shift to electric cars, and decarbonise heavy vehicles like trucks and trains.',
    target: 'TRANSPORT',
    position: 'top',
  },
  {
    title: 'Buildings Levers',
    description: 'BUILDINGS: Change home energy behaviour, improve insulation efficiency, and transition heating systems away from fossil fuels.',
    target: 'BUILDINGS',
    position: 'top',
  },
  {
    title: 'Industry & Technology',
    description: 'INDUSTRY, CCS & HYDROGEN: Reduce industrial emissions, capture carbon, and develop a hydrogen economy.',
    target: 'INDUSTRY',
    position: 'top',
  },
  {
    title: 'Electricity Generation',
    description: 'LOW CARBON ELECTRICITY: Choose your energy mix — nuclear, wind, solar, and marine power.',
    target: 'ELECTRICITY',
    position: 'top',
  },
  {
    title: 'Land & Nature',
    description: 'LAND, BIOENERGY & WASTE: Plant forests, develop sustainable bioenergy, and manage land use.',
    target: 'LAND',
    position: 'top',
  },
  {
    title: 'A Living Scene',
    description: 'The background responds to your choices: wind turbines spin faster as Wind rises, solar panels appear from Solar level 2, tidal turbines at Wave & Tidal 2, and the forest thickens with Forestry.',
    target: 'scene',
    position: 'top',
  },
  {
    title: 'Watch the Railway',
    description: 'The railway now carries trains in both directions. Raise Heavy Vehicles to electrify passenger trains and speed up freight — and watch the freight cargo switch between biomass, hydrogen tankers, timber, or coal depending on your other levers.',
    target: 'scene',
    position: 'top',
  },
  {
    title: 'Cars & Trucks',
    description: 'Raise Light Vehicles to swap petrol cars for electric ones. Raise Heavy Vehicles to add counter-flowing trucks on the road — at level 4 the whole heavy fleet turns electric or hydrogen.',
    target: 'scene',
    position: 'top',
  },
  {
    title: 'Watch the CO₂ Meter',
    description: 'The score meter shows an educational policy index from 0 to 100. It is not a forecast of actual UK emissions or proof of net zero.',
    target: 'CO₂e',
    position: 'left',
  },
  {
    title: 'See Your Results',
    description: 'Select Results or use the play button to explore illustrative charts, comparisons, downloadable reports, and sensitivity analysis.',
    target: 'results',
    position: 'top',
  },
  {
    title: 'Ready to Start!',
    description: 'You\'re all set. Adjust the levers, explore preset scenarios and compare pathways. Hide the floating controls whenever you want an unobstructed landscape.',
    target: 'center',
    position: 'center',
  },
];

export const OnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = Number(safeGet(STEP_KEY) ?? '0');
    return Number.isFinite(saved) && saved >= 0 && saved < TOUR_STEPS.length ? saved : 0;
  });
  const [dismissed, setDismissed] = useState(() => {
    return safeGet('my2050-tour-dismissed') === 'true';
  });

  // Persist progress so a reload resumes where the user left off.
  useEffect(() => {
    safeSet(STEP_KEY, String(currentStep));
  }, [currentStep]);

  // Auto-open on first visit (only if info modal was already dismissed)
  useEffect(() => {
    const infoDismissed = safeGet('my2050-info-dismissed');
    if (!dismissed && infoDismissed && !isOpen) {
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [dismissed, isOpen]);

  const handleDismiss = useCallback(() => {
    safeSet('my2050-tour-dismissed', 'true');
    safeRemove(STEP_KEY);
    setDismissed(true);
    setIsOpen(false);
    setCurrentStep(0);
  }, []);

  // Replay the tour from the beginning (also clears the dismissed flag so a
  // reload resumes the freshly restarted tour).
  const handleReplay = useCallback(() => {
    safeRemove('my2050-tour-dismissed');
    setCurrentStep(0);
    setDismissed(false);
    setIsOpen(true);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleDismiss();
    }
  }, [currentStep, handleDismiss]);

  const handlePrev = useCallback(() => {
    setCurrentStep(s => Math.max(0, s - 1));
  }, []);

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;

  if (dismissed) {
    return (
      <motion.button
        onClick={() => {
          safeRemove('my2050-tour-dismissed');
          setDismissed(false);
          setCurrentStep(0);
          setIsOpen(true);
        }}
        className="fixed right-16 top-4 z-30 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
        whileHover={{ scale: 1.12, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        title="Open guided tour"
        aria-label="Open guided tour"
      >
        <HelpCircle className="w-5 h-5 text-[#1A5276] dark:text-[#5DADE2]" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
          />

          {/* Tour card */}
          <motion.div
            className={`fixed z-50 ${
              step.position === 'center'
                ? 'inset-0 flex items-center justify-center p-4'
                : 'inset-0 flex items-center justify-center p-4'
            }`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-[#1A5276] dark:text-[#5DADE2] font-semibold mb-1">
                    Step {currentStep + 1} of {TOUR_STEPS.length}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {step.title}
                  </h3>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  aria-label="Close tour"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {step.description}
              </p>

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5 mb-4">
                {TOUR_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === currentStep
                        ? 'bg-[#1A5276] dark:bg-[#5DADE2] w-4'
                        : i < currentStep
                        ? 'bg-[#1A5276]/40 dark:bg-[#5DADE2]/40'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  {currentStep > 0 && (
                    <button
                      onClick={handleReplay}
                      className="flex items-center gap-1 text-xs text-[#1A5276] dark:text-[#5DADE2] hover:underline transition-colors"
                      title="Restart the tour from the beginning"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Replay
                    </button>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 bg-[#1A5276] hover:bg-[#154360] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  {isLast ? 'Got it!' : 'Next'}
                  {!isLast && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
