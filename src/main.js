import './assets/styles/main.scss'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

// ============================================
// TRIPTOPIA HORIZON — Custom PrimeVue Preset
// Based on Stitch "The Elevated Voyager" Design System
// ============================================
const TripTopiaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#e8f0f8',
      100: '#c5daed',
      200: '#9fc2e0',
      300: '#78a9d3',
      400: '#5b96c9',
      500: '#235789',   // ← Brand Primary
      600: '#1e4c78',
      700: '#1a3a5c',
      800: '#143047',
      900: '#0d1f30',
      950: '#071320'
    },
    colorScheme: {
      light: {
        primary: {
          color: '#235789',
          inverseColor: '#ffffff',
          hoverColor: '#1a3a5c',
          activeColor: '#1e4c78'
        },
        highlight: {
          background: 'rgba(35, 87, 137, 0.08)',
          focusBackground: 'rgba(35, 87, 137, 0.16)',
          color: '#235789',
          focusColor: '#1a3a5c'
        },
        surface: {
          0: '#ffffff',
          50: '#f7f7ff',
          100: '#f1f3f8',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#718096',
          600: '#4a5568',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        }
      }
    }
  },
  components: {
    button: {
      borderRadius: '9999px',
      paddingX: '1.5rem',
      paddingY: '0.75rem',
      sm: { fontSize: '0.8125rem', paddingX: '1rem', paddingY: '0.5rem' },
      lg: { fontSize: '1rem', paddingX: '2rem', paddingY: '0.875rem' }
    },
    card: {
      borderRadius: '16px',
      shadow: '0 4px 16px rgba(26, 32, 44, 0.05)',
      bodyPadding: '1.5rem'
    },
    dialog: {
      borderRadius: '20px',
      shadow: '0 20px 60px rgba(26, 32, 44, 0.12)',
      headerPadding: '1.5rem 1.75rem',
      contentPadding: '0 1.75rem 1.75rem'
    },
    datatable: {
      headerCellBorderWidth: '0',
      bodyCellBorderWidth: '0 0 1px 0',
      rowStripedBackground: 'rgba(241, 243, 248, 0.5)'
    },
    inputtext: {
      borderRadius: '12px',
      paddingX: '0.875rem',
      paddingY: '0.75rem'
    },
    select: {
      borderRadius: '12px'
    },
    tag: {
      borderRadius: '9999px',
      paddingX: '0.75rem',
      paddingY: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: '600'
    },
    toast: {
      borderRadius: '14px',
      shadow: '0 12px 32px rgba(26, 32, 44, 0.12)'
    },
    textarea: {
      borderRadius: '12px'
    },
    divider: {
      borderColor: '#e2e8f0'
    }
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

// PrimeVue 4 — Triptopia Horizon Theme
app.use(PrimeVue, {
  theme: {
    preset: TripTopiaPreset,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark-mode',
      cssLayer: false
    }
  }
})
app.use(ToastService)
app.use(ConfirmationService)
app.directive('tooltip', Tooltip)

app.mount('#app')
