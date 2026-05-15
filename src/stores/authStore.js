// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/authApi'

export const useAuthStore = defineStore('auth', () => {
  // ---- STATE ----
  const token = ref(localStorage.getItem('auth_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))

  // ---- GETTERS ----
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 1 || user.value?.role === 'Admin')
  const displayName = computed(() => user.value?.fullName || user.value?.email || 'Người dùng')

  // ---- ACTIONS ----
  // Xử lý logic đăng nhập, lưu trữ token và thông tin người dùng vào LocalStorage
  async function login(credentials) {
    try {
      const res = await authApi.login(credentials)
      // Axios interceptor trả về thẳng data body của C# (bao gồm { message, data })
      if (res && res.data && res.data.accessToken) {
        const tokenString = res.data.accessToken
        const userData = {
          email: res.data.email,
          fullName: res.data.fullName,
          role: res.data.roleId // C# AuthResponse trả về roleId
        }
        token.value = tokenString
        user.value = userData
        localStorage.setItem('auth_token', tokenString)
        localStorage.setItem('auth_user', JSON.stringify(userData))
        
        return { success: true, message: res.message || 'Đăng nhập thành công' }
      }
      return { success: false, message: 'Dữ liệu phản hồi không hợp lệ.' }
    } catch (err) {
      return { success: false, message: err.message || 'Lỗi đăng nhập.' }
    }
  }

  // Gọi API đăng ký tài khoản mới
  async function register(userData) {
    return await authApi.register(userData)
  }

  // Đăng xuất: Xóa thông tin xác thực khỏi bộ nhớ và LocalStorage
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  return { token, user, isLoggedIn, isAdmin, displayName, login, register, logout }
})
