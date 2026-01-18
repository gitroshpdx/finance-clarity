import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface QualityChecks {
  wordCount: { min: number; actual: number; passed: boolean };
  headingCount: { min: number; actual: number; passed: boolean };
  dataPointCount: { min: number; actual: number; passed: boolean };
  keyInsightCount: { min: number; actual: number; passed: boolean };
  hasConclusion: boolean;
  sourcesCited: { min: number; actual: number; passed: boolean };
  overallScore: number;
}

interface QualityScoreCardProps {
  qualityChecks: QualityChecks;
}

export function QualityScoreCard({ qualityChecks }: QualityScoreCardProps) {
  const checks = [
    {
      label: 'Word Count',
      requirement: `Minimum ${qualityChecks.wordCount.min} words`,
      actual: `${qualityChecks.wordCount.actual.toLocaleString()} words`,
      passed: qualityChecks.wordCount.passed,
      points: 20,
    },
    {
      label: 'Heading Structure',
      requirement: `Minimum ${qualityChecks.headingCount.min} headings`,
      actual: `${qualityChecks.headingCount.actual} headings`,
      passed: qualityChecks.headingCount.passed,
      points: 15,
    },
    {
      label: 'Data Points',
      requirement: `Minimum ${qualityChecks.dataPointCount.min} data callouts`,
      actual: `${qualityChecks.dataPointCount.actual} data points`,
      passed: qualityChecks.dataPointCount.passed,
      points: 15,
    },
    {
      label: 'Key Insights',
      requirement: `Minimum ${qualityChecks.keyInsightCount.min} key insights`,
      actual: `${qualityChecks.keyInsightCount.actual} insights`,
      passed: qualityChecks.keyInsightCount.passed,
      points: 15,
    },
    {
      label: 'Conclusion Section',
      requirement: 'Key Takeaways section required',
      actual: qualityChecks.hasConclusion ? 'Included' : 'Missing',
      passed: qualityChecks.hasConclusion,
      points: 10,
    },
    {
      label: 'Source Citations',
      requirement: `Minimum ${qualityChecks.sourcesCited.min} sources cited`,
      actual: `${qualityChecks.sourcesCited.actual} sources`,
      passed: qualityChecks.sourcesCited.passed,
      points: 15,
    },
  ];

  const earnedPoints = checks.reduce(
    (sum, check) => sum + (check.passed ? check.points : 0),
    0
  );

  // EEAT compliance adds 10 points (calculated separately)
  const eeatPoints = qualityChecks.overallScore - earnedPoints;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Quality Score Breakdown</h3>
        <div className="text-right">
          <span className="text-2xl font-bold">{qualityChecks.overallScore}</span>
          <span className="text-muted-foreground">/100</span>
        </div>
      </div>

      <Progress value={qualityChecks.overallScore} className="h-2" />

      <div className="flex items-center gap-2 text-sm">
        {qualityChecks.overallScore >= 70 ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-primary">Quality threshold met (70+ required)</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-destructive">
              Below quality threshold ({70 - qualityChecks.overallScore} more points needed)
            </span>
          </>
        )}
      </div>

      <div className="space-y-2 mt-4">
        {checks.map((check) => (
          <div
            key={check.label}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              check.passed ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 border-muted'
            }`}
          >
            <div className="flex items-center gap-3">
              {check.passed ? (
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
              <div>
                <div className="font-medium text-sm">{check.label}</div>
                <div className="text-xs text-muted-foreground">{check.requirement}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${check.passed ? 'text-primary' : ''}`}>
                {check.actual}
              </div>
              <div className="text-xs text-muted-foreground">
                {check.passed ? `+${check.points}` : '0'} pts
              </div>
            </div>
          </div>
        ))}

        {/* EEAT bonus */}
        <div
          className={`flex items-center justify-between p-3 rounded-lg border ${
            eeatPoints > 0 ? 'bg-amber-500/5 border-amber-500/20' : 'bg-muted/50 border-muted'
          }`}
        >
          <div className="flex items-center gap-3">
            {eeatPoints > 0 ? (
              <CheckCircle2 className="h-5 w-5 text-amber-500 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
            <div>
              <div className="font-medium text-sm">EEAT Compliance</div>
              <div className="text-xs text-muted-foreground">
                Experience, Expertise, Authority, Trust
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${eeatPoints > 0 ? 'text-amber-500' : ''}`}>
              {eeatPoints > 0 ? 'Compliant' : 'Incomplete'}
            </div>
            <div className="text-xs text-muted-foreground">+{eeatPoints} pts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
