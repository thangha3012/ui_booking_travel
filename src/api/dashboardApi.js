// src/api/dashboardApi.js
import apiClient from './axios'

export const dashboardApi = {
  getStats: () => apiClient.get('/Dashboard/stats')
}
