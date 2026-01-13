import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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
import { ArrowLeft, Loader2, Save, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  'Markets',
  'Economy',
  'Technology',
  'Central Banks',
  'Commodities',
  'Geopolitics',
  'Real Estate',
  'Crypto',
];

const COMMON_TAGS = [
  'Federal Reserve',
  'Inflation',
  'Interest Rates',
  'GDP',
  'Employment',
  'Equities',
  'Bonds',
  'Currency',
  'Oil',
  'Gold',
  'AI',
  'Bitcoin',
];

export default function CreateReport() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleAddTag = (tag: string) => {
    const normalizedTag = tag.trim();
    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags([...tags, normalizedTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || !body) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in the title, category, and body.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      const slug = generateSlug(title);
      const wordCount = countWords(body);

      const { data, error } = await supabase
        .from('reports')
        .insert({
          title,
          slug,
          category,
          tags,
          featured_image_url: featuredImageUrl || null,
          excerpt: excerpt || null,
          body,
          status,
          word_count: wordCount,
          author_id: user?.id,
          published_at: status === 'published' ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: status === 'published' ? 'Report published!' : 'Report saved as draft',
        description: status === 'published' 
          ? 'Your report is now live on the website.' 
          : 'You can continue editing or publish later.',
      });

      navigate('/admin/reports');
    } catch (error: any) {
      console.error('Error creating report:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create report',
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
          <Link to="/admin/reports">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Report</h1>
          <p className="text-muted-foreground mt-1">
            Write a new financial report
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Category */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Title and categorization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                placeholder="e.g., Q4 2024 Market Outlook: Navigating Rate Cuts"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg"
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
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={(v) => setStatus(v as 'draft' | 'published')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Add relevant tags for discoverability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(tagInput);
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={() => handleAddTag(tagInput)}>
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground mr-2">Quick add:</span>
              {COMMON_TAGS.filter(t => !tags.includes(t)).slice(0, 6).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => handleAddTag(tag)}
                >
                  + {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Featured Image */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
            <CardDescription>URL for the report's header image</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="https://images.unsplash.com/..."
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
            />
            {featuredImageUrl && (
              <div className="mt-4 rounded-lg overflow-hidden border">
                <img
                  src={featuredImageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Excerpt */}
        <Card>
          <CardHeader>
            <CardTitle>Excerpt</CardTitle>
            <CardDescription>Short summary shown in report cards</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="A brief summary of the report..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {excerpt.length}/300 characters
            </p>
          </CardContent>
        </Card>

        {/* Body */}
        <Card>
          <CardHeader>
            <CardTitle>Report Body *</CardTitle>
            <CardDescription>
              The main content of your report. Use markdown for formatting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write your report content here...

# Section Title

Your analysis goes here. You can use **bold**, *italic*, and other markdown formatting.

## Sub-section

More content..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={20}
              className="font-mono text-sm"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Word count: {countWords(body).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <Button type="button" variant="outline" asChild>
            <Link to="/admin/reports">Cancel</Link>
          </Button>

          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {status === 'published' ? 'Publish' : 'Save Draft'}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
