import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAutoPublishUsage } from '@/hooks/useAutoPublishUsage';
import { IndianRupee, Zap, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function OutstandingBalanceCard() {
  const { totalPosts, costPerPost, outstandingAmount, usageRecords, loading } = useAutoPublishUsage();

  if (loading) {
    return (
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <IndianRupee className="h-5 w-5" />
          Outstanding Balance
        </CardTitle>
        <CardDescription>
          Auto-publish &amp; one-click usage charges
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalPosts}</div>
            <div className="text-xs text-muted-foreground">Total Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">₹{costPerPost}</div>
            <div className="text-xs text-muted-foreground">Per Post</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">₹{outstandingAmount}</div>
            <div className="text-xs text-muted-foreground">Outstanding</div>
          </div>
        </div>

        {/* Recent charges */}
        {usageRecords.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent Charges</h4>
            {usageRecords.slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-amber-500" />
                  <Badge variant="outline" className="text-xs">
                    {record.feature_used === 'one_click_publish' ? 'One-Click' : 'Auto-Publish'}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(record.created_at), { addSuffix: true })}
                  </span>
                </div>
                <span className="font-medium">₹{Number(record.cost_amount)}</span>
              </div>
            ))}
          </div>
        )}

        {totalPosts === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            No usage recorded yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
