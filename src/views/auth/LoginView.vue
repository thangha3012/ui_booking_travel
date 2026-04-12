<template>
  <div class="auth-wrapper">
    <div class="auth-content">
      <!-- Left Side: Visual/Branding (Same as Register for consistency) -->
      <div class="auth-visual">
        <div class="visual-overlay"></div>
        <div class="visual-content">
          <div class="brand">
             <div class="brand-logo">
               <i class="pi pi-compass"></i>
             </div>
             <span class="brand-name">Triptopia</span>
          </div>
          <div class="visual-text">
            <h2 class="quote">"To travel is to live."</h2>
            <p class="author">— Hans Christian Andersen</p>
          </div>
          <div class="visual-features">
            <div class="v-feature">
              <i class="pi pi-check-circle"></i>
              <span>Over 500+ Premium Tours</span>
            </div>
            <div class="v-feature">
              <i class="pi pi-check-circle"></i>
              <span>Best Price Guarantee</span>
            </div>
            <div class="v-feature">
              <i class="pi pi-check-circle"></i>
              <span>24/7 Professional Support</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: Login Form -->
      <div class="auth-form-side">
        <div class="form-scroll-outer">
          <nav class="auth-breadcrumb">
             <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
             <i class="pi pi-chevron-right"></i>
             <span>{{ t('nav.login') }}</span>
          </nav>

          <div class="form-container">
            <div class="form-header">
              <h1>Welcome Back</h1>
              <p>Login to manage your bookings and explore new destinations.</p>
            </div>

            <form @submit.prevent="handleLogin" class="auth-form">
              <div class="field">
                <label for="email">{{ t('auth.email') }}</label>
                <div class="input-wrapper">
                  <i class="pi pi-envelope input-icon"></i>
                  <InputText id="email" type="email" v-model="form.email" :placeholder="t('auth.email')"
                    :invalid="!!errors.email" fluid />
                </div>
                <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
              </div>

              <div class="field">
                <label for="password">{{ t('auth.password') }}</label>
                <div class="input-wrapper">
                  <i class="pi pi-lock input-icon"></i>
                  <Password id="password" v-model="form.password" :placeholder="t('auth.password')"
                    :feedback="false" toggleMask :invalid="!!errors.password" inputClass="w-full" fluid />
                </div>
                <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
              </div>

              <div class="form-options">
                <div class="flex items-center gap-2">
                   <!-- Keep it simple, but could add "Remember me" here -->
                </div>
                <RouterLink to="/forgot-password" class="forgot-link">{{ t('auth.forgotPassword') }}</RouterLink>
              </div>

              <Button type="submit" :label="t('auth.loginBtn')" :loading="loading" raised class="submit-btn" />
            </form>

            <div class="auth-alt">
              <div class="divider">
                <span>Or login with</span>
              </div>
              <div class="social-btns">
                <Button icon="pi pi-google" severity="secondary" outlined class="flex-1" label="Google" />
                <Button icon="pi pi-facebook" severity="secondary" outlined class="flex-1" label="Facebook" />
              </div>
            </div>

            <div class="auth-switch">
              Don't have an account? 
              <RouterLink to="/register">{{ t('nav.register') }}</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'

import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const toast = useToast()

const loading = ref(false)
const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })

function validateForm() {
  errors.email = ''
  errors.password = ''
  let valid = true

  if (!form.email) { errors.email = t('common.required'); valid = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('common.invalidEmail'); valid = false
  }
  if (!form.password) { errors.password = t('common.required'); valid = false }
  return valid
}

async function handleLogin() {
  if (!validateForm()) return
  loading.value = true
  try {
    const res = await auth.login({ email: form.email, password: form.password })
    if (res.success) {
      toast.add({ severity: 'success', summary: t('auth.loginTitle'), detail: t('auth.loginSuccess'), life: 3000 })
      let redirect = route.query.redirect
      if (!redirect) redirect = auth.isAdmin ? '/admin' : '/'
      setTimeout(() => {
        router.push(redirect)
      }, 1000)
    } else {
      toast.add({ severity: 'error', summary: t('common.error'), detail: res.message || t('common.error'), life: 4000 })
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message || t('common.error'), life: 4000 })
  } finally { loading.value = false }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.auth-wrapper {
  min-height: 100vh;
  background: white;
  display: flex;
  align-items: stretch;
}

.auth-content {
  display: flex;
  width: 100%;
}

// Left visual side
.auth-visual {
  display: none;
  @include lg {
    display: block;
    width: 45%;
    position: relative;
    background: url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80') center/cover no-repeat;
  }
}

.visual-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba($color-primary, 0.85), rgba(0, 0, 0, 0.4));
}

.visual-content {
  position: relative;
  z-index: 10;
  height: 100%;
  padding: $space-12;
  display: flex;
  flex-direction: column;
  color: white;

  .brand {
    display: flex;
    align-items: center;
    gap: $space-3;
    margin-bottom: auto;
    
    &-logo {
      width: 44px;
      height: 44px;
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      @include flex-center;
      font-size: 1.5rem;
    }
    &-name {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -1px;
    }
  }

  .visual-text {
    margin-bottom: $space-10;
    .quote {
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: $space-4;
      font-family: 'Outfit', sans-serif;
    }
    .author {
      font-size: 1.1rem;
      opacity: 0.9;
      font-style: italic;
    }
  }

  .visual-features {
    display: flex;
    flex-direction: column;
    gap: $space-4;
    .v-feature {
      display: flex;
      align-items: center;
      gap: $space-3;
      font-weight: 500;
      i { color: #10b981; font-size: 1.2rem; }
    }
  }
}

// Right form side
.auth-form-side {
  width: 100%;
  @include lg { width: 55%; }
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-scroll-outer {
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  padding: $space-8 $space-6;
  @include md { padding: $space-12 $space-8; }
}

.auth-breadcrumb {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: 0.85rem;
  color: $color-text-secondary;
  margin-bottom: $space-8;
  
  a {
    color: inherit;
    &:hover { color: $color-primary; }
  }
  i { font-size: 0.7rem; opacity: 0.5; }
  span { font-weight: 600; color: $color-primary; }
}

.form-header {
  margin-bottom: $space-8;
  h1 {
    font-size: 2.25rem;
    font-weight: 800;
    color: $color-text-primary;
    letter-spacing: -0.02em;
    margin-bottom: $space-2;
  }
  p {
    color: $color-text-secondary;
    font-size: 1.05rem;
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.field {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  
  label {
    font-size: 13px;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.input-wrapper {
  position: relative;
  .input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    color: $color-text-secondary;
    pointer-events: none;
  }
  :deep(.p-inputtext), :deep(.p-password-input) {
    padding-left: 42px !important;
    height: 48px;
    border-radius: 12px;
    border: 1.5px solid #e2e8f0;
    &:focus { border-color: $color-primary; box-shadow: 0 0 0 2px rgba($color-primary-rgb, 0.1); }
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -$space-2;
}

.forgot-link {
  font-size: 14px;
  color: $color-primary;
  font-weight: 600;
  text-decoration: none;
  &:hover { text-decoration: underline; }
}

.submit-btn {
  height: 52px;
  font-size: 1rem !important;
  font-weight: 700 !important;
  border-radius: 14px !important;
  background: $color-primary !important;
  border: none !important;
  margin-top: $space-2;
}

.auth-alt {
  margin-top: $space-8;
  .divider {
    position: relative;
    text-align: center;
    margin-bottom: $space-6;
    &::before {
      content: ''; position: absolute; left: 0; top: 50%; width: 100%; height: 1px; background: #f1f5f9;
    }
    span {
      position: relative; background: white; padding: 0 16px; font-size: 13px; color: #94a3b8; font-weight: 500;
    }
  }
  .social-btns {
    display: flex;
    gap: $space-4;
    button { height: 48px; border-radius: 12px; font-weight: 600; border-color: #e2e8f0; }
  }
}

.auth-switch {
  margin-top: $space-10;
  text-align: center;
  font-size: 1rem;
  color: $color-text-secondary;
  a { color: $color-accent; font-weight: 700; margin-left: 6px; }
}

.p-error { font-size: 12px; margin-top: 4px; font-weight: 500; }
:deep(.p-password) { width: 100%; }
</style>
