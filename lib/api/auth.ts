import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  language?: string;
}

export interface AuthResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    language: string;
  };
  token: string;
  refreshToken: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export const authApi = {
  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.login,
      credentials
    );
    
    // Set auth token for future requests
    if (response.token) {
      apiClient.setAuthToken(response.token);
    }
    
    return response;
  },

  // Register new user
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.signup,
      userData
    );
    
    // Set auth token for future requests
    if (response.token) {
      apiClient.setAuthToken(response.token);
    }
    
    return response;
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.logout);
    } finally {
      // Always clear token, even if request fails
      apiClient.setAuthToken(null);
    }
  },

  // Refresh auth token
  async refresh(refreshData: RefreshRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.refresh,
      refreshData
    );
    
    // Update auth token
    if (response.token) {
      apiClient.setAuthToken(response.token);
    }
    
    return response;
  },

  // Set auth token (for when loading from storage)
  setAuthToken(token: string | null) {
    apiClient.setAuthToken(token);
  },
};