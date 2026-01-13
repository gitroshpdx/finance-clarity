import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
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
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
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
              <h2 className="text-xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Macro Finance Report ("we," "us," or "our"), we are committed to protecting 
                your privacy and ensuring the security of your personal information. This Privacy 
                Policy explains how we collect, use, disclose, and safeguard your information 
                when you visit our website or subscribe to our services.
              </p>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Personal Information</h3>
                  <p className="leading-relaxed">
                    When you subscribe to our newsletter or create an account, we may collect:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Email address</li>
                    <li>Name (if provided)</li>
                    <li>Company or organization (if provided)</li>
                    <li>Professional title (if provided)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Automatically Collected Information</h3>
                  <p className="leading-relaxed">
                    When you visit our website, we automatically collect certain information, including:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>IP address and approximate location</li>
                    <li>Browser type and version</li>
                    <li>Device type and operating system</li>
                    <li>Pages visited and time spent on each page</li>
                    <li>Referring website or source</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>To deliver our reports and newsletter content</li>
                <li>To personalize your experience on our website</li>
                <li>To improve our website and services</li>
                <li>To communicate with you about updates or changes</li>
                <li>To analyze usage patterns and optimize performance</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use cookies and similar tracking technologies to enhance your browsing experience. 
                These include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                You can control cookie preferences through your browser settings. Note that 
                disabling certain cookies may affect website functionality.
              </p>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">Data Sharing and Third Parties</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We do not sell your personal information. We may share data with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Service Providers:</strong> Third parties that help us operate our website and deliver services (e.g., email delivery, analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or 
                destruction. However, no method of transmission over the internet is 100% secure, 
                and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the 
                purposes outlined in this policy, unless a longer retention period is required 
                by law. When you unsubscribe from our newsletter, we will remove your email 
                from our active mailing list but may retain certain records for legal compliance.
              </p>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">Your Rights (GDPR)</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you are located in the European Economic Area, you have certain rights 
                regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
                <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Right to Object:</strong> Object to certain processing activities</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                To exercise these rights, please contact us using the information below.
              </p>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any 
                significant changes by posting a notice on our website or sending you an email. 
                We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us at:
              </p>
              <p className="text-foreground mt-3">
                <strong>Email:</strong> privacy@macrofinancereport.com
              </p>
            </section>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
