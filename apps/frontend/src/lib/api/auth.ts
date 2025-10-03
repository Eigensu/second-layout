import apiClient from './client';
import type { LoginCredentials, RegisterCredentials, AuthTokens, User } from '@/types/auth';

export const authApi = {
  /**
   * Register a new user
   */
  register: async (credentials: RegisterCredentials): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>('/api/auth/register', credentials);
    return response.data;
  },

  /**
   * Login with username and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>('/api/auth/login', credentials);
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>(
      '/api/auth/refresh',
      null,
      {
        params: { refresh_token: refreshToken }
      }
    );
    return response.data;
  },

  /**
   * Logout and revoke refresh token
   */
  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/api/auth/logout', null, {
      params: { refresh_token: refreshToken }
    });
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/users/me');
    return response.data;
  },

  /**
   * Update current user profile
   */
  updateProfile: async (data: { full_name?: string; avatar_url?: string }): Promise<User> => {
    const response = await apiClient.put<User>('/api/users/me', null, {
      params: data
    });
    return response.data;
  },
};
