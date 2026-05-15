<template>
  <div class="admin-layout">
    <!-- SIDEBAR -->
    <aside class="admin-sidebar" :class="{ 'is-collapsed': isSidebarCollapsed }">
      <div class="sidebar-header">
        <i class="pi pi-send logo-icon"></i>
        <h2 v-if="!isSidebarCollapsed" class="logo-text">
          Triptopia <span class="badge">Admin</span>
        </h2>
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
        <RouterLink to="/admin/participants" class="nav-item" active-class="active">
          <i class="pi pi-users icon"></i>
          <span v-if="!isSidebarCollapsed">{{ $t('admin.sidebar.participants') }}</span>
        </RouterLink>
        <RouterLink to="/admin/reviews" class="nav-item" active-class="active">
          <i class="pi pi-star icon"></i>
          <span v-if="!isSidebarCollapsed">Đánh giá</span>
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
            <span class="path">{{ $t('admin.header.breadcrumb') }}</span> /
            <span class="current">{{ pageTitle }}</span>
          </div>
          <RouterLink to="/" class="no-underline">
            <Button
              label="Trang chủ"
              icon="pi pi-home"
              text
              severity="secondary"
              size="small"
              class="ml-4"
            />
          </RouterLink>
        </div>

        <div class="header-right">
          <!-- Language Switcher -->
          <Button
            :label="locale.toUpperCase()"
            text
            rounded
            size="small"
            icon="pi pi-globe"
            @click="toggleLang"
            class="admin-lang-btn"
          />

          <div class="notification"><i class="pi pi-bell"></i> <span class="badge-dot"></span></div>
          <div class="user-profile">
            <img
              src="https://ui-avatars.com/api/?name=Admin+User&background=0284c7&color=fff"
              alt="Admin"
            />
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
  if (path.includes('/participants')) return t('admin.sidebar.participants')
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

body {
  margin: 0;
  padding: 0;
  background-color: $color-bg-page;
}

.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: $color-bg-page;
  font-family: $font-body;
  color: $color-text-primary;
}

// ========================
// SIDEBAR — Modern Floating Glassy Style
// ========================
.admin-sidebar {
  width: $sidebar-width;
  background: white;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  margin: $space-4;
  border-radius: $border-radius-2xl;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 30px rgba(35, 87, 137, 0.08);
  position: relative;
  height: calc(100vh - #{$space-8});

  &.is-collapsed {
    width: 80px;
    margin: $space-4 $space-2;
  }
}

.sidebar-header {
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  margin-bottom: $space-2;
  flex-shrink: 0;
  .admin-sidebar.is-collapsed & { justify-content: center; padding: 0; }
  
  .logo-icon {
    font-size: 28px;
    background: linear-gradient(135deg, $color-primary 0%, #1E6B8C 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 4px rgba(35, 87, 137, 0.2));
    margin-right: 12px;
  }
  
  .logo-text {
    font-size: 19px;
    color: $color-text-primary;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.03em;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .badge {
    background: rgba(255, 107, 53, 0.1);
    color: $color-accent;
    font-size: 10px;
    padding: 3px 10px;
    border-radius: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.sidebar-nav {
  flex: 1;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 14px;
  text-decoration: none;
  color: $color-text-secondary;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
  margin: 1px 0;

  .admin-sidebar.is-collapsed & { 
    justify-content: center; 
    padding: 12px 0;
    width: 48px;
    margin: 4px auto;
  }
  
  .icon {
    font-size: 19px;
    transition: transform 0.3s ease;
    color: $color-text-muted;
  }
  
  &:hover {
    background: rgba(35, 87, 137, 0.05);
    color: $color-primary;
    .icon { color: $color-primary; transform: translateX(2px); }
  }
  
  &.active {
    background: linear-gradient(135deg, $color-primary 0%, #1E6B8C 100%);
    color: white;
    box-shadow: 0 8px 20px rgba(35, 87, 137, 0.25);
    
    .icon { color: white; }
    &:hover { transform: none; }
  }
}

.sidebar-footer {
  padding: 20px 16px;
  border-top: 1px solid rgba(226, 232, 240, 0.6);
  flex-shrink: 0;
}

.logout-btn {
  color: #ef4444;
  &:hover {
    background: #fef2f2;
    color: #dc2626;
    .icon { color: #dc2626; }
  }
}

// ========================
// MAIN CONTENT & HEADER
// ========================
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  padding-left: 0;
}

.admin-header {
  height: 80px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 50;
  margin-top: $space-4;
  margin-right: $space-4;
  border-radius: $border-radius-2xl;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);

  .header-left {
    display: flex; align-items: center; gap: 24px;
    .toggle-btn { 
      width: 40px; height: 40px; border-radius: 12px;
      background: #f8fafc; border: 1px solid #e2e8f0;
      font-size: 18px; cursor: pointer; color: $color-text-secondary; 
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
      &:hover { background: white; color: $color-primary; border-color: $color-primary-light; }
    }
    .breadcrumb { 
      font-size: 13px; color: $color-text-muted; font-weight: 500;
      .path { font-weight: 400; }
      .current { color: $color-text-primary; font-weight: 700; margin-left: 4px; }
    }
  }

  .header-right {
    display: flex; align-items: center; gap: 24px;
    
    .notification {
      width: 40px; height: 40px; border-radius: 12px;
      background: #f8fafc; border: 1px solid #e2e8f0;
      display: flex; align-items: center; justify-content: center;
      position: relative; font-size: 18px; cursor: pointer; color: $color-text-secondary;
      transition: all 0.2s;
      &:hover { background: white; color: $color-primary; }
      .badge-dot { 
        position: absolute; top: 10px; right: 10px; width: 8px; height: 8px; 
        background: $color-danger; border-radius: 50%; border: 2px solid white; 
      }
    }
    
    .user-profile {
      display: flex; align-items: center; gap: 12px; cursor: pointer;
      padding: 4px 14px 4px 4px; border-radius: $border-radius-full;
      background: #f8fafc; border: 1px solid #e2e8f0;
      transition: all 0.2s;
      &:hover { background: white; border-color: $color-primary-light; }
      img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
      .name { font-size: 13px; font-weight: 700; color: $color-text-primary; }
    }
  }
}

.admin-content {
  padding: $space-4 $space-4 $space-4 0;
  margin-right: $space-4;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; // Important: Prevents whole page scroll
}

.admin-lang-btn {
  font-size: 12px !important;
  color: $color-text-secondary !important;
  font-weight: 700 !important;
  &:hover { color: $color-primary !important; }
}

// ========================
// GLOBAL ADMIN COMPONENTS
// ========================
.admin-card {
  background: white; 
  border-radius: $border-radius-2xl;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.7);
  padding: 32px;
  transition: all 0.3s ease;
  flex: 1; // Grow to fill space
  display: flex;
  flex-direction: column;
  overflow: hidden; // Contain the table
  &:hover { box-shadow: 0 15px 40px rgba(0, 0, 0, 0.06); }
}

.admin-page-header {
  display: flex; justify-content: space-between; align-items: center; 
  margin-bottom: 24px;
  flex-shrink: 0;
  .page-title { 
    font-size: 28px; font-weight: 800; color: $color-text-primary; margin: 0; 
    letter-spacing: -0.04em;
  }
}


// TABLE STYLES — Tonal layering
.admin-table-wrap {
  width: 100%;
  overflow-x: auto;
  .admin-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    th {
      background: $color-bg-surface;
      color: $color-text-secondary;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
      padding: 14px 18px;
      letter-spacing: 0.06em;
      border-bottom: none;
      &:first-child {
        border-radius: $border-radius-md 0 0 $border-radius-md;
      }
      &:last-child {
        border-radius: 0 $border-radius-md $border-radius-md 0;
      }
    }
    td {
      padding: 16px 18px;
      border-bottom: none;
      color: $color-text-primary;
      font-size: 14px;
      vertical-align: middle;
    }
    tbody tr {
      transition: $transition-base;
      &:hover td {
        background: $color-bg-page;
        &:first-child {
          border-radius: $border-radius-md 0 0 $border-radius-md;
        }
        &:last-child {
          border-radius: 0 $border-radius-md $border-radius-md 0;
        }
      }
    }
    tbody tr:nth-child(even) td {
      background: rgba($color-bg-surface, 0.5);
    }
  }
}

// STATUS BADGE — Gradient pills
.status-badge {
  padding: 5px 14px;
  border-radius: $border-radius-full;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  &.active {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    color: #065f46;
  }
  &.inactive {
    background: linear-gradient(135deg, #fecdd3, #fda4af);
    color: #9f1239;
  }
  &.pending {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    color: #92400e;
  }
}

.action-btns {
  display: flex;
  gap: 6px;
  button {
    background: $color-bg-surface;
    border: none;
    cursor: pointer;
    font-size: 15px;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: $transition-base;
    &:hover {
      background: $color-border;
      transform: scale(1.08);
    }
  }
}
</style>
