import { motion } from 'framer-motion';
import ReportCard from '@/components/ReportCard';
import { getRelatedReports } from '@/data/mockReports';

interface RelatedReportsProps {
  reportIds: string[];
  currentReportId: string;
}

const RelatedReports = ({ reportIds, currentReportId }: RelatedReportsProps) => {
  const relatedReports = getRelatedReports(reportIds)
    .filter(report => report.id !== currentReportId)
    .slice(0, 3);

  if (relatedReports.length === 0) return null;

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
              teaser={report.teaser}
              readTime={report.readTime}
              topic={report.topic}
              publishedAt={report.publishedAt}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedReports;
