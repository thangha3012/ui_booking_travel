import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  // ---- PUBLIC LAYOUT ----
  {
    path: '/',
    component: () => import('@/layout/DefaultLayout.vue'),
    children: [
      { path: '',          name: 'home',        component: () => import('@/views/public/HomeView.vue') },
      { path: 'tours',     name: 'tours',       component: () => import('@/views/public/TourListView.vue') },
      { path: 'tours/:id', name: 'tour-detail', component: () => import('@/views/public/TourDetailView.vue') },
      { path: 'checkout',  name: 'checkout',    component: () => import('@/views/public/CheckoutView.vue'), meta: { requiresAuth: true } },
      
      // ---- AUTH (bây giờ có navbar/footer) ----
      {
        path: 'login',    name: 'login',    component: () => import('@/views/auth/LoginView.vue'),    meta: { guestOnly: true },
      },
      {
        path: 'register', name: 'register', component: () => import('@/views/auth/RegisterView.vue'), meta: { guestOnly: true },
      },
      {
        path: 'forgot-password', name: 'forgot-password', component: () => import('@/views/auth/ForgotPasswordView.vue'), meta: { guestOnly: true },
      },
    ],
  },

  // ---- CUSTOMER (cần đăng nhập) ----
  {
    path: '/booking/:scheduleId', name: 'booking', component: () => import('@/views/customer/BookingView.vue'), meta: { requiresAuth: true },
  },
  {
    path: '/my-bookings', name: 'my-bookings', component: () => import('@/views/customer/MyBookingsView.vue'), meta: { requiresAuth: true },
  },

  // ---- ADMIN (cần đăng nhập + role Admin) ----
  {
    path: '/admin',
    component: () => import('@/layout/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '',       name: 'admin',             component: () => import('@/views/admin/AdminDashboardView.vue') },
      { path: 'tours',  name: 'admin-tours',       component: () => import('@/views/admin/AdminToursView.vue') },
      { path: 'users',  name: 'admin-users',       component: () => import('@/views/admin/AdminUsersView.vue') },
      { path: 'categories', name: 'admin-categories', component: () => import('@/views/admin/AdminCategoriesView.vue') },
      { path: 'destinations', name: 'admin-destinations', component: () => import('@/views/admin/AdminDestinationsView.vue') },
      { path: 'bookings', name: 'admin-bookings', component: () => import('@/views/admin/AdminBookingsView.vue') },
    ],
  },

  // ---- 404 ----
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// ---- NAVIGATION GUARDS ----
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return next({ name: 'home' })
  }

  if (to.meta.guestOnly && auth.isLoggedIn) {
    return next({ name: 'home' })
  }

  next()
})

export default router
