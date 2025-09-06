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
import { Gear, Check, X, Eye, EyeSlash } from '@phosphor-icons/react';
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
          {/* Backend URL */}
          <div className="space-y-2">
            <Label htmlFor="backend-url">Backend URL</Label>
            <Input
              id="backend-url"
              placeholder="http://localhost:8000"
              value={tempBackendUrl}
              onChange={(e) => setTempBackendUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Base URL for your NDVI backend API
            </p>
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
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
            <p className="text-xs text-muted-foreground">
              Optional API key for authentication
            </p>
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
            <span className="text-sm font-medium">Current Settings</span>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-muted-foreground">Backend URL:</span>
                <p className="font-mono bg-muted rounded p-2 mt-1 break-all">
                  {backendUrl || 'Not set'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">API Key:</span>
                <p className="font-mono bg-muted rounded p-2 mt-1">
                  {apiKey ? '••••••••••••' : 'Not set'}
                </p>
              </div>
            </div>
          </div>

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