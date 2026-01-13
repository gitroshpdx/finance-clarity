export interface DatabaseReport {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  category: string;
  tags: string[] | null;
  status: string;
  word_count: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_name: string | null;
  author_role: string | null;
  featured_image_url: string | null;
  author_id: string | null;
}

export function calculateReadTime(wordCount: number | null): string {
  if (!wordCount || wordCount === 0) return '1 min read';
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
}

export function formatPublishedDate(dateString: string | null): string {
  if (!dateString) return 'Not published';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
