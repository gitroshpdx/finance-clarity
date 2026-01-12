import { motion } from 'framer-motion';
import { Clock, Calendar, User } from 'lucide-react';
import type { Report } from '@/data/mockReports';

interface ReportHeroProps {
  report: Report;
}

const topicGradients: Record<string, string> = {
  'Macroeconomics': 'from-blue-500/30 via-indigo-500/20 to-transparent',
  'Markets': 'from-emerald-500/30 via-teal-500/20 to-transparent',
  'Geopolitics': 'from-orange-500/30 via-red-500/20 to-transparent',
  'Currencies': 'from-green-500/30 via-emerald-500/20 to-transparent',
  'Energy & Commodities': 'from-yellow-500/30 via-orange-500/20 to-transparent',
  'Tech & Innovation': 'from-purple-500/30 via-pink-500/20 to-transparent',
};

const ReportHero = ({ report }: ReportHeroProps) => {
  const gradientClass = topicGradients[report.topic] || 'from-primary/30 via-primary-glow/20 to-transparent';

  return (
    <header className="relative min-h-[60vh] flex items-end pb-16 overflow-hidden">
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${gradientClass}`} />
      
      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 right-[20%] w-64 h-64 rounded-full bg-primary/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-[10%] w-48 h-48 rounded-full bg-primary-glow/10 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      />

      <div className="container relative px-6 max-w-4xl mx-auto">
        {/* Topic badge */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block px-4 py-1.5 text-sm font-medium rounded-full bg-primary/20 text-primary mb-6"
        >
          {report.topic}
        </motion.span>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-8"
        >
          {report.title}
        </motion.h1>

        {/* Teaser */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl"
        >
          {report.teaser}
        </motion.p>

        {/* Meta information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
        >
          {report.author && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">{report.author.name}</span>
              {report.author.title && (
                <span className="hidden sm:inline">• {report.author.title}</span>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>{report.readTime} min read</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{report.publishedAt}</span>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default ReportHero;
