import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface PremiumListProps {
  items: string[];
  ordered?: boolean;
}

const PremiumList = ({ items, ordered = false }: PremiumListProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0 },
  };

  if (ordered) {
    return (
      <motion.ol
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="my-6 space-y-3 pl-0 list-none"
      >
        {items.map((item, index) => (
          <motion.li
            key={index}
            variants={itemVariants}
            className="flex items-start gap-4 group"
          >
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
              {index + 1}
            </span>
            <span className="text-muted-foreground leading-relaxed flex-1 pt-0.5">
              {item}
            </span>
          </motion.li>
        ))}
      </motion.ol>
    );
  }

  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="my-6 space-y-3 pl-0 list-none"
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          variants={itemVariants}
          className="flex items-start gap-3 group"
        >
          <ChevronRight className="flex-shrink-0 w-5 h-5 text-primary mt-0.5 group-hover:translate-x-1 transition-transform duration-200" />
          <span className="text-muted-foreground leading-relaxed flex-1">
            {item}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default PremiumList;
