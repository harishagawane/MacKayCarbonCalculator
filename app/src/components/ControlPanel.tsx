import { levers as defaultLevers } from '@/data/levers';
import type { Lever, Category } from '@/types';
import { CATEGORY_NAMES } from '@/types';
import { leverIcons } from './LeverIcons';
import { ArrowRight, RotateCcw, Save, X } from 'lucide-react';

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

const categories: Category[] = ['transport', 'buildings', 'industry', 'electricity', 'land'];
const categoryLabels: Record<Category, string> = {
  transport: 'Transport',
  buildings: 'Buildings',
  industry: 'Industry & Hydrogen',
  electricity: 'Clean electricity',
  land: 'Land & Nature',
};

export const ControlPanel = ({
  levers = defaultLevers, levels, onLevelChange, onLeverClick, onResults, onReset,
  onSaveComparison, hasComparison, onClearComparison,
}: ControlPanelProps) => (
  <div className="flex max-h-[min(46dvh,300px)] flex-col gap-2 overflow-y-auto px-3 pb-3 pt-2 sm:px-4 lg:max-h-none lg:flex-row lg:items-stretch">
    <div
      className="scene-controls-scroll min-w-0 flex-1 overflow-x-auto overflow-y-hidden pb-1"
      role="group"
      aria-label="Carbon pathway policy levers"
      tabIndex={0}
    >
      <div className="flex w-max min-w-full items-start gap-3">
        {categories.map(category => (
          <section key={category} aria-label={CATEGORY_NAMES[category]} className="shrink-0">
            <div className="mb-1.5 flex items-center gap-2 px-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
              <h2 className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-200">
                {categoryLabels[category]}
              </h2>
            </div>
            <div className="flex items-stretch gap-1.5">
              {levers.filter(lever => lever.category === category).map(lever => {
                const index = levers.findIndex(row => row.id === lever.id);
                const level = levels[index] ?? 1;
                const Icon = leverIcons[lever.id];
                const percentage = (level - 1) / 3 * 100;
                return (
                  <div
                    key={lever.id}
                    className="flex w-[83px] shrink-0 flex-col items-center rounded-xl border border-white/10 bg-white/[0.09] px-2 pb-2 pt-2 text-center transition-colors hover:border-emerald-300/50 hover:bg-white/[0.15] focus-within:border-emerald-300 sm:w-[88px]"
                  >
                    <button
                      type="button"
                      onClick={() => onLeverClick(lever, index)}
                      aria-label={`About ${lever.name}, current level ${level}`}
                      title={`Explore ${lever.name} policy options`}
                      className="flex min-h-[66px] w-full flex-col items-center justify-center gap-1 rounded-md text-slate-50 hover:text-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
                    >
                      {Icon && <Icon className="h-7 w-7" color="currentColor" aria-hidden="true" />}
                      <span className="line-clamp-2 text-[10px] font-semibold leading-tight">
                        {lever.name}
                      </span>
                    </button>
                    <div className="mb-1 flex w-full items-center justify-between text-[9px] font-medium text-slate-300">
                      <span>LEVEL</span><span className="rounded bg-emerald-400/25 px-1.5 py-0.5 text-[11px] font-bold text-emerald-100">{level}/4</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={4}
                      step={1}
                      value={level}
                      onChange={event => onLevelChange(index, Number(event.currentTarget.value))}
                      aria-label={`${lever.name} ambition level`}
                      aria-valuetext={`Level ${level} of 4`}
                      className="immersive-lever-range w-full cursor-pointer"
                      style={{ background: `linear-gradient(to right,#64ddb9 0%,#64ddb9 ${percentage}%,rgba(255,255,255,.26) ${percentage}%,rgba(255,255,255,.26) 100%)` }}
                    />
                    <div aria-hidden="true" className="mt-1.5 flex w-full justify-between text-[9px] text-slate-300">
                      <span>1</span><span>4</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>

    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2 lg:w-[124px] lg:flex-col lg:justify-center lg:border-l lg:border-t-0 lg:pb-1 lg:pl-3 lg:pt-1">
      <button
        type="button"
        onClick={onResults}
        className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg bg-emerald-400 px-3 py-2 text-xs font-bold text-slate-950 shadow-lg hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 lg:w-full"
      >
        Results <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg border border-white/25 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300 lg:w-full"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset
      </button>
      {onSaveComparison && (
        <button
          type="button"
          onClick={onSaveComparison}
          className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg border border-white/25 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300 lg:w-full"
        >
          <Save className="h-3.5 w-3.5" aria-hidden="true" /> Save comparison
        </button>
      )}
      {hasComparison && onClearComparison && (
        <button
          type="button"
          onClick={onClearComparison}
          className="inline-flex min-h-9 items-center justify-center gap-1 rounded-lg border border-red-300/30 bg-red-950/40 px-2.5 py-1.5 text-xs font-medium text-red-100 hover:bg-red-950/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-300 lg:w-full"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" /> Clear saved
        </button>
      )}
    </div>
  </div>
);
