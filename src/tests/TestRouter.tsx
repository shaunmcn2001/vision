import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatePersistenceTest } from './StatePersistenceTest';
import { IntegrationTest } from './IntegrationTest';
import { UserInteractionTest } from './UserInteractionTest';
import { TestTube, ArrowLeft, House, Lightning, User } from '@phosphor-icons/react';

interface TestRouterProps {
  onBackToApp: () => void;
}

export function TestRouter({ onBackToApp }: TestRouterProps) {
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  if (currentTest === 'persistence') {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentTest(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tests
            </Button>
          </div>
          <StatePersistenceTest />
        </div>
      </div>
    );
  }

  if (currentTest === 'integration') {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentTest(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tests
            </Button>
          </div>
          <IntegrationTest />
        </div>
      </div>
    );
  }

  if (currentTest === 'user-interaction') {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentTest(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tests
            </Button>
          </div>
          <UserInteractionTest />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">NDVI Vision Test Suite</h1>
          <p className="text-muted-foreground">Choose a test to run</p>
        </div>

        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={onBackToApp}
            className="flex items-center gap-2"
          >
            <House className="h-4 w-4" />
            Back to App
          </Button>
        </div>

        <div className="grid gap-4">
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentTest('persistence')}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TestTube className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">State Persistence Test</h3>
                <p className="text-muted-foreground mb-3">
                  Comprehensive testing of the useKV hook and localStorage persistence functionality. 
                  Tests string, number, boolean, array, object, and null value persistence, as well as 
                  functional updates and app-specific state management.
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  Click to run test →
                </div>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentTest('integration')}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Lightning className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Integration Test</h3>
                <p className="text-muted-foreground mb-3">
                  Real-world testing of useKV hook integration with actual app state management. 
                  Tests field selection, time selection, state synchronization, and performance 
                  with the actual keys used by the NDVI Vision application.
                </p>
                <div className="text-sm text-green-600 font-medium">
                  Click to run test →
                </div>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentTest('user-interaction')}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">User Interaction Test</h3>
                <p className="text-muted-foreground mb-3">
                  Simulates realistic user workflows with the NDVI Vision app. Tests complete 
                  user journeys including field selection, time navigation, state transitions, 
                  rapid interactions, and page refresh scenarios.
                </p>
                <div className="text-sm text-purple-600 font-medium">
                  Click to run test →
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-medium text-amber-800 mb-2">Testing Notes</h4>
          <div className="text-sm text-amber-700 space-y-1">
            <p>• Tests are designed to validate core functionality without affecting production data</p>
            <p>• All test data uses prefixed keys to avoid conflicts with app state</p>
            <p>• Tests include both synchronous and asynchronous state updates</p>
            <p>• Browser localStorage is used as the persistence layer</p>
          </div>
        </div>
      </div>
    </div>
  );
}