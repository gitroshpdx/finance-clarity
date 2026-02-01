import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/50 bg-card/50">
      <div className="container px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-lg tracking-tight">
                Macro<span className="text-primary">Finance</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Complexity made breathtakingly clear. Premium financial intelligence 
              for the globally ambitious.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Trusted by 50,000+ global decision-makers
            </p>
          </div>

          {/* Topics */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Topics</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/reports?category=technology" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Technology
              </Link>
              <Link to="/reports?category=real-estate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Real Estate
              </Link>
            </nav>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Platform</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/reports" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Reports
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Legal</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-12 mt-12 border-t border-border/50">
          <p className="text-xs text-muted-foreground/60">
            © {currentYear} Macro Finance Report. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
