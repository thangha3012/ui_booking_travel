// src/api/bookingApi.js
import apiClient from './axios'

export const bookingApi = {
  // Tạo đơn đặt tour mới
  create: (data) => apiClient.post('/Booking/create', data),
  // Lấy chi tiết đơn đặt tour theo ID
  getById: (id) => apiClient.get(`/Booking/${id}`),
  // Lấy danh sách đơn đặt tour của tôi
  getMyBookings: () => apiClient.get('/Booking/my'),
  // Lấy danh sách toàn bộ đơn đặt tour (Admin)
  getAll: () => apiClient.get('/Booking'),
  // Cập nhật trạng thái đơn hàng (Admin)
  updateStatus: (id, status) => apiClient.put(`/Booking/${id}/status`, { status }),
  // Hủy đơn đặt tour
  cancel: (id) => apiClient.put(`/Booking/${id}/cancel`),
  // Lấy danh sách khách đi tour (Admin)
  getTourParticipants: () => apiClient.get('/Booking/participants'),
}
