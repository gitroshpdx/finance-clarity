import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface ChartData {
  type: 'line' | 'bar' | 'area';
  title: string;
  data: { date: string; value: number }[];
}

interface DataVisualizationProps {
  chart: ChartData;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 rounded-lg border border-primary/20">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-lg font-mono text-primary font-semibold">
          {payload[0].value.toFixed(1)}
        </p>
      </div>
    );
  }
  return null;
};

const DataVisualization = ({ chart }: DataVisualizationProps) => {
  const chartColor = 'hsl(var(--primary))';
  const chartColorLight = 'hsl(var(--primary) / 0.2)';
  const gridColor = 'hsl(var(--muted-foreground) / 0.1)';
  const textColor = 'hsl(var(--muted-foreground))';

  const renderChart = () => {
    switch (chart.type) {
      case 'area':
        return (
          <AreaChart data={chart.data}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="date" 
              stroke={textColor} 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke={textColor} 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              fill="url(#areaGradient)"
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        );
      
      case 'bar':
        return (
          <BarChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="date" 
              stroke={textColor} 
              fontSize={11} 
              tickLine={false}
              axisLine={false}
              angle={-15}
              textAnchor="end"
              height={50}
            />
            <YAxis 
              stroke={textColor} 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill={chartColor}
              radius={[4, 4, 0, 0]}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </BarChart>
        );
      
      case 'line':
      default:
        return (
          <LineChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="date" 
              stroke={textColor} 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke={textColor} 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              dot={{ fill: chartColor, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: chartColor }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </LineChart>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="my-10 glass-card rounded-2xl p-6 border border-primary/10"
    >
      <h4 className="text-lg font-semibold text-foreground mb-6">
        {chart.title}
      </h4>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DataVisualization;
