// axios instance + JWT interceptors

import axios from 'axios';

export const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URL });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Optionally trigger logout
      localStorage.removeItem('token');
    }
    return Promise.reject(err);
  }
);
