<template>
  <div class="auth-page">
    <div class="auth-page__bg">
      <div class="auth-page__bg-img" />
      <div class="auth-page__bg-overlay" />
    </div>

    <div class="auth-card animate-fade-in-up">
      <RouterLink to="/" class="auth-card__logo">✈️ Voyage<span>VN</span></RouterLink>

      <h1 class="auth-card__title">{{ t('auth.registerTitle') }}</h1>
      <p class="auth-card__desc">{{ t('auth.registerDesc') }}</p>

      <form class="auth-form" @submit.prevent="handleRegister">
        <BaseInput v-model="form.fullName" :label="t('auth.fullName')" :placeholder="t('auth.fullName')" :error="errors.fullName" required>
          <template #icon-left>👤</template>
        </BaseInput>

        <BaseInput v-model="form.email" :label="t('auth.email')" type="email" :placeholder="t('auth.email')" :error="errors.email" required>
          <template #icon-left>📧</template>
        </BaseInput>

        <BaseInput v-model="form.phone" :label="t('auth.phone')" :placeholder="t('auth.phone')" :error="errors.phone">
          <template #icon-left>📱</template>
        </BaseInput>

        <BaseInput v-model="form.password" :label="t('auth.password')" type="password" :placeholder="t('auth.password')" :error="errors.password" required />

        <BaseInput v-model="form.confirmPassword" :label="t('auth.confirmPassword')" type="password" :placeholder="t('auth.confirmPassword')" :error="errors.confirmPassword" required />

        <BaseButton variant="primary" size="lg" :loading="loading" block type="submit">
          {{ t('auth.registerBtn') }}
        </BaseButton>
      </form>

      <p class="auth-card__footer">
        {{ t('auth.haveAccount') }}
        <RouterLink to="/login" class="auth-link auth-link--accent">{{ t('nav.login') }}</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authApi } from '@/api/authApi'
import { useToast } from '@/composables/useToast'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const loading = ref(false)

const form = reactive({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
const errors = reactive({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })

function validate() {
  Object.keys(errors).forEach(k => errors[k] = '')
  let valid = true
  if (!form.fullName) { errors.fullName = t('common.required'); valid = false }
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = t('common.invalidEmail'); valid = false }
  if (!form.password || form.password.length < 6) { errors.password = 'Mật khẩu ít nhất 6 ký tự'; valid = false }
  if (form.password !== form.confirmPassword) { errors.confirmPassword = 'Mật khẩu không khớp'; valid = false }
  return valid
}

async function handleRegister() {
  if (!validate()) return
  loading.value = true
  try {
    const res = await authApi.register({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      confirmPassword: form.confirmPassword
    })
    if (res.success) {
      toast.success('Đăng ký thành công! Vui lòng đăng nhập 🎉')
      router.push({ name: 'login' })
    } else {
      toast.error(res.message)
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
  &__bg { position: fixed; inset: 0; z-index: 0; }
  &__bg-img {
    position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80') center/cover;
  }
  &__bg-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(10,35,66,0.92), rgba(15,15,26,0.88));
  }
}

.auth-card {
  position: relative; z-index: 1;
  @include glass(rgba(15,15,26,0.85));
  border-radius: $border-radius-xl;
  padding: $space-10;
  width: 100%; max-width: 480px;
  box-shadow: $shadow-lg;

  &__logo {
    display: block; font-family: $font-heading; font-size: $font-size-xl;
    font-weight: $font-weight-bold; color: $color-text-primary; text-decoration: none;
    margin-bottom: $space-8;
    span { color: $color-accent; }
  }

  &__title { font-family: $font-heading; font-size: $font-size-3xl; color: $color-text-primary; margin-bottom: $space-2; }
  &__desc  { color: $color-text-secondary; font-size: $font-size-sm; margin-bottom: $space-8; }
  &__footer { text-align: center; margin-top: $space-6; font-size: $font-size-sm; color: $color-text-muted; }
}

.auth-form { display: flex; flex-direction: column; gap: $space-5; }

.auth-link {
  font-size: $font-size-sm; color: $color-text-secondary; text-decoration: none; transition: $transition-fast;
  &:hover { color: $color-text-primary; }
  &--accent { color: $color-accent; margin-left: $space-1; font-weight: $font-weight-semibold; }
}
</style>
