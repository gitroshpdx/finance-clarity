import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Disclaimer"
        description="Important disclaimer regarding the use of information provided on Apex Intel Stream. Read our terms of use and limitations."
        canonical="/disclaimer"
      />
      <Navigation />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <h1 className="text-4xl font-bold">Disclaimer</h1>
            </div>
            <p className="text-muted-foreground">
              Last updated: January 2026
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <div className="space-y-8">
              <section className="p-6 rounded-xl bg-card border border-border/50">
                <h2 className="text-xl font-semibold mb-4">General Information Only</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The content provided on Apex Intel Stream is for informational and educational 
                  purposes only and should not be construed as financial, investment, legal, tax, 
                  or any other type of professional advice. All information is provided "as is" 
                  without any representations or warranties, express or implied.
                </p>
              </section>

              <section className="p-6 rounded-xl bg-card border border-border/50">
                <h2 className="text-xl font-semibold mb-4">Not Financial Advice</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nothing contained on this website constitutes a solicitation, recommendation, 
                  endorsement, or offer to buy or sell any securities, financial instruments, 
                  or other assets. The information provided should not be relied upon for making 
                  any investment decisions.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Before making any financial decisions, you should consult with qualified 
                  professionals who can provide advice tailored to your individual circumstances, 
                  needs, and risk tolerance.
                </p>
              </section>

              <section className="p-6 rounded-xl bg-card border border-border/50">
                <h2 className="text-xl font-semibold mb-4">No Guarantees</h2>
                <p className="text-muted-foreground leading-relaxed">
                  While we strive to provide accurate and up-to-date information, Apex Intel 
                  Stream makes no guarantees regarding the accuracy, completeness, timeliness, 
                  or reliability of any content. Financial markets are inherently volatile and 
                  unpredictable, and past performance is not indicative of future results.
                </p>
              </section>

              <section className="p-6 rounded-xl bg-card border border-border/50">
                <h2 className="text-xl font-semibold mb-4">Reader Responsibility</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You acknowledge and agree that you are solely responsible for any decisions 
                  you make based on information found on this website. Apex Intel Stream 
                  and its authors, contributors, and affiliates shall not be held liable for 
                  any losses, damages, or other consequences arising from your use of this 
                  information.
                </p>
              </section>

              <section className="p-6 rounded-xl bg-card border border-border/50">
                <h2 className="text-xl font-semibold mb-4">Forward-Looking Statements</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Some content may contain forward-looking statements, projections, or forecasts. 
                  These statements are based on current expectations and assumptions and are 
                  subject to risks and uncertainties that could cause actual results to differ 
                  materially. We undertake no obligation to update any forward-looking statements.
                </p>
              </section>

              <section className="p-6 rounded-xl bg-card border border-border/50">
                <h2 className="text-xl font-semibold mb-4">Third-Party Content</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This website may contain links to third-party websites or reference third-party 
                  data and research. Apex Intel Stream does not endorse and is not responsible 
                  for the content, accuracy, or opinions expressed on such third-party sites.
                </p>
              </section>

              <section className="p-6 rounded-xl bg-card border border-border/50">
                <h2 className="text-xl font-semibold mb-4">Changes to This Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify this disclaimer at any time without prior notice. 
                  Continued use of the website following any changes constitutes acceptance of 
                  those changes.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Disclaimer;
