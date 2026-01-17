import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface PullQuoteProps {
  quote: string;
  attribution?: string;
}

const PullQuote = ({ quote, attribution }: PullQuoteProps) => {
  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative my-10 py-8 px-8 md:px-12"
    >
      {/* Left border accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/60 to-transparent rounded-full" />
      
      {/* Quote icon */}
      <Quote className="absolute -top-2 left-6 w-8 h-8 text-primary/20 rotate-180" />
      
      {/* Quote text */}
      <p className="font-serif text-xl md:text-2xl italic text-foreground/90 leading-relaxed mb-4">
        "{quote}"
      </p>

      {/* Attribution */}
      {attribution && (
        <footer className="flex items-center gap-2">
          <span className="w-8 h-px bg-primary/40" />
          <cite className="text-sm font-medium text-muted-foreground not-italic">
            {attribution}
          </cite>
        </footer>
      )}
    </motion.blockquote>
  );
};

export default PullQuote;
