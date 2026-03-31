<template>
  <div class="auth-page">
    <!-- BG -->
    <div class="auth-page__bg">
      <div class="auth-page__bg-img" />
      <div class="auth-page__bg-overlay" />
    </div>

    <!-- CARD -->
    <div class="auth-card animate-fade-in-up">
      <!-- Logo -->
      <RouterLink to="/" class="auth-card__logo">✈️ Voyage<span>VN</span></RouterLink>

      <h1 class="auth-card__title">{{ t('auth.loginTitle') }}</h1>
      <p class="auth-card__desc">{{ t('auth.loginDesc') }}</p>

      <form class="auth-form" @submit.prevent="handleLogin">
        <BaseInput
          v-model="form.email"
          :label="t('auth.email')"
          type="email"
          :placeholder="`${t('auth.email')}...`"
          :error="errors.email"
          required
        >
          <template #icon-left>📧</template>
        </BaseInput>

        <BaseInput
          v-model="form.password"
          :label="t('auth.password')"
          type="password"
          :placeholder="`${t('auth.password')}...`"
          :error="errors.password"
          required
        />

        <div class="auth-form__row">
          <RouterLink to="/forgot-password" class="auth-link">
            {{ t('auth.forgotPassword') }}
          </RouterLink>
        </div>

        <BaseButton variant="primary" size="lg" :loading="loading" block type="submit">
          {{ t('auth.loginBtn') }}
        </BaseButton>
      </form>

      <p class="auth-card__footer">
        {{ t('auth.noAccount') }}
        <RouterLink to="/register" class="auth-link auth-link--accent">{{ t('nav.register') }}</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

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
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = t('common.invalidEmail'); valid = false }
  if (!form.password) { errors.password = t('common.required'); valid = false }
  return valid
}

async function handleLogin() {
  if (!validateForm()) return
  loading.value = true
  try {
    const res = await auth.login({ email: form.email, password: form.password })
    if (res.success) {
      toast.success(`Chào mừng trở lại! 🎉`)
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      toast.error(res.message || t('common.error'))
    }
  } catch (err) {
    toast.error(err.message || t('common.error'))
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.auth-page {
  min-height: 100vh;
  @include flex-center;
  position: relative;
  padding: $space-4;

  &__bg {
    position: fixed; inset: 0; z-index: 0;
  }

  &__bg-img {
    position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1573390016527-19ef6f38ebe3?w=1920&q=80') center/cover;
  }

  &__bg-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(10,35,66,0.92) 0%, rgba(15,15,26,0.88) 100%);
  }
}

.auth-card {
  position: relative; z-index: 1;
  @include glass(rgba(15,15,26,0.85));
  border-radius: $border-radius-xl;
  padding: $space-10;
  width: 100%;
  max-width: 460px;
  box-shadow: $shadow-lg;

  &__logo {
    display: block;
    font-family: $font-heading;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    text-decoration: none;
    margin-bottom: $space-8;
    span { color: $color-accent; }
  }

  &__title {
    font-family: $font-heading;
    font-size: $font-size-3xl;
    color: $color-text-primary;
    margin-bottom: $space-2;
  }

  &__desc {
    color: $color-text-secondary;
    font-size: $font-size-sm;
    margin-bottom: $space-8;
  }

  &__footer {
    text-align: center;
    margin-top: $space-6;
    font-size: $font-size-sm;
    color: $color-text-muted;
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: $space-5;

  &__row {
    display: flex;
    justify-content: flex-end;
    margin-top: -$space-2;
  }
}

.auth-link {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  text-decoration: none;
  transition: $transition-fast;
  &:hover { color: $color-text-primary; }
  &--accent { color: $color-accent; margin-left: $space-1; font-weight: $font-weight-semibold; }
}
</style>
