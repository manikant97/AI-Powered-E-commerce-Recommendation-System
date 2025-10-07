import axios from 'axios';

// Base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle global errors and token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.error || error?.message || 'An error occurred';
    
    // Handle token expiration/invalid token
    if ((status === 401 || status === 403) && 
        (message.includes('Invalid token') || message.includes('Missing token') || message.includes('Token expired'))) {
      localStorage.removeItem('token');
      // Avoid infinite loops if already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
        data: null
      });
    }
    
    // Handle server errors
    if (status >= 500) {
      console.error('Server error:', error.response.data);
      return Promise.reject({
        message: 'Server error. Please try again later.',
        status,
        data: error.response.data
      });
    }
    
    // Handle client errors
    if (status >= 400) {
      console.error('Client error:', error.response.data);
      return Promise.reject({
        message: message || 'Request failed',
        status,
        data: error.response.data
      });
    }
    
    return Promise.reject(error);
  }
);

// Set default authorization header if token exists at startup
const existingToken = localStorage.getItem('token');
if (existingToken) {
  api.defaults.headers.common.Authorization = `Bearer ${existingToken}`;
}

// API service methods
export const apiService = {
  // Generic HTTP methods
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),

  // Auth endpoints
  auth: {
    login: (credentials) => api.post('/api/auth/login', credentials),
    register: (userData) => api.post('/api/auth/register', userData),
    logout: () => {
      localStorage.removeItem('token');
      delete api.defaults.headers.common.Authorization;
    },
    refreshToken: () => api.post('/api/auth/refresh'),
  },

  // Product endpoints
  products: {
    getAll: (params = {}) => api.get('/api/products', { params }),
    getById: (id) => api.get(`/api/products/${id}`),
    create: (productData) => api.post('/api/products', productData),
    update: (id, productData) => api.put(`/api/products/${id}`, productData),
    delete: (id) => api.delete(`/api/products/${id}`),
    search: (query, params = {}) => api.get('/api/products/search', { 
      params: { q: query, ...params } 
    }),
    getByCategory: (category, params = {}) => api.get(`/api/products/category/${category}`, { params }),
  },

  // Order endpoints
  orders: {
    getAll: () => api.get('/api/orders'),
    getById: (id) => api.get(`/api/orders/${id}`),
    create: (orderData) => api.post('/api/orders', orderData),
    update: (id, orderData) => api.put(`/api/orders/${id}`, orderData),
    cancel: (id) => api.patch(`/api/orders/${id}/cancel`),
  },

  // User/Profile endpoints
  profile: {
    get: () => api.get('/api/profile'),
    update: (profileData) => api.put('/api/profile', profileData),
    changePassword: (passwordData) => api.post('/api/profile/change-password', passwordData),
  },

  // Wishlist endpoints
  wishlist: {
    getAll: () => api.get('/api/wishlist'),
    add: (productId) => api.post('/api/wishlist', { productId }),
    remove: (productId) => api.delete(`/api/wishlist/${productId}`),
  },

  // Cart endpoints
  cart: {
    get: () => api.get('/api/cart'),
    addItem: (itemData) => api.post('/api/cart/items', itemData),
    updateItem: (itemId, quantity) => api.put(`/api/cart/items/${itemId}`, { quantity }),
    removeItem: (itemId) => api.delete(`/api/cart/items/${itemId}`),
    clear: () => api.delete('/api/cart'),
  },
};

// Export the axios instance for custom requests
export default api;

// Export individual methods for convenience
export const { get, post, put, patch, delete: del } = apiService;
