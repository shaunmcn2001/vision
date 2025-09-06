import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Gear, Check, X, Eye, EyeSlash, Info, GitBranch } from '@phosphor-icons/react';
import { apiClient } from '../api';
import { useKV } from '@github/spark/hooks';

interface SettingsProps {
  onSettingsUpdate?: () => void;
}

export function Settings({ onSettingsUpdate }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [backendUrl, setBackendUrl] = useKV('backend-url', import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000');
  const [apiKey, setApiKey] = useKV('api-key', import.meta.env.VITE_API_KEY || '');
  const [tempBackendUrl, setTempBackendUrl] = useState(backendUrl);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Check if environment variables are configured
  const hasEnvBackendUrl = !!import.meta.env.VITE_BACKEND_URL;
  const hasEnvApiKey = !!import.meta.env.VITE_API_KEY;
  const isUsingEnvDefaults = backendUrl === import.meta.env.VITE_BACKEND_URL && apiKey === import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const hasChanges = tempBackendUrl !== backendUrl || tempApiKey !== apiKey;
    setHasUnsavedChanges(hasChanges);
  }, [tempBackendUrl, tempApiKey, backendUrl, apiKey]);

  const handleOpen = (open: boolean) => {
    if (open) {
      setTempBackendUrl(backendUrl);
      setTempApiKey(apiKey);
      setTestResult(null);
      setHasUnsavedChanges(false);
    }
    setIsOpen(open);
  };

  const handleSave = async () => {
    setBackendUrl(tempBackendUrl);
    setApiKey(tempApiKey);
    
    // Update API client with new settings
    apiClient.updateSettings(tempBackendUrl, tempApiKey);
    
    setHasUnsavedChanges(false);
    
    if (onSettingsUpdate) {
      onSettingsUpdate();
    }
    
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempBackendUrl(backendUrl);
    setTempApiKey(apiKey);
    setHasUnsavedChanges(false);
    setTestResult(null);
    setIsOpen(false);
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Temporarily update API client for testing
      const originalSettings = { url: backendUrl, key: apiKey };
      apiClient.updateSettings(tempBackendUrl, tempApiKey);
      
      const status = await apiClient.checkHealth();
      
      // Restore original settings
      apiClient.updateSettings(originalSettings.url, originalSettings.key);
      
      setTestResult({
        success: status.healthy,
        message: status.healthy ? 'Connection successful!' : status.message
      });
    } catch (error) {
      // Restore original settings
      apiClient.updateSettings(backendUrl, apiKey);
      
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const resetToDefaults = () => {
    setTempBackendUrl(import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000');
    setTempApiKey(import.meta.env.VITE_API_KEY || '');
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Gear className="h-4 w-4 mr-2" />
          Settings
          {hasUnsavedChanges && (
            <Badge variant="secondary" className="ml-auto">
              •
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>API Settings</SheetTitle>
          <SheetDescription>
            Configure your backend connection and API credentials.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Environment Variables Status */}
          {(hasEnvBackendUrl || hasEnvApiKey) && (
            <Alert>
              <GitBranch className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Environment variables detected:</p>
                  <ul className="text-xs space-y-1 ml-4">
                    {hasEnvBackendUrl && <li>• VITE_BACKEND_URL is configured</li>}
                    {hasEnvApiKey && <li>• VITE_API_KEY is configured</li>}
                  </ul>
                  {isUsingEnvDefaults && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Currently using environment defaults. Override below if needed.
                    </p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Backend URL */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="backend-url">Backend URL</Label>
              {hasEnvBackendUrl && (
                <Badge variant="secondary" className="text-xs">
                  ENV
                </Badge>
              )}
            </div>
            <Input
              id="backend-url"
              placeholder="http://localhost:8000"
              value={tempBackendUrl}
              onChange={(e) => setTempBackendUrl(e.target.value)}
            />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Base URL for your NDVI backend API</p>
              {hasEnvBackendUrl && (
                <p className="font-mono">
                  Environment default: {import.meta.env.VITE_BACKEND_URL}
                </p>
              )}
            </div>
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="api-key">API Key</Label>
              {hasEnvApiKey && (
                <Badge variant="secondary" className="text-xs">
                  ENV
                </Badge>
              )}
            </div>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? 'text' : 'password'}
                placeholder="Enter your API key"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeSlash className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Optional API key for authentication</p>
              {hasEnvApiKey && (
                <p className="font-mono">
                  Environment default: {import.meta.env.VITE_API_KEY ? '••••••••••••' : '(empty)'}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Test Connection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Connection Test</span>
              <Button
                onClick={testConnection}
                disabled={isTesting || !tempBackendUrl}
                size="sm"
                variant="outline"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>

            {testResult && (
              <Alert variant={testResult.success ? 'default' : 'destructive'}>
                <div className="flex items-center gap-2">
                  {testResult.success ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                  <AlertDescription>{testResult.message}</AlertDescription>
                </div>
              </Alert>
            )}
          </div>

          <Separator />

          {/* Current Settings Display */}
          <div className="space-y-3">
            <span className="text-sm font-medium">Current Configuration</span>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-muted-foreground">Backend URL:</span>
                  {backendUrl === import.meta.env.VITE_BACKEND_URL && hasEnvBackendUrl && (
                    <Badge variant="outline" className="text-xs">FROM ENV</Badge>
                  )}
                </div>
                <p className="font-mono bg-muted rounded p-2 break-all">
                  {backendUrl || 'Not set'}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-muted-foreground">API Key:</span>
                  {apiKey === import.meta.env.VITE_API_KEY && hasEnvApiKey && (
                    <Badge variant="outline" className="text-xs">FROM ENV</Badge>
                  )}
                </div>
                <p className="font-mono bg-muted rounded p-2">
                  {apiKey ? '••••••••••••' : 'Not set'}
                </p>
              </div>
            </div>
          </div>

          {/* Deployment Info */}
          {!hasEnvBackendUrl && !hasEnvApiKey && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium mb-1">For GitHub Pages deployment:</p>
                <p className="text-xs">
                  Set VITE_BACKEND_URL and VITE_API_KEY as repository secrets 
                  instead of manually entering them here. See DEPLOYMENT.md for details.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Reset Option */}
          <div className="pt-4">
            <Button
              onClick={resetToDefaults}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Reset to Environment Defaults
            </Button>
          </div>
        </div>

        <SheetFooter className="gap-2">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="flex-1"
          >
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}