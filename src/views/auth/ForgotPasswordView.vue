<template>
  <div class="auth-page">
    <div class="auth-page__bg">
      <div class="auth-page__bg-img" />
      <div class="auth-page__bg-overlay" />
    </div>

    <div class="auth-card animate-fade-in-up">
      <RouterLink to="/" class="auth-card__logo">✈️ Voyage<span>VN</span></RouterLink>

      <!-- STEP 1: Nhập Email -->
      <template v-if="step === 1">
        <h1 class="auth-card__title">{{ t('auth.forgotTitle') }}</h1>
        <p class="auth-card__desc">{{ t('auth.forgotDesc') }}</p>
        <form class="auth-form" @submit.prevent="sendOtp">
          <BaseInput v-model="email" :label="t('auth.email')" type="email" :placeholder="t('auth.email')" :error="errors.email" required>
            <template #icon-left>📧</template>
          </BaseInput>
          <BaseButton variant="primary" size="lg" :loading="loading" block type="submit">
            {{ t('auth.sendOtp') }}
          </BaseButton>
        </form>
      </template>

      <!-- STEP 2: Nhập OTP -->
      <template v-else-if="step === 2">
        <h1 class="auth-card__title">{{ t('auth.verifyOtp') }}</h1>
        <p class="auth-card__desc">{{ t('auth.otpSent') }}: <strong>{{ email }}</strong></p>
        <form class="auth-form" @submit.prevent="verifyOtp">
          <div class="otp-inputs">
            <input
              v-for="(_, i) in otpDigits"
              :key="i"
              :ref="el => otpRefs[i] = el"
              v-model="otpDigits[i]"
              class="otp-input"
              maxlength="1"
              type="text"
              inputmode="numeric"
              pattern="[0-9]"
              @input="onOtpInput(i)"
              @keydown.backspace="onOtpBackspace(i)"
            />
          </div>
          <p v-if="errors.otp" class="input-error">{{ errors.otp }}</p>
          <BaseButton variant="primary" size="lg" :loading="loading" block type="submit">
            {{ t('auth.verifyOtp') }}
          </BaseButton>
          <button type="button" class="resend-btn" @click="step = 1">← {{ t('common.back') }}</button>
        </form>
      </template>

      <!-- STEP 3: Đổi mật khẩu mới -->
      <template v-else-if="step === 3">
        <h1 class="auth-card__title">{{ t('auth.newPassword') }}</h1>
        <p class="auth-card__desc">{{ t('auth.resetPassword') }}</p>
        <form class="auth-form" @submit.prevent="resetPassword">
          <BaseInput v-model="newPassword" :label="t('auth.newPassword')" type="password" :placeholder="t('auth.newPassword')" :error="errors.password" required />
          <BaseButton variant="primary" size="lg" :loading="loading" block type="submit">
            {{ t('auth.resetPassword') }}
          </BaseButton>
        </form>
      </template>

      <!-- STEP INDICATOR -->
      <div class="step-indicator">
        <div v-for="n in 3" :key="n" :class="['step-dot', { 'step-dot--active': step >= n }]" />
      </div>

      <p class="auth-card__footer">
        <RouterLink to="/login" class="auth-link">← {{ t('nav.login') }}</RouterLink>
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

const step = ref(1)
const loading = ref(false)
const email = ref('')
const newPassword = ref('')
const errors = reactive({ email: '', otp: '', password: '' })

// OTP 6 ô riêng biệt
const otpDigits = ref(['', '', '', '', '', ''])
const otpRefs = ref([])
const otpValue = () => otpDigits.value.join('')

function onOtpInput(idx) {
  const val = otpDigits.value[idx]
  if (val && idx < 5) otpRefs.value[idx + 1]?.focus()
}

function onOtpBackspace(idx) {
  if (!otpDigits.value[idx] && idx > 0) {
    otpDigits.value[idx - 1] = ''
    otpRefs.value[idx - 1]?.focus()
  }
}

async function sendOtp() {
  errors.email = ''
  if (!email.value) { errors.email = t('common.required'); return }
  loading.value = true
  try {
    const res = await authApi.forgotPassword({ email: email.value })
    if (res.success) { toast.success(t('auth.otpSent')); step.value = 2 }
    else toast.error(res.message)
  } catch (err) {
    toast.error(err.message)
  } finally { loading.value = false }
}

async function verifyOtp() {
  errors.otp = ''
  if (otpValue().length < 6) { errors.otp = 'Vui lòng nhập đủ 6 số OTP'; return }
  loading.value = true
  try {
    const res = await authApi.verifyOtp({ email: email.value, token: otpValue() })
    if (res.success) { step.value = 3 }
    else { errors.otp = res.message || 'OTP không đúng hoặc đã hết hạn' }
  } catch (err) { errors.otp = err.message }
  finally { loading.value = false }
}

async function resetPassword() {
  errors.password = ''
  if (!newPassword.value || newPassword.value.length < 6) { errors.password = 'Mật khẩu ít nhất 6 ký tự'; return }
  loading.value = true
  try {
    const res = await authApi.resetPassword({ email: email.value, token: otpValue(), newPassword: newPassword.value })
    if (res.success) {
      toast.success(t('auth.resetSuccess'))
      router.push({ name: 'login' })
    } else toast.error(res.message)
  } catch (err) { toast.error(err.message) }
  finally { loading.value = false }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.auth-page {
  min-height: 100vh; @include flex-center; position: relative; padding: $space-4;
  &__bg { position: fixed; inset: 0; z-index: 0; }
  &__bg-img { position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1555921015-5532091f6026?w=1920&q=80') center/cover; }
  &__bg-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(10,35,66,0.92), rgba(15,15,26,0.88)); }
}

.auth-card {
  position: relative; z-index: 1; @include glass(rgba(15,15,26,0.85));
  border-radius: $border-radius-xl; padding: $space-10; width: 100%; max-width: 460px;

  &__logo { display: block; font-family: $font-heading; font-size: $font-size-xl; font-weight: $font-weight-bold; color: $color-text-primary; text-decoration: none; margin-bottom: $space-8; span { color: $color-accent; } }
  &__title { font-family: $font-heading; font-size: $font-size-3xl; color: $color-text-primary; margin-bottom: $space-2; }
  &__desc { color: $color-text-secondary; font-size: $font-size-sm; margin-bottom: $space-8; strong { color: $color-accent; } }
  &__footer { text-align: center; margin-top: $space-6; font-size: $font-size-sm; color: $color-text-muted; }
}

.auth-form { display: flex; flex-direction: column; gap: $space-5; }

.otp-inputs {
  display: flex; gap: $space-3; justify-content: center;
}

.otp-input {
  width: 48px; height: 56px;
  text-align: center;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  @include input-base;
  border-radius: $border-radius-md;
  padding: 0;
}

.input-error { font-size: $font-size-xs; color: $color-danger; text-align: center; }

.resend-btn {
  background: none; border: none; cursor: pointer;
  color: $color-text-muted; font-size: $font-size-sm;
  text-align: center; padding: $space-2;
  &:hover { color: $color-text-primary; }
}

.step-indicator {
  display: flex; justify-content: center; gap: $space-2; margin-top: $space-8;
}

.step-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: $color-text-muted; transition: $transition-base;
  &--active { background: $color-accent; width: 24px; border-radius: 4px; }
}

.auth-link { font-size: $font-size-sm; color: $color-text-secondary; text-decoration: none; transition: $transition-fast; &:hover { color: $color-accent; } }
</style>
