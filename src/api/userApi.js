// src/api/userApi.js
import apiClient from './axios'

export const userApi = {
  // Lấy danh sách toàn bộ người dùng (Admin)
  getAll: () => apiClient.get('/User'),
  // Khóa hoặc mở khóa tài khoản người dùng (Admin)
  toggleStatus: (id) => apiClient.put(`/User/${id}/toggle-status`)
}
