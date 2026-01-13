import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Brain, Shield } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          System configuration and information
        </p>
      </div>

      {/* AI Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Generation
          </CardTitle>
          <CardDescription>
            Information about the AI-powered report generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-primary" />
                <span className="font-medium">Model</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Google Gemini 3 Flash Preview
              </p>
              <Badge variant="secondary" className="mt-2">
                google/gemini-3-flash-preview
              </Badge>
            </div>

            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-medium">Capabilities</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Long-form content generation</li>
                <li>• Financial analysis writing</li>
                <li>• Streaming responses</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium">Powered by Lovable AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This application uses Lovable AI for report generation. The AI gateway 
              is automatically configured and managed - no API keys required.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Technical details about your setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Backend</span>
              <span className="font-medium">Lovable Cloud</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Database</span>
              <span className="font-medium">PostgreSQL</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Authentication</span>
              <span className="font-medium">Email/Password</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">AI Gateway</span>
              <Badge>Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
