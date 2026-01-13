import { motion } from 'framer-motion';
import SectionDivider from './SectionDivider';

interface ArticleContentProps {
  body: string;
}

// Parse markdown-style headings and content
function parseBodyContent(body: string) {
  const lines = body.split('\n');
  const sections: { id: string; title: string; content: string[] }[] = [];
  let currentSection: { id: string; title: string; content: string[] } | null = null;
  let introContent: string[] = [];

  lines.forEach((line) => {
    const headingMatch = line.match(/^##\s+(.+)$/);
    
    if (headingMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const title = headingMatch[1];
      currentSection = {
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        content: [],
      };
    } else if (currentSection) {
      if (line.trim()) {
        currentSection.content.push(line);
      }
    } else {
      // Content before any heading goes to intro
      if (line.trim()) {
        introContent.push(line);
      }
    }
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  return { introContent, sections };
}

const ArticleContent = ({ body }: ArticleContentProps) => {
  const { introContent, sections } = parseBodyContent(body);

  return (
    <article className="max-w-3xl mx-auto px-6">
      {/* Intro content (before any headings) */}
      {introContent.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="prose prose-lg max-w-none mb-12"
        >
          {introContent.map((paragraph, pIndex) => (
            <p
              key={pIndex}
              className={`text-muted-foreground leading-[1.8] mb-6 ${pIndex === 0 ? 'drop-cap' : ''}`}
            >
              {paragraph}
            </p>
          ))}
        </motion.div>
      )}

      {/* Sections with headings */}
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
            {section.content.map((paragraph, pIndex) => (
              <p
                key={pIndex}
                className={`text-muted-foreground leading-[1.8] mb-6 ${
                  index === 0 && pIndex === 0 && introContent.length === 0 ? 'drop-cap' : ''
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </motion.section>
      ))}

      {/* If no sections, just render the body as paragraphs */}
      {sections.length === 0 && introContent.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="prose prose-lg max-w-none"
        >
          {body.split('\n\n').map((paragraph, pIndex) => (
            <p
              key={pIndex}
              className={`text-muted-foreground leading-[1.8] mb-6 ${pIndex === 0 ? 'drop-cap' : ''}`}
            >
              {paragraph}
            </p>
          ))}
        </motion.div>
      )}
    </article>
  );
};

export default ArticleContent;
