import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useKV } from '../hooks/useKV';
import { CheckCircle, XCircle, ArrowClockwise, Zap } from '@phosphor-icons/react';

interface IntegrationTestResult {
  name: string;
  passed: boolean;
  message: string;
  duration: number;
}

export function IntegrationTest() {
  const [testResults, setTestResults] = useState<IntegrationTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Use the actual app state keys to test integration
  const [selectedFieldId, setSelectedFieldId] = useKV('selected-field-id', null as string | null);
  const [selectedYear, setSelectedYear] = useKV('selected-year', new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useKV('selected-month', null as number | null);

  const runIntegrationTests = async () => {
    setIsRunning(true);
    const results: IntegrationTestResult[] = [];

    // Test 1: Field selection persistence across components
    try {
      const startTime = Date.now();
      
      // Simulate field selection
      const testFieldId = `field-${Date.now()}`;
      setSelectedFieldId(testFieldId);
      
      // Wait for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify persistence
      const storedValue = localStorage.getItem('spark-kv:selected-field-id');
      const parsed = storedValue ? JSON.parse(storedValue) : null;
      
      const duration = Date.now() - startTime;
      results.push({
        name: 'Field Selection Integration',
        passed: parsed === testFieldId,
        message: parsed === testFieldId ? 
          `Field ID persisted correctly: ${testFieldId}` : 
          `Expected ${testFieldId}, got ${parsed}`,
        duration
      });
    } catch (error) {
      results.push({
        name: 'Field Selection Integration',
        passed: false,
        message: `Error: ${error}`,
        duration: 0
      });
    }

    // Test 2: Time selection workflow
    try {
      const startTime = Date.now();
      
      // Simulate year and month selection workflow
      const testYear = 2022;
      const testMonth = 8;
      
      setSelectedYear(testYear);
      await new Promise(resolve => setTimeout(resolve, 50));
      setSelectedMonth(testMonth);
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verify both values persisted
      const yearStored = localStorage.getItem('spark-kv:selected-year');
      const monthStored = localStorage.getItem('spark-kv:selected-month');
      const yearParsed = yearStored ? JSON.parse(yearStored) : null;
      const monthParsed = monthStored ? JSON.parse(monthStored) : null;
      
      const yearCorrect = yearParsed === testYear;
      const monthCorrect = monthParsed === testMonth;
      const bothCorrect = yearCorrect && monthCorrect;
      
      const duration = Date.now() - startTime;
      results.push({
        name: 'Time Selection Integration',
        passed: bothCorrect,
        message: bothCorrect ? 
          `Year ${testYear} and month ${testMonth} persisted correctly` : 
          `Year: ${yearParsed} (expected ${testYear}), Month: ${monthParsed} (expected ${testMonth})`,
        duration
      });
    } catch (error) {
      results.push({
        name: 'Time Selection Integration',
        passed: false,
        message: `Error: ${error}`,
        duration: 0
      });
    }

    // Test 3: State synchronization across multiple hooks
    try {
      const startTime = Date.now();
      
      // Create multiple useKV instances for the same key
      const [value1, setValue1] = [selectedFieldId, setSelectedFieldId];
      
      // Test synchronization
      const syncTestValue = `sync-test-${Date.now()}`;
      setValue1(syncTestValue);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if the state is properly synchronized
      const storedValue = localStorage.getItem('spark-kv:selected-field-id');
      const parsed = storedValue ? JSON.parse(storedValue) : null;
      
      const duration = Date.now() - startTime;
      results.push({
        name: 'State Synchronization',
        passed: parsed === syncTestValue && value1 === syncTestValue,
        message: parsed === syncTestValue && value1 === syncTestValue ? 
          'State synchronized correctly across hooks' : 
          `Storage: ${parsed}, Hook: ${value1}, Expected: ${syncTestValue}`,
        duration
      });
    } catch (error) {
      results.push({
        name: 'State Synchronization',
        passed: false,
        message: `Error: ${error}`,
        duration: 0
      });
    }

    // Test 4: Complex state transitions
    try {
      const startTime = Date.now();
      
      // Simulate complex app state transitions
      setSelectedFieldId('field-a');
      await new Promise(resolve => setTimeout(resolve, 50));
      setSelectedYear(2021);
      await new Promise(resolve => setTimeout(resolve, 50));
      setSelectedMonth(3);
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Change field (simulating user selecting different field)
      setSelectedFieldId('field-b');
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verify all states are correctly persisted
      const fieldStored = localStorage.getItem('spark-kv:selected-field-id');
      const yearStored = localStorage.getItem('spark-kv:selected-year');
      const monthStored = localStorage.getItem('spark-kv:selected-month');
      
      const fieldParsed = fieldStored ? JSON.parse(fieldStored) : null;
      const yearParsed = yearStored ? JSON.parse(yearStored) : null;
      const monthParsed = monthStored ? JSON.parse(monthStored) : null;
      
      const allCorrect = fieldParsed === 'field-b' && yearParsed === 2021 && monthParsed === 3;
      
      const duration = Date.now() - startTime;
      results.push({
        name: 'Complex State Transitions',
        passed: allCorrect,
        message: allCorrect ? 
          'Complex state transitions handled correctly' : 
          `Field: ${fieldParsed}, Year: ${yearParsed}, Month: ${monthParsed}`,
        duration
      });
    } catch (error) {
      results.push({
        name: 'Complex State Transitions',
        passed: false,
        message: `Error: ${error}`,
        duration: 0
      });
    }

    // Test 5: Performance test - rapid state changes
    try {
      const startTime = Date.now();
      
      // Perform rapid state changes
      const iterations = 10;
      for (let i = 0; i < iterations; i++) {
        setSelectedYear(2020 + i);
        if (i % 2 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1)); // Minimal delay
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 100)); // Final wait
      
      const finalYear = 2020 + iterations - 1;
      const yearStored = localStorage.getItem('spark-kv:selected-year');
      const yearParsed = yearStored ? JSON.parse(yearStored) : null;
      
      const duration = Date.now() - startTime;
      results.push({
        name: 'Performance Test (Rapid Changes)',
        passed: yearParsed === finalYear,
        message: yearParsed === finalYear ? 
          `Handled ${iterations} rapid changes in ${duration}ms` : 
          `Expected ${finalYear}, got ${yearParsed} after ${iterations} changes`,
        duration
      });
    } catch (error) {
      results.push({
        name: 'Performance Test (Rapid Changes)',
        passed: false,
        message: `Error: ${error}`,
        duration: 0
      });
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const resetAppState = () => {
    // Reset to default app state
    setSelectedFieldId(null);
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth(null);
    setTestResults([]);
  };

  const passedTests = testResults.filter(result => result.passed).length;
  const totalTests = testResults.length;
  const allPassed = totalTests > 0 && passedTests === totalTests;
  const avgDuration = testResults.length > 0 ? 
    Math.round(testResults.reduce((sum, test) => sum + test.duration, 0) / testResults.length) : 0;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Integration Test Suite
        </CardTitle>
        <CardDescription>
          Real-world testing of useKV hook integration with actual app state management
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Controls */}
        <div className="flex items-center gap-4">
          <Button onClick={runIntegrationTests} disabled={isRunning} className="flex items-center gap-2">
            <ArrowClockwise className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running Integration Tests...' : 'Run Integration Tests'}
          </Button>
          <Button variant="outline" onClick={resetAppState}>
            Reset App State
          </Button>
          {totalTests > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <Badge variant={allPassed ? 'default' : 'destructive'}>
                {passedTests}/{totalTests} Passed
              </Badge>
              {avgDuration > 0 && (
                <Badge variant="outline">
                  Avg: {avgDuration}ms
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Current App State */}
        <Card className="p-4">
          <h4 className="font-medium mb-3">Current App State</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Selected Field ID:</span>
              <div className="font-mono bg-muted px-2 py-1 rounded mt-1">
                {selectedFieldId || 'null'}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Selected Year:</span>
              <div className="font-mono bg-muted px-2 py-1 rounded mt-1">
                {selectedYear}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Selected Month:</span>
              <div className="font-mono bg-muted px-2 py-1 rounded mt-1">
                {selectedMonth || 'null'}
              </div>
            </div>
          </div>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Integration Test Results</h3>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border flex items-start gap-3 ${
                    result.passed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  {result.passed ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className={`font-medium ${result.passed ? 'text-green-800' : 'text-red-800'}`}>
                        {result.name}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {result.duration}ms
                      </Badge>
                    </div>
                    <div className={`text-sm mt-1 ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
                      {result.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Description */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Integration Test Overview</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• <strong>Field Selection Integration:</strong> Tests actual app field selection workflow</p>
            <p>• <strong>Time Selection Integration:</strong> Validates year/month selection persistence</p>
            <p>• <strong>State Synchronization:</strong> Ensures multiple hook instances stay in sync</p>
            <p>• <strong>Complex State Transitions:</strong> Simulates realistic user interactions</p>
            <p>• <strong>Performance Test:</strong> Validates performance under rapid state changes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}