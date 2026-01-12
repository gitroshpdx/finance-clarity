import { motion } from 'framer-motion';
import type { ArticleSection } from '@/data/mockReports';
import SectionDivider from './SectionDivider';
import DataVisualization from './DataVisualization';

interface ArticleContentProps {
  sections: ArticleSection[];
}

const ArticleContent = ({ sections }: ArticleContentProps) => {
  return (
    <article className="max-w-3xl mx-auto px-6">
      {sections.map((section, index) => (
        <motion.section
          key={section.id}
          id={section.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="scroll-mt-24"
        >
          {index > 0 && <SectionDivider sectionNumber={index + 1} />}
          
          {/* Section Title */}
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 mt-8">
            {section.title}
          </h2>
          
          {/* Section Content */}
          <div className="prose prose-lg max-w-none">
            {section.content.split('\n\n').map((paragraph, pIndex) => (
              <p
                key={pIndex}
                className={`text-muted-foreground leading-[1.8] mb-6 ${
                  index === 0 && pIndex === 0 ? 'drop-cap' : ''
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Pull Quote */}
          {section.pullQuote && (
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="pull-quote"
            >
              {section.pullQuote}
            </motion.blockquote>
          )}
          
          {/* Chart */}
          {section.chart && <DataVisualization chart={section.chart} />}
        </motion.section>
      ))}
    </article>
  );
};

export default ArticleContent;
