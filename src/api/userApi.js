// src/api/userApi.js
import apiClient from './axios'

export const userApi = {
  getAll: () => apiClient.get('/User'),
  toggleStatus: (id) => apiClient.put(`/User/${id}/toggle-status`)
}
