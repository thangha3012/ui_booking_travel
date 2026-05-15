// src/api/tourApi.js
import apiClient from './axios'

export const tourApi = {
  // Lấy danh sách tour (có lọc và phân trang)
  getAll: (params) => apiClient.get('/Tour', { params }),
  // Lấy chi tiết tour theo ID
  getById: (id) => apiClient.get(`/Tour/${id}`),
  // Tạo tour mới (Admin)
  create: (data) => apiClient.post('/Tour', data),
  // Cập nhật thông tin tour (Admin)
  update: (id, data) => apiClient.put(`/Tour/${id}`, data),
  // Xóa tour (Admin)
  delete: (id) => apiClient.delete(`/Tour/${id}`),
  // Thêm lịch khởi hành cho tour (Admin)
  addSchedule: (tourId, data) => apiClient.post(`/Tour/${tourId}/schedules`, data),
  // Xóa lịch khởi hành (Admin)
  removeSchedule: (scheduleId) => apiClient.delete(`/Tour/schedules/${scheduleId}`),
}
