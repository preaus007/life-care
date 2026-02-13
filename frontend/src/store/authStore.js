import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        name,
        email,
        password
      });

      set({ user: response.data.user, error: null, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error signing up';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/verify-email`, {
        code
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        error: null,
        isLoading: false
      });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Invalid verification code';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        error: null,
        isLoading: false
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error logging in';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/auth/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false
      });
    } catch (error) {
      set({ error: 'Error logging out', isLoading: false });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      const message =
        error.response?.data?.message || 'Error sending reset password email';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/auth/reset-password/${token}`,
        { password }
      );
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      const message =
        error.response?.data?.message || 'Error resetting password';
      set({ isLoading: false, error: message });
      throw error;
    }
  }
}));
