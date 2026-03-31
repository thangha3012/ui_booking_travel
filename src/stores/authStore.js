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
  async function login(credentials) {
    const res = await authApi.login(credentials)
    if (res.success) {
      token.value = res.data.token
      user.value = res.data.user
      localStorage.setItem('auth_token', res.data.token)
      localStorage.setItem('auth_user', JSON.stringify(res.data.user))
    }
    return res
  }

  async function register(userData) {
    return await authApi.register(userData)
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  return { token, user, isLoggedIn, isAdmin, displayName, login, register, logout }
})
