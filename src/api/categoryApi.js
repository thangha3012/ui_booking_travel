// src/api/categoryApi.js
import apiClient from './axios'

export const categoryApi = {
  getAll: () => apiClient.get('/Category'),
  getById: (id) => apiClient.get(`/Category/${id}`),
  create: (data) => apiClient.post('/Category', data),
  update: (id, data) => apiClient.put(`/Category/${id}`, data),
  delete: (id) => apiClient.delete(`/Category/${id}`),
}
