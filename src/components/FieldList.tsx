import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { MapPin, MagnifyingGlass } from '@phosphor-icons/react';
import { apiClient } from '../api';
import { Field } from '../types';
import { useKV } from '@github/spark/hooks';

interface FieldListProps {
  selectedFieldId: string | null;
  onFieldSelect: (field: Field) => void;
}

export function FieldList({ selectedFieldId, onFieldSelect }: FieldListProps) {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated] = useKV('fields-last-updated', null);

  const filteredFields = fields.filter(field =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchFields = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching fields from API...');
      const result = await apiClient.getFields();
      
      if (!Array.isArray(result)) {
        throw new Error('Invalid response format: expected array of fields');
      }
      
      console.log(`Loaded ${result.length} fields successfully`);
      setFields(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load fields';
      console.error('Field loading error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const formatArea = (area: number) => {
    if (area >= 10000) {
      return `${(area / 10000).toFixed(1)} ha`;
    }
    return `${area.toFixed(0)} m²`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Fields
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Fields
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchFields} size="sm">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Fields
          <Badge variant="secondary">{fields.length}</Badge>
        </CardTitle>
        
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <div className="p-4 space-y-2">
            {filteredFields.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'No fields match your search' : 'No fields found'}
                </p>
              </div>
            ) : (
              filteredFields.map((field) => (
                <Button
                  key={field.id}
                  variant={selectedFieldId === field.id ? 'default' : 'ghost'}
                  className="w-full justify-start h-auto p-3"
                  onClick={() => onFieldSelect(field)}
                >
                  <div className="flex flex-col items-start gap-1 w-full">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium truncate">{field.name}</span>
                      {selectedFieldId === field.id && (
                        <Badge variant="secondary" className="ml-2">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Area: {formatArea(field.area)}</span>
                      <span>•</span>
                      <span>ID: {field.id.slice(0, 8)}...</span>
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
        
        {lastUpdated && (
          <div className="px-4 py-2 border-t">
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}