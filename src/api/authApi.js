// src/api/authApi.js
import apiClient from './axios'

export const authApi = {
  // Gửi thông tin đăng nhập
  login: (data) => apiClient.post('/Auth/login', data),
  // Đăng ký tài khoản mới
  register: (data) => apiClient.post('/Auth/register', data),
  // Yêu cầu cấp lại mật khẩu (Gửi OTP)
  forgotPassword: (data) => apiClient.post('/Auth/forgot-password', data),
  // Xác thực mã OTP
  verifyOtp: (data) => apiClient.post('/Auth/verify-otp', data),
  // Đặt lại mật khẩu mới
  resetPassword: (data) => apiClient.post('/Auth/reset-password', data),
}
