import { motion } from 'framer-motion';

interface SectionDividerProps {
  sectionNumber?: number;
}

const SectionDivider = ({ sectionNumber }: SectionDividerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex items-center gap-4 my-12"
    >
      {/* Left line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-primary/50 origin-left"
      />
      
      {/* Section number */}
      {sectionNumber && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-mono font-medium"
        >
          {sectionNumber}
        </motion.span>
      )}
      
      {/* Right line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 h-px bg-gradient-to-l from-transparent via-primary/30 to-primary/50 origin-right"
      />
    </motion.div>
  );
};

export default SectionDivider;
