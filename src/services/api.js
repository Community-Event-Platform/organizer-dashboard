import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid - clear storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// ==================== Auth APIs ====================

export const organizerLogin = (credentials) => {
  return api.post('/login', credentials);
};

export const organizerRegister = (userData) => {
  return api.post('/register', userData);
};

// ==================== Dashboard APIs ====================

export const getDashboardStats = () => {
  return api.get('/dashboard-stats');
};

// ==================== Events APIs ====================

export const getOrganizerEvents = () => {
  return api.get('/organizer/events');
};

export const createEvent = (eventData) => {
  return api.post('/events', eventData);
};

export const updateEvent = (id, eventData) => {
  return api.put(`/events/${id}`, eventData);
};

export const deleteEvent = (id) => {
  return api.delete(`/events/${id}`);
};

// ==================== Categories APIs ====================

export const getCategories = () => {
  return api.get('/categories');
};

export const createCategory = (data) => {
  return api.post('/categories', data);
};

export const updateCategory = (id, data) => {
  return api.put(`/categories/${id}`, data);
};

export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};

export default api;
