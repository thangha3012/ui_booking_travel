// src/api/bookingApi.js
import apiClient from './axios'

export const bookingApi = {
  create: (data) => apiClient.post('/Booking/create', data),
  getById: (id) => apiClient.get(`/Booking/${id}`),
  getMyBookings: () => apiClient.get('/Booking/my'),
  getAll: () => apiClient.get('/Booking'),
  updateStatus: (id, status) => apiClient.put(`/Booking/${id}/status`, { status }),
  cancel: (id) => apiClient.put(`/Booking/${id}/cancel`),
}
