import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Send,
  Save,
  Edit,
  Clock,
  FileText,
  Shield,
  Award,
  ExternalLink,
} from 'lucide-react';
import { QualityScoreCard } from './QualityScoreCard';

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
  wordCount: number;
  sourceUrls: string[];
  qualityChecks: QualityChecks;
  eeatSignals: EEATSignals;
}

interface ArticlePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewData: PreviewData | null;
  onPublish: () => void;
  onSaveDraft: () => void;
  onRegenerate: () => void;
  isPublishing: boolean;
  isSaving: boolean;
}

export function ArticlePreviewModal({
  open,
  onOpenChange,
  previewData,
  onPublish,
  onSaveDraft,
  onRegenerate,
  isPublishing,
  isSaving,
}: ArticlePreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'quality' | 'sources'>('preview');

  if (!previewData) return null;

  const { qualityChecks, eeatSignals } = previewData;
  const canPublish = qualityChecks.overallScore >= 70;

  // Calculate reading time
  const readingTime = Math.ceil(previewData.wordCount / 200);

  // Render markdown-like content (simplified)
  const renderBody = (body: string) => {
    const lines = body.split('\n');
    return lines.map((line, i) => {
      // Headers
      if (line.startsWith('## ')) {
        return (
          <h2 key={i} className="text-xl font-bold mt-6 mb-3 text-foreground">
            {line.replace('## ', '')}
          </h2>
        );
      }
      // KEY callouts
      if (line.startsWith('> KEY:')) {
        return (
          <div
            key={i}
            className="my-4 p-4 rounded-lg border-l-4 border-primary bg-primary/5"
          >
            <span className="font-semibold text-primary">💡 Key Insight:</span>
            <span className="ml-2">{line.replace('> KEY:', '').trim()}</span>
          </div>
        );
      }
      // DATA callouts
      if (line.startsWith('> DATA:')) {
        return (
          <div
            key={i}
            className="my-4 p-4 rounded-lg border-l-4 border-amber-500 bg-amber-500/5"
          >
            <span className="font-semibold text-amber-500">📊 Data Point:</span>
            <span className="ml-2">{line.replace('> DATA:', '').trim()}</span>
          </div>
        );
      }
      // Regular paragraphs
      if (line.trim()) {
        return (
          <p key={i} className="my-2 leading-relaxed text-muted-foreground">
            {line}
          </p>
        );
      }
      return <br key={i} />;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{previewData.title}</DialogTitle>
              <DialogDescription className="mt-2">
                {previewData.excerpt}
              </DialogDescription>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge>{previewData.category}</Badge>
                {previewData.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right space-y-1">
              <div
                className={`text-3xl font-bold ${
                  canPublish ? 'text-primary' : 'text-destructive'
                }`}
              >
                {qualityChecks.overallScore}
              </div>
              <div className="text-xs text-muted-foreground">Quality Score</div>
              {canPublish ? (
                <Badge className="bg-primary/10 text-primary">Ready to Publish</Badge>
              ) : (
                <Badge variant="destructive">Below Threshold</Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 border-b">
          {[
            { id: 'preview', label: 'Preview', icon: FileText },
            { id: 'quality', label: 'Quality & EEAT', icon: Shield },
            { id: 'sources', label: 'Sources', icon: ExternalLink },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          {activeTab === 'preview' && (
            <div className="pr-4 py-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {previewData.wordCount.toLocaleString()} words
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readingTime} min read
                </span>
              </div>
              <article className="prose prose-sm max-w-none dark:prose-invert">
                {renderBody(previewData.body)}
              </article>
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="pr-4 py-4 space-y-6">
              <QualityScoreCard qualityChecks={qualityChecks} />

              <Separator />

              {/* EEAT Compliance */}
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-amber-500" />
                  Google EEAT Compliance
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      label: 'Sources Cited',
                      value: `${eeatSignals.sources_cited} sources`,
                      passed: eeatSignals.sources_cited >= 2,
                    },
                    {
                      label: 'Data Verification Date',
                      value: eeatSignals.data_verification_date || 'Not set',
                      passed: !!eeatSignals.data_verification_date,
                    },
                    {
                      label: 'Author Expertise Stated',
                      value: eeatSignals.author_expertise_stated ? 'Yes' : 'No',
                      passed: eeatSignals.author_expertise_stated,
                    },
                    {
                      label: 'Forward-Looking Disclaimer',
                      value: eeatSignals.forward_looking_disclaimer ? 'Included' : 'Missing',
                      passed: eeatSignals.forward_looking_disclaimer,
                    },
                    {
                      label: 'Methodology Section',
                      value: eeatSignals.methodology_included ? 'Included' : 'Missing',
                      passed: eeatSignals.methodology_included,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        item.passed ? 'bg-primary/5 border-primary/20' : 'bg-muted border-muted'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.value}</div>
                      </div>
                      {item.passed ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="pr-4 py-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Content was generated from these source URLs. These URLs are tracked to
                prevent duplicate content in future articles.
              </p>
              <div className="space-y-2">
                {previewData.sourceUrls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm truncate">{url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        <Separator />

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" onClick={onRegenerate} disabled={isPublishing || isSaving}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onSaveDraft}
              disabled={isPublishing || isSaving}
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save as Draft
            </Button>

            <Button
              onClick={onPublish}
              disabled={!canPublish || isPublishing || isSaving}
              className="min-w-32"
            >
              {isPublishing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Publish Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
