import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { X } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ReportCard from '@/components/ReportCard';
import { usePublishedReports } from '@/hooks/useReports';
import { useCategories } from '@/hooks/useCategories';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const Reports = () => {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  
  const { data: reports, isLoading: reportsLoading } = usePublishedReports(100);
  const { data: categories } = useCategories();

  const activeCategory = useMemo(() => {
    if (!categorySlug || !categories) return null;
    return categories.find(c => c.slug === categorySlug);
  }, [categorySlug, categories]);

  const filteredReports = useMemo(() => {
    if (!reports) return [];
    if (!categorySlug) return reports;
    return reports.filter(report => 
      report.category.toLowerCase() === categorySlug.toLowerCase()
    );
  }, [reports, categorySlug]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {activeCategory ? activeCategory.name : 'All Reports'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {activeCategory 
                ? `Explore our latest ${activeCategory.name.toLowerCase()} analysis and insights.`
                : 'Browse our complete collection of financial analysis and market insights.'
              }
            </p>
            
            {activeCategory && (
              <Link to="/reports">
                <Button variant="outline" size="sm" className="mt-4 gap-2">
                  <X className="w-4 h-4" />
                  Clear filter
                </Button>
              </Link>
            )}
          </motion.div>

          {/* Category Pills */}
          {categories && categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap gap-2 mb-12"
            >
              <Link to="/reports">
                <Button 
                  variant={!categorySlug ? "default" : "outline"} 
                  size="sm"
                  className="rounded-full"
                >
                  All
                </Button>
              </Link>
              {categories.map((category) => (
                <Link key={category.id} to={`/reports?category=${category.slug}`}>
                  <Button 
                    variant={categorySlug === category.slug ? "default" : "outline"} 
                    size="sm"
                    className="rounded-full"
                  >
                    {category.name}
                  </Button>
                </Link>
              ))}
            </motion.div>
          )}

          {/* Reports Grid */}
          {reportsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-muted-foreground mb-4">
                {categorySlug 
                  ? `No reports found in the "${activeCategory?.name || categorySlug}" category.`
                  : 'No reports available yet.'
                }
              </p>
              {categorySlug && (
                <Link to="/reports">
                  <Button variant="outline">View all reports</Button>
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <ReportCard
                    slug={report.slug}
                    title={report.title}
                    teaser={report.excerpt || ''}
                    readTime={Math.ceil((report.word_count || 0) / 200)}
                    topic={report.category}
                    publishedAt={report.published_at || report.created_at}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Reports;
