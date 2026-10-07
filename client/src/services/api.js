import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Dashboard
export const getDashboardStats = () => API.get('/dashboard/stats');

// Guests
export const getGuests = (search = '') => API.get(`/guests?search=${search}`);
export const getGuest = (id) => API.get(`/guests/${id}`);
export const createGuest = (data) => API.post('/guests', data);
export const updateGuest = (id, data) => API.put(`/guests/${id}`, data);
export const deleteGuest = (id) => API.delete(`/guests/${id}`);

// Rooms
export const getRooms = (params = {}) => API.get('/rooms', { params });
export const getRoom = (id) => API.get(`/rooms/${id}`);
export const createRoom = (data) => API.post('/rooms', data);
export const updateRoom = (id, data) => API.put(`/rooms/${id}`, data);
export const deleteRoom = (id) => API.delete(`/rooms/${id}`);

// Reservations
export const getReservations = (params = {}) => API.get('/reservations', { params });
export const getReservation = (id) => API.get(`/reservations/${id}`);
export const createReservation = (data) => API.post('/reservations', data);
export const updateReservation = (id, data) => API.put(`/reservations/${id}`, data);
export const deleteReservation = (id) => API.delete(`/reservations/${id}`);

// Restaurant
export const getFoods = (params = {}) => API.get('/restaurant/foods', { params });
export const createFood = (data) => API.post('/restaurant/foods', data);
export const updateFood = (id, data) => API.put(`/restaurant/foods/${id}`, data);
export const deleteFood = (id) => API.delete(`/restaurant/foods/${id}`);
export const getOrders = () => API.get('/restaurant/orders');
export const createOrder = (data) => API.post('/restaurant/orders', data);
export const updateOrder = (id, data) => API.put(`/restaurant/orders/${id}`, data);

// Housekeeping
export const getHousekeeping = () => API.get('/housekeeping');
export const createHousekeeping = (data) => API.post('/housekeeping', data);
export const updateHousekeeping = (id, data) => API.put(`/housekeeping/${id}`, data);

// Parking
export const getParking = () => API.get('/parking');
export const createParking = (data) => API.post('/parking', data);
export const updateParking = (id, data) => API.put(`/parking/${id}`, data);
export const deleteParking = (id) => API.delete(`/parking/${id}`);

// Messages
export const getMessages = (params = {}) => API.get('/messages', { params });
export const createMessage = (data) => API.post('/messages', data);

export default API;
