import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Twitter, Linkedin, Mail, Bookmark, BookmarkCheck, Printer, Link, Check } from 'lucide-react';

interface ShareActionsProps {
  title: string;
}

const ShareActions = ({ title }: ShareActionsProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(currentUrl);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:bg-blue-500/20 hover:text-blue-400',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:bg-blue-600/20 hover:text-blue-500',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      color: 'hover:bg-primary/20 hover:text-primary',
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const ActionButton = ({ 
    onClick, 
    children, 
    active = false,
    ariaLabel 
  }: { 
    onClick: () => void; 
    children: React.ReactNode;
    active?: boolean;
    ariaLabel: string;
  }) => (
    <motion.button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
        active 
          ? 'bg-primary/20 text-primary' 
          : 'bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      {/* Ripple effect */}
      <motion.span
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 rounded-full bg-primary/20 pointer-events-none"
        key={Date.now()}
      />
    </motion.button>
  );

  return (
    <>
      {/* Desktop - Floating sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-3"
      >
        <div className="glass-card rounded-full p-2 border border-primary/10 flex flex-col gap-2">
          {/* Share button with dropdown */}
          <div className="relative">
            <ActionButton 
              onClick={() => setIsShareOpen(!isShareOpen)}
              ariaLabel="Share"
            >
              <Share2 className="w-4 h-4" />
            </ActionButton>
            
            <AnimatePresence>
              {isShareOpen && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.9 }}
                  className="absolute right-full mr-3 top-0 glass-card rounded-2xl p-2 border border-primary/10 flex flex-col gap-1"
                >
                  {shareLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground transition-colors ${link.color}`}
                      whileHover={{ x: -4 }}
                    >
                      <link.icon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ActionButton 
            onClick={() => setIsBookmarked(!isBookmarked)}
            active={isBookmarked}
            ariaLabel="Bookmark"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </ActionButton>

          <ActionButton onClick={copyToClipboard} ariaLabel="Copy link">
            {isCopied ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Link className="w-4 h-4" />
            )}
          </ActionButton>

          <ActionButton onClick={handlePrint} ariaLabel="Print">
            <Printer className="w-4 h-4" />
          </ActionButton>
        </div>
      </motion.aside>

    </>
  );
};

export default ShareActions;
