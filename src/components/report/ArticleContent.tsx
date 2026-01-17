import { motion } from 'framer-motion';
import SectionDivider from './SectionDivider';
import KeyInsightCard from './KeyInsightCard';
import DataCallout from './DataCallout';
import PullQuote from './PullQuote';
import PremiumTable from './PremiumTable';
import PremiumList from './PremiumList';
import AlertBox from './AlertBox';

interface ArticleContentProps {
  body: string;
}

type ContentBlock =
  | { type: 'paragraph'; content: string; isFirst?: boolean }
  | { type: 'key-insight'; content: string; variant: 'key' | 'takeaway' }
  | { type: 'data-callout'; value: string; label: string; context?: string }
  | { type: 'pull-quote'; quote: string; attribution?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'list'; items: string[]; ordered: boolean }
  | { type: 'alert'; content: string; variant: 'warning' | 'risk' | 'info' };

interface Section {
  id: string;
  title: string;
  blocks: ContentBlock[];
}

// Parse a single line/block and determine its type
function parseBlock(line: string): ContentBlock | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Key insight: > KEY: or > INSIGHT:
  const keyMatch = trimmed.match(/^>\s*(KEY|INSIGHT):\s*(.+)$/i);
  if (keyMatch) {
    return { type: 'key-insight', content: keyMatch[2], variant: 'key' };
  }

  // Takeaway: > TAKEAWAY:
  const takeawayMatch = trimmed.match(/^>\s*TAKEAWAY:\s*(.+)$/i);
  if (takeawayMatch) {
    return { type: 'key-insight', content: takeawayMatch[1], variant: 'takeaway' };
  }

  // Data callout: > DATA: value | label | context
  const dataMatch = trimmed.match(/^>\s*DATA:\s*(.+?)\s*\|\s*(.+?)(?:\s*\|\s*(.+))?$/i);
  if (dataMatch) {
    return {
      type: 'data-callout',
      value: dataMatch[1].trim(),
      label: dataMatch[2].trim(),
      context: dataMatch[3]?.trim(),
    };
  }

  // Warning/Risk: > RISK: or > WARNING:
  const warningMatch = trimmed.match(/^>\s*(RISK|WARNING):\s*(.+)$/i);
  if (warningMatch) {
    return {
      type: 'alert',
      content: warningMatch[2],
      variant: warningMatch[1].toLowerCase() as 'risk' | 'warning',
    };
  }

  // Info note: > NOTE: or > INFO:
  const infoMatch = trimmed.match(/^>\s*(NOTE|INFO):\s*(.+)$/i);
  if (infoMatch) {
    return { type: 'alert', content: infoMatch[2], variant: 'info' };
  }

  // Pull quote: > "quote text" - attribution or > "quote text"
  const quoteMatch = trimmed.match(/^>\s*"(.+?)"\s*(?:-\s*(.+))?$/);
  if (quoteMatch) {
    return {
      type: 'pull-quote',
      quote: quoteMatch[1],
      attribution: quoteMatch[2]?.trim(),
    };
  }

  // Regular paragraph
  return { type: 'paragraph', content: trimmed };
}

// Parse markdown table
function parseTable(lines: string[], startIndex: number): { table: ContentBlock | null; endIndex: number } {
  const tableLines: string[] = [];
  let i = startIndex;

  while (i < lines.length && lines[i].includes('|')) {
    tableLines.push(lines[i]);
    i++;
  }

  if (tableLines.length < 2) return { table: null, endIndex: startIndex };

  // Parse headers
  const headers = tableLines[0]
    .split('|')
    .map((h) => h.trim())
    .filter((h) => h && !h.match(/^-+$/));

  // Skip separator line
  let dataStartIndex = 1;
  if (tableLines[1] && tableLines[1].match(/^\|?\s*[-:]+\s*\|/)) {
    dataStartIndex = 2;
  }

  // Parse rows
  const rows = tableLines.slice(dataStartIndex).map((row) =>
    row
      .split('|')
      .map((cell) => cell.trim())
      .filter((cell) => cell)
  );

  if (headers.length === 0) return { table: null, endIndex: startIndex };

  return {
    table: { type: 'table', headers, rows },
    endIndex: i - 1,
  };
}

// Parse list items
function parseList(lines: string[], startIndex: number): { list: ContentBlock | null; endIndex: number } {
  const items: string[] = [];
  let i = startIndex;
  let ordered = false;

  // Check if ordered list
  const firstLine = lines[startIndex]?.trim();
  if (firstLine?.match(/^\d+\.\s/)) {
    ordered = true;
  }

  while (i < lines.length) {
    const line = lines[i].trim();
    const unorderedMatch = line.match(/^[-*]\s+(.+)$/);
    const orderedMatch = line.match(/^\d+\.\s+(.+)$/);

    if (unorderedMatch && !ordered) {
      items.push(unorderedMatch[1]);
    } else if (orderedMatch && ordered) {
      items.push(orderedMatch[1]);
    } else if (unorderedMatch && items.length === 0) {
      items.push(unorderedMatch[1]);
      ordered = false;
    } else {
      break;
    }
    i++;
  }

  if (items.length === 0) return { list: null, endIndex: startIndex };

  return {
    list: { type: 'list', items, ordered },
    endIndex: i - 1,
  };
}

// Main parser
function parseBodyContent(body: string) {
  const lines = body.split('\n');
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let introBlocks: ContentBlock[] = [];
  let isFirstParagraph = true;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const headingMatch = line.match(/^##\s+(.+)$/);

    if (headingMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const title = headingMatch[1];
      currentSection = {
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        blocks: [],
      };
      isFirstParagraph = true;
      i++;
      continue;
    }

    // Check for table
    if (line.includes('|') && line.trim().startsWith('|')) {
      const { table, endIndex } = parseTable(lines, i);
      if (table) {
        if (currentSection) {
          currentSection.blocks.push(table);
        } else {
          introBlocks.push(table);
        }
        i = endIndex + 1;
        continue;
      }
    }

    // Check for list
    const trimmedLine = line.trim();
    if (trimmedLine.match(/^[-*]\s/) || trimmedLine.match(/^\d+\.\s/)) {
      const { list, endIndex } = parseList(lines, i);
      if (list) {
        if (currentSection) {
          currentSection.blocks.push(list);
        } else {
          introBlocks.push(list);
        }
        i = endIndex + 1;
        continue;
      }
    }

    // Parse regular block
    const block = parseBlock(line);
    if (block) {
      if (block.type === 'paragraph' && isFirstParagraph) {
        block.isFirst = true;
        isFirstParagraph = false;
      }
      if (currentSection) {
        currentSection.blocks.push(block);
      } else {
        introBlocks.push(block);
      }
    }
    i++;
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return { introBlocks, sections };
}

// Render a single content block
function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p
          key={index}
          className={`text-muted-foreground leading-[1.85] mb-6 text-[1.05rem] ${
            block.isFirst ? 'drop-cap' : ''
          }`}
        >
          {block.content}
        </p>
      );
    case 'key-insight':
      return <KeyInsightCard key={index} content={block.content} type={block.variant} />;
    case 'data-callout':
      return (
        <DataCallout
          key={index}
          value={block.value}
          label={block.label}
          context={block.context}
        />
      );
    case 'pull-quote':
      return <PullQuote key={index} quote={block.quote} attribution={block.attribution} />;
    case 'table':
      return <PremiumTable key={index} headers={block.headers} rows={block.rows} />;
    case 'list':
      return <PremiumList key={index} items={block.items} ordered={block.ordered} />;
    case 'alert':
      return <AlertBox key={index} content={block.content} type={block.variant} />;
    default:
      return null;
  }
}

const ArticleContent = ({ body }: ArticleContentProps) => {
  const { introBlocks, sections } = parseBodyContent(body);

  return (
    <article className="max-w-3xl mx-auto px-6">
      {/* Intro content (before any headings) */}
      {introBlocks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="prose prose-lg max-w-none mb-12"
        >
          {introBlocks.map((block, index) => renderBlock(block, index))}
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
          <div className="relative mb-8 mt-10">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xs font-mono text-primary/60 uppercase tracking-widest mb-2 block"
            >
              Section {index + 1}
            </motion.span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              {section.title}
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute -bottom-2 left-0 h-0.5 w-16 bg-gradient-to-r from-primary to-primary/30 origin-left"
            />
          </div>

          {/* Section Content */}
          <div className="prose prose-lg max-w-none">
            {section.blocks.map((block, bIndex) => renderBlock(block, bIndex))}
          </div>
        </motion.section>
      ))}

      {/* Fallback: If no sections and no intro, render as paragraphs */}
      {sections.length === 0 && introBlocks.length === 0 && (
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
              className={`text-muted-foreground leading-[1.85] mb-6 ${pIndex === 0 ? 'drop-cap' : ''}`}
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
