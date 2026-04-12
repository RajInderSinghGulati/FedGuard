import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchAlerts = () => api.get('/alerts');
export const fetchStats = () => api.get('/stats');
export const fetchClients = () => api.get('/clients');
export const sendPrediction = (clientId, features) =>
  api.post('/predict', { clientId, features });

export default api;