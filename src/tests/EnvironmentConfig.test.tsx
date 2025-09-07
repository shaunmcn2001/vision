import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnvironmentConfig } from '../components/EnvironmentConfig';

// Mock the hooks and API client
vi.mock('../hooks', () => ({
  useKV: vi.fn(() => ['', vi.fn(), vi.fn()])
}));

vi.mock('../api', () => ({
  apiClient: {
    updateSettings: vi.fn(),
    checkHealth: vi.fn(),
    getFields: vi.fn()
  }
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('EnvironmentConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset import.meta.env
    Object.defineProperty(import.meta, 'env', {
      value: {
        VITE_BACKEND_URL: '',
        MODE: 'development'
      },
      writable: true
    });
  });

  it('renders environment config button', () => {
    render(<EnvironmentConfig />);
    expect(screen.getByText('Environment')).toBeInTheDocument();
  });

  it('opens dialog when button is clicked', async () => {
    render(<EnvironmentConfig />);
    
    const button = screen.getByText('Environment');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Environment Configuration')).toBeInTheDocument();
    });
  });

  it('shows current configuration status', async () => {
    // Set environment variables
    Object.defineProperty(import.meta, 'env', {
      value: {
        VITE_BACKEND_URL: 'https://vision-backend-0l94.onrender.com',
        MODE: 'production'
      },
      writable: true
    });

    render(<EnvironmentConfig />);
    
    const button = screen.getByText('Environment');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Current Configuration')).toBeInTheDocument();
      expect(screen.getByText('Environment')).toBeInTheDocument(); // Environment badge
      expect(screen.getByText('https://vision-backend-0l94.onrender.com')).toBeInTheDocument();
    });
  });

  it('shows manual configuration when no environment variables', async () => {
    render(<EnvironmentConfig />);
    
    const button = screen.getByText('Environment');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Manual Configuration')).toBeInTheDocument();
      expect(screen.getByText('Some environment variables are missing')).toBeInTheDocument();
    });
  });

  it('displays GitHub secrets setup guide', async () => {
    render(<EnvironmentConfig />);
    
    const button = screen.getByText('Environment');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('GitHub Secrets Setup (Recommended)')).toBeInTheDocument();
      expect(screen.getByText('VITE_BACKEND_URL')).toBeInTheDocument();
    });
  });

  it('allows manual configuration when environment variables not set', async () => {
    const { useKV } = await import('../hooks');
    const mockSetBackendUrl = vi.fn();
    
    (useKV as any)
      .mockReturnValueOnce(['', mockSetBackendUrl, vi.fn()]); // backendUrl

    render(<EnvironmentConfig />);
    
    const button = screen.getByText('Environment');
    fireEvent.click(button);
    
    await waitFor(() => {
      const urlInput = screen.getByPlaceholderText('https://vision-backend-0l94.onrender.com');
      
      expect(urlInput).not.toBeDisabled();
      
      fireEvent.change(urlInput, { target: { value: 'https://test.com' } });
      
      expect(mockSetBackendUrl).toHaveBeenCalledWith('https://test.com');
    });
  });

  it('disables manual inputs when environment variables are set', async () => {
    Object.defineProperty(import.meta, 'env', {
      value: {
        VITE_BACKEND_URL: 'https://vision-backend-0l94.onrender.com',
        MODE: 'production'
      },
      writable: true
    });

    render(<EnvironmentConfig />);
    
    const button = screen.getByText('Environment');
    fireEvent.click(button);
    
    await waitFor(() => {
      const urlInput = screen.getByPlaceholderText('https://vision-backend-0l94.onrender.com');
      
      expect(urlInput).toBeDisabled();
    });
  });

  it('runs environment tests successfully', async () => {
    const { apiClient } = await import('../api');
    
    (apiClient.checkHealth as any).mockResolvedValue({
      healthy: true,
      message: 'Backend connected'
    });
    
    (apiClient.getFields as any).mockResolvedValue([
      { id: '1', name: 'Field 1' },
      { id: '2', name: 'Field 2' }
    ]);

    render(<EnvironmentConfig />);
    
    const button = screen.getByText('Environment');
    fireEvent.click(button);
    
    await waitFor(() => {
      const testButton = screen.getByText('Run Environment Tests');
      fireEvent.click(testButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Found 2 fields')).toBeInTheDocument();
    });
  });

  it('handles environment test failures', async () => {
    const { apiClient } = await import('../api');
    
    (apiClient.checkHealth as any).mockResolvedValue({
      healthy: false,
      message: 'Connection refused'
    });

    render(<EnvironmentConfig />);
    
    const button = screen.getByText('Environment');
    fireEvent.click(button);
    
    await waitFor(() => {
      const testButton = screen.getByText('Run Environment Tests');
      fireEvent.click(testButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Connection failed: Connection refused')).toBeInTheDocument();
    });
  });

  it('handles field data access failures', async () => {
    const { apiClient } = await import('../api');
    
    (apiClient.checkHealth as any).mockResolvedValue({
      healthy: true,
      message: 'Backend connected'
    });
    
    (apiClient.getFields as any).mockRejectedValue(new Error('Failed to fetch fields'));

    render(<EnvironmentConfig />);
    
    const button = screen.getByText('Environment');
    fireEvent.click(button);
    
    await waitFor(() => {
      const testButton = screen.getByText('Run Environment Tests');
      fireEvent.click(testButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch fields data')).toBeInTheDocument();
    });
  });
});