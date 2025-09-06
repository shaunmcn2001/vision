import { Field, MonthlyNDVIResponse, BackendStatus } from '../types';

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_BACKEND_URL || 'https://srv-d2tejgeuk2gs73cqecp0.onrender.com';
  }

  updateSettings(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getFields(): Promise<Field[]> {
    return this.request<Field[]>('/api/fields');
  }

  async getMonthlyNDVI(fieldId: string, year: number): Promise<MonthlyNDVIResponse> {
    return this.request<MonthlyNDVIResponse>(`/api/ndvi/monthly/by-field/${fieldId}?year=${year}`);
  }

  async checkHealth(): Promise<BackendStatus> {
    try {
      const response = await fetch(`${this.baseURL}/api/health`);
      
      return {
        healthy: response.ok,
        message: response.ok ? 'Backend connected' : `HTTP ${response.status}`,
        lastChecked: new Date(),
      };
    } catch (error) {
      return {
        healthy: false,
        message: error instanceof Error ? error.message : 'Connection failed',
        lastChecked: new Date(),
      };
    }
  }

  getTileURL(type: 'annual' | 'monthly', fieldId: string, year: number, month?: number): string {
    const base = `${this.baseURL}/api/tiles/ndvi`;
    
    if (type === 'annual') {
      return `${base}/annual/${fieldId}/${year}/{z}/{x}/{y}.png`;
    } else {
      return `${base}/month/${fieldId}/${year}/${month}/{z}/{x}/{y}.png`;
    }
  }
}

export const apiClient = new APIClient();