import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import LatestReports from '@/components/LatestReports';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Apex Intel Stream",
    "url": "https://apex-intel-stream.lovable.app",
    "description": "Cutting-edge financial intelligence and macro analysis for informed decision-making.",
    "publisher": {
      "@type": "Organization",
      "name": "Apex Intel Stream",
      "url": "https://apex-intel-stream.lovable.app"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://apex-intel-stream.lovable.app/reports?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Financial Intelligence & Macro Analysis"
        description="Cutting-edge financial intelligence and macro analysis. Stay ahead with expert insights on global markets, economic trends, and investment strategies."
        canonical="/"
        structuredData={structuredData}
      />
      <Navigation />
      <main>
        <Hero />
        <LatestReports />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
