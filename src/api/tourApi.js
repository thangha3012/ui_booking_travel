// src/api/tourApi.js
import apiClient from './axios'

export const tourApi = {
  getAll: (params) => apiClient.get('/Tour', { params }),
  getById: (id) => apiClient.get(`/Tour/${id}`),
  create: (data) => apiClient.post('/Tour', data),
  update: (id, data) => apiClient.put(`/Tour/${id}`, data),
  delete: (id) => apiClient.delete(`/Tour/${id}`),
  addSchedule: (tourId, data) => apiClient.post(`/Tour/${tourId}/schedules`, data),
  removeSchedule: (scheduleId) => apiClient.delete(`/Tour/schedules/${scheduleId}`),
}
