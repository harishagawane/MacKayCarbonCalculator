import { useMemo } from 'react';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { getTopRemainingLevers } from '@/data/calculations';

interface ScenarioInsightsProps {
  levels: number[];
  onEdit: () => void;
}

export const ScenarioInsights = ({ levels, onEdit }: ScenarioInsightsProps) => {
  const opportunities = useMemo(() => getTopRemainingLevers(levels), [levels]);
  return (
    <section aria-labelledby="score-opportunities-title" className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-gray-800">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="score-opportunities-title" className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            <TrendingUp aria-hidden="true" className="h-5 w-5 text-blue-600 dark:text-sky-400" />
            Biggest remaining score opportunities
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Potential additional index points if a lever is raised to level 4. These are model weights, not forecast emissions savings.
          </p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:bg-sky-700 dark:hover:bg-sky-600"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Adjust levers
        </button>
      </div>
      {opportunities.length === 0 ? (
        <p className="mt-4 text-sm text-gray-700 dark:text-gray-200">
          All levers are at their maximum index level. This does not establish real-world feasibility.
        </p>
      ) : (
        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          {opportunities.map((lever, index) => (
            <li key={lever.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-900/60">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Opportunity {index + 1}</div>
              <div className="mt-1 font-semibold text-slate-900 dark:text-white">{lever.name}</div>
              <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">Current level {lever.currentLevel} of 4</div>
              <div className="mt-3 text-lg font-bold text-blue-700 dark:text-sky-300">
                +{lever.remainingPoints.toFixed(1)} <span className="text-xs font-medium">score points</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};
