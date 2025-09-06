import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  Warning,
  ArrowSquareOut,
  GitBranch,
  Key,
  Globe
} from '@phosphor-icons/react';

/**
 * GitHub Repository Secrets Status Component
 * 
 * Displays information about repository secrets configuration
 * and provides guidance for GitHub Pages deployment setup.
 */
export function GitHubSecretsStatus() {
  const [showSecretsGuide, setShowSecretsGuide] = useState(false);

  // Check if we're likely running in GitHub Actions/Pages
  const isGitHubPages = window.location.hostname.endsWith('.github.io');
  const hasEnvBackendUrl = !!import.meta.env.VITE_BACKEND_URL;
  const hasEnvApiKey = !!import.meta.env.VITE_API_KEY;
  
  // Analyze environment configuration
  const getConfigurationStatus = () => {
    if (hasEnvBackendUrl && hasEnvApiKey) {
      return {
        status: 'success' as const,
        message: 'Repository secrets are properly configured',
        details: 'Both VITE_BACKEND_URL and VITE_API_KEY are available'
      };
    } else if (hasEnvBackendUrl || hasEnvApiKey) {
      return {
        status: 'warning' as const,
        message: 'Partial repository secrets configuration',
        details: 'Some environment variables are missing'
      };
    } else {
      return {
        status: 'error' as const,
        message: 'Repository secrets not configured',
        details: 'No environment variables detected from repository secrets'
      };
    }
  };

  const configStatus = getConfigurationStatus();

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" weight="fill" />;
      case 'warning':
        return <Warning className="h-4 w-4 text-yellow-500" weight="fill" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" weight="fill" />;
    }
  };

  const getStatusColor = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  const openRepositorySettings = () => {
    // Try to determine the repository URL from the current GitHub Pages URL
    if (isGitHubPages) {
      const pathParts = window.location.hostname.split('.');
      const username = pathParts[0];
      const repoName = window.location.pathname.split('/')[1] || 'repository';
      const repoUrl = `https://github.com/${username}/${repoName}/settings/secrets/actions`;
      window.open(repoUrl, '_blank');
    } else {
      // Generic GitHub secrets documentation
      window.open('https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions', '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          <div>
            <CardTitle className="text-lg">GitHub Repository Secrets</CardTitle>
            <CardDescription>
              Configuration status for GitHub Pages deployment
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <Alert className={getStatusColor(configStatus.status)}>
          <div className="flex items-center gap-2">
            {getStatusIcon(configStatus.status)}
            <div>
              <AlertDescription className="font-medium">
                {configStatus.message}
              </AlertDescription>
              <p className="text-xs text-muted-foreground mt-1">
                {configStatus.details}
              </p>
            </div>
          </div>
        </Alert>

        <Separator />

        {/* Environment Variables Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Environment Variables</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span className="text-sm">VITE_BACKEND_URL</span>
              </div>
              <Badge variant={hasEnvBackendUrl ? "default" : "destructive"}>
                {hasEnvBackendUrl ? "Configured" : "Missing"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span className="text-sm">VITE_API_KEY</span>
              </div>
              <Badge variant={hasEnvApiKey ? "default" : "secondary"}>
                {hasEnvApiKey ? "Configured" : "Optional"}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Deployment Context */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Deployment Context</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Platform:</span>
              <Badge variant={isGitHubPages ? "default" : "outline"}>
                {isGitHubPages ? "GitHub Pages" : "Other"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Environment:</span>
              <Badge variant={import.meta.env.PROD ? "default" : "secondary"}>
                {import.meta.env.MODE}
              </Badge>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        {configStatus.status !== 'success' && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Setup Instructions</h4>
              <div className="text-sm space-y-2 text-muted-foreground">
                <p>To configure repository secrets for GitHub Pages:</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Go to your GitHub repository</li>
                  <li>Click Settings → Secrets and variables → Actions</li>
                  <li>Click "New repository secret"</li>
                  <li>Add <code className="bg-muted px-1 rounded">VITE_BACKEND_URL</code> with your API URL</li>
                  <li>Add <code className="bg-muted px-1 rounded">VITE_API_KEY</code> with your API key (optional)</li>
                  <li>Push to main branch to trigger deployment</li>
                </ol>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button 
            onClick={openRepositorySettings}
            variant="outline"
            className="w-full"
          >
            <ArrowSquareOut className="h-4 w-4 mr-2" />
            {isGitHubPages ? "Open Repository Secrets" : "GitHub Secrets Guide"}
          </Button>
          
          {isGitHubPages && (
            <Button 
              onClick={() => window.open('https://github.com/settings/applications', '_blank')}
              variant="outline"
              size="sm"
            >
              <Globe className="h-4 w-4 mr-2" />
              View GitHub Actions Logs
            </Button>
          )}
        </div>

        {/* Security Note */}
        <Alert>
          <Key className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium mb-1">Security Note</p>
            <p className="text-xs">
              Repository secrets are securely injected during the build process and 
              are not exposed in your source code or build logs.
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}