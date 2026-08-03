import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { UK_HISTORICAL_EMISSIONS } from '@/data/ukEmissions';

interface TimelineChartProps {
  totalReduction: number;
  showHistorical?: boolean;
}

/**
 * Generates a projected emissions pathway from 2025 to 2050
 * based on the total reduction achieved in the scenario.
 * Uses an S-curve (logistic) projection for realistic deployment timing.
 */
const generatePathway = (totalReduction: number) => {
  const years = [2025, 2030, 2035, 2040, 2045, 2050];
  return years.map(year => {
    const t = (year - 2025) / 25;
    const progress = t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const reduction = totalReduction * progress;
    const emissions = 800 * (1 - reduction / 100);
    return {
      year,
      emissions: Math.round(emissions),
      reduction: Math.round(reduction),
    };
  });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const isHistorical = Number(label) <= 2023;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {label} {isHistorical ? '(Actual)' : '(Projected)'}
        </p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? `${entry.value} MtCO₂e` : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const TimelineChart = ({ totalReduction, showHistorical = true }: TimelineChartProps) => {
  const pathwayData = useMemo(() => generatePathway(totalReduction), [totalReduction]);

  // Merge historical + projected data
  const combinedData = useMemo(() => {
    if (!showHistorical) {
      return pathwayData.map(p => ({
        year: p.year,
        scenarioEmissions: p.emissions as number | undefined,
        baselineEmissions: 800,
        historicalEmissions: undefined as number | undefined,
      }));
    }

    const result = UK_HISTORICAL_EMISSIONS.map(h => ({
      year: h.year,
      historicalEmissions: h.emissions as number | undefined,
      scenarioEmissions: undefined as number | undefined,
      baselineEmissions: 800,
    }));

    pathwayData.forEach(p => {
      const existing = result.find(r => r.year === p.year);
      if (existing) {
        existing.scenarioEmissions = p.emissions;
      } else {
        result.push({
          year: p.year,
          historicalEmissions: undefined,
          scenarioEmissions: p.emissions,
          baselineEmissions: 800,
        });
      }
    });

    return result.sort((a, b) => a.year - b.year);
  }, [pathwayData, showHistorical]);

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis
            dataKey="year"
            stroke="var(--chart-text)"
            tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
            tickLine={{ stroke: 'var(--chart-grid)' }}
            axisLine={{ stroke: 'var(--chart-grid)' }}
          />
          <YAxis
            yAxisId="left"
            stroke="var(--chart-text)"
            tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
            tickLine={{ stroke: 'var(--chart-grid)' }}
            axisLine={{ stroke: 'var(--chart-grid)' }}
            label={{ value: 'Emissions (MtCO₂e)', angle: -90, position: 'insideLeft', fill: 'var(--chart-text)', fontSize: 12 }}
            domain={[0, 800]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <ReferenceLine
            yAxisId="left"
            y={0}
            stroke="#4CAF50"
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{ value: 'Net Zero', position: 'right', fill: '#4CAF50', fontSize: 11 }}
          />
          {/* Divider line at 2023 */}
          <ReferenceLine
            x={2023}
            yAxisId="left"
            stroke="#9E9E9E"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            label={{ value: 'Now', position: 'top', fill: '#9E9E9E', fontSize: 10 }}
          />
          {showHistorical && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="historicalEmissions"
              name="UK Historical Emissions"
              stroke="#4CAF50"
              strokeWidth={2.5}
              dot={{ fill: '#4CAF50', r: 3 }}
              connectNulls={false}
            />
          )}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="scenarioEmissions"
            name="Your Scenario (Projected)"
            stroke="#42A5F5"
            strokeWidth={3}
            dot={{ fill: '#42A5F5', r: 5 }}
            connectNulls={false}
            activeDot={{ r: 7 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="baselineEmissions"
            name="Baseline (no action)"
            stroke="#9E9E9E"
            strokeWidth={2}
            strokeDasharray="8 4"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
