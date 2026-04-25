import axios from 'axios';

import { AUTH_INVALIDATED_EVENT, clearAuthSession, setAuthNotice } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = String(error.config?.url || '');
    const authHeader = error.config?.headers?.Authorization;
    const hadAuthenticatedRequest = Boolean(authHeader);
    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register-company') ||
      requestUrl.includes('/auth/signup');

    if (status === 401 && hadAuthenticatedRequest && !isAuthEndpoint) {
      clearAuthSession();
      setAuthNotice('Votre session a expire. Reconnectez-vous pour continuer.');
      window.dispatchEvent(new Event(AUTH_INVALIDATED_EVENT));
    }

    return Promise.reject(error);
  }
);

export default api;
