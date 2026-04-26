<template>
  <div class="my-bookings-page">
    <!-- Hero Banner -->
    <div class="bookings-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">{{ t('booking.myBookings.title') }}</h1>
        <p class="hero-subtitle">{{ t('booking.myBookings.subtitle') }}</p>
      </div>
    </div>

    <div class="container bookings-container">
      <!-- Filter tabs -->
      <div class="tabs-container">
        <Tabs v-model:value="activeTab">
          <TabList>
            <Tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
              {{ tab.label }}
            </Tab>
          </TabList>
        </Tabs>
      </div>

      <div v-if="loading" class="bookings-grid">
         <div v-for="n in 3" :key="n" class="skeleton-ticket mb-6">
            <Skeleton height="150px" borderRadius="16px"></Skeleton>
         </div>
      </div>

      <div v-else-if="filteredBookings.length === 0" class="empty-state">
        <div class="empty-icon">
           <i class="pi pi-map-marker"></i>
        </div>
        <h3>{{ t('booking.myBookings.empty.title') }}</h3>
        <p>{{ t('booking.myBookings.empty.desc') }}</p>
        <Button label="Explore Tours" icon="pi pi-compass" raised @click="router.push('/tours')" />
      </div>

      <div v-else class="bookings-list">
        <div v-for="booking in pagedBookings" :key="booking.id" class="ticket-card animate-fade-in">
          <!-- Left: Ticket stub -->
          <div class="ticket-left">
            <div class="ticket-label">TICKET</div>
            <div class="ticket-id">#{{ booking.id }}</div>
            <div class="ticket-date-label">BOOKED ON</div>
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
                <span class="detail-pill"><i class="pi pi-calendar-plus mr-1"></i> {{ formatDate(booking.departureDate) }}</span>
                <span class="detail-pill"><i class="pi pi-users mr-1"></i> {{ booking.numberOfPassengers }} Travelers</span>
                <span class="detail-pill currency"><i class="pi pi-wallet mr-1"></i> ${{ booking.totalAmount?.toLocaleString() }}</span>
              </div>
            </div>
            
            <div class="ticket-actions">
              <div class="status-wrap mb-4">
                 <Tag :value="getStatusLabel(booking.status)" :severity="getStatusSeverity(booking.status)" rounded />
              </div>
              
              <div class="flex gap-2">
                 <!-- Pay Now for Pending/Awaiting -->
                 <Button v-if="booking.status === 1 || booking.status === 2" 
                    label="Pay Now" 
                    icon="pi pi-credit-card" 
                    size="small"
                    @click="router.push({ name: 'checkout', query: { bookingId: booking.id } })" />
                 
                 <!-- Cancel for Pending/Awaiting -->
                 <Button v-if="booking.status === 1 || booking.status === 2" 
                    label="Cancel" 
                    icon="pi pi-times" 
                    severity="danger" 
                    size="small"
                    outlined
                    @click="confirmCancel(booking)" />
                 
                 <!-- Track/Details for others -->
                 <Button v-if="booking.status === 3 || booking.status === 5" 
                    label="Itinerary" 
                    icon="pi pi-map" 
                    severity="secondary" 
                    size="small"
                    text />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginator -->
      <div v-if="filteredBookings.length > pageSize" class="paginator-wrap">
        <Paginator
          v-model:first="pageFirst"
          :rows="pageSize"
          :totalRecords="filteredBookings.length"
          :rowsPerPageOptions="[5, 10, 20]"
          @page="onPageChange"
        />
      </div>
    </div>
    
    <!-- Confirm Dialog -->
    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { bookingApi } from '@/api/bookingApi'

// PrimeVue
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Skeleton from 'primevue/skeleton'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import Paginator from 'primevue/paginator'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const { t, locale } = useI18n()
const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

const bookings = ref([])
const loading = ref(true)
const activeTab = ref('All')
const pageFirst = ref(0)
const pageSize = ref(5)

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
  } catch (err) { 
    toast.add({ severity: 'error', summary: 'Error', detail: t('common.error'), life: 3000 })
  } finally { loading.value = false }
}

const filteredBookings = computed(() => {
  if (activeTab.value === 'All') return bookings.value
  const statusMap = { Upcoming: [1, 2, 3], Completed: [5], Cancelled: [4] }
  return bookings.value.filter(b => statusMap[activeTab.value]?.includes(b.status))
})

watch(activeTab, () => { pageFirst.value = 0 })

const pagedBookings = computed(() => {
  return filteredBookings.value.slice(pageFirst.value, pageFirst.value + pageSize.value)
})

function onPageChange(event) {
  pageFirst.value = event.first
  pageSize.value = event.rows
}

function formatDate(d) {
  if (!d) return 'N/A'
  return new Date(d).toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  })
}

function getStatusLabel(s) {
  return {
    1: t('booking.myBookings.status.pending'),
    2: 'Awaiting Confirmation',
    3: t('booking.myBookings.status.confirmed'),
    4: t('booking.myBookings.status.cancelled'),
    5: t('booking.myBookings.status.completed')
  }[s] || 'Unknown'
}

function getStatusSeverity(s) {
  return { 1: 'warn', 2: 'info', 3: 'success', 4: 'danger', 5: 'secondary' }[s] || 'secondary'
}

function confirmCancel(booking) {
  confirm.require({
    message: `Are you sure you want to cancel booking #${booking.id}? This action cannot be undone and reserved seats will be released.`,
    header: 'Hủy đơn hàng',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Quay lại',
    acceptLabel: 'Hủy ngay',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await bookingApi.cancel(booking.id)
        toast.add({ severity: 'success', summary: 'Canceled', detail: 'Đơn hàng đã được hủy thành công', life: 3000 })
        fetchMyBookings()
      } catch (err) {
        toast.add({ severity: 'error', summary: 'Error', detail: err.response?.data?.message || 'Không thể hủy đơn hàng', life: 4000 })
      }
    }
  })
}

onMounted(fetchMyBookings)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.my-bookings-page { background: #f8fafc; min-height: 100vh; padding-bottom: $space-20; }

.bookings-hero {
  position: relative; height: 260px;
  background: url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80') center/cover;
  display: flex; align-items: center; justify-content: center; padding-top: $navbar-height;
}
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(35, 87, 137, 0.9), rgba(0, 0, 0, 0.6)); }
.hero-content { position: relative; z-index: 1; text-align: center; color: white; }
.hero-title { font-size: 2.5rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }
.hero-subtitle { font-size: 1rem; opacity: 0.8; }

.bookings-container { max-width: 1000px; margin: -40px auto 0; position: relative; z-index: 10; }

.tabs-container {
   background: white; border-radius: 16px; padding: 4px; box-shadow: $shadow-lg; margin-bottom: $space-8;
   :deep(.p-tabs-list) { border: none; }
}

.empty-state {
   text-align: center; padding: $space-20 $space-6; background: white; border-radius: 20px; box-shadow: $shadow-xl;
   .empty-icon { font-size: 4rem; color: #cbd5e1; margin-bottom: $space-6; }
   h3 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: $space-2; }
   p { color: #64748b; margin-bottom: $space-8; max-width: 400px; margin-inline: auto; }
}

.bookings-list { display: flex; flex-direction: column; gap: $space-5; }

.ticket-card {
  display: flex; background: white; border-radius: 20px;
  box-shadow: $shadow-md; overflow: hidden; border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  &:hover { transform: translateY(-4px); box-shadow: $shadow-2xl; }
}

.ticket-left {
  width: 140px; min-width: 140px; background: linear-gradient(135deg, $color-primary, #1e40af);
  color: white; padding: $space-8 $space-4; display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; gap: 4px; border-right: 1px dashed rgba(255,255,255,0.2);
}
.ticket-label { font-size: 10px; font-weight: 800; letter-spacing: 0.2em; opacity: 0.6; }
.ticket-id { font-size: 24px; font-weight: 900; margin-bottom: 12px; }
.ticket-date-label { font-size: 9px; font-weight: 700; opacity: 0.5; }
.ticket-date { font-size: 12px; font-weight: 600; opacity: 0.9; }

.ticket-separator {
  width: 1px; position: relative; display: flex; flex-direction: column; align-items: center;
  .circle-top, .circle-bottom { width: 24px; height: 24px; border-radius: 50%; background: #f8fafc; position: absolute; z-index: 2; border: 1px solid #f1f5f9; }
  .circle-top { top: -12px; }
  .circle-bottom { bottom: -12px; }
  .dashed-line { flex: 1; width: 0; border-left: 2px dashed #e2e8f0; margin: 15px 0; }
}

.ticket-right { flex: 1; padding: $space-6 $space-8; display: flex; justify-content: space-between; align-items: center; gap: 24px; }
.tour-name { font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: $space-4; letter-spacing: -0.01em; }
.tour-details { display: flex; gap: 12px; flex-wrap: wrap; }
.detail-pill {
   font-size: 12px; color: #64748b; font-weight: 600; background: #f1f5f9; padding: 4px 12px; border-radius: 8px;
   display: flex; align-items: center;
   &.currency { color: $color-primary; background: rgba($color-primary, 0.08); }
}

.ticket-actions { display: flex; flex-direction: column; align-items: flex-end; }

@include md-max {
   .ticket-card { flex-direction: column; }
   .ticket-left { width: 100%; flex-direction: row; justify-content: space-between; padding: $space-4 $space-6; }
   .ticket-separator { display: none; }
   .ticket-right { flex-direction: column; align-items: flex-start; }
   .ticket-actions { width: 100%; align-items: flex-start; margin-top: $space-6; border-top: 1px solid #f1f5f9; padding-top: $space-6; }
}

.animate-fade-in { animation: fadeIn 0.4s ease-out both; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.paginator-wrap {
  margin-top: $space-8;
  :deep(.p-paginator) {
    background: white;
    border-radius: 16px;
    box-shadow: $shadow-md;
    padding: $space-3 $space-4;
    border: 1px solid #f1f5f9;
  }
  :deep(.p-paginator-page.p-highlight) {
    background: $color-primary;
    color: white;
    border-radius: 8px;
  }
}

</style>
