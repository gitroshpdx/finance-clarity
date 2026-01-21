import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Sparkles, Save, Wand2 } from 'lucide-react';

export default function AIGenerateReport() {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('');
  const [sources, setSources] = useState('');
  const [wordCount, setWordCount] = useState('1500');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedBody, setGeneratedBody] = useState('');
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [generatedExcerpt, setGeneratedExcerpt] = useState('');
  
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: categories } = useCategories();

  const handleGenerate = async () => {
    if (!topic || !category) {
      toast({
        title: 'Missing fields',
        description: 'Please provide a topic and category.',
        variant: 'destructive',
      });
      return;
    }

    setGenerating(true);
    setGeneratedBody('');

    try {
      // Get user's session token for authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        throw new Error('You must be logged in to generate reports');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-report`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            topic,
            category,
            sources: sources.split('\n').filter(Boolean),
            wordCount: parseInt(wordCount),
            additionalInstructions,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate report');
      }

      // Stream the response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let fullContent = '';

      if (!reader) throw new Error('No response body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullContent += content;
              setGeneratedBody(fullContent);
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Parse the generated content
      parseGeneratedContent(fullContent);
      setHasGenerated(true);

      toast({
        title: 'Report generated!',
        description: 'Review the content and make any edits before saving.',
      });
    } catch (error: any) {
      console.error('Error generating report:', error);
      toast({
        title: 'Generation failed',
        description: error.message || 'Failed to generate report',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const parseGeneratedContent = (content: string) => {
    // Try to extract title from first line or heading
    const lines = content.split('\n');
    let title = topic;
    let body = content;
    let excerpt = '';
    const tags: string[] = [];

    // Look for a title pattern (# Title or **Title**)
    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.slice(2).trim();
        body = content.replace(line, '').trim();
        break;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        title = line.slice(2, -2).trim();
        body = content.replace(line, '').trim();
        break;
      }
    }

    // Generate excerpt from first paragraph
    const firstParagraph = body.split('\n\n').find(p => p.trim() && !p.startsWith('#'));
    if (firstParagraph) {
      excerpt = firstParagraph.slice(0, 250).trim() + '...';
    }

    // Extract potential tags based on category and topic
    const commonTags = ['Analysis', 'Report', category];
    const topicWords = topic.split(' ').filter(w => w.length > 4);
    tags.push(...commonTags, ...topicWords.slice(0, 3));

    setGeneratedTitle(title);
    setGeneratedBody(body);
    setGeneratedExcerpt(excerpt);
    setGeneratedTags([...new Set(tags)]);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!generatedTitle || !generatedBody) {
      toast({
        title: 'Missing content',
        description: 'Please generate a report first.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      const slug = generateSlug(generatedTitle);
      const actualWordCount = countWords(generatedBody);

      const { error } = await supabase
        .from('reports')
        .insert({
          title: generatedTitle,
          slug,
          category,
          tags: generatedTags,
          excerpt: generatedExcerpt,
          body: generatedBody,
          status,
          word_count: actualWordCount,
          author_id: user?.id,
          published_at: status === 'published' ? new Date().toISOString() : null,
        });

      if (error) throw error;

      toast({
        title: status === 'published' ? 'Report published!' : 'Report saved as draft',
        description: status === 'published' 
          ? 'Your AI-generated report is now live.' 
          : 'You can continue editing or publish later.',
      });

      navigate('/admin/reports');
    } catch (error: any) {
      console.error('Error saving report:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save report',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Generate Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Let AI create a comprehensive financial report
          </p>
        </div>
      </div>

      {/* Generation Form */}
      {!hasGenerated && (
        <Card>
          <CardHeader>
            <CardTitle>Report Parameters</CardTitle>
            <CardDescription>
              Provide details about the report you want to generate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic *</label>
              <Input
                placeholder="e.g., Impact of Fed rate cuts on equity markets in Q1 2025"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category *</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Word Count</label>
                <Select value={wordCount} onValueChange={setWordCount}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="800">~800 words (Short)</SelectItem>
                    <SelectItem value="1500">~1,500 words (Standard)</SelectItem>
                    <SelectItem value="2500">~2,500 words (Long)</SelectItem>
                    <SelectItem value="4000">~4,000 words (Comprehensive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reference Sources (optional)</label>
              <Textarea
                placeholder="Add URLs or source descriptions, one per line:&#10;https://www.federalreserve.gov/...&#10;Recent BLS employment report&#10;Q4 earnings from major banks"
                value={sources}
                onChange={(e) => setSources(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                AI will use these as context for generating the report
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Instructions (optional)</label>
              <Textarea
                placeholder="e.g., Focus on institutional investors, include comparison with 2008 financial crisis, maintain bullish undertone..."
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating || !topic || !category}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Generated Content */}
      {(generating || hasGenerated) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              {generating ? 'Generating your report...' : 'Review and edit before saving'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasGenerated && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={generatedTitle}
                    onChange={(e) => setGeneratedTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {generatedTags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Excerpt</label>
                  <Textarea
                    value={generatedExcerpt}
                    onChange={(e) => setGeneratedExcerpt(e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Body</label>
              <Textarea
                value={generatedBody}
                onChange={(e) => setGeneratedBody(e.target.value)}
                rows={20}
                className="font-mono text-sm"
                placeholder={generating ? 'Content will appear here as it generates...' : ''}
              />
              <p className="text-sm text-muted-foreground">
                Word count: {countWords(generatedBody).toLocaleString()}
              </p>
            </div>

            {hasGenerated && (
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setHasGenerated(false);
                    setGeneratedBody('');
                    setGeneratedTitle('');
                    setGeneratedTags([]);
                    setGeneratedExcerpt('');
                  }}
                >
                  Start Over
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleSave('draft')}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleSave('published')}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Publish
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
