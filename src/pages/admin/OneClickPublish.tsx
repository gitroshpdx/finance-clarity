import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logAutoPublishUsage } from '@/hooks/useAutoPublishUsage';
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
  Eye,
} from 'lucide-react';
import { ArticlePreviewModal } from '@/components/admin/ArticlePreviewModal';

interface PublishedArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  wordCount: number;
}

interface QualityChecks {
  wordCount: { min: number; actual: number; passed: boolean };
  headingCount: { min: number; actual: number; passed: boolean };
  dataPointCount: { min: number; actual: number; passed: boolean };
  keyInsightCount: { min: number; actual: number; passed: boolean };
  hasConclusion: boolean;
  sourcesCited: { min: number; actual: number; passed: boolean };
  overallScore: number;
}

interface EEATSignals {
  sources_cited: number;
  data_verification_date: string;
  author_expertise_stated: boolean;
  forward_looking_disclaimer: boolean;
  methodology_included: boolean;
}

interface PreviewData {
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  category: string;
  slug: string;
  wordCount: number;
  sourceUrls: string[];
  qualityChecks: QualityChecks;
  eeatSignals: EEATSignals;
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
  const { user } = useAuth();
  const [generatingCategory, setGeneratingCategory] = useState<string | null>(null);
  const [publishedArticles, setPublishedArticles] = useState<PublishedArticle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async (category: string) => {
    setGeneratingCategory(category);
    setError(null);

    toast.info(`Generating ${category} article...`, {
      description: 'Scraping unique content and creating EEAT-compliant article',
      duration: 60000,
    });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('You must be logged in');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/one-click-publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ category, preview: true }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate article');
      }

      setPreviewData(data.data);
      setIsPreviewOpen(true);
      toast.success('Article generated!', {
        description: `Quality Score: ${data.data.qualityChecks.overallScore}/100`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      toast.error('Failed to generate', { description: message });
    } finally {
      setGeneratingCategory(null);
    }
  };

  const handlePublish = async () => {
    if (!previewData) return;
    setIsPublishing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('You must be logged in');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/one-click-publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            publishData: {
              title: previewData.title,
              slug: previewData.slug,
              excerpt: previewData.excerpt,
              body: previewData.body,
              tags: previewData.tags,
              category: previewData.category,
              status: 'published',
              wordCount: previewData.wordCount,
              sourceUrls: previewData.sourceUrls,
              qualityScore: previewData.qualityChecks.overallScore,
              eeatSignals: previewData.eeatSignals,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to publish article');
      }

      if (user) await logAutoPublishUsage(user.id, 'one_click_publish', data.article.id);
      setPublishedArticles((prev) => [data.article, ...prev]);
      setIsPreviewOpen(false);
      setPreviewData(null);
      toast.success(`Published: ${data.article.title}`, {
        description: `${data.article.wordCount} words • ${previewData.category}`,
        action: {
          label: 'View',
          onClick: () => window.open(`/report/${data.article.slug}`, '_blank'),
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error('Failed to publish', { description: message });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!previewData) return;
    setIsSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('You must be logged in');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/one-click-publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            publishData: {
              title: previewData.title,
              slug: previewData.slug,
              excerpt: previewData.excerpt,
              body: previewData.body,
              tags: previewData.tags,
              category: previewData.category,
              status: 'draft',
              wordCount: previewData.wordCount,
              sourceUrls: previewData.sourceUrls,
              qualityScore: previewData.qualityChecks.overallScore,
              eeatSignals: previewData.eeatSignals,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save draft');
      }

      setIsPreviewOpen(false);
      setPreviewData(null);
      toast.success('Saved as draft', {
        description: 'You can edit and publish it later from Reports.',
        action: {
          label: 'Edit',
          onClick: () => window.open(`/admin/reports/${data.article.id}/edit`, '_blank'),
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error('Failed to save draft', { description: message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = () => {
    if (!previewData) return;
    setIsPreviewOpen(false);
    setPreviewData(null);
    handleGenerate(previewData.category);
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
            Generate EEAT-compliant articles with quality validation and preview before publishing.
          </p>
        </div>
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
          const isGenerating = generatingCategory === category.name;
          const isDisabled = generatingCategory !== null;

          return (
            <Card
              key={category.name}
              className={`cursor-pointer transition-all duration-200 ${
                isDisabled && !isGenerating ? 'opacity-50' : ''
              } ${category.bgColor} border-2 border-transparent hover:border-primary/20`}
              onClick={() => !isDisabled && handleGenerate(category.name)}
            >
              <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
                {isGenerating ? (
                  <Loader2 className={`h-12 w-12 animate-spin ${category.color}`} />
                ) : (
                  <Icon className={`h-12 w-12 ${category.color}`} />
                )}
                <span className="font-semibold text-lg">{category.name}</span>
                {isGenerating ? (
                  <Badge variant="secondary" className="animate-pulse">
                    Generating...
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <Eye className="h-3 w-3" />
                    Preview First
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
          <h3 className="font-semibold mb-2">Quality Controls & EEAT Compliance</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>Click any category to generate an article</li>
            <li>AI searches for fresh, unique content (excludes sources used in last 7 days)</li>
            <li>Generates EEAT-compliant article with source citations & disclaimers</li>
            <li>Preview shows quality score (minimum 70/100 to publish)</li>
            <li>Review content, then Publish or Save as Draft</li>
          </ol>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Minimum 1500 words</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Duplicate source detection</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>EEAT compliance signals</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Quality score validation</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Source attribution</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Forward-looking disclaimers</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <ArticlePreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        previewData={previewData}
        onPublish={handlePublish}
        onSaveDraft={handleSaveDraft}
        onRegenerate={handleRegenerate}
        isPublishing={isPublishing}
        isSaving={isSaving}
      />
    </div>
  );
}
