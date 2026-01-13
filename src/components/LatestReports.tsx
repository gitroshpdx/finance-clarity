import { motion } from 'framer-motion';
import ReportCard from './ReportCard';
import { usePublishedReports } from '@/hooks/useReports';
import { Skeleton } from '@/components/ui/skeleton';

const LatestReports = () => {
  const { data: reports, isLoading } = usePublishedReports(6);

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

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-6">
                <Skeleton className="h-4 w-20 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!reports || reports.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground text-lg">
              No published reports yet. Check back soon for fresh intelligence.
            </p>
          </motion.div>
        )}

        {/* Reports Grid */}
        {!isLoading && reports && reports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {reports.map((report, index) => (
              <ReportCard
                key={report.id}
                slug={report.slug}
                title={report.title}
                teaser={report.excerpt || ''}
                readTime={Math.ceil((report.word_count || 0) / 200)}
                topic={report.category}
                publishedAt={report.published_at || report.created_at}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestReports;
