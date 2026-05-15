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
      { path: 'zalopay-return', name: 'zalopay-return', component: () => import('@/views/public/ZaloPayReturnView.vue'), meta: { requiresAuth: true } },
      { path: 'my-bookings', name: 'my-bookings', component: () => import('@/views/customer/MyBookingsView.vue'), meta: { requiresAuth: true } },
      { path: 'booking-detail/:id', name: 'booking-detail', component: () => import('@/views/customer/BookingDetailView.vue'), meta: { requiresAuth: true } },
      { path: 'booking/:scheduleId', name: 'booking', component: () => import('@/views/customer/BookingView.vue'), meta: { requiresAuth: true } },
      
      // ---- STATIC PAGES ----
      { path: 'about',      name: 'about',       component: () => import('@/views/public/AboutUsView.vue') },
      { path: 'contact',    name: 'contact',     component: () => import('@/views/public/ContactView.vue') },
      { path: 'blog',       name: 'blog',        component: () => import('@/views/public/BlogView.vue') },
      { path: 'destinations', name: 'destinations', component: () => import('@/views/public/DestinationsView.vue') },
      { path: 'services',   name: 'services',    component: () => import('@/views/public/ServicesView.vue') },
      { path: 'privacy-policy', name: 'privacy-policy', component: () => import('@/views/public/PrivacyPolicyView.vue') },
      { path: 'terms-of-use', name: 'terms-of-use', component: () => import('@/views/public/TermsOfUseView.vue') },
      
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

  // ---- CUSTOMER (đã chuyển vào DefaultLayout ở trên) ----

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
      { path: 'participants', name: 'admin-participants', component: () => import('@/views/admin/AdminParticipantsView.vue') },
      { path: 'reviews', name: 'admin-reviews', component: () => import('@/views/admin/AdminReviewsView.vue') },
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
