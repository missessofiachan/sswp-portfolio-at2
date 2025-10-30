// axios instance + JWT interceptors

import axios from 'axios';
import { showToast } from './toast';

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
    const enhanced = normalizeAxiosError(err);

    // If unauthorized, clear token and redirect to login page
    if (enhanced.status === 401) {
      try {
        localStorage.removeItem('token');
        // Store a flag to show "session expired" message
        const currentPath = window.location.pathname;
        // Don't set expired flag if we're already on login/register
        if (currentPath !== LOGIN_ROUTE && currentPath !== '/register') {
          sessionStorage.setItem('sessionExpired', 'true');
          sessionStorage.setItem('returnTo', currentPath);
        }
      } catch (error) {
        console.error('Error handling session expiration:', error);
      }
      if (typeof window !== 'undefined' && window.location.pathname !== LOGIN_ROUTE) {
        window.location.href = LOGIN_ROUTE;
      }
    }

    // Show global toast for network/server errors (but not for expected client errors)
    if (enhanced.status && enhanced.status >= 500) {
      showToast('Server error. Please try again later.', { type: 'error', duration: 4000 });
    } else if (!enhanced.status && err.code === 'ERR_NETWORK') {
      showToast('Network error. Please check your connection.', { type: 'error', duration: 4000 });
    }

    return Promise.reject(enhanced);
  }
);

// Exported for tests and components that need consistent error shapes
export function normalizeAxiosError(err: any) {
  const status = err?.response?.status;
  const data = err?.response?.data;
  const message = data?.error?.message || data?.message || err?.message || 'Request failed';
  const enhanced: any = new Error(message);
  enhanced.status = status;
  enhanced.details = data?.error?.details ?? data?.errors ?? data;
  enhanced.indexUrl = data?.error?.indexUrl ?? data?.indexUrl;
  enhanced.response = err?.response;
  return enhanced;
}
