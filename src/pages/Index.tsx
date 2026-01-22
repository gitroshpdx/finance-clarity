import { Suspense, lazy } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import SEO from '@/components/SEO';

// Lazy load below-fold components for better initial load
const LatestReports = lazy(() => import('@/components/LatestReports'));
const Newsletter = lazy(() => import('@/components/Newsletter'));
const Footer = lazy(() => import('@/components/Footer'));

// Simple loading skeleton
const SectionSkeleton = () => (
  <div className="py-16 animate-pulse">
    <div className="container px-6">
      <div className="h-8 bg-muted rounded w-48 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-muted rounded-2xl" />
        ))}
      </div>
    </div>
  </div>
);

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Macro Finance Report",
    "url": "https://macrofinancereport.com",
    "description": "Premium financial intelligence distilled into elegant 5-minute briefings. Global markets, macroeconomics, and geopolitics decoded daily.",
    "publisher": {
      "@type": "Organization",
      "name": "Macro Finance Report",
      "url": "https://macrofinancereport.com"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://macrofinancereport.com/reports?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Financial Intelligence & Macro Analysis"
        description="Premium financial intelligence distilled into elegant 5-minute briefings. Global markets, macroeconomics, and geopolitics decoded daily for the ambitious."
        canonical="/"
        structuredData={structuredData}
      />
      <Navigation />
      <main>
        <Hero />
        <Suspense fallback={<SectionSkeleton />}>
          <LatestReports />
        </Suspense>
        <Suspense fallback={<div className="py-16" />}>
          <Newsletter />
        </Suspense>
      </main>
      <Suspense fallback={<div className="h-32" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
