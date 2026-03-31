// src/api/axios.js
// =============================================
// AXIOS INSTANCE — Cấu hình trung tâm HTTP Client
// =============================================
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001/api'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ---- REQUEST INTERCEPTOR: Tự động gắn Token ----
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ---- RESPONSE INTERCEPTOR: Xử lý lỗi tập trung ----
apiClient.interceptors.response.use(
  (response) => response.data, // Tự động unwrap data
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.'

    if (status === 401) {
      // Token hết hạn — xóa token và về trang đăng nhập
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/login'
    }

    return Promise.reject({ status, message })
  },
)

export default apiClient
