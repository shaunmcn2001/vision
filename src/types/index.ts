export interface Field {
  id: string;
  name: string;
  area: number;
  coordinates: [number, number][];
  center: [number, number];
  bbox: [number, number, number, number];
}

export interface NDVIData {
  field_id: string;
  year: number;
  month: number;
  ndvi_value: number;
  date: string;
}

export interface MonthlyNDVIResponse {
  field_id: string;
  year: number;
  data: NDVIData[];
}

export interface APISettings {
  backendUrl: string;
  apiKey: string;
}

export interface BackendStatus {
  healthy: boolean;
  message: string;
  lastChecked: Date;
}

export interface MapState {
  center: [number, number];
  zoom: number;
  selectedField: string | null;
  selectedYear: number;
  selectedMonth: number | null;
  showFieldBoundaries: boolean;
  showNDVILayer: boolean;
}

export interface ChartData {
  month: string;
  ndvi: number;
  date: string;
}

export interface TileLayer {
  id: string;
  type: 'raster' | 'vector';
  source: string;
  visible: boolean;
}