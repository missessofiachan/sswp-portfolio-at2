// axios instance + JWT interceptors

import axios from 'axios';

// Default to relative "/api/v1" so Vite dev proxy can forward to the server.
// You can override with VITE_API_URL (e.g., VITE_API_URL=http://localhost:4000/api/v1) for production.
const baseURL = import.meta.env.VITE_API_URL ?? '/api/v1';
const LOGIN_ROUTE = '/login'; // Make login route configurable here
export const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Token likely expired/invalid -> clear and redirect to login
      try {
        localStorage.removeItem('token');
      } catch (error) {
        console.error('Error removing token from localStorage:', error);
      }
      if (typeof window !== 'undefined') {
        window.location.href = LOGIN_ROUTE;
      }
    }
    return Promise.reject(err);
  }
);
