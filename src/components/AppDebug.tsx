import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Bug, CaretDown, CaretRight, Copy, Trash } from '@phosphor-icons/react';
import { Field, MapState } from '../types';
import { useKV } from '../hooks/useKV';
import { ConnectionTest } from './ConnectionTest';

interface AppDebugProps {
  selectedField: Field | null;
  mapState: MapState;
  isVisible: boolean;
  onToggle: () => void;
}

export function AppDebug({ selectedField, mapState, isVisible, onToggle }: AppDebugProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    connectionTest: true,
    environment: false,
    mapState: false,
    selectedField: false,
    storage: false,
  });

  const [debugLogs, setDebugLogs] = useKV('debug-logs', [] as any[]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyToClipboard = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const clearLogs = () => {
    setDebugLogs([]);
  };

  const addLog = (message: string, data?: any) => {
    const newLog = {
      timestamp: new Date().toISOString(),
      message,
      data,
    };
    setDebugLogs(current => [...current, newLog].slice(-100)); // Keep last 100 logs
  };

  // Environment info
  const envInfo = {
    NODE_ENV: import.meta.env.NODE_ENV,
    VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggle}
          variant="outline"
          size="sm"
          className="shadow-lg"
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-[80vh] z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Debug Panel
          </CardTitle>
          <Button onClick={onToggle} variant="ghost" size="sm">
            <CaretDown className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <ScrollArea className="h-64">
          {/* Connection Test */}
          <Collapsible 
            open={expandedSections.connectionTest} 
            onOpenChange={() => toggleSection('connectionTest')}
          >
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium w-full hover:bg-muted rounded p-2">
              {expandedSections.connectionTest ? (
                <CaretDown className="h-3 w-3" />
              ) : (
                <CaretRight className="h-3 w-3" />
              )}
              Backend Connection Test
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-2 pt-2">
              <ConnectionTest />
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Environment Variables */}
          <Collapsible 
            open={expandedSections.environment} 
            onOpenChange={() => toggleSection('environment')}
          >
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium w-full hover:bg-muted rounded p-2">
              {expandedSections.environment ? (
                <CaretDown className="h-3 w-3" />
              ) : (
                <CaretRight className="h-3 w-3" />
              )}
              Environment
              <Badge variant="secondary" className="ml-auto text-xs">
                {Object.keys(envInfo).length}
              </Badge>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-5 pt-2 space-y-2">
              {Object.entries(envInfo).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="font-mono text-muted-foreground">{key}:</span>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      {value || 'undefined'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard({ [key]: value })}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Map State */}
          <Collapsible 
            open={expandedSections.mapState} 
            onOpenChange={() => toggleSection('mapState')}
          >
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium w-full hover:bg-muted rounded p-2">
              {expandedSections.mapState ? (
                <CaretDown className="h-3 w-3" />
              ) : (
                <CaretRight className="h-3 w-3" />
              )}
              Map State
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(mapState)}
                className="ml-auto h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-5 pt-2 space-y-2">
              <div className="text-xs font-mono bg-muted rounded p-2">
                <pre>{JSON.stringify(mapState, null, 2)}</pre>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Selected Field */}
          <Collapsible 
            open={expandedSections.selectedField} 
            onOpenChange={() => toggleSection('selectedField')}
          >
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium w-full hover:bg-muted rounded p-2">
              {expandedSections.selectedField ? (
                <CaretDown className="h-3 w-3" />
              ) : (
                <CaretRight className="h-3 w-3" />
              )}
              Selected Field
              <Badge variant={selectedField ? 'default' : 'secondary'} className="ml-auto text-xs">
                {selectedField ? 'Active' : 'None'}
              </Badge>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-5 pt-2 space-y-2">
              {selectedField ? (
                <div className="text-xs font-mono bg-muted rounded p-2">
                  <pre>{JSON.stringify(selectedField, null, 2)}</pre>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No field selected</p>
              )}
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Storage Keys */}
          <Collapsible 
            open={expandedSections.storage} 
            onOpenChange={() => toggleSection('storage')}
          >
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium w-full hover:bg-muted rounded p-2">
              {expandedSections.storage ? (
                <CaretDown className="h-3 w-3" />
              ) : (
                <CaretRight className="h-3 w-3" />
              )}
              Local Storage
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-5 pt-2 space-y-2">
              <div className="text-xs space-y-1">
                <p className="text-muted-foreground">Persistent Keys:</p>
                <div className="font-mono bg-muted rounded p-2">
                  <div>• backend-url</div>
                  <div>• api-key</div>
                  <div>• selected-field-id</div>
                  <div>• map-center</div>
                  <div>• map-zoom</div>
                  <div>• selected-year</div>
                  <div>• selected-month</div>
                  <div>• debug-logs</div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </ScrollArea>

        <Separator />

        {/* Debug Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addLog('Manual log entry', { mapState, selectedField })}
            className="flex-1"
          >
            Log State
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearLogs}
            className="flex-1"
          >
            <Trash className="h-3 w-3 mr-1" />
            Clear Logs
          </Button>
        </div>

        {/* Log Count */}
        <div className="flex justify-center">
          <Badge variant="secondary" className="text-xs">
            {debugLogs.length} debug entries
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}