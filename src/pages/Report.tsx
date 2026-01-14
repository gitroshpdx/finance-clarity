import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/report/ScrollProgress';
import ReportHero from '@/components/report/ReportHero';
import ArticleContent from '@/components/report/ArticleContent';
import TableOfContents from '@/components/report/TableOfContents';
import ShareActions from '@/components/report/ShareActions';
import RelatedReports from '@/components/report/RelatedReports';
import SEO from '@/components/SEO';
import { useReportBySlug } from '@/hooks/useReports';

const Report = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: report, isLoading, error } = useReportBySlug(slug);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SEO 
          title="Report Not Found"
          description="The report you're looking for doesn't exist."
          noindex={true}
        />
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Report Not Found</h1>
          <p className="text-muted-foreground mb-8">The report you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": report.title,
    "description": report.excerpt || `Read our analysis on ${report.title}`,
    "image": report.featured_image_url || "https://macrofinancereport.com/og-image.png",
    "datePublished": report.published_at,
    "dateModified": report.updated_at,
    "author": {
      "@type": "Person",
      "name": report.author_name || "Editorial Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Macro Finance Report",
      "url": "https://macrofinancereport.com"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://macrofinancereport.com/report/${report.slug}`
    },
    "articleSection": report.category,
    "keywords": report.tags?.join(', ') || ''
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO 
        title={report.title}
        description={report.excerpt || `Read our in-depth analysis on ${report.title}`}
        canonical={`/report/${report.slug}`}
        image={report.featured_image_url}
        type="article"
        publishedTime={report.published_at || undefined}
        modifiedTime={report.updated_at}
        author={report.author_name || "Editorial Team"}
        section={report.category}
        tags={report.tags || undefined}
        structuredData={structuredData}
      />
      <ScrollProgress />
      <Navigation />
      
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate('/')}
        className="fixed top-24 left-6 z-30 hidden xl:flex items-center gap-2 px-4 py-2 rounded-full glass-card text-muted-foreground hover:text-foreground transition-colors border border-primary/10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </motion.button>

      {/* Hero */}
      <ReportHero report={report} />

      {/* Main Content Area */}
      <div className="relative pb-32 lg:pb-20">
        {/* Table of Contents */}
        <TableOfContents body={report.body} />
        
        {/* Article Content */}
        <ArticleContent body={report.body} />
        
        {/* Share Actions */}
        <ShareActions title={report.title} />
      </div>

      {/* Related Reports */}
      <RelatedReports 
        category={report.category} 
        currentReportId={report.id} 
      />

      <Footer />
    </div>
  );
};

export default Report;
