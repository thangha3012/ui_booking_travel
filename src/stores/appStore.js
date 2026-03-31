// src/stores/appStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const locale = ref(localStorage.getItem('app_locale') || 'vi')

  function setLocale(lang) {
    locale.value = lang
    localStorage.setItem('app_locale', lang)
  }

  return { locale, setLocale }
})
