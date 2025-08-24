import { API_BASE, createApiUrl } from './config';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiClientError extends Error implements ApiError {
  status: number;
  code?: string;
  details?: unknown;
  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_BASE;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders.Authorization = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders.Authorization;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = createApiUrl(endpoint);

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    if (__DEV__) {
      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
    }

    try {
      const response = await fetch(url, config);

      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const msg = (data && (data.message || data.error)) || (typeof data === 'string' ? data : 'Request failed');
        const error = new ApiClientError(String(msg), response.status, (data && data.code) || undefined, data);
        if (__DEV__) {
          console.error('❌ API Error:', { message: error.message, status: error.status, code: error.code });
        }
        throw error;
      }

      if (__DEV__) {
        console.log('✅ API Success:', response.status);
      }
      return data as T;
    } catch (error: unknown) {
      if (error instanceof TypeError || (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError')) {
        const hint = `Base: ${this.baseURL}`;
        const networkError = new ApiClientError(`Network connection failed. ${hint}`, 0, 'NETWORK_ERROR', error);
        if (__DEV__) {
          console.error('🌐 Network Error:', networkError.message);
          console.error('   URL:', url);
          console.error('   Check if server is running and EXPO_PUBLIC_API_BASE is correct');
          console.error('\n🛠️  Quick fix:');
          console.error('   1. Navigate to server directory: cd server');
          console.error('   2. Install dependencies: npm install');
          console.error('   3. Start server: npm run dev');
          console.error('   4. Server should be running on http://localhost:3001');
        }
        throw networkError;
      }
      throw error as Error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(createApiUrl(endpoint));

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(url.pathname + url.search, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = createApiUrl(endpoint);

    const config: RequestInit = {
      method: 'POST',
      body: formData,
      headers: {
        ...this.defaultHeaders,
      },
    };

    delete (config.headers as any)['Content-Type'];

    if (__DEV__) {
      console.log(`📁 File Upload: POST ${url}`);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const error = new ApiClientError(String(data?.message || 'Upload failed'), response.status, data?.code, data);
        if (__DEV__) {
          console.error('❌ Upload Error:', { message: error.message, status: error.status, code: error.code });
        }
        throw error;
      }

      if (__DEV__) {
        console.log('✅ Upload Success:', response.status);
      }
      return data as T;
    } catch (error: unknown) {
      if (error instanceof TypeError) {
        const networkError = new ApiClientError('Network error during upload', 0, 'NETWORK_ERROR', error);
        if (__DEV__) {
          console.error('🌐 Upload Network Error:', { message: networkError.message });
        }
        throw networkError;
      }
      throw error as Error;
    }
  }

  async healthCheck(): Promise<any> {
    try {
      return await this.get('/health');
    } catch (error) {
      console.warn('Health check failed:', error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
