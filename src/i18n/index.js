// src/i18n/index.js
import { createI18n } from 'vue-i18n'
import vi from './vi.json'
import en from './en.json'

const savedLocale = localStorage.getItem('app_locale') || 'vi'

const i18n = createI18n({
  legacy: false,      // Dùng Composition API mode
  locale: savedLocale,
  fallbackLocale: 'vi',
  messages: { vi, en },
})

export default i18n
