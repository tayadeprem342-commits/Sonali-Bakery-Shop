import axios from 'axios';

// base URL points to our backend
const api = axios.create({
  baseURL: '/api',
});

// attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// redirect to login if token expires
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ── Menu ──────────────────────────────────────
export const fetchMenu = () => api.get('/menu');
export const addMenuItem = (data) => api.post('/menu', data);
export const updateMenuItem = (id, data) => api.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => api.delete(`/menu/${id}`);
export const toggleItemAvailability = (id) => api.patch(`/menu/${id}/toggle`);

// ── Orders ────────────────────────────────────
export const placeOrder = (data) => api.post('/orders', data);
export const fetchOrders = () => api.get('/orders');
export const fetchOrderById = (orderId) => api.get(`/orders/${orderId}`);
export const acceptOrder = (id) => api.put(`/orders/${id}/accept`);
export const cancelOrder = (id) => api.put(`/orders/${id}/cancel`);
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
export const clearAllOrders = () => api.delete('/orders/clear');

// ── Admin ─────────────────────────────────────
export const loginAdmin = (data) => api.post('/admin/login', data);

export default api;
