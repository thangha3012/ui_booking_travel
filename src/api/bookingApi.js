// src/api/bookingApi.js
import apiClient from './axios'

export const bookingApi = {
  create: (data) => apiClient.post('/Booking/create', data),
  getMyBookings: () => apiClient.get('/Booking/my'),
}
