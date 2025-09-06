import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Warning, RefreshCw, ArrowSquareOut } from '@phosphor-icons/react';
import { useEnvConfig } from '../hooks/useEnvConfig';

/**
 * Environment Configuration Status Component
 * 
 * Displays the current status of environment variable configuration
 * with helpful guidance for setup and troubleshooting.
 */
export function EnvStatus() {
  const { getConfigurationStatus, validateEnvironment, getConfig } = useEnvConfig();
  const [status, setStatus] = useState(getConfigurationStatus());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    
    // Add a small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newStatus = getConfigurationStatus();
    setStatus(newStatus);
    setIsRefreshing(false);
  };

  useEffect(() => {
    setStatus(getConfigurationStatus());
  }, []);

  const getStatusIcon = (hasValue: boolean) => {
    if (hasValue) {
      return <CheckCircle className="h-4 w-4 text-green-500" weight="fill" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" weight="fill" />;
  };

  const getStatusBadge = (hasValue: boolean) => {
    return (
      <Badge variant={hasValue ? "default" : "destructive"} className="ml-2">
        {hasValue ? "Configured" : "Missing"}
      </Badge>
    );
  };

  const config = getConfig();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Environment Configuration</CardTitle>
            <CardDescription>
              Current status of your API configuration
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshStatus}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <Alert className={status.isValid ? "border-green-200" : "border-red-200"}>
          <div className="flex items-center gap-2">
            {status.isValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" weight="fill" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" weight="fill" />
            )}
            <AlertDescription>
              {status.isValid 
                ? "Environment configuration is valid and ready"
                : "Environment configuration has issues that need attention"
              }
            </AlertDescription>
          </div>
        </Alert>

        <Separator />

        {/* Configuration Details */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Configuration Variables</h4>
          
          {/* Backend URL */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(status.hasBackendUrl)}
              <span className="text-sm">Backend URL</span>
              {getStatusBadge(status.hasBackendUrl)}
            </div>
            {status.hasBackendUrl && (
              <span className="text-xs text-muted-foreground font-mono">
                {config.backendUrl.length > 40 
                  ? `${config.backendUrl.substring(0, 40)}...` 
                  : config.backendUrl
                }
              </span>
            )}
          </div>

          {/* API Key */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(status.hasApiKey)}
              <span className="text-sm">API Key</span>
              {getStatusBadge(status.hasApiKey)}
            </div>
            {status.hasApiKey && (
              <span className="text-xs text-muted-foreground font-mono">
                {config.apiKey.substring(0, 8)}...
              </span>
            )}
          </div>
        </div>

        {/* Errors */}
        {status.errors.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-red-600">Configuration Errors</h4>
              {status.errors.map((error, index) => (
                <Alert key={index} variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
            </div>
          </>
        )}

        {/* Warnings */}
        {status.warnings.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-yellow-600">Configuration Warnings</h4>
              {status.warnings.map((warning, index) => (
                <Alert key={index} className="border-yellow-200">
                  <Warning className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>{warning}</AlertDescription>
                </Alert>
              ))}
            </div>
          </>
        )}

        {/* Setup Instructions */}
        {!status.isValid && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Setup Instructions</h4>
              <div className="text-sm space-y-2 text-muted-foreground">
                <p>To configure your environment variables for GitHub Pages deployment:</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Go to your GitHub repository settings</li>
                  <li>Navigate to "Secrets and variables" → "Actions"</li>
                  <li>Add the following repository secrets:</li>
                </ol>
                <div className="bg-muted p-3 rounded-lg font-mono text-xs space-y-1">
                  <div><strong>VITE_BACKEND_URL</strong>: Your API backend URL</div>
                  <div><strong>VITE_API_KEY</strong>: Your API authentication key</div>
                </div>
                <p>These secrets will be automatically injected as environment variables during the GitHub Actions build process.</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions', '_blank')}
                  className="mt-2"
                >
                  <ArrowSquareOut className="h-4 w-4 mr-2" />
                  GitHub Secrets Documentation
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Environment Info */}
        <Separator />
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Environment Info</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Mode:</span>
              <Badge variant="outline" className="ml-2 text-xs">
                {config.mode}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Production:</span>
              <Badge variant={config.isProd ? "default" : "secondary"} className="ml-2 text-xs">
                {config.isProd ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}