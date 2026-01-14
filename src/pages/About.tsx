import { motion } from 'framer-motion';
import { Target, Shield, Globe, TrendingUp, Users, Award } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Clarity',
      description: 'We transform complex global economic data into clear, digestible insights that empower decision-making.',
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'Our analysis is independent, unbiased, and grounded in rigorous research methodologies.',
    },
    {
      icon: Globe,
      title: 'Global Perspective',
      description: 'We monitor markets, policies, and trends across every major economy to provide comprehensive coverage.',
    },
  ];

  const stats = [
    { value: '50,000+', label: 'Global Readers' },
    { value: '500+', label: 'Reports Published' },
    { value: '45+', label: 'Countries Reached' },
    { value: '98%', label: 'Reader Satisfaction' },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Apex Intel Stream",
    "url": "https://apex-intel-stream.lovable.app",
    "description": "Cutting-edge financial intelligence and macro analysis for informed decision-making.",
    "sameAs": [],
    "foundingDate": "2024",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": "10-50"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="About Us"
        description="Learn about Apex Intel Stream - delivering cutting-edge financial intelligence and macro analysis to decision-makers worldwide."
        canonical="/about"
        structuredData={structuredData}
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Complexity Made{' '}
              <span className="text-primary">Breathtakingly Clear</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Apex Intel Stream delivers premium financial intelligence to decision-makers worldwide. 
              We bridge the gap between complex economic data and actionable insights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-card/50">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In an era of information overload, quality analysis has never been more valuable. 
                We exist to cut through the noise and deliver the insights that matter most to 
                investors, executives, and policymakers.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our team of analysts and economists works tirelessly to monitor global markets, 
                central bank policies, geopolitical developments, and emerging trends that shape 
                the financial landscape.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every report we publish is crafted with precision, backed by data, and designed 
                to give you the competitive edge in understanding macro-level forces.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-2xl bg-background border border-border/50 text-center"
                >
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from research to publication.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 px-6 bg-card/50">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive coverage across all aspects of global finance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, title: 'Market Analysis', desc: 'In-depth coverage of equity, bond, and commodity markets.' },
              { icon: Globe, title: 'Global Economics', desc: 'Macroeconomic trends and forecasts for major economies.' },
              { icon: Shield, title: 'Policy Insights', desc: 'Central bank decisions and fiscal policy analysis.' },
              { icon: Users, title: 'Sector Deep-Dives', desc: 'Industry-specific research and trend analysis.' },
              { icon: Award, title: 'Expert Commentary', desc: 'Perspectives from seasoned financial analysts.' },
              { icon: Target, title: 'Actionable Ideas', desc: 'Clear takeaways to inform your decision-making.' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex items-start gap-4 p-6 rounded-xl bg-background border border-border/50"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
