import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Mail, Search, Download, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function Subscribers() {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { data: subscribers, isLoading, refetch } = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredSubscribers = subscribers?.filter(sub =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const activeCount = subscribers?.filter(s => s.is_active).length || 0;
  const inactiveCount = subscribers?.filter(s => !s.is_active).length || 0;

  const handleExportCSV = () => {
    if (!subscribers || subscribers.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no subscribers to export.',
        variant: 'destructive',
      });
      return;
    }

    const csvContent = [
      ['Email', 'Subscribed At', 'Active'].join(','),
      ...subscribers.map(sub => [
        sub.email,
        sub.subscribed_at ? format(new Date(sub.subscribed_at), 'yyyy-MM-dd HH:mm') : '',
        sub.is_active ? 'Yes' : 'No',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Export complete',
      description: `Exported ${subscribers.length} subscribers.`,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Newsletter Subscribers
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage newsletter subscriptions
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Subscribers</CardDescription>
            <CardTitle className="text-3xl">{subscribers?.length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-green-600">{activeCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inactive</CardDescription>
            <CardTitle className="text-3xl text-muted-foreground">{inactiveCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search & Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Subscribers</CardTitle>
              <CardDescription>
                {filteredSubscribers.length} subscriber{filteredSubscribers.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <Button onClick={handleExportCSV} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No subscribers match your search.' : 'No subscribers yet.'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscribed At</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {subscriber.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {subscriber.subscribed_at
                          ? format(new Date(subscriber.subscribed_at), 'MMM d, yyyy h:mm a')
                          : '—'}
                      </TableCell>
                      <TableCell>
                        {subscriber.is_active ? (
                          <Badge variant="default" className="gap-1 bg-green-600">
                            <Check className="h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <X className="h-3 w-3" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
