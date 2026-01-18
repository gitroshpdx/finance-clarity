import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  PenLine, 
  Sparkles,
  ArrowRight,
  Loader2,
  Wand2,
  Zap
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface DashboardStats {
  totalReports: number;
  publishedReports: number;
  draftReports: number;
  recentReports: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    created_at: string;
    category: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    publishedReports: 0,
    draftReports: 0,
    recentReports: [],
  });
  const [loading, setLoading] = useState(true);
  const [transforming, setTransforming] = useState(false);

  const handleTransformArticles = async () => {
    setTransforming(true);
    toast.info('Transforming articles to premium format...', { duration: 10000 });
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transform-articles`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({}),
        }
      );
      
      if (!response.ok) {
        throw new Error('Transform failed');
      }
      
      const data = await response.json();
      toast.success(`Transformed ${data.results?.filter((r: any) => r.status === 'success').length || 0} articles successfully!`);
    } catch (error) {
      console.error('Transform error:', error);
      toast.error('Failed to transform articles. Check console for details.');
    } finally {
      setTransforming(false);
    }
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch all reports
        const { data: reports, error } = await supabase
          .from('reports')
          .select('id, title, slug, status, created_at, category')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        const allReports = reports || [];
        const published = allReports.filter(r => r.status === 'published');
        const drafts = allReports.filter(r => r.status === 'draft');

        // Get total counts
        const { count: totalCount } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true });

        const { count: publishedCount } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');

        setStats({
          totalReports: totalCount || 0,
          publishedReports: publishedCount || 0,
          draftReports: (totalCount || 0) - (publishedCount || 0),
          recentReports: allReports,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to the MacroFinance Report admin panel.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time reports created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.publishedReports}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Live on the website
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.draftReports}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting publication
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-dashed hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenLine className="h-5 w-5 text-primary" />
              Create Report
            </CardTitle>
            <CardDescription>
              Write a new financial report manually with full editorial control.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/admin/reports/new">
                Start Writing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-dashed hover:border-primary/50 transition-colors bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Generate
            </CardTitle>
            <CardDescription>
              Let AI create a comprehensive report based on your topic and sources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button asChild variant="secondary">
                <Link to="/admin/reports/ai">
                  Generate with AI <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleTransformArticles}
                disabled={transforming}
              >
                {transforming ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Transform All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed hover:border-primary/50 transition-colors bg-gradient-to-br from-amber-500/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Auto-Publish
            </CardTitle>
            <CardDescription>
              Transform raw news data into premium articles automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to="/admin/auto-publish">
                Open Pipeline <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Your latest created reports</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/reports">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {stats.recentReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No reports yet. Create your first report!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/admin/reports/${report.id}/edit`}
                      className="font-medium hover:text-primary transition-colors truncate block"
                    >
                      {report.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span>{report.category}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <Badge variant={report.status === 'published' ? 'default' : 'secondary'}>
                    {report.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
