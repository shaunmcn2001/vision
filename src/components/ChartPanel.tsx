import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { ChartLine, ChartBar, TrendUp } from '@phosphor-icons/react';
import { apiClient } from '../api';
import { Field, ChartData } from '../types';

interface ChartPanelProps {
  selectedField: Field | null;
  selectedYear: number;
  selectedMonth: number | null;
}

type ChartType = 'line' | 'bar';

export function ChartPanel({ selectedField, selectedYear, selectedMonth }: ChartPanelProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<ChartType>('line');

  useEffect(() => {
    if (selectedField) {
      fetchNDVIData();
    }
  }, [selectedField, selectedYear]);

  const fetchNDVIData = async () => {
    if (!selectedField) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching NDVI data for field ${selectedField.id}, year ${selectedYear}`);
      const response = await apiClient.getMonthlyNDVI(selectedField.id, selectedYear);
      
      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format: expected data array');
      }
      
      const formattedData: ChartData[] = response.data.map(item => {
        if (typeof item.ndvi_value !== 'number') {
          console.warn('Invalid NDVI value:', item.ndvi_value);
        }
        
        return {
          month: new Date(2000, item.month - 1).toLocaleDateString('en', { month: 'short' }),
          ndvi: Number(item.ndvi_value.toFixed(3)),
          date: item.date,
        };
      });

      console.log(`Loaded ${formattedData.length} NDVI data points`);
      setChartData(formattedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load NDVI data';
      console.error('NDVI data loading error:', err);
      setError(errorMessage);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const getAverageNDVI = () => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, item) => acc + item.ndvi, 0);
    return (sum / chartData.length).toFixed(3);
  };

  const getMaxNDVI = () => {
    if (chartData.length === 0) return 0;
    return Math.max(...chartData.map(item => item.ndvi)).toFixed(3);
  };

  const getCurrentMonthNDVI = () => {
    if (!selectedMonth || chartData.length === 0) return null;
    const monthData = chartData.find(item => {
      const monthIndex = new Date(`${item.month} 1, 2000`).getMonth() + 1;
      return monthIndex === selectedMonth;
    });
    return monthData?.ndvi.toFixed(3) || null;
  };

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'ndvi') {
      return [value.toFixed(3), 'NDVI'];
    }
    return [value, name];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`Month: ${label}`}</p>
          <p className="text-primary">
            NDVI: {payload[0].value.toFixed(3)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!selectedField) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ChartLine className="h-5 w-5" />
            NDVI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Select a field to view NDVI data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ChartLine className="h-5 w-5" />
            NDVI Analysis
            <Badge variant="outline">{selectedField.name}</Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              <ChartLine className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              <ChartBar className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Statistics Row */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <TrendUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Avg:</span>
            <Badge variant="secondary">{getAverageNDVI()}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Max:</span>
            <Badge variant="secondary">{getMaxNDVI()}</Badge>
          </div>
          {selectedMonth && getCurrentMonthNDVI() && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Selected:</span>
              <Badge variant="default">{getCurrentMonthNDVI()}</Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : chartData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No NDVI data available for {selectedYear}</p>
            <Button onClick={fetchNDVIData} variant="outline" size="sm" className="mt-4">
              Retry
            </Button>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={[0, 1]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="ndvi" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={[0, 1]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="ndvi" 
                    fill="hsl(var(--primary))"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}