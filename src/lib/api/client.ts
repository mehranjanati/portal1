export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
};

export const createApiClient = () => {
  const baseUrl = getApiBaseUrl();

  return {
    async fetch(endpoint: string, options: RequestInit = {}) {
      // Allow passing full URLs (like for Vercel AI SDK api endpoint generation) or paths
      const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
      
      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add auth token if exists (for Phase 3)
      const storedAuth = typeof localStorage !== 'undefined' ? localStorage.getItem('nexus_auth') : null;
      if (storedAuth) {
        try {
          const { token } = JSON.parse(storedAuth);
          if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
          }
        } catch (e) {
          console.error('Failed to parse auth token');
        }
      }

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