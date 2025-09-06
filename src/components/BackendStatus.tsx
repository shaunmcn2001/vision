import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, XCircle, ArrowClockwise } from '@phosphor-icons/react';
import { apiClient } from '../api';
import { BackendStatus } from '../types';

export function BackendStatus() {
  const [status, setStatus] = useState<BackendStatus>({
    healthy: false,
    message: 'Checking...',
    lastChecked: new Date(),
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      console.log('Checking backend health...');
      const result = await apiClient.checkHealth();
      console.log('Backend status check result:', result);
      setStatus(result);
    } catch (error) {
      console.error('Backend status check failed:', error);
      setStatus({
        healthy: false,
        message: error instanceof Error ? error.message : 'Network error',
        lastChecked: new Date(),
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
    
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status.healthy ? (
              <CheckCircle className="h-4 w-4 text-primary" weight="fill" />
            ) : (
              <XCircle className="h-4 w-4 text-destructive" weight="fill" />
            )}
            <span className="text-sm font-medium">Backend</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={status.healthy ? 'default' : 'destructive'}>
              {status.healthy ? 'Online' : 'Offline'}
            </Badge>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={checkStatus}
                    disabled={isChecking}
                  >
                    <ArrowClockwise 
                      className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} 
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh connection status</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="mt-2">
          <p className="text-xs text-muted-foreground">
            {status.message}
          </p>
          <p className="text-xs text-muted-foreground">
            Last checked: {status.lastChecked.toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}