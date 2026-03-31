// src/api/destinationApi.js
import apiClient from './axios'

export const destinationApi = {
  getAll: () => apiClient.get('/Destination'),
  getById: (id) => apiClient.get(`/Destination/${id}`),
  create: (data) => apiClient.post('/Destination', data),
  update: (id, data) => apiClient.put(`/Destination/${id}`, data),
  delete: (id) => apiClient.delete(`/Destination/${id}`),
}

// src/api/categoryApi.js
export const categoryApi = {
  getAll: () => apiClient.get('/Category'),
}
