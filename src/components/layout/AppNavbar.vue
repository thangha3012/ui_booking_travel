<template>
  <nav class="navbar">
    <div class="container navbar__inner">
      <!-- LOGO -->
      <RouterLink to="/" class="navbar__logo">
        <span class="logo-icon">✈️</span>
        <span class="logo-text">Voyage<span class="logo-accent">VN</span></span>
      </RouterLink>

      <!-- MENU DESKTOP -->
      <ul class="navbar__menu">
        <li><RouterLink to="/" class="navbar__link">{{ t('nav.home') }}</RouterLink></li>
        <li><RouterLink to="/tours" class="navbar__link">{{ t('nav.tours') }}</RouterLink></li>
      </ul>

      <!-- RIGHT ACTIONS -->
      <div class="navbar__actions">
        <!-- Language Switcher -->
        <button class="lang-btn" @click="toggleLang">
          {{ locale === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN' }}
        </button>

        <!-- Chưa đăng nhập -->
        <template v-if="!auth.isLoggedIn">
          <RouterLink to="/login"><BaseButton variant="ghost" size="sm">{{ t('nav.login') }}</BaseButton></RouterLink>
          <RouterLink to="/register"><BaseButton variant="accent" size="sm">{{ t('nav.register') }}</BaseButton></RouterLink>
        </template>

        <!-- Đã đăng nhập -->
        <template v-else>
          <div class="user-menu" @click="userMenuOpen = !userMenuOpen">
            <div class="user-avatar">{{ auth.displayName.charAt(0).toUpperCase() }}</div>
            <span class="user-name">{{ auth.displayName }}</span>
            <span class="user-caret">▾</span>

            <Transition name="slide-down">
              <div v-if="userMenuOpen" class="user-dropdown">
                <RouterLink to="/my-bookings" class="dropdown-item">📋 {{ t('nav.myBookings') }}</RouterLink>
                <RouterLink v-if="auth.isAdmin" to="/admin" class="dropdown-item">⚙️ {{ t('nav.admin') }}</RouterLink>
                <div class="dropdown-divider" />
                <button class="dropdown-item dropdown-item--danger" @click="handleLogout">🚪 {{ t('nav.logout') }}</button>
              </div>
            </Transition>
          </div>
        </template>
      </div>

      <!-- MOBILE HAMBURGER -->
      <button class="hamburger" @click="mobileOpen = !mobileOpen">☰</button>
    </div>

    <!-- MOBILE MENU -->
    <Transition name="slide-down">
      <div v-if="mobileOpen" class="navbar__mobile">
        <RouterLink to="/" class="mobile-link" @click="mobileOpen = false">{{ t('nav.home') }}</RouterLink>
        <RouterLink to="/tours" class="mobile-link" @click="mobileOpen = false">{{ t('nav.tours') }}</RouterLink>
        <template v-if="!auth.isLoggedIn">
          <RouterLink to="/login" class="mobile-link" @click="mobileOpen = false">{{ t('nav.login') }}</RouterLink>
          <RouterLink to="/register" class="mobile-link" @click="mobileOpen = false">{{ t('nav.register') }}</RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/my-bookings" class="mobile-link" @click="mobileOpen = false">{{ t('nav.myBookings') }}</RouterLink>
          <button class="mobile-link mobile-link--danger" @click="handleLogout">{{ t('nav.logout') }}</button>
        </template>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'
import BaseButton from '@/components/base/BaseButton.vue'

const { t, locale } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const app = useAppStore()

const mobileOpen  = ref(false)
const userMenuOpen = ref(false)

function toggleLang() {
  const next = locale.value === 'vi' ? 'en' : 'vi'
  locale.value = next
  app.setLocale(next)
}

function handleLogout() {
  auth.logout()
  userMenuOpen.value = false
  mobileOpen.value   = false
  router.push({ name: 'home' })
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: $navbar-height;
  @include glass(rgba(15,15,26,0.85));
  border-bottom: 1px solid $color-border;

  &__inner { @include flex-between; height: 100%; }

  &__logo {
    display: flex; align-items: center; gap: $space-2;
    font-family: $font-heading;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    text-decoration: none;
  }
  .logo-icon    { font-size: $font-size-2xl; }
  .logo-accent  { color: $color-accent; }

  &__menu {
    display: none;
    list-style: none;
    gap: $space-8;
    @include lg { display: flex; }
  }

  &__link {
    color: $color-text-secondary;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    transition: $transition-fast;
    text-decoration: none;
    &:hover, &.router-link-active { color: $color-text-primary; }
    &.router-link-active { @include gradient-text; }
  }

  &__actions {
    display: none;
    align-items: center;
    gap: $space-3;
    @include lg { display: flex; }
  }

  &__mobile {
    display: flex;
    flex-direction: column;
    padding: $space-4;
    border-top: 1px solid $color-border;
    background: rgba(15,15,26,0.98);
    @include lg { display: none; }
  }
}

.lang-btn {
  background: $color-bg-surface;
  border: 1px solid $color-border;
  color: $color-text-secondary;
  padding: $space-2 $space-3;
  border-radius: $border-radius-full;
  font-size: $font-size-xs;
  cursor: pointer;
  transition: $transition-fast;
  &:hover { color: $color-text-primary; border-color: $color-border-focus; }
}

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: $space-2;
  cursor: pointer;
  padding: $space-2 $space-3;
  border-radius: $border-radius-full;
  border: 1px solid $color-border;
  transition: $transition-fast;
  &:hover { border-color: $color-border-focus; }
}

.user-avatar {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-gradient-start, $color-gradient-end);
  @include flex-center;
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  color: #fff;
}

.user-name, .user-caret { font-size: $font-size-xs; color: $color-text-secondary; }

.user-dropdown {
  position: absolute;
  top: calc(100% + $space-2);
  right: 0;
  min-width: 200px;
  @include glass(rgba(15,15,26,0.98));
  border-radius: $border-radius-md;
  padding: $space-2;
  box-shadow: $shadow-lg;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-3 $space-4;
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  transition: $transition-fast;
  &:hover { background: $color-bg-surface-hover; color: $color-text-primary; }
  &--danger:hover { color: $color-danger; }
}

.dropdown-divider { height: 1px; background: $color-border; margin: $space-2 0; }

.mobile-link {
  display: block;
  padding: $space-4;
  color: $color-text-secondary;
  text-decoration: none;
  font-size: $font-size-base;
  border-bottom: 1px solid $color-border;
  background: none; border-left: none; border-right: none; border-top: none;
  cursor: pointer; width: 100%; text-align: left;
  &:hover { color: $color-text-primary; }
  &--danger:hover { color: $color-danger; }
}

.hamburger {
  display: flex;
  background: none; border: none;
  color: $color-text-primary;
  font-size: $font-size-2xl;
  cursor: pointer;
  @include lg { display: none; }
}

// Transitions
.slide-down-enter-active { animation: slideDown 0.2s ease; }
.slide-down-leave-active { animation: slideDown 0.15s ease reverse; }
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
