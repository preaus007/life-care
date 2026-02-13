import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({

    user : null,
    isAuthenticated : false,
    error : null,
    isLoading : false,
    isCheckingAuth : true,

    signup: async( name, email, password ) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, {
                name,
                email,
                password
            });

            set({user: response.data.user, error: null, isLoading: false });
            return { success: true };

        } catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            return { success: false, error: error.response?.data?.message || 'Error signing up' };
        }
    },

    verifyEmail: async( code ) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/auth/verify-email`, { code });
            set({ user: response.data.user, isAuthenticated: true, error: null, isLoading: false });
            return { success: true };
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            return { success: false, error: error.response?.data?.message || 'Invalid verification code' };
        }
    },

    login: async( email, password ) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });
            set({ user: response.data.user, isAuthenticated: true, error: null, isLoading: false });
            return { success: true };
        } catch (error) {
            set({ error: error.response.data.message || "Error logging in", isLoading: false });
            return { success: false, error: error.response?.data?.message || 'Error logging in' };
        }
    }

}));