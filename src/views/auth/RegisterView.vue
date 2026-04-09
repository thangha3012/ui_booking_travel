<template>
  <div class="auth-page">
    <div class="container auth-container">
      <!-- Breadcrumb Simplified -->
      <nav class="auth-breadcrumb">
        <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
        <i class="pi pi-chevron-right separator"></i>
        <span>{{ t('nav.register') }}</span>
      </nav>

      <div class="auth-card">
        <div class="auth-card__content">
          <div class="auth-card__header">
            <h1 class="auth-title">{{ t('auth.registerTitle') }}</h1>
            <p class="auth-subtitle">{{ t('auth.registerDesc') }}</p>
          </div>

          <form @submit.prevent="handleRegister" class="auth-form">
            <div class="form-grid">
              <!-- Full Name -->
              <div class="field">
                <label for="fullName">{{ t('auth.fullName') }}</label>
                <InputText id="fullName" v-model="form.fullName" :placeholder="t('auth.fullName')"
                  :invalid="!!errors.fullName" fluid />
                <small v-if="errors.fullName" class="p-error">{{ errors.fullName }}</small>
              </div>

              <!-- Email -->
              <div class="field">
                <label for="regEmail">{{ t('auth.email') }}</label>
                <InputText id="regEmail" type="email" v-model="form.email" :placeholder="t('auth.email')"
                  :invalid="!!errors.email" fluid />
                <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
              </div>

              <!-- Phone -->
              <div class="field">
                <label for="phone">{{ t('auth.phone') }}</label>
                <InputText id="phone" v-model="form.phoneNumber" :placeholder="t('auth.phone')"
                  :invalid="!!errors.phoneNumber" fluid />
                <small v-if="errors.phoneNumber" class="p-error">{{ errors.phoneNumber }}</small>
              </div>

              <!-- Password -->
              <div class="field">
                <label for="regPass">{{ t('auth.password') }}</label>
                <Password id="regPass" v-model="form.password" :placeholder="t('auth.password')"
                  toggleMask :invalid="!!errors.password" inputClass="w-full" fluid />
                <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
              </div>

              <!-- Confirm Password -->
              <div class="field full-width">
                <label for="confirmPass">{{ t('auth.confirmPassword') }}</label>
                <Password id="confirmPass" v-model="form.confirmPassword" :placeholder="t('auth.confirmPassword')"
                  :feedback="false" toggleMask :invalid="!!errors.confirmPassword" inputClass="w-full" fluid />
                <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
              </div>
            </div>

            <Button type="submit" :label="t('auth.registerBtn')" :loading="loading" icon="pi pi-user-plus" raised class="w-full register-btn" />
          </form>

          <div class="auth-footer">
            <p>
              {{ t('auth.haveAccount') }}
              <RouterLink to="/login" class="login-link">{{ t('nav.login') }}</RouterLink>
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
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authApi } from '@/api/authApi'

import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()

const loading = ref(false)
const form = reactive({ email: '', password: '', confirmPassword: '', fullName: '', phoneNumber: '' })
const errors = reactive({ email: '', password: '', confirmPassword: '', fullName: '', phoneNumber: '' })

function validateForm() {
  let valid = true
  Object.keys(errors).forEach(k => errors[k] = '')
  if (!form.fullName) { errors.fullName = t('common.required'); valid = false }
  if (!form.phoneNumber) { errors.phoneNumber = t('common.required'); valid = false }
  if (!form.email) { errors.email = t('common.required'); valid = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = t('common.invalidEmail'); valid = false }
  if (!form.password) { errors.password = t('common.required'); valid = false }
  else if (form.password.length < 6) { errors.password = t('auth.min6Chars'); valid = false }
  if (form.password !== form.confirmPassword) { errors.confirmPassword = t('auth.passNotMatch'); valid = false }
  return valid
}

async function handleRegister() {
  if (!validateForm()) return
  loading.value = true
  try {
    const res = await authApi.register({
      email: form.email, password: form.password, ConfirmPassword: form.confirmPassword,
      fullName: form.fullName, phoneNumber: form.phoneNumber
    })
    toast.add({ severity: 'success', summary: t('auth.registerTitle'), detail: t('auth.registerSuccess'), life: 3000 })
    router.push('/login')
  } catch (err) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: err.message || t('common.error'), life: 4000 })
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
  max-width: 500px;
  overflow: hidden;
  border: 1px solid #f1f5f9;

  &__content {
    padding: $space-10 $space-8;
    @include md { padding: $space-12 $space-12; }
  }

  &__header {
    text-align: center;
    margin-bottom: $space-8;
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-4;
  
  @include md {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .full-width {
    grid-column: 1 / -1;
  }
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

.register-btn {
  padding: 0.75rem !important;
  font-weight: 700 !important;
  border-radius: $border-radius-lg !important;
  margin-top: $space-2;
}

.auth-footer {
  margin-top: $space-8;
  text-align: center;
  font-size: 14px;
  color: $color-text-secondary;
  
  .login-link {
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
