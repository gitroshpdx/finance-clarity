import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Terms and Conditions"
        description="Read the terms and conditions for using Apex Intel Stream. By accessing our website, you agree to these terms."
        canonical="/terms"
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
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold">Terms and Conditions</h1>
            </div>
            <p className="text-muted-foreground">
              Last updated: January 2026
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Apex Intel Stream ("the Website"), you accept and agree 
                to be bound by these Terms and Conditions ("Terms"). If you do not agree to these 
                Terms, you must not use the Website. We reserve the right to modify these Terms 
                at any time, and your continued use of the Website constitutes acceptance of any 
                modifications.
              </p>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                Apex Intel Stream provides financial news, analysis, research reports, and 
                commentary on global markets, economics, and related topics. Our content is 
                intended for informational and educational purposes only and does not constitute 
                financial, investment, or professional advice.
              </p>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">3. Intellectual Property Rights</h2>
              <div className="text-muted-foreground space-y-3">
                <p className="leading-relaxed">
                  All content on the Website, including but not limited to text, graphics, logos, 
                  images, data compilations, and software, is the property of Apex Intel Stream 
                  or its content suppliers and is protected by intellectual property laws.
                </p>
                <p className="leading-relaxed">
                  You may not reproduce, distribute, modify, transmit, reuse, repost, or use the 
                  content of the Website for public or commercial purposes without prior written 
                  consent from Apex Intel Stream.
                </p>
                <p className="leading-relaxed">
                  Limited excerpts may be quoted for personal, non-commercial use with proper 
                  attribution and a link back to the original content.
                </p>
              </div>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">4. User Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                By using the Website, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Use the Website only for lawful purposes</li>
                <li>Not attempt to gain unauthorized access to any part of the Website</li>
                <li>Not interfere with or disrupt the Website or its servers</li>
                <li>Not use automated systems to access the Website without permission</li>
                <li>Provide accurate information when subscribing or creating an account</li>
                <li>Keep your account credentials confidential</li>
              </ul>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">5. Newsletter and Communications</h2>
              <p className="text-muted-foreground leading-relaxed">
                By subscribing to our newsletter, you consent to receive periodic emails containing 
                reports, updates, and promotional content. You may unsubscribe at any time by 
                clicking the unsubscribe link in any email or contacting us directly. We will 
                process unsubscribe requests promptly but please allow up to 10 business days 
                for removal from all mailing lists.
              </p>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">6. Disclaimer of Warranties</h2>
              <div className="text-muted-foreground space-y-3">
                <p className="leading-relaxed">
                  THE WEBSITE AND ITS CONTENT ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT 
                  ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT 
                  LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
                  OR NON-INFRINGEMENT.
                </p>
                <p className="leading-relaxed">
                  We do not warrant that the Website will be uninterrupted, error-free, or free 
                  of viruses or other harmful components. We do not warrant the accuracy, 
                  completeness, or usefulness of any information on the Website.
                </p>
              </div>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                TO THE FULLEST EXTENT PERMITTED BY LAW, APEX INTEL STREAM AND ITS OFFICERS, 
                DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS 
                OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATED TO YOUR 
                USE OF THE WEBSITE OR RELIANCE ON ANY INFORMATION PROVIDED THEREIN.
              </p>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">8. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless Apex Intel Stream, its affiliates, 
                officers, directors, employees, and agents from and against any claims, liabilities, 
                damages, losses, and expenses, including reasonable attorneys' fees, arising out 
                of or in any way connected with your access to or use of the Website or your 
                violation of these Terms.
              </p>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">9. Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Website may contain links to third-party websites or services that are not 
                owned or controlled by Apex Intel Stream. We have no control over, and assume 
                no responsibility for, the content, privacy policies, or practices of any 
                third-party websites or services. Your use of third-party websites is at your 
                own risk.
              </p>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">10. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to terminate or suspend your access to the Website immediately, 
                without prior notice or liability, for any reason, including but not limited to 
                breach of these Terms. Upon termination, your right to use the Website will 
                immediately cease.
              </p>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">11. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of 
                the jurisdiction in which Apex Intel Stream operates, without regard to its 
                conflict of law provisions. Any disputes arising under these Terms shall be 
                subject to the exclusive jurisdiction of the courts in that jurisdiction.
              </p>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">12. Severability</h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, that 
                provision will be limited or eliminated to the minimum extent necessary so that 
                these Terms will otherwise remain in full force and effect.
              </p>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">13. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <p className="text-foreground mt-3">
                <strong>Email:</strong> macrofinancereport@gmail.com
              </p>
            </section>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
