// src/api/authApi.js
import apiClient from './axios'

export const authApi = {
  login: (data) => apiClient.post('/Auth/login', data),
  register: (data) => apiClient.post('/Auth/register', data),
  forgotPassword: (data) => apiClient.post('/Auth/forgot-password', data),
  verifyOtp: (data) => apiClient.post('/Auth/verify-otp', data),
  resetPassword: (data) => apiClient.post('/Auth/reset-password', data),
}
