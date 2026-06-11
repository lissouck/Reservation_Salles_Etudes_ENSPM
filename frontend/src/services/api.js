// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Erreur inattendue.';
        return Promise.reject(new Error(message));
    }
);

export const getRooms = () => api.get('/rooms');
export const getRoomById = (id) => api.get(`/rooms/${id}`);
export const createRoom = (data) => api.post('/rooms', data);

export const getBookingsByRoom = (roomId, date) => {
    const params = date ? { date } : {};
    return api.get(`/rooms/${roomId}/bookings`, { params });
};

export const createBooking = (data) => api.post('/bookings', data);
export const getTodayBookings = () => api.get('/bookings/today');

export default api;