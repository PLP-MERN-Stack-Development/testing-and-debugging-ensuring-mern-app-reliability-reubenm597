import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced request logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`, config.params || '');
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, {
      status: response.status,
      data: response.data,
      dataType: typeof response.data,
      isArray: Array.isArray(response.data)
    });
    return response.data;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.response?.data?.error || error.message
    });
    
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Posts API
export const getPosts = (filters = {}) => 
  api.get('/posts', { params: filters });

export const getPost = (id) => 
  api.get(`/posts/${id}`);

export const createPost = (postData) => 
  api.post('/posts', postData);

export const updatePost = (id, updates) => 
  api.put(`/posts/${id}`, updates);

export const deletePost = (id) => 
  api.delete(`/posts/${id}`);

// Auth API
export const login = (email, password) => 
  api.post('/auth/login', { email, password });

export const register = (username, email, password) => 
  api.post('/auth/register', { username, email, password });

export const logout = () => 
  api.post('/auth/logout');

export const getCurrentUser = () => 
  api.get('/auth/me');

export default api;