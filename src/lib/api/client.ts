export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
};

export const createApiClient = () => {
  const baseUrl = getApiBaseUrl();

  return {
    async fetch(endpoint: string, options: RequestInit = {}) {
      const url = `${baseUrl}${endpoint}`;
      
      const defaultHeaders = {
        'Content-Type': 'application/json',
      };

      const config = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      };

      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        return response;
      } catch (error) {
        console.error('API Client Error:', error);
        throw error;
      }
    }
  };
};

export const apiClient = createApiClient();