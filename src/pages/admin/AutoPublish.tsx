import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  Zap, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Globe,
  TrendingUp,
  Calendar,
  X,
  Plus,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { logAutoPublishUsage } from '@/hooks/useAutoPublishUsage';

interface MarketContext {
  indices: string;
  commodities: string;
  forex: string;
  rates: string;
}

interface GeneratedArticle {
  title: string;
  subtitle: string;
  slug: string;
  date: string;
  category: string;
  region_tags: string[];
  summary_3_points: string[];
  article_body: string;
  sources: string[];
  seo_keywords: string[];
  estimated_read_time_minutes: number;
}

interface AutoPublishResult {
  success: boolean;
  article: GeneratedArticle;
  published: boolean;
  report_id: string | null;
  report_slug: string;
}

const REGION_OPTIONS = [
  'USA', 'Europe', 'China', 'India', 'Japan', 'UK', 
  'Middle East', 'Latin America', 'Africa', 'Asia Pacific', 'Global'
];

export default function AutoPublish() {
  const { user } = useAuth();
  const [rawNewsData, setRawNewsData] = useState('');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [regionTags, setRegionTags] = useState<string[]>(['Global']);
  const [newRegion, setNewRegion] = useState('');
  const [marketContext, setMarketContext] = useState<MarketContext>({
    indices: '',
    commodities: '',
    forex: '',
    rates: '',
  });
  const [autoPublish, setAutoPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AutoPublishResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addRegion = (region: string) => {
    if (region && !regionTags.includes(region)) {
      setRegionTags([...regionTags, region]);
    }
    setNewRegion('');
  };

  const removeRegion = (region: string) => {
    setRegionTags(regionTags.filter(r => r !== region));
  };

  const handleGenerate = async () => {
    if (!rawNewsData.trim()) {
      toast.error('Please provide raw news data');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('You must be logged in');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auto-publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            raw_news_data: rawNewsData,
            publish_date: publishDate,
            region_tags: regionTags,
            market_context: marketContext,
            auto_publish: autoPublish,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate article');
      }

      const data: AutoPublishResult = await response.json();
      setResult(data);

      if (data.published) {
        if (user) await logAutoPublishUsage(user.id, 'auto_publish', data.report_id);
        toast.success('Article generated and published successfully!');
      } else {
        toast.success('Article generated successfully! Review below.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishPreview = async () => {
    if (!result?.article) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('You must be logged in');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auto-publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            raw_news_data: rawNewsData,
            publish_date: publishDate,
            region_tags: regionTags,
            market_context: marketContext,
            auto_publish: true,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to publish article');
      }

      const data: AutoPublishResult = await response.json();
      setResult(data);
      if (user) await logAutoPublishUsage(user.id, 'auto_publish', data.report_id);
      toast.success('Article published successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Zap className="h-8 w-8 text-primary" />
          Auto-Publish Pipeline
        </h1>
        <p className="text-muted-foreground mt-1">
          Transform raw news data into premium financial articles automatically.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Raw News Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Raw News Data
              </CardTitle>
              <CardDescription>
                Paste scraped news, RSS content, or API data from sources like Reuters, Bloomberg, etc.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your raw news data here...

Example:
WASHINGTON (Reuters) - The Federal Reserve held interest rates steady on Wednesday as expected, but signaled it may begin cutting rates as early as September if inflation continues to cool...

Fed Chair Jerome Powell said at the post-meeting press conference that 'we're getting closer' to the point where rate cuts would be appropriate..."
                value={rawNewsData}
                onChange={(e) => setRawNewsData(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Date & Regions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Publish Date
                  </Label>
                  <Input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Region Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {regionTags.map((region) => (
                    <Badge key={region} variant="secondary" className="gap-1">
                      {region}
                      <button
                        onClick={() => removeRegion(region)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <select
                    value={newRegion}
                    onChange={(e) => {
                      if (e.target.value) addRegion(e.target.value);
                    }}
                    className="flex-1 px-3 py-2 bg-background border rounded-md text-sm"
                  >
                    <option value="">Add region...</option>
                    {REGION_OPTIONS.filter(r => !regionTags.includes(r)).map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Context */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Market Context (Optional)
              </CardTitle>
              <CardDescription>
                Add current market data for richer context in the generated article.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Indices</Label>
                  <Input
                    placeholder="S&P 500 +0.8%, NASDAQ +1.2%"
                    value={marketContext.indices}
                    onChange={(e) => setMarketContext({ ...marketContext, indices: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Commodities</Label>
                  <Input
                    placeholder="Oil $78.50, Gold $2,045"
                    value={marketContext.commodities}
                    onChange={(e) => setMarketContext({ ...marketContext, commodities: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Forex</Label>
                  <Input
                    placeholder="EUR/USD 1.0892, USD/JPY 150.25"
                    value={marketContext.forex}
                    onChange={(e) => setMarketContext({ ...marketContext, forex: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rates</Label>
                  <Input
                    placeholder="10Y Treasury 4.12%"
                    value={marketContext.rates}
                    onChange={(e) => setMarketContext({ ...marketContext, rates: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleGenerate}
              disabled={loading || !rawNewsData.trim()}
              className="flex-1"
              size="lg"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Zap className="h-5 w-5 mr-2" />
              )}
              {autoPublish ? 'Generate & Publish' : 'Generate Preview'}
            </Button>
            <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="checkbox"
                checked={autoPublish}
                onChange={(e) => setAutoPublish(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Auto-publish</span>
            </label>
          </div>
        </div>

        {/* Result Section */}
        <div className="space-y-6">
          {error && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  Error
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{error}</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              {/* Status */}
              <Card className={result.published ? 'border-primary' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {result.published ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                    {result.published ? 'Published!' : 'Preview Generated'}
                  </CardTitle>
                  {result.published && result.report_slug && (
                    <CardDescription>
                      <Link
                        to={`/report/${result.report_slug}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        View live article <ExternalLink className="h-3 w-3" />
                      </Link>
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>

              {/* Article Preview */}
              <Card>
                <CardHeader>
                  <div className="space-y-2">
                    <Badge>{result.article.category}</Badge>
                    <CardTitle className="text-xl">{result.article.title}</CardTitle>
                    <CardDescription>{result.article.subtitle}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>📅 {result.article.date}</span>
                    <span>•</span>
                    <span>⏱️ {result.article.estimated_read_time_minutes} min read</span>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Key Takeaways</h4>
                    <ul className="space-y-1">
                      {result.article.summary_3_points.map((point, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Regions</h4>
                    <div className="flex flex-wrap gap-1">
                      {result.article.region_tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">SEO Keywords</h4>
                    <div className="flex flex-wrap gap-1">
                      {result.article.seo_keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Sources</h4>
                    <p className="text-sm text-muted-foreground">
                      {result.article.sources.join(', ')}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Article Body Preview</h4>
                    <div className="max-h-[400px] overflow-y-auto bg-muted/50 rounded-lg p-4">
                      <pre className="text-xs whitespace-pre-wrap font-mono">
                        {result.article.article_body}
                      </pre>
                    </div>
                  </div>

                  {!result.published && (
                    <Button
                      onClick={handlePublishPreview}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                      )}
                      Publish This Article
                    </Button>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {!result && !error && !loading && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg">No Preview Yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Paste raw news data and click Generate to see the transformed article.
                </p>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <h3 className="font-semibold text-lg">Generating Article...</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  AI is analyzing and transforming your news data.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
