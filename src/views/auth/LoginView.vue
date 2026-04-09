<template>
  <div class="auth-page">
    <div class="container auth-container">
      <!-- Breadcrumb Simplified -->
      <nav class="auth-breadcrumb">
        <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
        <i class="pi pi-chevron-right separator"></i>
        <span>{{ t('nav.login') }}</span>
      </nav>

      <div class="auth-card">
        <div class="auth-card__content">
          <div class="auth-card__header">
            <h1 class="auth-title">{{ t('auth.loginTitle') }}</h1>
            <p class="auth-subtitle">{{ t('auth.loginDesc') }}</p>
          </div>

          <form @submit.prevent="handleLogin" class="auth-form">
            <div class="field">
              <label for="email">{{ t('auth.email') }}</label>
              <InputText id="email" type="email" v-model="form.email" :placeholder="t('auth.email')"
                :invalid="!!errors.email" fluid />
              <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
            </div>

            <div class="field">
              <label for="password">{{ t('auth.password') }}</label>
              <Password id="password" v-model="form.password" :placeholder="t('auth.password')"
                :feedback="false" toggleMask :invalid="!!errors.password" inputClass="w-full" fluid />
              <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
            </div>

            <div class="form-options">
              <RouterLink to="/forgot-password" class="forgot-link">{{ t('auth.forgotPassword') }}</RouterLink>
            </div>

            <Button type="submit" :label="t('auth.loginBtn')" :loading="loading" icon="pi pi-sign-in" raised class="w-full login-btn" />
          </form>

          <div class="auth-footer">
            <p>
              {{ t('auth.noAccount') }}
              <RouterLink to="/register" class="signup-link">{{ t('nav.register') }}</RouterLink>
            </p>
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
      router.push(redirect)
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

.auth-page {
  background-color: #f8fafc;
  min-height: calc(100vh - #{$navbar-height});
  display: flex;
  flex-direction: column;
  padding: $space-16 0 $space-24;
}

.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-6;
}

.auth-breadcrumb {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: 14px;
  color: $color-text-secondary;
  
  a {
    color: inherit;
    text-decoration: none;
    &:hover { color: $color-primary; }
  }
  
  .separator {
    font-size: 10px;
    opacity: 0.5;
  }
  
  span {
    color: $color-primary;
    font-weight: 600;
  }
}

.auth-card {
  background: white;
  border-radius: $border-radius-xl;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 450px;
  overflow: hidden;
  border: 1px solid #f1f5f9;

  &__content {
    padding: $space-10 $space-8;
    @include md { padding: $space-12 $space-12; }
  }

  &__header {
    text-align: center;
    margin-bottom: $space-10;
  }
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: $color-text-primary;
  margin-bottom: $space-2;
  letter-spacing: -0.02em;
}

.auth-subtitle {
  font-size: 0.95rem;
  color: $color-text-secondary;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.field {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  
  label {
    font-size: 13px;
    font-weight: 600;
    color: $color-text-primary;
  }
}

.form-options {
  display: flex;
  justify-content: flex-end;
  margin-top: -$space-2;
}

.forgot-link {
  font-size: 13px;
  color: $color-text-secondary;
  text-decoration: none;
  &:hover { color: $color-primary; text-decoration: underline; }
}

.login-btn {
  padding: 0.75rem !important;
  font-weight: 700 !important;
  border-radius: $border-radius-lg !important;
}

.auth-footer {
  margin-top: $space-8;
  text-align: center;
  font-size: 14px;
  color: $color-text-secondary;
  
  .signup-link {
    color: $color-accent;
    font-weight: 700;
    margin-left: 4px;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
}

:deep(.p-password) { width: 100%; }
.p-error { font-size: 12px; margin-top: 2px; }
</style>
