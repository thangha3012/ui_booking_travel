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
        <div v-for="n in 3" :key="n" class="skeleton-ticket-item">
          <Skeleton height="150px" borderRadius="16px"></Skeleton>
        </div>
      </div>

      <div v-else-if="filteredBookings.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="pi pi-map-marker"></i>
        </div>
        <h3>{{ t('booking.myBookings.empty.title') }}</h3>
        <p>{{ t('booking.myBookings.empty.desc') }}</p>
        <Button label="Khám phá Tour" icon="pi pi-compass" raised @click="router.push('/tours')" />
      </div>

      <div v-else class="bookings-list">
        <div
          v-for="booking in pagedBookings"
          :key="booking.id"
          class="booking-card animate-fade-in"
        >
          <div class="card-body">
            <div class="booking-main-info">
              <div class="tour-thumbnail">
                <img
                  :src="
                    getFullImageUrl(booking.tourThumbnail) ||
                    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80'
                  "
                  alt="Tour"
                />
                <div class="status-badge" :class="getStatusSeverity(booking.status)">
                  {{ getStatusLabel(booking.status) }}
                </div>
              </div>

              <div class="tour-content">
                <div class="tour-header-row">
                  <h3 class="tour-name-text">{{ booking.tourName }}</h3>
                  <span class="booking-id-tag">#{{ booking.id }}</span>
                </div>

                <div class="info-grid-container">
                  <div class="info-pill">
                    <i class="pi pi-calendar"></i>
                    <span
                      >Khởi hành: <b>{{ formatDate(booking.departureDate) }}</b></span
                    >
                  </div>
                  <div class="info-pill">
                    <i class="pi pi-users"></i>
                    <span
                      ><b>{{ booking.numberOfPassengers }}</b> Khách</span
                    >
                  </div>
                  <div class="info-pill">
                    <i class="pi pi-clock"></i>
                    <span>Đặt lúc: {{ formatDate(booking.createdAt) }}</span>
                  </div>
                </div>

                <!-- Countdown for Pending bookings -->
                <div v-if="booking.status === 1" class="expiry-alert">
                  <i class="pi pi-info-circle"></i>
                  <span>Đơn hàng sẽ tự động hủy nếu không thanh toán sớm.</span>
                </div>
              </div>
            </div>

            <div class="card-footer-actions">
              <div class="price-section">
                <span class="total-label">Tổng cộng</span>
                <span class="total-price"
                  >{{ booking.totalAmount?.toLocaleString('vi-VN') }} đ</span
                >
              </div>

              <div class="btns-group">
                <!-- Pay Now -->
                <Button
                  v-if="booking.status === 1 || booking.status === 2"
                  label="Thanh toán ngay"
                  icon="pi pi-credit-card"
                  class="btn-pay"
                  @click="router.push({ name: 'checkout', query: { bookingId: booking.id } })"
                />

                <!-- Details/Itinerary -->
                <Button
                  label="Chi tiết chuyến đi"
                  icon="pi pi-search"
                  class="btn-details"
                  text
                  @click="router.push(`/booking-detail/${booking.id}`)"
                />

                <!-- Cancel: chỉ hiện khi chưa hoàn thành và chưa qua ngày khởi hành -->
                <Button
                  v-if="canCancel(booking)"
                  label="Hủy chuyến"
                  icon="pi pi-times"
                  severity="danger"
                  text
                  class="btn-cancel"
                  @click="confirmCancel(booking)"
                />
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
import { getFullImageUrl } from '@/utils/imageHelper'

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
  { label: t('booking.myBookings.tabs.cancelled'), value: 'Cancelled' },
])

// Lấy danh sách các đơn đặt tour của cá nhân người dùng hiện tại
async function fetchMyBookings() {
  loading.value = true
  try {
    const res = await bookingApi.getMyBookings()
    bookings.value = res.data || res || []
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: t('common.error'), life: 3000 })
  } finally {
    loading.value = false
  }
}

const filteredBookings = computed(() => {
  if (activeTab.value === 'All') return bookings.value

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (activeTab.value === 'Upcoming') {
    // Sắp tới: booking chưa hủy, chưa hoàn thành, VÀ ngày khởi hành >= hôm nay
    return bookings.value.filter((b) => {
      if (b.status === 4 || b.status === 5) return false // Bỏ qua đã hủy & đã hoàn thành
      const dep = new Date(b.departureDate)
      dep.setHours(0, 0, 0, 0)
      return dep >= today
    })
  }

  if (activeTab.value === 'Completed') {
    // Hoàn thành: status=5 (Completed) HOẶC status=3 (Confirmed) mà ngày khởi hành < hôm nay
    return bookings.value.filter((b) => {
      if (b.status === 5) return true
      if (b.status === 3) {
        const dep = new Date(b.departureDate)
        dep.setHours(0, 0, 0, 0)
        return dep < today
      }
      return false
    })
  }

  if (activeTab.value === 'Cancelled') {
    return bookings.value.filter((b) => b.status === 4)
  }

  return bookings.value
})

watch(activeTab, () => {
  pageFirst.value = 0
})

const pagedBookings = computed(() => {
  return filteredBookings.value.slice(pageFirst.value, pageFirst.value + pageSize.value)
})

// Xử lý khi người dùng thay đổi trang hoặc số lượng mục hiển thị trên mỗi trang
function onPageChange(event) {
  pageFirst.value = event.first
  pageSize.value = event.rows
}

// Định dạng ngày tháng sang kiểu chuỗi dựa trên ngôn ngữ hiện tại
function formatDate(d) {
  if (!d) return 'N/A'
  return new Date(d).toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Lấy nhãn hiển thị cho trạng thái đơn hàng (tiếng Việt)
function getStatusLabel(s) {
  const statusMap = {
    1: 'Chờ thanh toán',
    2: 'Đang xác thực',
    3: 'Đã xác nhận',
    4: 'Đã hủy',
    5: 'Đã hoàn thành',
  }
  return statusMap[s] || 'Không xác định'
}

// Xác định màu sắc (severity) cho Tag trạng thái đơn hàng
function getStatusSeverity(s) {
  return { 1: 'warn', 2: 'info', 3: 'success', 4: 'danger', 5: 'secondary' }[s] || 'secondary'
}

// Chỉ cho hủy khi: trạng thái chưa hoàn thành/hủy VÀ ngày khởi hành chưa qua
// Kiểm tra xem đơn hàng có đủ điều kiện để hủy hay không
function canCancel(booking) {
  // Không cho hủy nếu đã hoàn thành (5) hoặc đã hủy (4)
  if (booking.status === 4 || booking.status === 5) return false
  // Không cho hủy nếu ngày khởi hành đã qua
  if (booking.departureDate) {
    const dep = new Date(booking.departureDate)
    dep.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (dep < today) return false
  }
  return true
}

// Hiển thị hộp thoại xác nhận và thực hiện gọi API hủy đơn hàng nếu người dùng đồng ý
function confirmCancel(booking) {
  confirm.require({
    message: `Bạn có chắc chắn muốn hủy đơn hàng #${booking.id}? Hành động này không thể hoàn tác và các chỗ đã đặt sẽ được giải phóng.`,
    header: 'Hủy đơn hàng',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Quay lại',
    acceptLabel: 'Hủy ngay',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await bookingApi.cancel(booking.id)
        toast.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đơn hàng đã được hủy thành công',
          life: 3000,
        })
        fetchMyBookings()
      } catch (err) {
        toast.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: err.response?.data?.message || 'Không thể hủy đơn hàng',
          life: 4000,
        })
      }
    },
  })
}

onMounted(fetchMyBookings)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.my-bookings-page {
  background: #f8fafc;
  min-height: 100vh;
  padding-bottom: 5rem;
}

.bookings-hero {
  position: relative;
  height: 280px;
  background: url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80')
    center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.4));
  }
}
.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
}
.hero-title {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
}
.hero-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  font-weight: 500;
}

.skeleton-ticket-item {
  margin-bottom: 1.5rem;
}

.bookings-container {
  max-width: 1100px;
  margin: -50px auto 0;
  position: relative;
  z-index: 10;
  padding: 0 1rem;
}

.tabs-container {
  background: white;
  border-radius: 20px;
  padding: 6px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  :deep(.p-tabs-list) {
    border: none;
    background: transparent;
  }
  :deep(.p-tab) {
    border-radius: 14px;
    font-weight: 700;
    transition: all 0.2s;
  }
  :deep(.p-tab-active) {
    background: #f1f5f9;
    color: $color-primary;
  }
}

.booking-card {
  background: white;
  border-radius: 24px;
  margin-bottom: 1.5rem;
  border: 1px solid #f1f5f9;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px -1px rgba(0, 0, 0, 0.01);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  }
}

.card-body {
  padding: 0;
}

.booking-main-info {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.tour-thumbnail {
  width: 200px;
  height: 140px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .status-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 4px 12px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    &.success {
      background: #10b981;
      color: white;
    }
    &.warn {
      background: #f59e0b;
      color: white;
    }
    &.danger {
      background: #ef4444;
      color: white;
    }
    &.info {
      background: #3b82f6;
      color: white;
    }
    &.secondary {
      background: #94a3b8;
      color: white;
    }
  }
}

.tour-content {
  flex: 1;
}
.tour-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.tour-name-text {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.01em;
}
.booking-id-tag {
  font-family: monospace;
  background: #f1f5f9;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
}

.info-grid-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.info-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #64748b;
  i {
    color: $color-primary;
  }
  b {
    color: #1e293b;
  }
}

.expiry-alert {
  background: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #92400e;
  font-size: 0.8rem;
  font-weight: 600;
  i {
    font-size: 1rem;
  }
}

.card-footer-actions {
  background: #fafafa;
  border-top: 1px solid #f1f5f9;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

.price-section {
  display: flex;
  flex-direction: column;
  .total-label {
    font-size: 0.75rem;
    color: #94a3b8;
    font-weight: 700;
    text-transform: uppercase;
  }
  .total-price {
    font-size: 1.4rem;
    font-weight: 900;
    color: $color-primary;
  }
}

.btns-group {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  @media (max-width: 640px) {
    width: 100%;
    justify-content: flex-end;
  }
}

.btn-pay {
  background: $color-primary !important;
  border: none !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  padding: 0.6rem 1.25rem !important;
}

.btn-details {
  color: #1e293b !important;
  font-weight: 700 !important;
}
.btn-cancel {
  color: #ef4444 !important;
  font-weight: 700 !important;
}

.empty-state {
  background: white;
  border-radius: 24px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  .empty-icon {
    font-size: 4rem;
    color: #e2e8f0;
    margin-bottom: 1.5rem;
  }
  h3 {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  p {
    color: #64748b;
    margin-bottom: 2rem;
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out both;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.paginator-wrap {
  margin-top: 2rem;
  :deep(.p-paginator) {
    background: transparent;
    border: none;
  }
}
</style>
