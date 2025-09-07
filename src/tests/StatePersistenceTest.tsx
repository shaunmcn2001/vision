import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useKV } from '../hooks/useKV';
import { CheckCircle, XCircle, RefreshCw, Gear, Clock, User } from '@phosphor-icons/react';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

export function StatePersistenceTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Test state variables using useKV
  const [testString, setTestString] = useKV('test-string', 'default-value');
  const [testNumber, setTestNumber] = useKV('test-number', 42);
  const [testBoolean, setTestBoolean] = useKV('test-boolean', false);
  const [testArray, setTestArray] = useKV('test-array', [] as string[]);
  const [testObject, setTestObject] = useKV('test-object', { name: 'test', value: 0 });
  const [testNull, setTestNull] = useKV('test-null', null as string | null);

  // App-specific state tests
  const [selectedFieldId, setSelectedFieldId] = useKV('selected-field-id', null as string | null);
  const [selectedYear, setSelectedYear] = useKV('selected-year', new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useKV('selected-month', null as number | null);
  
  const runTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    // Test 1: String persistence
    try {
      setTestString('test-value-123');
      await new Promise(resolve => setTimeout(resolve, 100));
      const storedValue = localStorage.getItem('spark-kv:test-string');
      const parsed = storedValue ? JSON.parse(storedValue) : null;
      results.push({
        name: 'String Persistence',
        passed: parsed === 'test-value-123',
        message: parsed === 'test-value-123' ? 'String stored correctly' : `Expected 'test-value-123', got '${parsed}'`
      });
    } catch (error) {
      results.push({
        name: 'String Persistence',
        passed: false,
        message: `Error: ${error}`
      });
    }

    // Test 2: Number persistence
    try {
      setTestNumber(999);
      await new Promise(resolve => setTimeout(resolve, 100));
      const storedValue = localStorage.getItem('spark-kv:test-number');
      const parsed = storedValue ? JSON.parse(storedValue) : null;
      results.push({
        name: 'Number Persistence',
        passed: parsed === 999,
        message: parsed === 999 ? 'Number stored correctly' : `Expected 999, got ${parsed}`
      });
    } catch (error) {
      results.push({
        name: 'Number Persistence',
        passed: false,
        message: `Error: ${error}`
      });
    }

    // Test 3: Boolean persistence
    try {
      setTestBoolean(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      const storedValue = localStorage.getItem('spark-kv:test-boolean');
      const parsed = storedValue ? JSON.parse(storedValue) : null;
      results.push({
        name: 'Boolean Persistence',
        passed: parsed === true,
        message: parsed === true ? 'Boolean stored correctly' : `Expected true, got ${parsed}`
      });
    } catch (error) {
      results.push({
        name: 'Boolean Persistence',
        passed: false,
        message: `Error: ${error}`
      });
    }

    // Test 4: Array persistence
    try {
      const testArr = ['item1', 'item2', 'item3'];
      setTestArray(testArr);
      await new Promise(resolve => setTimeout(resolve, 100));
      const storedValue = localStorage.getItem('spark-kv:test-array');
      const parsed = storedValue ? JSON.parse(storedValue) : null;
      const isEqual = Array.isArray(parsed) && 
                     parsed.length === testArr.length && 
                     parsed.every((item, index) => item === testArr[index]);
      results.push({
        name: 'Array Persistence',
        passed: isEqual,
        message: isEqual ? 'Array stored correctly' : `Expected [${testArr.join(', ')}], got [${parsed?.join(', ') || 'null'}]`
      });
    } catch (error) {
      results.push({
        name: 'Array Persistence',
        passed: false,
        message: `Error: ${error}`
      });
    }

    // Test 5: Object persistence
    try {
      const testObj = { name: 'updated', value: 123, nested: { prop: 'test' } };
      setTestObject(testObj);
      await new Promise(resolve => setTimeout(resolve, 100));
      const storedValue = localStorage.getItem('spark-kv:test-object');
      const parsed = storedValue ? JSON.parse(storedValue) : null;
      const isEqual = parsed && 
                     parsed.name === testObj.name && 
                     parsed.value === testObj.value &&
                     parsed.nested?.prop === testObj.nested.prop;
      results.push({
        name: 'Object Persistence',
        passed: isEqual,
        message: isEqual ? 'Object stored correctly' : `Object mismatch: ${JSON.stringify(parsed)}`
      });
    } catch (error) {
      results.push({
        name: 'Object Persistence',
        passed: false,
        message: `Error: ${error}`
      });
    }

    // Test 6: Null value persistence
    try {
      setTestNull('not-null');
      await new Promise(resolve => setTimeout(resolve, 100));
      setTestNull(null);
      await new Promise(resolve => setTimeout(resolve, 100));
      const storedValue = localStorage.getItem('spark-kv:test-null');
      const parsed = storedValue ? JSON.parse(storedValue) : null;
      results.push({
        name: 'Null Persistence',
        passed: parsed === null,
        message: parsed === null ? 'Null stored correctly' : `Expected null, got ${parsed}`
      });
    } catch (error) {
      results.push({
        name: 'Null Persistence',
        passed: false,
        message: `Error: ${error}`
      });
    }

    // Test 7: App-specific field selection persistence
    try {
      setSelectedFieldId('field-123');
      await new Promise(resolve => setTimeout(resolve, 100));
      const storedValue = localStorage.getItem('spark-kv:selected-field-id');
      const parsed = storedValue ? JSON.parse(storedValue) : null;
      results.push({
        name: 'Field Selection Persistence',
        passed: parsed === 'field-123',
        message: parsed === 'field-123' ? 'Field ID stored correctly' : `Expected 'field-123', got '${parsed}'`
      });
    } catch (error) {
      results.push({
        name: 'Field Selection Persistence',
        passed: false,
        message: `Error: ${error}`
      });
    }

    // Test 8: Year selection persistence
    try {
      setSelectedYear(2023);
      await new Promise(resolve => setTimeout(resolve, 100));
      const storedValue = localStorage.getItem('spark-kv:selected-year');
      const parsed = storedValue ? JSON.parse(storedValue) : null;
      results.push({
        name: 'Year Selection Persistence',
        passed: parsed === 2023,
        message: parsed === 2023 ? 'Year stored correctly' : `Expected 2023, got ${parsed}`
      });
    } catch (error) {
      results.push({
        name: 'Year Selection Persistence',
        passed: false,
        message: `Error: ${error}`
      });
    }

    // Test 9: Month selection persistence
    try {
      setSelectedMonth(6);
      await new Promise(resolve => setTimeout(resolve, 100));
      const storedValue = localStorage.getItem('spark-kv:selected-month');
      const parsed = storedValue ? JSON.parse(storedValue) : null;
      results.push({
        name: 'Month Selection Persistence',
        passed: parsed === 6,
        message: parsed === 6 ? 'Month stored correctly' : `Expected 6, got ${parsed}`
      });
    } catch (error) {
      results.push({
        name: 'Month Selection Persistence',
        passed: false,
        message: `Error: ${error}`
      });
    }

    // Test 10: Functional updates
    try {
      setTestNumber(100);
      await new Promise(resolve => setTimeout(resolve, 100));
      setTestNumber(prev => prev + 50);
      await new Promise(resolve => setTimeout(resolve, 100));
      const storedValue = localStorage.getItem('spark-kv:test-number');
      const parsed = storedValue ? JSON.parse(storedValue) : null;
      results.push({
        name: 'Functional Updates',
        passed: parsed === 150,
        message: parsed === 150 ? 'Functional updates work correctly' : `Expected 150, got ${parsed}`
      });
    } catch (error) {
      results.push({
        name: 'Functional Updates',
        passed: false,
        message: `Error: ${error}`
      });
    }

    // Test 11: Array functional updates
    try {
      setTestArray(['initial']);
      await new Promise(resolve => setTimeout(resolve, 100));
      setTestArray(prev => [...prev, 'added']);
      await new Promise(resolve => setTimeout(resolve, 100));
      const storedValue = localStorage.getItem('spark-kv:test-array');
      const parsed = storedValue ? JSON.parse(storedValue) : null;
      const isCorrect = Array.isArray(parsed) && parsed.length === 2 && parsed.includes('initial') && parsed.includes('added');
      results.push({
        name: 'Array Functional Updates',
        passed: isCorrect,
        message: isCorrect ? 'Array functional updates work correctly' : `Expected ['initial', 'added'], got ${JSON.stringify(parsed)}`
      });
    } catch (error) {
      results.push({
        name: 'Array Functional Updates',
        passed: false,
        message: `Error: ${error}`
      });
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const clearStorage = () => {
    // Clear test keys from localStorage
    const keysToRemove = [
      'spark-kv:test-string',
      'spark-kv:test-number',
      'spark-kv:test-boolean',
      'spark-kv:test-array',
      'spark-kv:test-object',
      'spark-kv:test-null',
      'spark-kv:selected-field-id',
      'spark-kv:selected-year',
      'spark-kv:selected-month'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Reset all test values to defaults
    setTestString('default-value');
    setTestNumber(42);
    setTestBoolean(false);
    setTestArray([]);
    setTestObject({ name: 'test', value: 0 });
    setTestNull(null);
    setSelectedFieldId(null);
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth(null);
    
    setTestResults([]);
  };

  const passedTests = testResults.filter(result => result.passed).length;
  const totalTests = testResults.length;
  const allPassed = totalTests > 0 && passedTests === totalTests;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gear className="h-5 w-5" />
          State Persistence Test Suite
        </CardTitle>
        <CardDescription>
          Comprehensive testing of useKV hook and localStorage persistence for NDVI Vision app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Controls */}
        <div className="flex items-center gap-4">
          <Button onClick={runTests} disabled={isRunning} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
          <Button variant="outline" onClick={clearStorage}>
            Clear Storage
          </Button>
          {totalTests > 0 && (
            <Badge variant={allPassed ? 'default' : 'destructive'} className="ml-auto">
              {passedTests}/{totalTests} Passed
            </Badge>
          )}
        </div>

        {/* Current State Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Test Values
            </h4>
            <div className="space-y-1 text-sm">
              <div>String: <code>{testString}</code></div>
              <div>Number: <code>{testNumber}</code></div>
              <div>Boolean: <code>{testBoolean.toString()}</code></div>
              <div>Array: <code>[{testArray.join(', ')}]</code></div>
              <div>Object: <code>{JSON.stringify(testObject)}</code></div>
              <div>Null: <code>{String(testNull)}</code></div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              App State
            </h4>
            <div className="space-y-1 text-sm">
              <div>Field ID: <code>{selectedFieldId || 'null'}</code></div>
              <div>Year: <code>{selectedYear}</code></div>
              <div>Month: <code>{selectedMonth || 'null'}</code></div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2">Storage Keys</h4>
            <div className="text-sm text-muted-foreground">
              {Object.keys(localStorage)
                .filter(key => key.startsWith('spark-kv:'))
                .map(key => (
                  <div key={key} className="truncate">
                    {key.replace('spark-kv:', '')}
                  </div>
                )) || 'No keys found'}
            </div>
          </Card>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Test Results</h3>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border flex items-start gap-3 ${
                    result.passed 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {result.passed ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm opacity-80">{result.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Test Instructions</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>1. Click "Run All Tests" to execute the complete test suite</p>
            <p>2. Each test validates a specific aspect of state persistence</p>
            <p>3. Check browser localStorage to verify values are actually stored</p>
            <p>4. Refresh the page to test that values persist across sessions</p>
            <p>5. Use "Clear Storage" to reset all test data</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}