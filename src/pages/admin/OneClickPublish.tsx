import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Zap,
  TrendingUp,
  Building2,
  Coins,
  Landmark,
  Bitcoin,
  Globe,
  Cpu,
  Home,
  Loader2,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface PublishedArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  wordCount: number;
}

const categories = [
  { name: 'Markets', icon: TrendingUp, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/20' },
  { name: 'Economy', icon: Building2, color: 'text-blue-500', bgColor: 'bg-blue-500/10 hover:bg-blue-500/20' },
  { name: 'Commodities', icon: Coins, color: 'text-amber-500', bgColor: 'bg-amber-500/10 hover:bg-amber-500/20' },
  { name: 'Central Banks', icon: Landmark, color: 'text-purple-500', bgColor: 'bg-purple-500/10 hover:bg-purple-500/20' },
  { name: 'Crypto', icon: Bitcoin, color: 'text-orange-500', bgColor: 'bg-orange-500/10 hover:bg-orange-500/20' },
  { name: 'Geopolitics', icon: Globe, color: 'text-red-500', bgColor: 'bg-red-500/10 hover:bg-red-500/20' },
  { name: 'Technology', icon: Cpu, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10 hover:bg-cyan-500/20' },
  { name: 'Real Estate', icon: Home, color: 'text-pink-500', bgColor: 'bg-pink-500/10 hover:bg-pink-500/20' },
];

export default function OneClickPublish() {
  const [publishingCategory, setPublishingCategory] = useState<string | null>(null);
  const [publishedArticles, setPublishedArticles] = useState<PublishedArticle[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async (category: string) => {
    setPublishingCategory(category);
    setError(null);

    toast.info(`Generating ${category} article...`, {
      description: 'Scraping news and creating premium content',
      duration: 30000,
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/one-click-publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ category }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to publish article');
      }

      setPublishedArticles((prev) => [data.article, ...prev]);
      toast.success(`Published: ${data.article.title}`, {
        description: `${data.article.wordCount} words • ${category}`,
        action: {
          label: 'View',
          onClick: () => window.open(`/report/${data.article.slug}`, '_blank'),
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      toast.error('Failed to publish', { description: message });
    } finally {
      setPublishingCategory(null);
    }
  };

  const handlePublishAll = async () => {
    for (const category of categories) {
      if (publishingCategory) break;
      await handlePublish(category.name);
      // Small delay between publications to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Zap className="h-8 w-8 text-amber-500" />
            One-Click Publish
          </h1>
          <p className="text-muted-foreground mt-1">
            Click a category to automatically scrape news and publish a premium article.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handlePublishAll}
          disabled={publishingCategory !== null}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${publishingCategory ? 'animate-spin' : ''}`} />
          Publish All
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <span className="text-destructive">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Category Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isPublishing = publishingCategory === category.name;
          const isDisabled = publishingCategory !== null;

          return (
            <Card
              key={category.name}
              className={`cursor-pointer transition-all duration-200 ${
                isDisabled && !isPublishing ? 'opacity-50' : ''
              } ${category.bgColor} border-2 border-transparent hover:border-primary/20`}
              onClick={() => !isDisabled && handlePublish(category.name)}
            >
              <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
                {isPublishing ? (
                  <Loader2 className={`h-12 w-12 animate-spin ${category.color}`} />
                ) : (
                  <Icon className={`h-12 w-12 ${category.color}`} />
                )}
                <span className="font-semibold text-lg">{category.name}</span>
                {isPublishing && (
                  <Badge variant="secondary" className="animate-pulse">
                    Generating...
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Published Articles */}
      {publishedArticles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Recently Published
            </CardTitle>
            <CardDescription>
              Articles generated and published in this session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {publishedArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{article.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Badge variant="outline">{article.category}</Badge>
                    <span>{article.wordCount} words</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link to={`/admin/reports/${article.id}/edit`}>Edit</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={`/report/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-muted/30">
        <CardContent className="py-6">
          <h3 className="font-semibold mb-2">How it works</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>Click any category button above</li>
            <li>AI searches for the latest news from Reuters, Bloomberg, etc.</li>
            <li>Scrapes and combines content from top 3 articles</li>
            <li>Generates a premium 1500-2500 word analysis</li>
            <li>Publishes directly to your site (no approval needed)</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            Each article takes approximately 30-60 seconds to generate.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
