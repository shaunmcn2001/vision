import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useKV } from '@github/spark/hooks';
import { apiClient } from '../api';
import { toast } from 'sonner';
import { 
  Gear, 
  CheckCircle, 
  XCircle, 
  Warning, 
  Info,
  GitBranch,
  Globe
} from '@phosphor-icons/react';

interface EnvironmentInfo {
  hasViteBackendUrl: boolean;
  currentBackendUrl: string;
  isProduction: boolean;
}

export function EnvironmentConfig() {
  const [backendUrl, setBackendUrl] = useKV('manual-backend-url', '');
  const [isOpen, setIsOpen] = useState(false);
  const [envInfo, setEnvInfo] = useState<EnvironmentInfo | null>(null);
  const [testResults, setTestResults] = useState<{
    connection: 'pending' | 'success' | 'error';
    fields: 'pending' | 'success' | 'error';
    message?: string;
  } | null>(null);

  useEffect(() => {
    // Analyze current environment configuration
    const viteBackendUrl = import.meta.env.VITE_BACKEND_URL;
    const currentUrl = viteBackendUrl || backendUrl || 'https://srv-d2tejgeuk2gs73cqecp0.onrender.com';
    
    setEnvInfo({
      hasViteBackendUrl: !!viteBackendUrl,
      currentBackendUrl: currentUrl,
      isProduction: import.meta.env.MODE === 'production'
    });
  }, [backendUrl]);

  const handleSaveConfig = () => {
    if (backendUrl) {
      apiClient.updateSettings(backendUrl);
      toast.success('Configuration saved successfully');
      setIsOpen(false);
    } else {
      toast.error('Backend URL is required');
    }
  };

  const runEnvironmentTests = async () => {
    if (!envInfo) return;

    setTestResults({
      connection: 'pending',
      fields: 'pending'
    });

    // Test 1: Connection
    try {
      const healthCheck = await apiClient.checkHealth();
      const connectionResult = healthCheck.healthy ? 'success' : 'error';
      
      setTestResults(prev => prev ? { ...prev, connection: connectionResult } : null);
      
      if (!healthCheck.healthy) {
        setTestResults(prev => prev ? { 
          ...prev, 
          fields: 'error',
          message: `Connection failed: ${healthCheck.message}`
        } : null);
        return;
      }

      // Test 2: Try to fetch fields
      try {
        const fields = await apiClient.getFields();
        setTestResults(prev => prev ? { 
          ...prev, 
          fields: fields.length > 0 ? 'success' : 'error',
          message: `Found ${fields.length} fields`
        } : null);
      } catch (error) {
        setTestResults(prev => prev ? { 
          ...prev, 
          fields: 'error',
          message: 'Failed to fetch fields data'
        } : null);
      }
    } catch (error) {
      setTestResults({
        connection: 'error',
        fields: 'error',
        message: error instanceof Error ? error.message : 'Connection failed'
      });
    }
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" weight="fill" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" weight="fill" />;
      default: return <div className="h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Gear className="h-4 w-4" />
          Environment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gear className="h-5 w-5" />
            Environment Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          {envInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Current Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">Backend URL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {envInfo.hasViteBackendUrl ? (
                      <Badge variant="default" className="text-xs">Environment</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Manual</Badge>
                    )}
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {envInfo.currentBackendUrl}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* GitHub Secrets Setup Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                GitHub Secrets Setup (Recommended)
              </CardTitle>
              <CardDescription>
                Configure your backend URL as a GitHub repository secret for automatic deployment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>For GitHub Pages deployment:</strong> Set this as a repository secret to automatically configure your app without exposing the URL in your code.
                </AlertDescription>
              </Alert>

              <div className="space-y-3 text-sm">
                <div>
                  <Label className="font-medium">1. Go to your GitHub repository</Label>
                  <p className="text-muted-foreground">Navigate to Settings → Secrets and variables → Actions</p>
                </div>
                
                <div>
                  <Label className="font-medium">2. Add repository secret</Label>
                  <div className="ml-4 space-y-2 mt-1">
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-xs">VITE_BACKEND_URL</code>
                      <span className="text-muted-foreground">→ Your backend API URL</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-medium">3. Deploy to GitHub Pages</Label>
                  <p className="text-muted-foreground">The secret will be automatically injected during the build process.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manual Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Manual Configuration</CardTitle>
              <CardDescription>
                Override environment variables for development or testing. These values are stored locally.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!envInfo?.hasViteBackendUrl && (
                <Alert>
                  <Warning className="h-4 w-4" />
                  <AlertDescription>
                    Backend URL environment variable is missing. Configure it here or set up GitHub secrets for production.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backend-url">Backend URL</Label>
                  <Input
                    id="backend-url"
                    placeholder="https://srv-d2tejgeuk2gs73cqecp0.onrender.com"
                    value={backendUrl}
                    onChange={(e) => setBackendUrl(e.target.value)}
                    disabled={envInfo?.hasViteBackendUrl}
                  />
                  {envInfo?.hasViteBackendUrl && (
                    <p className="text-xs text-muted-foreground">
                      Using environment variable. Manual override disabled.
                    </p>
                  )}
                </div>

                <Button 
                  onClick={handleSaveConfig} 
                  disabled={!backendUrl || envInfo?.hasViteBackendUrl}
                  className="w-full"
                >
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Connection Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Connection Testing</CardTitle>
              <CardDescription>
                Test your current configuration to ensure it's working properly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runEnvironmentTests} variant="outline" className="w-full">
                Run Environment Tests
              </Button>

              {testResults && (
                <div className="space-y-3">
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Backend Connection</span>
                      {getStatusIcon(testResults.connection)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Field Data Access</span>
                      {getStatusIcon(testResults.fields)}
                    </div>
                  </div>
                  
                  {testResults.message && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>{testResults.message}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}