import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, AuthStore, RegisterData, ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await axios.post<ApiResponse<{ user: User; token: string }>>(
            `${API_URL}/api/auth/login`,
            { email, password },
            { withCredentials: true }
          );

          if (response.data.success) {
            const { user, token } = response.data.data;
            
            // Set token in axios default headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Store token in localStorage
            localStorage.setItem('token', token);
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
            
            toast.success(`Welcome back, ${user.firstName}!`);
          }
        } catch (error: any) {
          const message = error.response?.data?.message || 'Login failed';
          toast.error(message);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true });
        try {
          const response = await axios.post<ApiResponse<{ user: User; token: string }>>(
            `${API_URL}/api/auth/register`,
            userData,
            { withCredentials: true }
          );

          if (response.data.success) {
            const { user, token } = response.data.data;
            
            // Set token in axios default headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Store token in localStorage
            localStorage.setItem('token', token);
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
            
            toast.success(`Welcome, ${user.firstName}! Your account has been created.`);
          }
        } catch (error: any) {
          const message = error.response?.data?.message || 'Registration failed';
          toast.error(message);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
        } catch (error) {
          console.log('Logout request failed:', error);
        } finally {
          // Clear token from axios headers
          delete axios.defaults.headers.common['Authorization'];
          
          // Remove token from localStorage
          localStorage.removeItem('token');
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
          
          toast.success('Logged out successfully');
        }
      },

      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true });
        try {
          const response = await axios.put<ApiResponse<User>>(
            `${API_URL}/api/auth/profile`,
            userData,
            { withCredentials: true }
          );

          if (response.data.success) {
            const updatedUser = response.data.data;
            
            set({ 
              user: updatedUser, 
              isLoading: false 
            });
            
            toast.success('Profile updated successfully');
          }
        } catch (error: any) {
          const message = error.response?.data?.message || 'Profile update failed';
          toast.error(message);
          set({ isLoading: false });
          throw error;
        }
      },

      // Initialize auth state from token
      initializeAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await axios.get<ApiResponse<User>>(
            `${API_URL}/api/auth/me`,
            { withCredentials: true }
          );

          if (response.data.success) {
            set({ 
              user: response.data.data, 
              isAuthenticated: true 
            });
          }
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          set({ 
            user: null, 
            isAuthenticated: false 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);