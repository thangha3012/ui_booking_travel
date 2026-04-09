<template>
  <div class="auth-page">
    <div class="container auth-container">
      <!-- Breadcrumb Simplified -->
      <nav class="auth-breadcrumb">
        <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
        <i class="pi pi-chevron-right separator"></i>
        <RouterLink to="/login">{{ t('nav.login') }}</RouterLink>
        <i class="pi pi-chevron-right separator"></i>
        <span>{{ t('auth.forgotTitle') }}</span>
      </nav>

      <div class="auth-card">
        <div class="auth-card__content">
          <div class="auth-card__header">
            <h1 class="auth-title" v-if="step === 1">{{ t('auth.forgotTitle') }}</h1>
            <h1 class="auth-title" v-else-if="step === 2">{{ t('auth.verifyIdentity') }}</h1>
            <h1 class="auth-title" v-else>{{ t('auth.newPassword') }}</h1>
            
            <p class="auth-subtitle" v-if="step === 1">{{ t('auth.forgotDesc') }}</p>
            <p class="auth-subtitle" v-else-if="step === 2">{{ t('auth.otpSent') }}: <strong>{{ email }}</strong></p>
            <p class="auth-subtitle" v-else>{{ t('auth.resetPassword') }}</p>
          </div>

          <!-- STEP 1: Enter Email -->
          <form v-if="step === 1" @submit.prevent="sendOtp" class="auth-form">
            <div class="field">
              <label for="email">{{ t('auth.email') }}</label>
              <div class="p-input-icon-left w-full relative">
                <i class="pi pi-envelope absolute z-10 left-3 top-1/2 -translate-y-1/2 opacity-50"></i>
                <InputText id="email" v-model="email" type="email" :placeholder="t('auth.email')"
                  :invalid="!!errors.email" fluid class="pl-10" />
              </div>
              <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
            </div>
            <Button type="submit" :label="t('auth.step1Btn')" :loading="loading" icon="pi pi-send" raised class="w-full auth-btn" />
          </form>

          <!-- STEP 2: Enter OTP -->
          <form v-else-if="step === 2" @submit.prevent="verifyOtp" class="auth-form">
            <div class="otp-container py-4 flex flex-col items-center">
              <InputOtp v-model="otpCode" :length="6" integerOnly class="mb-4" />
              <small v-if="errors.otp" class="p-error text-center block">{{ errors.otp }}</small>
            </div>
            <Button type="submit" :label="t('auth.step2Btn')" :loading="loading" icon="pi pi-check-circle" raised class="w-full auth-btn" />
            <Button type="button" :label="t('auth.changeEmail')" icon="pi pi-arrow-left" text class="w-full mt-2" @click="step = 1" />
          </form>

          <!-- STEP 3: New Password -->
          <form v-else-if="step === 3" @submit.prevent="resetPassword" class="auth-form">
            <div class="field">
              <label for="newPass">{{ t('auth.newSecurePass') }}</label>
              <Password id="newPass" v-model="newPassword" :placeholder="t('auth.enterNewPass')"
                toggleMask :invalid="!!errors.password" inputClass="w-full" fluid />
              <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
            </div>
            <Button type="submit" :label="t('auth.step3Btn')" :loading="loading" icon="pi pi-refresh" raised class="w-full auth-btn" />
          </form>

          <!-- PROGRESS INDICATOR -->
          <div class="step-indicator">
            <div v-for="n in 3" :key="n" :class="['step-dot', { 'step-dot--active': step === n, 'step-dot--completed': step > n }]" />
          </div>

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
import InputOtp from 'primevue/inputotp'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()

const step = ref(1)
const loading = ref(false)
const email = ref('')
const newPassword = ref('')
const otpCode = ref('')
const errors = reactive({ email: '', otp: '', password: '' })

async function sendOtp() {
  errors.email = ''
  if (!email.value) { errors.email = t('common.required'); return }
  loading.value = true
  try {
    const res = await authApi.forgotPassword({ email: email.value })
    toast.add({ severity: 'info', summary: t('auth.otpSent'), detail: res.message || t('auth.otpSent'), life: 3000 })
    loading.value = false
    step.value = 2
  } catch (err) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: err.message, life: 4000 })
  } finally { loading.value = false }
}

async function verifyOtp() {
  errors.otp = ''
  if (!otpCode.value || otpCode.value.length < 6) { errors.otp = 'Please enter 6-digit OTP'; return }
  loading.value = true
  try {
    const res = await authApi.verifyOtp({ email: email.value, token: otpCode.value })
    step.value = 3
    toast.add({ severity: 'success', summary: t('auth.verified'), detail: res.message, life: 3000 })
  } catch (err) { errors.otp = err.message }
  finally { loading.value = false }
}

async function resetPassword() {
  errors.password = ''
  if (!newPassword.value || newPassword.value.length < 6) { errors.password = t('auth.min6Chars'); return }
  loading.value = true
  try {
    const res = await authApi.resetPassword({ email: email.value, token: otpCode.value, newPassword: newPassword.value })
    toast.add({ severity: 'success', summary: t('auth.resetSuccess'), detail: res.message || t('auth.resetSuccess'), life: 3000 })
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: err.message, life: 4000 })
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
  line-height: 1.5;
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

.auth-btn {
  padding: 0.75rem !important;
  font-weight: 700 !important;
  border-radius: $border-radius-lg !important;
}

.step-indicator {
  display: flex;
  justify-content: center;
  gap: $space-2;
  margin-top: $space-8;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e2e8f0;
  transition: all 0.3s;
  &--active { background: $color-primary; width: 24px; border-radius: 4px; }
  &--completed { background: $color-success; }
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
.p-error { font-size: 12px; margin-top: 2px; color: $color-danger; }
</style>
