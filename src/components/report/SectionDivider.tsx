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
      className="flex items-center gap-6 my-16"
    >
      {/* Left decorative element */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex items-center gap-2 origin-left"
      >
        <div className="w-2 h-2 rounded-full bg-primary/40" />
        <div className="flex-1 h-px bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
      </motion.div>

      {/* Center diamond */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        whileInView={{ scale: 1, rotate: 45 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
        className="relative"
      >
        <div className="w-3 h-3 bg-primary/20 border border-primary/40" />
        <div className="absolute inset-0.5 bg-primary/10" />
      </motion.div>

      {/* Right decorative element */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex items-center gap-2 origin-right"
      >
        <div className="flex-1 h-px bg-gradient-to-l from-primary/40 via-primary/20 to-transparent" />
        <div className="w-2 h-2 rounded-full bg-primary/40" />
      </motion.div>
    </motion.div>
  );
};

export default SectionDivider;
