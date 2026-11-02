import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

interface DataPoint {
  category: string;
  reference: number;
  scenario: number;
}

interface EmissionsChartProps {
  data: DataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(0)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const EmissionsChart = ({ data }: EmissionsChartProps) => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
          <XAxis 
            dataKey="category" 
            stroke="var(--chart-text)"
            tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
            tickLine={{ stroke: 'var(--chart-grid)' }}
            axisLine={{ stroke: 'var(--chart-grid)' }}
          />
          <YAxis 
            stroke="var(--chart-text)"
            tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
            tickLine={{ stroke: 'var(--chart-grid)' }}
            axisLine={{ stroke: 'var(--chart-grid)' }}
            label={{ value: 'Model share (%)', angle: -90, position: 'insideLeft', fill: 'var(--chart-text)', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="reference" name="Reference weight (level 1)" fill="#9E9E9E" radius={[4, 4, 0, 0]} />
          <Bar dataKey="scenario" name="Your scenario" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.scenario < entry.reference ? '#42A5F5' : '#EF5350'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
