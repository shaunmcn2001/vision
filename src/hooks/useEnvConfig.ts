import { EnvValidator } from '../tests/env.test';
import { toast } from 'sonner';

/**
 * Environment Configuration Hook
 * 
 * Provides validated environment variables and status checking
 * for the NDVI Vision application.
 */
export function useEnvConfig() {
  const validateEnvironment = () => {
    const validation = EnvValidator.validate();
    
    if (!validation.isValid) {
      console.error('Environment validation failed:', validation.errors);
      validation.errors.forEach(error => {
        toast.error(`Config Error: ${error}`);
      });
    }

    return validation;
  };

  const getConfig = () => {
    const config = EnvValidator.getConfig();
    
    // Provide fallbacks for missing values
    return {
      ...config,
      backendUrl: config.backendUrl || 'http://localhost:8000',
      apiKey: config.apiKey || '',
    };
  };

  const isConfigured = () => {
    const validation = EnvValidator.validate();
    return validation.isValid;
  };

  const getConfigurationStatus = () => {
    const config = getConfig();
    const validation = validateEnvironment();

    return {
      hasBackendUrl: !!config.backendUrl && config.backendUrl !== 'http://localhost:8000',
      hasApiKey: !!config.apiKey,
      isValid: validation.isValid,
      errors: validation.errors,
      warnings: generateWarnings(config),
    };
  };

  const generateWarnings = (config: ReturnType<typeof getConfig>) => {
    const warnings: string[] = [];

    // Check for development URLs in production
    if (config.isProd && config.backendUrl?.includes('localhost')) {
      warnings.push('Using localhost backend URL in production');
    }

    // Check for placeholder API keys
    if (config.apiKey && ['test', 'demo', 'placeholder'].some(word => 
      config.apiKey.toLowerCase().includes(word))) {
      warnings.push('API key appears to be a test/demo value');
    }

    // Check for HTTP in production
    if (config.isProd && config.backendUrl?.startsWith('http://')) {
      warnings.push('Using HTTP (not HTTPS) backend URL in production');
    }

    return warnings;
  };

  return {
    validateEnvironment,
    getConfig,
    isConfigured,
    getConfigurationStatus,
  };
}