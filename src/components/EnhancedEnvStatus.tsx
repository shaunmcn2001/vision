import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  CheckCircle, 
  XCircle, 
  Warning, 
  RefreshCw, 
  ArrowSquareOut, 
  ChevronDown,
  Copy,
  Eye,
  EyeSlash,
  Info
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { EnvSetupHelper, useEnvValidation } from '../utils/env-setup';
import { GitHubSecretsStatus } from './GitHubSecretsStatus';

/**
 * Enhanced Environment Status Component
 * 
 * Comprehensive environment variable validation and troubleshooting
 * with specific guidance for GitHub Pages deployment.
 */
export function EnhancedEnvStatus() {
  const { validation, isLoading, refresh } = useEnvValidation();
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

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

  const config = EnvSetupHelper.getConfigSummary();
  const setupInstructions = EnvSetupHelper.getSetupInstructions();
  const troubleshootingTips = EnvSetupHelper.getTroubleshootingTips();

  if (!validation) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Loading environment status...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Environment Configuration</CardTitle>
              <CardDescription>
                Current status and validation of your API configuration
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Overall Status */}
          <Alert className={getStatusColor(validation.status)}>
            <div className="flex items-center gap-2">
              {getStatusIcon(validation.status)}
              <AlertDescription>
                {validation.status === 'success' && 'Environment configuration is valid and ready'}
                {validation.status === 'warning' && 'Environment configuration has warnings'}
                {validation.status === 'error' && 'Environment configuration has critical issues'}
              </AlertDescription>
            </div>
          </Alert>

          <Separator />

          {/* Configuration Summary */}
          <Collapsible open={showConfig} onOpenChange={setShowConfig}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Configuration Details
                <ChevronDown className={`h-4 w-4 transition-transform ${showConfig ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-3">
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Environment:</span>
                  <Badge variant={config.isProd ? "default" : "secondary"}>
                    {config.mode} {config.isProd ? '(Production)' : '(Development)'}
                  </Badge>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">Backend URL:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(config.backendUrl, 'Backend URL')}
                      className="h-6 px-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="font-mono text-xs bg-muted rounded p-2 break-all">
                    {config.backendUrl}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">API Key:</span>
                    <div className="flex items-center gap-1">
                      {config.hasApiKey && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="h-6 px-2"
                        >
                          {showApiKey ? <EyeSlash className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      )}
                      {config.hasApiKey && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(import.meta.env.VITE_API_KEY || '', 'API Key')}
                          className="h-6 px-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="font-mono text-xs bg-muted rounded p-2">
                    {config.hasApiKey ? (
                      showApiKey ? import.meta.env.VITE_API_KEY : config.apiKeyPreview
                    ) : 'Not configured'}
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Errors */}
          {validation.errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-red-600">Critical Issues</h4>
              {validation.errors.map((error, index) => (
                <Alert key={index} variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Warnings */}
          {validation.warnings.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-yellow-600">Warnings</h4>
              {validation.warnings.map((warning, index) => (
                <Alert key={index} className="border-yellow-200">
                  <Warning className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>{warning}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {validation.suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-blue-600">Recommendations</h4>
              {validation.suggestions.map((suggestion, index) => (
                <Alert key={index} className="border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription>{suggestion}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          <Separator />

          {/* Setup Instructions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Setup Instructions</h4>
            <div className="text-sm space-y-2">
              <p className="text-muted-foreground mb-2">
                {config.isProd 
                  ? 'For GitHub Pages deployment:'
                  : 'For local development:'
                }
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-4 text-muted-foreground">
                {setupInstructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Troubleshooting */}
          <Collapsible open={showTroubleshooting} onOpenChange={setShowTroubleshooting}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Troubleshooting Guide
                <ChevronDown className={`h-4 w-4 transition-transform ${showTroubleshooting ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="space-y-4">
                {troubleshootingTips.map((section, index) => (
                  <div key={index}>
                    <h5 className="text-sm font-medium mb-2">{section.title}</h5>
                    <ul className="text-xs space-y-1 ml-4 text-muted-foreground">
                      {section.tips.map((tip, tipIndex) => (
                        <li key={tipIndex}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions', '_blank')}
            >
              <ArrowSquareOut className="h-4 w-4 mr-2" />
              GitHub Secrets Guide
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://vitejs.dev/guide/env-and-mode.html', '_blank')}
            >
              <ArrowSquareOut className="h-4 w-4 mr-2" />
              Vite Environment Variables
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* GitHub Repository Secrets Status */}
      <GitHubSecretsStatus />
    </div>
  );
}