import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export interface HealthStatus {
  ok: boolean;
  env: string;
  timestamp: string;
  uptime: number;
  responseTime: string;
  database: {
    status: string;
    latency: string;
  };
  services: {
    ai: string[];
    cors: string;
    rateLimit: string;
  };
  memory: {
    used: string;
    total: string;
  };
  version: string;
}

export interface ReadinessStatus {
  ready: boolean;
  timestamp: string;
  checks: {
    database: string;
    environment: string;
  };
}

export interface PingResponse {
  pong: boolean;
  timestamp: string;
}

export const healthApi = {
  // Check server health
  async getHealth(): Promise<HealthStatus> {
    return apiClient.get<HealthStatus>(API_ENDPOINTS.health);
  },

  // Check server readiness
  async getReadiness(): Promise<ReadinessStatus> {
    return apiClient.get<ReadinessStatus>(API_ENDPOINTS.ready);
  },

  // Simple ping with timeout
  async ping(timeoutMs: number = 3000): Promise<PingResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      // Create a race between the request and timeout
      const requestPromise = apiClient.get<PingResponse>(API_ENDPOINTS.ping);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
      });
      
      const result = await Promise.race([requestPromise, timeoutPromise]);
      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },

  // Test connection with timeout
  async testConnection(timeoutMs: number = 5000): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      await fetch(apiClient['baseURL'] + API_ENDPOINTS.ping, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      console.warn('Connection test failed:', error);
      return false;
    }
  },
};