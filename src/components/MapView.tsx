import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Plus, 
  Minus, 
  ArrowsOut, 
  Layers, 
  Eye, 
  EyeSlash 
} from '@phosphor-icons/react';
import { Field, MapState } from '../types';
import { apiClient } from '../api';
import { useKV } from '@github/spark/hooks';

interface MapViewProps {
  selectedField: Field | null;
  selectedYear: number;
  selectedMonth: number | null;
  onMapStateChange: (state: MapState) => void;
}

export function MapView({ 
  selectedField, 
  selectedYear, 
  selectedMonth, 
  onMapStateChange 
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showFieldBoundaries, setShowFieldBoundaries] = useKV('show-field-boundaries', true);
  const [showNDVILayer, setShowNDVILayer] = useKV('show-ndvi-layer', true);
  const [mapCenter, setMapCenter] = useKV('map-center', [-95.7129, 37.0902] as [number, number]);
  const [mapZoom, setMapZoom] = useKV('map-zoom', 4);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: mapCenter,
      zoom: mapZoom,
      maxZoom: 18,
      minZoom: 2
    });

    // Map event listeners
    map.current.on('load', () => {
      setMapLoaded(true);
    });

    map.current.on('moveend', () => {
      if (map.current) {
        const center = map.current.getCenter();
        const zoom = map.current.getZoom();
        setMapCenter([center.lng, center.lat]);
        setMapZoom(zoom);
        
        onMapStateChange({
          center: [center.lng, center.lat],
          zoom,
          selectedField: selectedField?.id || null,
          selectedYear,
          selectedMonth,
          showFieldBoundaries,
          showNDVILayer
        });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update selected field boundary
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing field boundary
    if (map.current.getLayer('selected-field-boundary')) {
      map.current.removeLayer('selected-field-boundary');
    }
    if (map.current.getSource('selected-field')) {
      map.current.removeSource('selected-field');
    }

    if (selectedField && showFieldBoundaries) {
      // Add field boundary
      const coordinates = selectedField.coordinates.map(coord => [coord[1], coord[0]]); // Swap lat/lng for GeoJSON
      
      map.current.addSource('selected-field', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {
            name: selectedField.name,
            id: selectedField.id
          },
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates]
          }
        }
      });

      map.current.addLayer({
        id: 'selected-field-boundary',
        type: 'line',
        source: 'selected-field',
        layout: {},
        paint: {
          'line-color': 'hsl(var(--primary))',
          'line-width': 3,
          'line-opacity': 0.8
        }
      });

      // Fit map to field bounds
      if (selectedField.bbox) {
        const [minLng, minLat, maxLng, maxLat] = selectedField.bbox;
        map.current.fitBounds([
          [minLng, minLat],
          [maxLng, maxLat]
        ], { padding: 50 });
      }
    }
  }, [selectedField, showFieldBoundaries, mapLoaded]);

  // Update NDVI layer
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedField) return;

    // Remove existing NDVI layer
    if (map.current.getLayer('ndvi-tiles')) {
      map.current.removeLayer('ndvi-tiles');
    }
    if (map.current.getSource('ndvi')) {
      map.current.removeSource('ndvi');
    }

    if (showNDVILayer) {
      const tileUrl = selectedMonth 
        ? apiClient.getTileURL('monthly', selectedField.id, selectedYear, selectedMonth)
        : apiClient.getTileURL('annual', selectedField.id, selectedYear);

      map.current.addSource('ndvi', {
        type: 'raster',
        tiles: [tileUrl],
        tileSize: 256,
        attribution: 'NDVI Data'
      });

      map.current.addLayer({
        id: 'ndvi-tiles',
        type: 'raster',
        source: 'ndvi',
        paint: {
          'raster-opacity': 0.7
        }
      }, 'selected-field-boundary'); // Add below field boundary
    }
  }, [selectedField, selectedYear, selectedMonth, showNDVILayer, mapLoaded]);

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  const handleFitToField = () => {
    if (map.current && selectedField?.bbox) {
      const [minLng, minLat, maxLng, maxLat] = selectedField.bbox;
      map.current.fitBounds([
        [minLng, minLat],
        [maxLng, maxLat]
      ], { padding: 50 });
    }
  };

  const toggleFieldBoundaries = () => {
    setShowFieldBoundaries(current => !current);
  };

  const toggleNDVILayer = () => {
    setShowNDVILayer(current => !current);
  };

  return (
    <div className="relative h-full w-full">
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="h-full w-full rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Zoom Controls */}
        <Card className="p-2">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
            {selectedField && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFitToField}
                className="h-8 w-8 p-0"
              >
                <ArrowsOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>

        {/* Layer Controls */}
        <Card className="p-2">
          <div className="flex flex-col gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showFieldBoundaries ? 'default' : 'ghost'}
                    size="sm"
                    onClick={toggleFieldBoundaries}
                    className="h-8 w-8 p-0"
                  >
                    <Layers className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{showFieldBoundaries ? 'Hide' : 'Show'} field boundaries</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showNDVILayer ? 'default' : 'ghost'}
                    size="sm"
                    onClick={toggleNDVILayer}
                    className="h-8 w-8 p-0"
                    disabled={!selectedField}
                  >
                    {showNDVILayer ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeSlash className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{showNDVILayer ? 'Hide' : 'Show'} NDVI layer</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </Card>
      </div>

      {/* Map Info */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        {selectedField && (
          <Badge variant="default" className="bg-background/80 backdrop-blur">
            {selectedField.name}
          </Badge>
        )}
        <Badge variant="secondary" className="bg-background/80 backdrop-blur">
          {selectedMonth 
            ? `${new Date(2000, selectedMonth - 1).toLocaleDateString('en', { month: 'short' })} ${selectedYear}`
            : `${selectedYear} Annual`
          }
        </Badge>
      </div>

      {/* Loading Indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}