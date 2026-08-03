import { useState, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLeverState } from '@/hooks/useLeverState';
import { MainPage } from '@/pages/MainPage';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';

const ResultsPage = lazy(() => import('@/pages/ResultsPage').then(m => ({ default: m.ResultsPage })));

function App() {
  const {
    levels, setLevel, reset, applyPreset, activePreset,
    getShareUrl, isInitialized, PRESET_SCENARIOS,
    comparisonLevels, saveForComparison, clearComparison,
  } = useLeverState();
  const [showResults, setShowResults] = useState(false);

  if (!isInitialized) {
    return (
      <div className="h-screen bg-[#87CEEB] dark:bg-slate-950 flex items-center justify-center">
        <div className="text-white dark:text-slate-300 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="relative">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <MainPage
              key="main"
              levels={levels}
              onLevelChange={setLevel}
              onReset={reset}
              onResults={() => setShowResults(true)}
              presets={PRESET_SCENARIOS}
              activePreset={activePreset}
              onApplyPreset={applyPreset}
              onSaveComparison={saveForComparison}
              hasComparison={comparisonLevels !== null}
              onClearComparison={clearComparison}
            />
          ) : (
            <Suspense fallback={
              <div className="h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-gray-500 dark:text-gray-400 text-lg font-medium">Loading results...</div>
              </div>
            }>
              <ResultsPage
                key="results"
                levels={levels}
                onBack={() => setShowResults(false)}
                getShareUrl={getShareUrl}
                comparisonLevels={comparisonLevels}
              />
            </Suspense>
          )}
        </AnimatePresence>
        <ThemeToggle />
        <Toaster />
      </div>
    </ErrorBoundary>
  );
}

export default App;
