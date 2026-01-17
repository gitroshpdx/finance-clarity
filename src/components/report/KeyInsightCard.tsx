import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface KeyInsightCardProps {
  content: string;
  type?: 'key' | 'insight' | 'takeaway';
}

const KeyInsightCard = ({ content, type = 'key' }: KeyInsightCardProps) => {
  const isKey = type === 'key' || type === 'insight';
  const isTakeaway = type === 'takeaway';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative my-8 pl-6 pr-6 py-5 rounded-r-lg border-l-4 ${
        isTakeaway 
          ? 'border-l-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10' 
          : 'border-l-amber-500 bg-amber-500/5 dark:bg-amber-500/10'
      }`}
    >
      {/* Decorative gradient */}
      <div className={`absolute inset-0 rounded-r-lg opacity-30 ${
        isTakeaway
          ? 'bg-gradient-to-r from-emerald-500/20 to-transparent'
          : 'bg-gradient-to-r from-amber-500/20 to-transparent'
      }`} />
      
      {/* Icon */}
      <div className={`absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center ${
        isTakeaway 
          ? 'bg-emerald-500 text-white' 
          : 'bg-amber-500 text-white'
      }`}>
        <Lightbulb className="w-3.5 h-3.5" />
      </div>

      {/* Label */}
      <span className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${
        isTakeaway 
          ? 'text-emerald-600 dark:text-emerald-400' 
          : 'text-amber-600 dark:text-amber-400'
      }`}>
        {isTakeaway ? 'Key Takeaway' : 'Key Insight'}
      </span>

      {/* Content */}
      <p className="relative text-foreground font-medium leading-relaxed text-[1.05rem]">
        {content}
      </p>
    </motion.div>
  );
};

export default KeyInsightCard;
