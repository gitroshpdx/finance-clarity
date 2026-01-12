import { motion } from 'framer-motion';
import { Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/50 bg-card/50">
      <div className="container px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-lg tracking-tight">
                Macro<span className="text-primary">Finance</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Complexity made breathtakingly clear. Premium financial intelligence 
              for the globally ambitious.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Trusted by 50,000+ global decision-makers
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Platform</h4>
            <nav className="flex flex-col gap-3">
              <a href="#reports" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Reports
              </a>
              <a href="#topics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Topics
              </a>
              <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#subscribe" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Subscribe
              </a>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Legal</h4>
            <nav className="flex flex-col gap-3">
              <a href="#privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 mt-12 border-t border-border/50">
          <p className="text-xs text-muted-foreground/60">
            © {currentYear} Macro Finance Report. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {[
              { icon: Twitter, href: '#twitter', label: 'Twitter' },
              { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
              { icon: Github, href: '#github', label: 'GitHub' },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
