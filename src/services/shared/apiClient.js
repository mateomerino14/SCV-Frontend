import axios from 'axios';
import {getToken, setToken, clearToken} from './tokenStore';

const baseUrl = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let waitingQueue = [];

const processQueue = (error, token = null) => {
  waitingQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    }
    else {
      promise.resolve(token);
    }
  });
  waitingQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.error || '';
    const isLoginRoute = originalRequest.url?.includes('/auth') &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/send-code') &&
      !originalRequest.url?.includes('/auth/verify-code');
    if (isLoginRoute) {
      return Promise.reject(error);
    }
    const isTokenExpired = status === 401 && message === 'Token expirado';
    const isTokenInvalid = status === 401 && message.includes('Token inválido');
    const isSuspended = status === 401 && (message.includes('suspendida') || message.includes('Usuario no válido'));
    const isNoToken = status === 401 && message.includes('token no proporcionado');
    const isRefreshRoute = originalRequest.url?.includes('/auth/refresh');
    if (isRefreshRoute || isSuspended || isNoToken || isTokenInvalid) {
      clearToken();
      window.dispatchEvent(new CustomEvent('session-expired'));
      return Promise.reject(error);
    }
    if (isTokenExpired && !originalRequest._retried) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          waitingQueue.push({resolve, reject});
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch((queueError) => Promise.reject(queueError));
      }
      originalRequest._retried = true;
      isRefreshing = true;
      try {
        const response = await axios.post(`${baseUrl}/auth/refresh`, {}, {withCredentials: true});
        const newToken = response.data.token;
        setToken(newToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        window.dispatchEvent(new CustomEvent('token-refreshed'));
        return apiClient(originalRequest);
      }
      catch (refreshError) {
        processQueue(refreshError, null);
        clearToken();
        window.dispatchEvent(new CustomEvent('session-expired'));
        return Promise.reject(refreshError);
      }
      finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;