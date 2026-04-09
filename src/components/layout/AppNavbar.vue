<template>
  <nav class="navbar">
    <div class="container navbar__inner">
      <!-- LOGO -->
      <RouterLink to="/" class="navbar__logo">
        <i class="pi pi-send text-primary text-2xl"></i>
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
        <Button :label="locale.toUpperCase()" text rounded size="small" icon="pi pi-globe" @click="toggleLang" class="lang-btn" />

        <!-- Not logged in -->
        <template v-if="!auth.isLoggedIn">
          <RouterLink to="/login">
            <Button :label="t('nav.login')" text size="small" />
          </RouterLink>
          <RouterLink to="/register">
            <Button :label="t('nav.register')" size="small" raised />
          </RouterLink>
        </template>

        <!-- Logged in -->
        <template v-else>
          <div class="user-menu" @click="userMenuOpen = !userMenuOpen">
            <div class="user-avatar">{{ auth.displayName.charAt(0).toUpperCase() }}</div>
            <span class="user-name">{{ auth.displayName }}</span>
            <i class="pi pi-chevron-down" style="font-size: 10px"></i>

            <Transition name="slide-down">
              <div v-if="userMenuOpen" class="user-dropdown">
                <RouterLink to="/my-bookings" class="dropdown-item">
                  <i class="pi pi-list"></i> {{ t('nav.myBookings') }}
                </RouterLink>
                <RouterLink v-if="auth.isAdmin" to="/admin" class="dropdown-item">
                  <i class="pi pi-cog"></i> {{ t('nav.admin') }}
                </RouterLink>
                <div class="dropdown-divider" />
                <button class="dropdown-item dropdown-item--danger" @click="handleLogout">
                  <i class="pi pi-sign-out"></i> {{ t('nav.logout') }}
                </button>
              </div>
            </Transition>
          </div>
        </template>
      </div>

      <!-- MOBILE HAMBURGER -->
      <Button icon="pi pi-bars" text rounded class="hamburger" @click="mobileOpen = !mobileOpen" />
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
import Button from 'primevue/button'

const { t, locale } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const app = useAppStore()

const mobileOpen = ref(false)
const userMenuOpen = ref(false)

function toggleLang() {
  const next = locale.value === 'vi' ? 'en' : 'vi'
  locale.value = next
  app.setLocale(next)
}

function handleLogout() {
  auth.logout()
  userMenuOpen.value = false
  mobileOpen.value = false
  router.push({ name: 'home' })
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  height: $navbar-height;
  background: $glass-bg;
  backdrop-filter: $glass-blur; -webkit-backdrop-filter: $glass-blur;
  border-bottom: 1px solid $color-border-light;

  &__inner { @include flex-between; height: 100%; }

  &__logo {
    display: flex; align-items: center; gap: $space-2;
    font-family: $font-heading; font-size: $font-size-xl; font-weight: 700;
    color: $color-text-primary; text-decoration: none;
  }
  .logo-icon { font-size: $font-size-2xl; }
  .logo-accent { color: $color-primary; }

  &__menu {
    display: none; list-style: none; gap: $space-8;
    @include lg { display: flex; }
  }

  &__link {
    color: $color-text-body; font-size: $font-size-sm; font-weight: 500;
    transition: $transition-fast; text-decoration: none;
    &:hover, &.router-link-active { color: $color-primary; }
  }

  &__actions {
    display: none; align-items: center; gap: $space-2;
    @include lg { display: flex; }
  }

  &__mobile {
    display: flex; flex-direction: column; padding: $space-4;
    border-top: 1px solid $color-border-light;
    background: $glass-bg; backdrop-filter: $glass-blur;
    @include lg { display: none; }
  }
}

.lang-btn { font-size: 12px !important; }

.user-menu {
  position: relative; display: flex; align-items: center; gap: $space-2;
  cursor: pointer; padding: $space-2 $space-3;
  border-radius: $border-radius-full; border: 1px solid $color-border;
  transition: $transition-fast;
  &:hover { border-color: $color-primary; }
}

.user-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: $gradient-primary;
  @include flex-center; font-size: $font-size-xs; font-weight: 700; color: #fff;
}

.user-name { font-size: $font-size-xs; color: $color-text-body; font-weight: 500; }

.user-dropdown {
  position: absolute; top: calc(100% + $space-2); right: 0; min-width: 200px;
  background: white; border: 1px solid $color-border-light;
  border-radius: $border-radius-md; padding: $space-2;
  box-shadow: $shadow-lg;
}

.dropdown-item {
  display: flex; align-items: center; gap: $space-2;
  padding: $space-3 $space-4; border-radius: $border-radius-sm;
  font-size: $font-size-sm; color: $color-text-body;
  text-decoration: none; cursor: pointer; background: none; border: none; width: 100%; text-align: left;
  transition: $transition-fast;
  &:hover { background: $color-bg-surface; color: $color-text-primary; }
  &--danger:hover { color: $color-danger; }
}

.dropdown-divider { height: 1px; background: $color-border-light; margin: $space-2 0; }

.mobile-link {
  display: block; padding: $space-4; color: $color-text-body; text-decoration: none;
  font-size: $font-size-base; border-bottom: 1px solid $color-border-light;
  background: none; border-left: none; border-right: none; border-top: none;
  cursor: pointer; width: 100%; text-align: left;
  &:hover { color: $color-primary; }
  &--danger:hover { color: $color-danger; }
}

.hamburger {
  @include lg { display: none !important; }
}

// Transitions
.slide-down-enter-active { animation: slideDown 0.2s ease; }
.slide-down-leave-active { animation: slideDown 0.15s ease reverse; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
</style>
