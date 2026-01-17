import { motion } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';

interface AlertBoxProps {
  content: string;
  type: 'warning' | 'risk' | 'info';
}

const AlertBox = ({ content, type }: AlertBoxProps) => {
  const isWarning = type === 'warning' || type === 'risk';
  const Icon = isWarning ? AlertTriangle : Info;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`my-8 p-5 rounded-lg border ${
        isWarning
          ? 'bg-amber-500/5 border-amber-500/20 dark:bg-amber-500/10'
          : 'bg-blue-500/5 border-blue-500/20 dark:bg-blue-500/10'
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`flex-shrink-0 w-5 h-5 mt-0.5 ${
          isWarning ? 'text-amber-500' : 'text-blue-500'
        }`} />
        <div>
          <span className={`text-xs font-semibold uppercase tracking-wider mb-1 block ${
            isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'
          }`}>
            {type === 'risk' ? 'Risk Factor' : type === 'warning' ? 'Warning' : 'Note'}
          </span>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertBox;
