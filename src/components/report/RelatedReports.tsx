import { motion } from 'framer-motion';
import ReportCard from '@/components/ReportCard';
import { useRelatedReports } from '@/hooks/useReports';
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedReportsProps {
  category: string;
  currentReportId: string;
}

const RelatedReports = ({ category, currentReportId }: RelatedReportsProps) => {
  const { data: relatedReports, isLoading } = useRelatedReports(category, currentReportId);

  if (isLoading) {
    return (
      <section className="py-20 border-t border-primary/10">
        <div className="container px-6 max-w-6xl mx-auto">
          <h2 className="text-display font-sans text-center mb-12">Related Intelligence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-6">
                <Skeleton className="h-4 w-20 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!relatedReports || relatedReports.length === 0) return null;

  return (
    <section className="py-20 border-t border-primary/10">
      <div className="container px-6 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-display font-sans text-center mb-12"
        >
          Related Intelligence
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {relatedReports.map((report, index) => (
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
      </div>
    </section>
  );
};

export default RelatedReports;
