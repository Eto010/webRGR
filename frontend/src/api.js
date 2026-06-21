import axios from 'axios';

const API_BASE = 'http://192.168.8.1/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Интерсептор: добавляем токен в заголовки
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерсептор: при 401 пробуем обновить токен (упрощённо – просто выходим)
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
