import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, X } from 'lucide-react';

interface TOCItem {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  body: string;
}

// Parse headings from markdown-style body
function parseHeadings(body: string): TOCItem[] {
  const lines = body.split('\n');
  const headings: TOCItem[] = [];

  lines.forEach((line) => {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      const title = match[1];
      headings.push({
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
      });
    }
  });

  return headings;
}

const TableOfContents = ({ body }: TableOfContentsProps) => {
  const sections = useMemo(() => parseHeadings(body), [body]);
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (sections.length === 0) return;
    
    const observers: IntersectionObserver[] = [];
    
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(section.id);
              }
            });
          },
          { rootMargin: '-20% 0px -70% 0px' }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileOpen(false);
    }
  };

  if (sections.length === 0) return null;

  const TOCContent = () => (
    <nav className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Contents
      </h3>
      {sections.map((section, index) => (
        <motion.button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className={`group flex items-center gap-3 w-full text-left py-2 transition-colors ${
            activeSection === section.id
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          whileHover={{ x: 4 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <span
            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono transition-colors ${
              activeSection === section.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground group-hover:bg-primary/20'
            }`}
          >
            {index + 1}
          </span>
          <span className="text-sm font-medium line-clamp-2">{section.title}</span>
          
          {/* Active indicator */}
          {activeSection === section.id && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 w-0.5 h-6 bg-primary rounded-full"
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop TOC - Sticky Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 w-64 max-h-[60vh] overflow-y-auto"
      >
        <div className="glass-card rounded-2xl p-6 border border-primary/10">
          <TOCContent />
        </div>
      </motion.aside>

      {/* Mobile TOC - Floating Button & Drawer */}
      <div className="lg:hidden">
        {/* Floating Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => setIsMobileOpen(true)}
          className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <List className="w-5 h-5" />
        </motion.button>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              />
              
              {/* Drawer */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-3xl glass-card border-t border-primary/20 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Contents</h3>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <TOCContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default TableOfContents;
