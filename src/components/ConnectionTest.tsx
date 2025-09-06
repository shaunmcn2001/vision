import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, Play } from '@phosphor-icons/react';
import { apiClient } from '../api';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

export function ConnectionTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    const tests: TestResult[] = [
      { name: 'Backend Health Check', status: 'pending', message: 'Testing...' },
      { name: 'Fields API', status: 'pending', message: 'Testing...' },
      { name: 'Environment Config', status: 'pending', message: 'Testing...' }
    ];

    setResults([...tests]);

    // Test 1: Health Check
    try {
      const healthResult = await apiClient.checkHealth();
      tests[0] = {
        name: 'Backend Health Check',
        status: healthResult.healthy ? 'success' : 'error',
        message: healthResult.message,
        details: healthResult
      };
      setResults([...tests]);
    } catch (error) {
      tests[0] = {
        name: 'Backend Health Check',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
      setResults([...tests]);
    }

    // Test 2: Fields API
    try {
      const fields = await apiClient.getFields();
      tests[1] = {
        name: 'Fields API',
        status: 'success',
        message: `Successfully loaded ${fields.length} fields`,
        details: fields.slice(0, 3) // First 3 fields for preview
      };
      setResults([...tests]);
    } catch (error) {
      tests[1] = {
        name: 'Fields API',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
      setResults([...tests]);
    }

    // Test 3: Environment Config
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://vision-backend-0l94.onrender.com';
    tests[2] = {
      name: 'Environment Config',
      status: 'success',
      message: `Using backend URL: ${backendUrl}`,
      details: {
        VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
        fallback: 'https://vision-backend-0l94.onrender.com',
        actual: backendUrl
      }
    };
    setResults([...tests]);

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" weight="fill" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" weight="fill" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" weight="fill" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Testing...</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Backend Connection Test</span>
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Testing...' : 'Run Tests'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.length === 0 && (
          <Alert>
            <AlertDescription>
              Click "Run Tests" to verify the backend connection is working properly.
            </AlertDescription>
          </Alert>
        )}

        {results.map((result, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(result.status)}
                <span className="font-medium">{result.name}</span>
              </div>
              {getStatusBadge(result.status)}
            </div>
            
            <p className="text-sm text-muted-foreground">{result.message}</p>
            
            {result.details && (
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  View Details
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}

        {results.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Summary:</span>
              <span className="text-green-600">
                {results.filter(r => r.status === 'success').length} passed
              </span>
              <span className="text-red-600">
                {results.filter(r => r.status === 'error').length} failed
              </span>
              <span className="text-yellow-600">
                {results.filter(r => r.status === 'pending').length} pending
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}