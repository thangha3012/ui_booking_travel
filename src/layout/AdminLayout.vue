<template>
  <div class="admin-layout">
    <!-- SIDEBAR -->
    <aside class="admin-sidebar" :class="{ 'is-collapsed': isSidebarCollapsed }">
      <div class="sidebar-header">
        <i class="pi pi-send logo-icon"></i>
        <h2 v-if="!isSidebarCollapsed" class="logo-text">Triptopia <span class="badge">Admin</span></h2>
      </div>

      <nav class="sidebar-nav">
        <RouterLink to="/admin" class="nav-item" exact-active-class="active">
          <i class="pi pi-chart-bar icon"></i>
          <span v-if="!isSidebarCollapsed">{{ $t('admin.sidebar.dashboard') }}</span>
        </RouterLink>
        <RouterLink to="/admin/tours" class="nav-item" active-class="active">
          <i class="pi pi-map icon"></i>
          <span v-if="!isSidebarCollapsed">{{ $t('admin.sidebar.tours') }}</span>
        </RouterLink>
        <RouterLink to="/admin/categories" class="nav-item" active-class="active">
          <i class="pi pi-list icon"></i>
          <span v-if="!isSidebarCollapsed">{{ $t('admin.sidebar.categories') }}</span>
        </RouterLink>
        <RouterLink to="/admin/destinations" class="nav-item" active-class="active">
          <i class="pi pi-map-marker icon"></i>
          <span v-if="!isSidebarCollapsed">{{ $t('admin.sidebar.destinations') }}</span>
        </RouterLink>
        <RouterLink to="/admin/users" class="nav-item" active-class="active">
          <i class="pi pi-users icon"></i>
          <span v-if="!isSidebarCollapsed">{{ $t('admin.sidebar.users') }}</span>
        </RouterLink>
        <RouterLink to="/admin/bookings" class="nav-item" active-class="active">
           <i class="pi pi-ticket icon"></i>
           <span v-if="!isSidebarCollapsed">{{ $t('admin.sidebar.bookings') }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <button class="nav-item logout-btn" @click="handleLogout">
          <i class="pi pi-sign-out icon"></i>
          <span v-if="!isSidebarCollapsed">{{ $t('admin.sidebar.logout') }}</span>
        </button>
      </div>
    </aside>

    <!-- CONTENT AREA -->
    <div class="admin-main">
      <!-- HEADER -->
      <header class="admin-header">
        <div class="header-left">
          <button class="toggle-btn" @click="isSidebarCollapsed = !isSidebarCollapsed">
            <i class="pi pi-bars"></i>
          </button>
          <div class="breadcrumb">
            <span class="path">{{ $t('admin.header.breadcrumb') }}</span> / <span class="current">{{ pageTitle }}</span>
          </div>
        </div>

        <div class="header-right">
          <!-- Language Switcher -->
          <Button :label="locale.toUpperCase()" text rounded size="small" icon="pi pi-globe" @click="toggleLang" class="admin-lang-btn" />

          <div class="notification">
            <i class="pi pi-bell"></i> <span class="badge-dot"></span>
          </div>
          <div class="user-profile">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=0284c7&color=fff" alt="Admin" />
            <span class="name">{{ $t('admin.header.userProfile') }}</span>
          </div>
        </div>
      </header>

      <!-- PAGE CONTENT -->
      <main class="admin-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'
import { useToast } from '@/composables/useToast'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()
const toast = useToast()
const { t, locale } = useI18n()

const isSidebarCollapsed = ref(false)

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/admin') return t('admin.sidebar.dashboard')
  if (path.includes('/tours')) return t('admin.sidebar.tours')
  if (path.includes('/users')) return t('admin.sidebar.users')
  if (path.includes('/bookings')) return t('admin.sidebar.bookings')
  if (path.includes('/categories')) return t('admin.sidebar.categories')
  if (path.includes('/destinations')) return t('admin.sidebar.destinations')
  return t('admin.header.breadcrumb')
})

function toggleLang() {
  const next = locale.value === 'vi' ? 'en' : 'vi'
  locale.value = next
  appStore.setLocale(next)
}

function handleLogout() {
  authStore.logout()
  toast.success(t('admin.header.logoutSuccess'))
  router.push('/login')
}
</script>

<style lang="scss">
@use '@/assets/styles/variables' as *;

// =============================================
// TRIPTOPIA NORTH — Admin Dashboard Design System
// From Stitch Design + User Brand Spec
// =============================================

body { margin: 0; padding: 0; background-color: $color-bg-page; }

.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: $color-bg-page;
  font-family: $font-body;
  color: $color-text-primary;
}

// ========================
// SIDEBAR
// ========================
.admin-sidebar {
  width: $sidebar-width;
  background: $gradient-sidebar;
  color: rgba(255,255,255,0.7);
  display: flex;
  flex-direction: column;
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  box-shadow: 4px 0 24px rgba(35,87,137,0.12);
  &.is-collapsed { width: 80px; }
}

.sidebar-header {
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  .admin-sidebar.is-collapsed & { justify-content: center; padding: 0; }
  .logo-icon { font-size: 26px; margin-right: 12px; filter: drop-shadow(0 2px 4px rgba(255,255,255,0.2)); }
  .logo-text { 
    font-size: 18px; color: white; font-weight: 700; margin: 0; letter-spacing: -0.02em;
    display: flex; align-items: center; gap: 10px;
  }
  .badge { 
    background: $color-accent; 
    font-size: 10px; padding: 3px 8px; border-radius: 6px; font-weight: 600;
    box-shadow: 0 2px 8px rgba(255,107,53,0.3);
  }
}

.sidebar-nav {
  flex: 1;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 16px;
  border-radius: $border-radius-md;
  text-decoration: none;
  color: rgba(255,255,255,0.65);
  font-weight: 500;
  transition: $transition-base;
  border: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
  letter-spacing: 0.01em;
  .admin-sidebar.is-collapsed & { justify-content: center; padding: 13px 0; }
  .icon { font-size: 18px; font-style: normal; opacity: 0.8; transition: opacity 0.2s; }
  &:hover { 
    background: rgba(255,255,255,0.08); 
    color: white; 
    .icon { opacity: 1; }
  }
  &.active {
    background: rgba(255,255,255,0.15);
    color: white;
    font-weight: 600;
    border-left: 3px solid $color-accent;
    box-shadow: 0 4px 16px rgba(35,87,137,0.2);
    .icon { opacity: 1; }
  }
}

.logout-btn {
  color: rgba(239,68,68,0.85);
  &:hover { background: rgba(239,68,68,0.1); color: #f87171; }
}
.sidebar-footer {
  padding: 16px 14px; border-top: 1px solid rgba(255,255,255,0.08);
}

// ========================
// MAIN CONTENT & HEADER — Glassmorphism
// ========================
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: $color-bg-page;
}

.admin-header {
  height: $navbar-height;
  background: $glass-bg;
  backdrop-filter: $glass-blur;
  -webkit-backdrop-filter: $glass-blur;
  padding: 0 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 0 $glass-border;
  position: sticky; top: 0; z-index: 50;

  .header-left {
    display: flex; align-items: center; gap: 24px;
    .toggle-btn { 
      background: none; border: none; font-size: 20px; cursor: pointer; color: $color-text-secondary; 
      transition: color 0.2s;
      &:hover { color: $color-text-primary; }
    }
    .breadcrumb { 
      font-size: 13px; color: $color-text-secondary; letter-spacing: 0.02em; font-weight: 500;
      .current { color: $color-text-primary; font-weight: 600; }
    }
  }

  .header-right {
    display: flex; align-items: center; gap: 28px;
    .notification {
      position: relative; font-size: 20px; cursor: pointer; opacity: 0.7;
      transition: opacity 0.2s;
      &:hover { opacity: 1; }
      .badge-dot { 
        position: absolute; top: -2px; right: -2px; width: 9px; height: 9px; 
        background: $color-danger; 
        border-radius: 50%; border: 2px solid white; 
      }
    }
    .user-profile {
      display: flex; align-items: center; gap: 12px; cursor: pointer;
      padding: 6px 12px 6px 6px; border-radius: $border-radius-full;
      transition: background 0.2s;
      &:hover { background: rgba(0,0,0,0.03); }
      img { width: 36px; height: 36px; border-radius: 50%; border: 2px solid $color-border; }
      .name { font-size: 13px; font-weight: 600; color: $color-text-primary; }
    }
  }
}

.admin-lang-btn {
  font-size: 12px !important;
  color: $color-text-secondary !important;
  font-weight: 700 !important;
  &:hover { color: $color-primary !important; }
}

.admin-content {
  padding: 36px;
  flex: 1;
}

// ========================
// COMMON ADMIN UI — Design Tokens
// ========================
.admin-card {
  background: $color-bg-card; 
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;
  border: none;
  padding: 28px;
  transition: $transition-base;
}

.admin-page-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px;
  .page-title { 
    font-size: 26px; font-weight: 700; color: $color-text-primary; margin: 0; 
    letter-spacing: -0.025em;
  }
  .admin-btn {
    background: $gradient-primary; 
    color: white; border: none; padding: 11px 22px;
    border-radius: $border-radius-full; font-weight: 600; cursor: pointer; 
    transition: $transition-base;
    box-shadow: 0 4px 14px rgba(35,87,137,0.25);
    font-size: 13px; letter-spacing: 0.01em;
    &:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(35,87,137,0.35); }
    &--danger { 
        background: linear-gradient(135deg, $color-danger, #f43f5e); 
        box-shadow: 0 4px 14px rgba(239, 68, 68, 0.25);
        &:hover { box-shadow: 0 8px 20px rgba(239, 68, 68, 0.35); }
    }
  }
}

// TABLE STYLES — Tonal layering
.admin-table-wrap {
  width: 100%; overflow-x: auto;
  .admin-table {
    width: 100%; border-collapse: collapse; text-align: left;
    th { 
      background: $color-bg-surface; color: $color-text-secondary; font-size: 11px; text-transform: uppercase; 
      font-weight: 600; padding: 14px 18px; letter-spacing: 0.06em;
      border-bottom: none;
      &:first-child { border-radius: $border-radius-md 0 0 $border-radius-md; }
      &:last-child { border-radius: 0 $border-radius-md $border-radius-md 0; }
    }
    td { 
      padding: 16px 18px; border-bottom: none; color: $color-text-primary; font-size: 14px; 
      vertical-align: middle; 
    }
    tbody tr { 
      transition: $transition-base;
      &:hover td { 
        background: $color-bg-page;
        &:first-child { border-radius: $border-radius-md 0 0 $border-radius-md; }
        &:last-child { border-radius: 0 $border-radius-md $border-radius-md 0; }
      }
    }
    tbody tr:nth-child(even) td { background: rgba($color-bg-surface, 0.5); }
  }
}

// STATUS BADGE — Gradient pills
.status-badge {
  padding: 5px 14px; border-radius: $border-radius-full; font-size: 11px; font-weight: 600;
  letter-spacing: 0.03em; text-transform: uppercase;
  &.active { background: linear-gradient(135deg, #d1fae5, #a7f3d0); color: #065f46; }
  &.inactive { background: linear-gradient(135deg, #fecdd3, #fda4af); color: #9f1239; }
  &.pending { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #92400e; }
}

.action-btns {
  display: flex; gap: 6px;
  button { 
    background: $color-bg-surface; border: none; cursor: pointer; font-size: 15px; 
    width: 34px; height: 34px; border-radius: 10px; 
    display: flex; align-items: center; justify-content: center;
    transition: $transition-base; 
    &:hover { background: $color-border; transform: scale(1.08); } 
  }
}
</style>


