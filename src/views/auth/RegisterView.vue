<template>
  <div class="auth-wrapper">
    <div class="auth-content">
      <!-- Left Side: Visual/Branding -->
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
            <h2 class="quote">"Adventure is worthwhile in itself."</h2>
            <p class="author">— Amelia Earhart</p>
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

      <!-- Right Side: Register Form -->
      <div class="auth-form-side">
        <div class="form-scroll-outer">
          <nav class="auth-breadcrumb">
             <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
             <i class="pi pi-chevron-right"></i>
             <span>{{ t('nav.register') }}</span>
          </nav>

          <div class="form-container">
            <div class="form-header">
              <h1>Join Triptopia</h1>
              <p>Create an account to start your journey with us.</p>
            </div>

            <form @submit.prevent="handleRegister" class="auth-form">
              <div class="field-group">
                <div class="field">
                  <label for="fullName">{{ t('auth.fullName') }}</label>
                  <div class="input-wrapper">
                    <i class="pi pi-user input-icon"></i>
                    <InputText id="fullName" v-model="form.fullName" :placeholder="t('auth.fullName')"
                      :invalid="!!errors.fullName" fluid />
                  </div>
                  <small v-if="errors.fullName" class="p-error">{{ errors.fullName }}</small>
                </div>

                <div class="field">
                  <label for="regEmail">{{ t('auth.email') }}</label>
                  <div class="input-wrapper">
                    <i class="pi pi-envelope input-icon"></i>
                    <InputText id="regEmail" type="email" v-model="form.email" :placeholder="t('auth.email')"
                      :invalid="!!errors.email" fluid />
                  </div>
                  <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
                </div>

                <div class="field">
                  <label for="phone">{{ t('auth.phone') }} (VN: 0xxxxxxxxx)</label>
                  <div class="input-wrapper">
                    <i class="pi pi-phone input-icon"></i>
                    <InputText id="phone" v-model="form.phone" placeholder="0123456789"
                      :invalid="!!errors.phone" fluid />
                  </div>
                  <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
                </div>

                <div class="field">
                  <label for="regPass">{{ t('auth.password') }}</label>
                  <div class="input-wrapper">
                    <i class="pi pi-lock input-icon"></i>
                    <Password id="regPass" v-model="form.password" :placeholder="t('auth.password')"
                      toggleMask :invalid="!!errors.password" inputClass="w-full" :feedback="true" fluid />
                  </div>
                  <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
                </div>

                <div class="field">
                  <label for="confirmPass">{{ t('auth.confirmPassword') }}</label>
                  <div class="input-wrapper">
                    <i class="pi pi-shield input-icon"></i>
                    <Password id="confirmPass" v-model="form.confirmPassword" :placeholder="t('auth.confirmPassword')"
                      :feedback="false" toggleMask :invalid="!!errors.confirmPassword" inputClass="w-full" fluid />
                  </div>
                  <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
                </div>
              </div>

              <div class="terms-label">
                By registering, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </div>

              <Button type="submit" :label="t('auth.registerBtn')" :loading="loading" raised class="submit-btn" />
            </form>

            <div class="auth-alt">
              <div class="divider">
                <span>Or register with</span>
              </div>
              <div class="social-btns">
                <Button icon="pi pi-google" severity="secondary" outlined class="flex-1" label="Google" />
                <Button icon="pi pi-facebook" severity="secondary" outlined class="flex-1" label="Facebook" />
              </div>
            </div>

            <div class="auth-switch">
              Already have an account? 
              <RouterLink to="/login">{{ t('nav.login') }}</RouterLink>
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
const form = reactive({ email: '', password: '', confirmPassword: '', fullName: '', phone: '' })
const errors = reactive({ email: '', password: '', confirmPassword: '', fullName: '', phone: '' })

function validateForm() {
  let valid = true
  Object.keys(errors).forEach(k => errors[k] = '')
  
  if (!form.fullName) { errors.fullName = t('common.required'); valid = false }
  
  if (!form.phone) { 
    errors.phone = t('common.required')
    valid = false 
  } else if (!/^0\d{9}$/.test(form.phone)) {
    errors.phone = "Số điện thoại VN không hợp lệ (10 số, bắt đầu bằng 0)"
    valid = false
  }

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
      email: form.email, 
      password: form.password, 
      confirmPassword: form.confirmPassword,
      fullName: form.fullName, 
      phone: form.phone
    })
    toast.add({ severity: 'success', summary: t('auth.registerTitle'), detail: t('auth.registerSuccess'), life: 3000 })
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (err) {
    const detail = err.response?.data?.message || err.message || t('common.error')
    toast.add({ severity: 'error', summary: t('common.error'), detail, life: 4000 })
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
    background: url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80') center/cover no-repeat;
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
  overflow-y: auto;
}

.form-scroll-outer {
  max-width: 580px;
  width: 100%;
  margin: 0 auto;
  padding: $space-8 $space-6;
  @include md { padding: $space-12 $space-10; }
}

.auth-breadcrumb {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-size: 0.85rem;
  color: $color-text-secondary;
  margin-bottom: $space-10;
  
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
  gap: $space-6;
}

.field-group {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-5;
  @include md {
    grid-template-columns: repeat(2, 1fr);
  }
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

.terms-label {
  font-size: 13px;
  color: $color-text-secondary;
  margin: $space-2 0;
  a { color: $color-primary; font-weight: 600; }
}

.submit-btn {
  height: 52px;
  font-size: 1rem !important;
  font-weight: 700 !important;
  border-radius: 14px !important;
  background: $color-primary !important;
  border: none !important;
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
