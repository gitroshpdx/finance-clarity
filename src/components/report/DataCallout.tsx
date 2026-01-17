import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DataCalloutProps {
  value: string;
  label: string;
  context?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const DataCallout = ({ value, label, context, trend }: DataCalloutProps) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="my-8 p-6 rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/10 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative flex items-start gap-4">
        {/* Large number */}
        <div className="flex-shrink-0">
          <span className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">
            {value}
          </span>
        </div>

        {/* Label and context */}
        <div className="flex-1 pt-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground uppercase tracking-wide">
              {label}
            </span>
            {trend && (
              <TrendIcon className={`w-4 h-4 ${trendColor}`} />
            )}
          </div>
          {context && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {context}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DataCallout;
