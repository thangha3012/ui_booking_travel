<template>
  <div class="my-bookings-page">
    <!-- Hero Banner -->
    <div class="bookings-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">{{ $t('booking.myBookings.title') }}</h1>
        <p class="hero-subtitle">{{ $t('booking.myBookings.subtitle') }}</p>
      </div>
    </div>

    <div class="container bookings-container">
      <!-- Filter tabs -->
      <div class="filter-tabs">
        <button v-for="tab in tabs" :key="tab.value"
          class="tab-btn" :class="{ active: activeTab === tab.value }" @click="activeTab = tab.value">
          {{ tab.label }}
        </button>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>{{ $t('booking.myBookings.loading') }}</p>
      </div>

      <div v-else-if="filteredBookings.length === 0" class="empty-state">
        <div class="empty-icon">✈️</div>
        <h3>{{ $t('booking.myBookings.empty.title') }}</h3>
        <p>{{ $t('booking.myBookings.empty.desc') }}</p>
        <RouterLink to="/tours" class="explore-btn">{{ $t('booking.myBookings.empty.explore') }}</RouterLink>
      </div>

      <div v-else class="bookings-list">
        <div v-for="booking in filteredBookings" :key="booking.id" class="ticket-card">
          <!-- Left: Ticket stub -->
          <div class="ticket-left">
            <div class="ticket-label">{{ $t('booking.myBookings.ticket.label') }}</div>
            <div class="ticket-id">#{{ booking.id }}</div>
            <div class="ticket-date-label">{{ $t('booking.myBookings.ticket.booked') }}</div>
            <div class="ticket-date">{{ formatDate(booking.createdAt) }}</div>
          </div>

          <!-- Dotted separator -->
          <div class="ticket-separator">
            <div class="circle-top"></div>
            <div class="dashed-line"></div>
            <div class="circle-bottom"></div>
          </div>

          <!-- Right: Tour info -->
          <div class="ticket-right">
            <div class="ticket-main">
              <h3 class="tour-name">{{ booking.tourName }}</h3>
              <div class="tour-details">
                <span class="detail-pill">📅 {{ formatDate(booking.departureDate) }}</span>
                <span class="detail-pill">👥 {{ booking.numberOfPassengers }} {{ $t('booking.myBookings.ticket.travelers') }}</span>
              </div>
            </div>
            <div class="ticket-price-block">
              <div class="ticket-status" :class="getStatusClass(booking.status)">
                {{ getStatusLabel(booking.status) }}
              </div>
              <div class="ticket-price">
                <span class="price-amount">${{ booking.totalAmount?.toLocaleString() }}</span>
              </div>
              <button v-if="booking.status === 1" class="pay-now-btn">{{ $t('booking.myBookings.ticket.payNow') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Chatbot Button -->
    <div class="chatbot-fab" title="Chat with us">
      💬
      <span class="fab-dot"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { bookingApi } from '@/api/bookingApi'
import { useToast } from '@/composables/useToast'

const { t, locale } = useI18n()
const toast = useToast()
const bookings = ref([])
const loading = ref(true)
const activeTab = ref('All')

const tabs = computed(() => [
  { label: t('booking.myBookings.tabs.all'), value: 'All' },
  { label: t('booking.myBookings.tabs.upcoming'), value: 'Upcoming' },
  { label: t('booking.myBookings.tabs.completed'), value: 'Completed' },
  { label: t('booking.myBookings.tabs.cancelled'), value: 'Cancelled' }
])

async function fetchMyBookings() {
  loading.value = true
  try {
    const res = await bookingApi.getMyBookings()
    bookings.value = res.data || res || []
  } catch { toast.error(t('common.error')) }
  finally { loading.value = false }
}

const filteredBookings = computed(() => {
  if (activeTab.value === 'All') return bookings.value
  const statusMap = { Upcoming: 1, Completed: 4, Cancelled: 3 }
  return bookings.value.filter(b => b.status === statusMap[activeTab.value])
})

function formatDate(d) {
  if (!d) return 'N/A'
  return new Date(d).toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  })
}

function getStatusLabel(s) {
  return { 
    1: t('booking.myBookings.status.pending'), 
    2: t('booking.myBookings.status.confirmed'), 
    3: t('booking.myBookings.status.cancelled'), 
    4: t('booking.myBookings.status.completed') 
  }[s] || t('booking.myBookings.status.unknown')
}

function getStatusClass(s) {
  return { 1: 'status-pending', 2: 'status-confirmed', 3: 'status-cancelled', 4: 'status-completed' }[s] || ''
}

onMounted(fetchMyBookings)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.my-bookings-page {
  min-height: 100vh;
  background: $color-bg-page;
  font-family: $font-body;
}

// ---- Hero ----
.bookings-hero {
  position: relative;
  height: 280px;
  background: url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80') center/cover;
  display: flex; align-items: center; justify-content: center;
  padding-top: $navbar-height;
}
.hero-overlay {
  position: absolute; inset: 0;
  background: $gradient-hero;
  opacity: 0.92;
}
.hero-content { position: relative; z-index: 1; text-align: center; color: white; }
.hero-title { font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 700; letter-spacing: -0.03em; margin: 0 0 8px; }
.hero-subtitle { font-size: 15px; opacity: 0.75; font-weight: 400; }

// ---- Container ----
.bookings-container { max-width: 920px; margin: -40px auto 0; padding: 0 24px 80px; position: relative; z-index: 10; }

// ---- Filter Tabs ----
.filter-tabs {
  display: flex; gap: 8px; margin-bottom: 28px; justify-content: center;
}
.tab-btn {
  padding: 8px 20px; border-radius: $border-radius-full; border: none; background: $color-bg-card;
  color: $color-text-body; font-size: 13px; font-weight: 600; cursor: pointer;
  box-shadow: $shadow-sm; transition: $transition-base;
  &.active { background: $color-primary; color: white; box-shadow: 0 4px 12px rgba(35,87,137,0.25); }
  &:hover:not(.active) { background: $color-bg-surface; }
}

// ---- Loading & Empty ----
.loading-state, .empty-state { text-align: center; padding: 80px 20px; background: white; border-radius: $border-radius-lg; box-shadow: $shadow-lg; }
.spinner { width: 36px; height: 36px; border: 3px solid $color-border; border-top-color: $color-primary; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 20px; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-icon { font-size: 56px; margin-bottom: 16px; }
.empty-state h3 { font-size: 22px; color: $color-text-primary; font-weight: 700; margin-bottom: 8px; }
.empty-state p { color: $color-text-secondary; margin-bottom: 28px; font-size: 14px; }
.explore-btn {
  display: inline-block; background: $gradient-primary; color: white; padding: 12px 28px;
  border-radius: $border-radius-full; text-decoration: none; font-weight: 600; font-size: 13px;
  box-shadow: 0 4px 14px rgba(35,87,137,0.25); transition: $transition-base;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(35,87,137,0.35); }
}

// ---- Ticket Card — Boarding Pass Style ----
.bookings-list { display: flex; flex-direction: column; gap: 20px; }
.ticket-card {
  display: flex; background: white; border-radius: $border-radius-lg;
  box-shadow: $shadow-card; overflow: hidden; transition: $transition-base;
  &:hover { transform: translateY(-3px); box-shadow: $shadow-card-hover; }
}

.ticket-left {
  width: 130px; min-width: 130px;
  background: $gradient-primary;
  color: white; padding: 28px 20px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; gap: 4px;
}
.ticket-label { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.6; }
.ticket-id { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 12px; }
.ticket-date-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.5; }
.ticket-date { font-size: 12px; font-weight: 500; opacity: 0.85; }

.ticket-separator {
  width: 1px; position: relative; display: flex; flex-direction: column; align-items: center;
  .circle-top, .circle-bottom { width: 20px; height: 20px; border-radius: 50%; background: $color-bg-page; position: absolute; z-index: 2; }
  .circle-top { top: -10px; }
  .circle-bottom { bottom: -10px; }
  .dashed-line { flex: 1; width: 0; border-left: 2px dashed rgba($color-border, 0.6); margin: 10px 0; }
}

.ticket-right {
  flex: 1; padding: 24px 28px; display: flex; justify-content: space-between; align-items: center; gap: 24px;
}
.ticket-main { flex: 1; }
.tour-name { font-size: 17px; font-weight: 700; color: $color-text-primary; margin: 0 0 12px; letter-spacing: -0.01em; }
.tour-details { display: flex; gap: 8px; flex-wrap: wrap; }
.detail-pill {
  padding: 4px 12px; background: $color-bg-surface; border-radius: $border-radius-full;
  font-size: 12px; color: $color-text-body; font-weight: 500;
}

.ticket-price-block { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; min-width: 140px; }
.ticket-status {
  padding: 5px 14px; border-radius: $border-radius-full; font-size: 11px; font-weight: 600;
  letter-spacing: 0.03em; text-transform: uppercase;
}
.status-pending { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #92400e; }
.status-confirmed { background: linear-gradient(135deg, #d1fae5, #a7f3d0); color: #065f46; }
.status-cancelled { background: linear-gradient(135deg, #fecdd3, #fda4af); color: #9f1239; }
.status-completed { background: $color-bg-surface; color: $color-text-body; }
.price-amount { font-size: 24px; font-weight: 700; color: $color-text-primary; letter-spacing: -0.03em; }
.pay-now-btn {
  background: $gradient-primary; color: white; border: none; padding: 8px 18px; border-radius: $border-radius-full;
  font-size: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(35,87,137,0.2);
  transition: $transition-base;
  &:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(35,87,137,0.3); }
}

// Chatbot FAB
.chatbot-fab {
  position: fixed; bottom: 28px; right: 28px;
  width: 56px; height: 56px; border-radius: 50%;
  background: $color-primary; color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; cursor: pointer; box-shadow: 0 8px 24px rgba(35,87,137,0.3);
  transition: $transition-base; z-index: 999;
  &:hover { transform: scale(1.08); box-shadow: 0 12px 32px rgba(35,87,137,0.4); }
  .fab-dot {
    position: absolute; top: 2px; right: 2px; width: 12px; height: 12px;
    background: $color-accent; border-radius: 50%; border: 2px solid white;
  }
}

@media (max-width: 640px) {
  .ticket-card { flex-direction: column; }
  .ticket-left { width: 100%; min-width: unset; flex-direction: row; gap: 16px; padding: 16px 20px; }
  .ticket-separator { display: none; }
  .ticket-right { flex-direction: column; align-items: flex-start; }
}
</style>
