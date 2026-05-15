// src/i18n/index.js
import { createI18n } from 'vue-i18n'
import vi from './vi.json'

const i18n = createI18n({
  legacy: false,      // Dùng Composition API mode
  locale: 'vi',
  fallbackLocale: 'vi',
  messages: { vi },
})

export default i18n
