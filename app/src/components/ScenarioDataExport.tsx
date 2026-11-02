import { useState } from 'react';
import { FileJson, FileSpreadsheet } from 'lucide-react';
import { createScenarioReport, scenarioReportToCsv } from '@/lib/scenarioReport';

interface ScenarioDataExportProps {
  levels: number[];
  comparisonLevels?: number[] | null;
}

export const ScenarioDataExport = ({ levels, comparisonLevels }: ScenarioDataExportProps) => {
  const [error, setError] = useState(false);

  const download = (format: 'csv' | 'json') => {
    try {
      const report = createScenarioReport(levels, comparisonLevels);
      const content = format === 'csv'
        ? scenarioReportToCsv(report)
        : JSON.stringify(report, null, 2);
      const blob = new Blob([content], {
        type: format === 'csv' ? 'text/csv;charset=utf-8' : 'application/json;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'my2050-scenario.' + format;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setError(false);
    } catch (cause) {
      console.error('Scenario data export failed', cause);
      setError(true);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => download('csv')}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        aria-label="Download scenario as CSV spreadsheet"
      >
        <FileSpreadsheet className="h-4 w-4" aria-hidden="true" /> CSV
      </button>
      <button
        type="button"
        onClick={() => download('json')}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        aria-label="Download scenario as JSON data"
      >
        <FileJson className="h-4 w-4" aria-hidden="true" /> JSON
      </button>
      {error && <span role="alert" className="text-xs text-red-700 dark:text-red-300">Export failed. Please retry.</span>}
    </div>
  );
};
