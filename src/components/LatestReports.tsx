import { motion } from 'framer-motion';
import ReportCard from './ReportCard';
import { mockReports } from '@/data/mockReports';

const LatestReports = () => {
  return (
    <section id="reports" className="relative py-24 md:py-32">
      <div className="container px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-display font-sans mb-4">Latest Intelligence</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fresh insights from global markets, economies, and policy developments—
            distilled for clarity.
          </p>
        </motion.div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {mockReports.map((report, index) => (
            <ReportCard
              key={report.id}
              slug={report.slug}
              title={report.title}
              teaser={report.teaser}
              readTime={report.readTime}
              topic={report.topic}
              publishedAt={report.publishedAt}
              index={index}
            />
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-16"
        >
          <button className="group flex items-center gap-2 px-6 py-3 rounded-full glass-card text-muted-foreground hover:text-foreground transition-colors">
            <span className="font-medium">Load more reports</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-5"
            >
              ↓
            </motion.div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestReports;
