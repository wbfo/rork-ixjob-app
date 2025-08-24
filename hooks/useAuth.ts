import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { authApi, healthApi, type ApiError } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  language: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isConnected: boolean;
  user: User | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    isConnected: false,
    user: null,
  });

  useEffect(() => {
    checkAuthStatus();
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      // Use a shorter timeout and more graceful handling
      await healthApi.ping(2000);
      
      setAuthState(prev => ({ ...prev, isConnected: true }));
      console.log('✅ Backend server connected');
    } catch (error) {
      setAuthState(prev => ({ ...prev, isConnected: false }));
      
      // Only log in development, and make it less alarming
      if (__DEV__) {
        console.log('📱 Running in offline mode - backend server not available');
        console.log('   This is normal for development. The app will work with mock data.');
      }
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        // Set token for API client
        authApi.setAuthToken(token);
        
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          user,
        }));
      } else {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: false,
          isLoading: false,
          user: null,
        }));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
        user: null,
      }));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      if (authState.isConnected) {
        // Use backend API
        const response = await authApi.login({ email, password });
        
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          avatar: response.user.avatar || null,
          language: response.user.language
        };
        
        await AsyncStorage.setItem('auth_token', response.token);
        await AsyncStorage.setItem('user_data', JSON.stringify(user));
        await AsyncStorage.setItem('refresh_token', response.refreshToken);
        
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          user,
        }));
        
        return { success: true };
      } else {
        // Fallback to mock login for offline development
        console.log('📱 Using offline mode for login');
        
        const mockUser: User = {
          id: '1',
          email,
          name: email.split('@')[0],
          avatar: null,
          language: 'en'
        };
        
        await AsyncStorage.setItem('auth_token', 'mock_token_123');
        await AsyncStorage.setItem('user_data', JSON.stringify(mockUser));
        
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          user: mockUser,
        }));
        
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as ApiError).message;
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      if (authState.isConnected) {
        // Use backend API
        const response = await authApi.signup({ name, email, password });
        
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          avatar: response.user.avatar || null,
          language: response.user.language
        };
        
        await AsyncStorage.setItem('auth_token', response.token);
        await AsyncStorage.setItem('user_data', JSON.stringify(user));
        await AsyncStorage.setItem('refresh_token', response.refreshToken);
        
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          user,
        }));
        
        return { success: true };
      } else {
        // Fallback to mock signup for offline development
        console.log('📱 Using offline mode for signup');
        
        const mockUser: User = {
          id: '1',
          email,
          name,
          avatar: null,
          language: 'en'
        };
        
        await AsyncStorage.setItem('auth_token', 'mock_token_123');
        await AsyncStorage.setItem('user_data', JSON.stringify(mockUser));
        
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          user: mockUser,
        }));
        
        return { success: true };
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Signup failed';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as ApiError).message;
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      if (authState.isConnected) {
        // Call backend logout
        await authApi.logout();
      }
      
      // Clear local storage
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      await AsyncStorage.removeItem('refresh_token');
      
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
      }));
      
      router.replace('/welcome');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if backend call fails
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      await AsyncStorage.removeItem('refresh_token');
      
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
      }));
      
      router.replace('/welcome');
    }
  };

  return {
    ...authState,
    login,
    signup,
    logout,
    checkAuthStatus,
    checkServerConnection,
  };
}