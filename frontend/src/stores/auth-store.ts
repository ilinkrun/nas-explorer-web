import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, type LoginResponse } from '@/lib/api';

interface AuthState {
  isAuthenticated: boolean;
  user: LoginResponse['user'] | null;
  token: string | null;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: async (username: string, password: string, rememberMe = false) => {
        try {
          const response = await apiClient.login({ username, password, rememberMe });
          
          if (response.success && response.data) {
            const { token, user } = response.data;
            
            apiClient.setToken(token);
            
            set({
              isAuthenticated: true,
              user,
              token,
            });
          } else {
            throw new Error(response.error?.message || 'Login failed');
          }
        } catch (error) {
          throw error;
        }
      },

      logout: async () => {
        try {
          await apiClient.logout();
        } catch (error) {
          // Continue with logout even if API call fails
          console.warn('Logout API call failed:', error);
        } finally {
          apiClient.removeToken();
          set({
            isAuthenticated: false,
            user: null,
            token: null,
          });
        }
      },

      checkAuth: async () => {
        const { token } = get();
        
        if (!token) {
          return;
        }

        try {
          const response = await apiClient.getMe();
          
          if (response.success && response.data) {
            set({
              isAuthenticated: true,
              user: response.data,
            });
          } else {
            // Token is invalid
            get().logout();
          }
        } catch (error) {
          console.warn('Auth check failed:', error);
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);