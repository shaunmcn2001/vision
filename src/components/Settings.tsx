import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
import { Gear, Check, X, Info, GitBranch } from '@phosphor-icons/react';
import { apiClient } from '../api';
import { useKV } from '../hooks';
import { EnhancedEnvStatus } from './EnhancedEnvStatus';
import { EnvironmentConfig } from './EnvironmentConfig';

interface SettingsProps {
  onSettingsUpdate?: () => void;
}

export function Settings({ onSettingsUpdate }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEnvStatus, setShowEnvStatus] = useState(false);
  const [backendUrl, setBackendUrl] = useKV('backend-url', 
    import.meta.env.VITE_BACKEND_URL || 'https://vision-backend-0l94.onrender.com'
  );
  const [tempBackendUrl, setTempBackendUrl] = useState(backendUrl);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Check if environment variables are configured
  const hasEnvBackendUrl = !!import.meta.env.VITE_BACKEND_URL;
  const isUsingEnvDefaults = backendUrl === import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const hasChanges = tempBackendUrl !== backendUrl;
    setHasUnsavedChanges(hasChanges);
  }, [tempBackendUrl, backendUrl]);

  const handleOpen = (open: boolean) => {
    if (open) {
      setTempBackendUrl(backendUrl);
      setTestResult(null);
      setHasUnsavedChanges(false);
    }
    setIsOpen(open);
  };

  const handleSave = async () => {
    try {
      // Validate URL format
      let cleanUrl = tempBackendUrl.trim();
      
      // Remove trailing slash if present
      if (cleanUrl.endsWith('/')) {
        cleanUrl = cleanUrl.slice(0, -1);
      }
      
      // Basic URL validation
      try {
        new URL(cleanUrl);
      } catch {
        setTestResult({
          success: false,
          message: 'Invalid URL format'
        });
        return;
      }
      
      setBackendUrl(cleanUrl);
      
      // Update API client with new settings
      apiClient.updateSettings(cleanUrl);
      
      setHasUnsavedChanges(false);
      
      if (onSettingsUpdate) {
        onSettingsUpdate();
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setTestResult({
        success: false,
        message: 'Failed to save settings'
      });
    }
  };

  const handleCancel = () => {
    setTempBackendUrl(backendUrl);
    setHasUnsavedChanges(false);
    setTestResult(null);
    setIsOpen(false);
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Temporarily update API client for testing
      const originalUrl = backendUrl;
      apiClient.updateSettings(tempBackendUrl);
      
      const status = await apiClient.checkHealth();
      
      // Restore original settings
      apiClient.updateSettings(originalUrl);
      
      setTestResult({
        success: status.healthy,
        message: status.healthy ? 'Connection successful!' : status.message
      });
    } catch (error) {
      // Restore original settings
      apiClient.updateSettings(backendUrl);
      
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const resetToDefaults = () => {
    setTempBackendUrl(import.meta.env.VITE_BACKEND_URL || 'https://vision-backend-0l94.onrender.com');
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
          <SheetTitle>Backend Settings</SheetTitle>
          <SheetDescription>
            Configure your backend connection.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Environment Configuration Button */}
          <div className="flex gap-2">
            <EnvironmentConfig />
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 flex-1"
              onClick={() => setShowEnvStatus(!showEnvStatus)}
            >
              <Info className="h-4 w-4" />
              Status
            </Button>
          </div>

          {/* Environment Configuration Status */}
          <Collapsible open={showEnvStatus} onOpenChange={setShowEnvStatus}>
            <CollapsibleContent className="mt-4">
              <EnhancedEnvStatus />
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Environment Variables Status */}
          {hasEnvBackendUrl && (
            <Alert>
              <GitBranch className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Environment variable detected:</p>
                  <ul className="text-xs space-y-1 ml-4">
                    <li>• VITE_BACKEND_URL is configured</li>
                  </ul>
                  {isUsingEnvDefaults && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Currently using environment default. Override below if needed.
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
              placeholder="https://vision-backend-0l94.onrender.com"
              value={tempBackendUrl}
              onChange={(e) => setTempBackendUrl(e.target.value)}
            />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Base URL for your NDVI backend API (no API key required)</p>
              {hasEnvBackendUrl && (
                <p className="font-mono">
                  Environment default: {import.meta.env.VITE_BACKEND_URL}
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
            </div>
          </div>

          {/* Deployment Info */}
          {!hasEnvBackendUrl && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium mb-1">For GitHub Pages deployment:</p>
                <p className="text-xs">
                  Set VITE_BACKEND_URL as a repository secret 
                  instead of manually entering it here. See DEPLOYMENT.md for details.
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