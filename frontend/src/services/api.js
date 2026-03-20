import axios from 'axios';

const api = axios.create({
  baseURL: `http://${window.location.hostname}:8000`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public
export const criarAnalise = (data) => api.post('/api/analise/', data);
export const getTabelaVerdade = () => api.get('/api/tabela-verdade/');

// Admin
export const adminLogin = (data) => api.post('/api/admin/login/', data);
export const adminLogout = () => api.post('/api/admin/logout/');
export const adminCheck = () => api.get('/api/admin/check/');
export const adminDashboard = () => api.get('/api/admin/dashboard/');
export const adminAnalises = (params) => api.get('/api/admin/analises/', { params });
export const adminLogs = (params) => api.get('/api/admin/logs/', { params });
export const adminStats = () => api.get('/api/admin/stats/');

export default api;
