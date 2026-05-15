<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': scrolled }">
    <div class="container navbar__inner">
      <!-- LOGO -->
      <RouterLink to="/" class="navbar__logo">
        <div class="logo-icon-wrap">
          <i class="pi pi-compass"></i>
        </div>
        <span class="logo-text">Trip<span class="logo-accent">topia</span></span>
      </RouterLink>

      <!-- MENU DESKTOP -->
      <ul class="navbar__menu">
        <li><RouterLink to="/" class="navbar__link">{{ t('nav.home') }}</RouterLink></li>
        <li>
          <RouterLink 
            to="/tours" 
            class="navbar__link"
            :class="{ 'router-link-active': $route.path.startsWith('/tours') }"
          >
            Tour Du lịch
          </RouterLink>
        </li>
        <li><RouterLink to="/blog" class="navbar__link">{{ t('nav.blog', 'Tin tức') }}</RouterLink></li>
        <li><RouterLink to="/about" class="navbar__link">{{ t('nav.about', 'Giới thiệu') }}</RouterLink></li>
        <li><RouterLink to="/contact" class="navbar__link">{{ t('nav.contact', 'Liên hệ') }}</RouterLink></li>
      </ul>

      <!-- RIGHT ACTIONS -->
      <div class="navbar__actions">

        <!-- Not logged in -->
        <template v-if="!auth.isLoggedIn">
          <RouterLink to="/login" class="btn-ghost">{{ t('nav.login') }}</RouterLink>
          <RouterLink to="/register" class="btn-primary-nav">{{ t('nav.register') }}</RouterLink>
        </template>

        <!-- Logged in -->
        <template v-else>
          <div class="user-menu" @click="userMenuOpen = !userMenuOpen" v-click-outside="() => userMenuOpen = false">
            <div class="user-avatar">{{ auth.displayName.charAt(0).toUpperCase() }}</div>
            <span class="user-name">{{ auth.displayName }}</span>
            <i class="pi pi-chevron-down chevron" :class="{ rotated: userMenuOpen }"></i>

            <Transition name="dropdown">
              <div v-if="userMenuOpen" class="user-dropdown">
                <div class="dropdown-header">
                  <div class="dh-avatar">{{ auth.displayName.charAt(0).toUpperCase() }}</div>
                  <div>
                    <div class="dh-name">{{ auth.displayName }}</div>
                    <div class="dh-role">{{ auth.isAdmin ? 'Quản trị viên' : 'Thành viên' }}</div>
                  </div>
                </div>
                <div class="dropdown-divider" />
                <RouterLink to="/my-bookings" class="dropdown-item" @click="userMenuOpen = false">
                  <i class="pi pi-calendar"></i> {{ t('nav.myBookings') }}
                </RouterLink>
                <RouterLink v-if="auth.isAdmin" to="/admin" class="dropdown-item" @click="userMenuOpen = false">
                  <i class="pi pi-shield"></i> {{ t('nav.admin') }}
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
      <button class="hamburger" @click="mobileOpen = !mobileOpen" :class="{ open: mobileOpen }">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- MOBILE MENU -->
    <Transition name="mobile-slide">
      <div v-if="mobileOpen" class="navbar__mobile">
        <RouterLink to="/" class="navbar__mobile-link" @click="mobileOpen = false">
          <i class="pi pi-home"></i> {{ t('nav.home') }}
        </RouterLink>
        <RouterLink to="/tours" class="navbar__mobile-link" @click="mobileOpen = false">
          <i class="pi pi-map"></i> Tour Du lịch
        </RouterLink>
        <RouterLink to="/blog" class="navbar__mobile-link" @click="mobileOpen = false">
          <i class="pi pi-book"></i> {{ t('nav.blog', 'Tin tức') }}
        </RouterLink>
        <RouterLink to="/about" class="navbar__mobile-link" @click="mobileOpen = false">
          <i class="pi pi-info-circle"></i> {{ t('nav.about', 'Giới thiệu') }}
        </RouterLink>
        <RouterLink to="/contact" class="navbar__mobile-link" @click="mobileOpen = false">
          <i class="pi pi-phone"></i> {{ t('nav.contact', 'Liên hệ') }}
        </RouterLink>
        <template v-if="!auth.isLoggedIn">
          <div class="mobile-divider" />
          <RouterLink to="/login" class="mobile-link" @click="mobileOpen = false">
            <i class="pi pi-sign-in"></i> {{ t('nav.login') }}
          </RouterLink>
          <RouterLink to="/register" class="mobile-link mobile-link--cta" @click="mobileOpen = false">
            {{ t('nav.register') }}
          </RouterLink>
        </template>
        <template v-else>
          <div class="mobile-divider" />
          <RouterLink to="/my-bookings" class="mobile-link" @click="mobileOpen = false">
            <i class="pi pi-calendar"></i> {{ t('nav.myBookings') }}
          </RouterLink>
          <RouterLink v-if="auth.isAdmin" to="/admin" class="mobile-link" @click="mobileOpen = false">
            <i class="pi pi-shield"></i> {{ t('nav.admin') }}
          </RouterLink>
          <button class="mobile-link mobile-link--danger" @click="handleLogout">
            <i class="pi pi-sign-out"></i> {{ t('nav.logout') }}
          </button>
        </template>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, resolveDirective, withDirectives } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'

const { t, locale } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const app = useAppStore()

const mobileOpen = ref(false)
const userMenuOpen = ref(false)
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 30
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

// Close dropdown when clicking outside
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (e) => {
      if (!el.contains(e.target)) binding.value()
    }
    document.addEventListener('mousedown', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('mousedown', el._clickOutside)
  }
}

// Đã bỏ chức năng chuyển ngôn ngữ - chỉ dùng tiếng Việt

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

// =============================================
// NAVBAR
// =============================================
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  height: $navbar-height;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &--scrolled {
    background: rgba(255, 255, 255, 0.97);
    box-shadow: 0 4px 24px rgba(26, 32, 44, 0.08);
    border-bottom-color: rgba(226, 232, 240, 0.9);
  }

  &__inner {
    @include flex-between;
    height: 100%;
    gap: $space-4;
  }

  // ----  LOGO ----
  &__logo {
    display: flex;
    align-items: center;
    gap: $space-2;
    text-decoration: none;
    flex-shrink: 0;
  }

  // ---- MENU ----
  &__menu {
    display: none;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: $space-2;
    @include lg { display: flex; }
  }

  &__link {
    position: relative;
    color: $color-text-body;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    text-decoration: none;
    padding: $space-2 $space-3;
    border-radius: $border-radius-sm;
    transition: $transition-fast;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      right: 50%;
      height: 2px;
      background: $color-primary;
      border-radius: 1px;
      transition: all 0.25s ease;
    }

    &:hover {
      color: $color-primary;
      background: rgba(35, 87, 137, 0.06);
      &::after { left: $space-3; right: $space-3; }
    }

    &.router-link-active {
      color: $color-primary;
      font-weight: $font-weight-semibold;
      &::after { left: $space-3; right: $space-3; }
    }
  }

  // ---- ACTIONS ----
  &__actions {
    display: none;
    align-items: center;
    gap: $space-2;
    @include lg { display: flex; }
  }

  // ---- MOBILE MENU ----
  &__mobile {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(226, 232, 240, 0.7);
    padding: $space-3 $space-4 $space-5;
    display: flex;
    flex-direction: column;
    gap: $space-1;
    box-shadow: 0 16px 32px rgba(26, 32, 44, 0.12);

    @include lg { display: none; }
  }
}

// ---- LOGO Widget ----
.logo-icon-wrap {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, $color-primary 0%, #1E6B8C 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(35, 87, 137, 0.3);
}

.logo-text {
  font-family: $font-heading;
  font-size: 1.25rem;
  font-weight: 800;
  color: $color-text-primary;
  letter-spacing: -0.03em;
}

.logo-accent {
  color: $color-primary;
}

// ---- Language Chip ----
.lang-chip {
  display: flex;
  align-items: center;
  gap: $space-1;
  padding: 6px 12px;
  border-radius: $border-radius-full;
  border: 1.5px solid $color-border;
  background: transparent;
  color: $color-text-body;
  font-size: 0.8rem;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: $transition-fast;

  &:hover {
    border-color: $color-primary;
    color: $color-primary;
    background: rgba(35, 87, 137, 0.05);
  }

  i { font-size: 0.85rem; }
}

// ---- Nav Buttons ----
.btn-ghost {
  padding: 7px 16px;
  border-radius: $border-radius-full;
  color: $color-text-body;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  text-decoration: none;
  transition: $transition-fast;
  border: 1.5px solid transparent;

  &:hover {
    color: $color-primary;
    border-color: rgba(35, 87, 137, 0.2);
    background: rgba(35, 87, 137, 0.05);
  }
}

.btn-primary-nav {
  padding: 7px 20px;
  border-radius: $border-radius-full;
  background: linear-gradient(135deg, $color-primary 0%, #1E6B8C 100%);
  color: white;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  text-decoration: none;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(35, 87, 137, 0.25);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(35, 87, 137, 0.35);
  }
}

// ---- User Menu ----
.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: $space-2;
  cursor: pointer;
  padding: 6px 14px 6px 6px;
  border-radius: $border-radius-full;
  border: 1.5px solid $color-border;
  transition: $transition-fast;

  &:hover { border-color: $color-primary; background: rgba(35, 87, 137, 0.03); }
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-primary, #1E6B8C);
  color: white;
  font-size: 0.8rem;
  font-weight: 800;
  @include flex-center;
}

.user-name {
  font-size: 0.82rem;
  color: $color-text-body;
  font-weight: $font-weight-semibold;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  font-size: 0.65rem;
  color: $color-text-muted;
  transition: transform 0.2s ease;
  &.rotated { transform: rotate(180deg); }
}

// ---- Dropdown ----
.user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 220px;
  background: white;
  border-radius: $border-radius-lg;
  border: 1px solid $color-border-light;
  box-shadow: 0 20px 40px rgba(26, 32, 44, 0.14);
  overflow: hidden;
  z-index: 999;
}

.dropdown-header {
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: $space-3;
  background: linear-gradient(135deg, rgba(35, 87, 137, 0.05), rgba(30, 107, 140, 0.05));

  .dh-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, $color-primary, #1E6B8C);
    color: white;
    font-size: 1rem;
    font-weight: 800;
    @include flex-center;
    flex-shrink: 0;
  }

  .dh-name {
    font-size: 0.875rem;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  .dh-role {
    font-size: 0.75rem;
    color: $color-text-muted;
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: 10px 16px;
  font-size: $font-size-sm;
  color: $color-text-body;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  transition: $transition-fast;

  i { font-size: 0.9rem; color: $color-text-muted; }

  &:hover {
    background: rgba(35, 87, 137, 0.05);
    color: $color-primary;
    i { color: $color-primary; }
  }

  &--danger {
    color: #ef4444;
    i { color: #ef4444; }
    &:hover { background: rgba(239, 68, 68, 0.06); color: #dc2626; }
  }
}

.dropdown-divider {
  height: 1px;
  background: $color-border-light;
  margin: 4px 0;
}

// ---- Hamburger ----
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: none;
  border: 1.5px solid $color-border;
  border-radius: $border-radius-sm;
  cursor: pointer;
  padding: 0 9px;
  transition: $transition-fast;

  @include lg { display: none; }

  &:hover { border-color: $color-primary; }

  span {
    display: block;
    height: 1.5px;
    background: $color-text-body;
    border-radius: 1px;
    transition: all 0.3s ease;
    transform-origin: center;
  }

  &.open {
    border-color: $color-primary;
    span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
    span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
  }
}

// ---- Mobile Links ----
.mobile-link {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: 11px 12px;
  color: $color-text-body;
  text-decoration: none;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  border-radius: $border-radius-sm;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: $transition-fast;

  i { font-size: 0.9rem; color: $color-text-muted; }

  &:hover {
    background: rgba(35, 87, 137, 0.06);
    color: $color-primary;
    i { color: $color-primary; }
  }

  &.router-link-active {
    color: $color-primary;
    background: rgba(35, 87, 137, 0.08);
    font-weight: $font-weight-semibold;
  }

  &--cta {
    margin-top: $space-2;
    background: linear-gradient(135deg, $color-primary, #1E6B8C) !important;
    color: white !important;
    justify-content: center;
    border-radius: $border-radius-full;
    font-weight: $font-weight-semibold;
    i { color: white !important; }
  }

  &--danger {
    color: #ef4444;
    i { color: #ef4444; }
    &:hover { background: rgba(239, 68, 68, 0.06); }
  }
}

.mobile-divider {
  height: 1px;
  background: $color-border-light;
  margin: $space-1 0;
}

// ---- Transitions ----
.dropdown-enter-active {
  animation: dropdown-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.dropdown-leave-active {
  animation: dropdown-in 0.15s ease reverse;
}
@keyframes dropdown-in {
  from { opacity: 0; transform: translateY(-8px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.mobile-slide-enter-active { animation: mobile-slide-in 0.25s ease; }
.mobile-slide-leave-active { animation: mobile-slide-in 0.2s ease reverse; }
@keyframes mobile-slide-in {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
