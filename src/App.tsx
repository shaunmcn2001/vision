import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plant } from '@phosphor-icons/react';

function App() {
  // Test persistent state
  const [counter, setCounter] = useKV('test-counter', 0);
  const [selectedYear, setSelectedYear] = useKV('selected-year', new Date().getFullYear());
  
  // Local state
  const [showDebug, setShowDebug] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
            <Plant className="h-6 w-6 text-primary-foreground" weight="fill" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">NDVI Vision</h1>
            <p className="text-muted-foreground">Agricultural Analytics Dashboard</p>
          </div>
          <Badge variant="secondary" className="ml-auto">
            v1.0.0
          </Badge>
        </div>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Spark Runtime Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setCounter(c => c + 1)}
                variant="default"
              >
                Count: {counter}
              </Button>
              <Button 
                onClick={() => setCounter(0)}
                variant="outline"
              >
                Reset
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Year:</label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-1 rounded border border-input bg-background"
              >
                {[2020, 2021, 2022, 2023, 2024].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <Button 
              onClick={() => setShowDebug(!showDebug)}
              variant="ghost"
              size="sm"
            >
              {showDebug ? 'Hide' : 'Show'} Debug
            </Button>

            {showDebug && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Debug Info:</h4>
                <div className="text-sm space-y-1">
                  <div>Counter (persistent): {counter}</div>
                  <div>Selected Year (persistent): {selectedYear}</div>
                  <div>Show Debug (local): {showDebug.toString()}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sample NDVI Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Map View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Plant className="h-16 w-16 mx-auto mb-4" />
                  <p>Interactive NDVI Map</p>
                  <p className="text-sm">Would show field boundaries and NDVI data here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Field Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-2 rounded border border-border bg-card-foreground/5">
                <div className="font-medium">North Field</div>
                <div className="text-sm text-muted-foreground">42.5 acres</div>
              </div>
              <div className="p-2 rounded border border-border">
                <div className="font-medium">South Field</div>
                <div className="text-sm text-muted-foreground">38.2 acres</div>
              </div>
              <div className="p-2 rounded border border-border">
                <div className="font-medium">East Field</div>
                <div className="text-sm text-muted-foreground">55.1 acres</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Panel */}
        <Card>
          <CardHeader>
            <CardTitle>NDVI Analytics - {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Chart showing monthly NDVI trends</p>
                <p className="text-sm">Would use recharts for visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
      
      <Toaster />
    </div>
  );
}

export default App;