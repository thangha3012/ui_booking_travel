<template>
  <div class="booking-detail-page">
    <div class="container detail-container">
      <div v-if="loading" class="loading-state">
        <ProgressSpinner />
        <p>Đang tải thông tin chuyến đi...</p>
      </div>

      <div v-else-if="!booking" class="empty-error-state">
        <i class="pi pi-exclamation-circle error-icon-large"></i>
        <h3>Không tìm thấy thông tin đơn hàng</h3>
        <Button label="Quay lại danh sách" icon="pi pi-arrow-left" text @click="router.push('/my-bookings')" />
      </div>

      <div v-else class="booking-content animate-fade-in">
        <!-- Header -->
        <div class="detail-header">
           <div class="header-left-side">
              <Button icon="pi pi-arrow-left" text rounded @click="router.push('/my-bookings')" class="back-btn" />
              <div class="header-title-box">
                 <h1 class="page-title">Chi tiết đơn hàng #{{ booking.id }}</h1>
                 <p class="subtitle">Ngày đặt: {{ formatDate(booking.createdAt) }}</p>
              </div>
           </div>
           <Tag :value="getStatusLabel(booking.status)" :severity="getStatusSeverity(booking.status)" rounded class="status-tag" />
        </div>

        <div class="booking-grid-layout">
           <!-- Main Column -->
           <div class="booking-main-col">
              <!-- Tour Info Card -->
              <div class="info-card">
                 <div class="card-title">
                    <i class="pi pi-info-circle"></i>
                    Thông tin chuyến đi
                 </div>
                 <div class="tour-banner-small" v-if="booking.tourThumbnail">
                    <img :src="getFullImageUrl(booking.tourThumbnail)" :alt="booking.tourName">
                 </div>
                 <div class="tour-brief">
                    <h2 class="tour-detail-title">{{ booking.tourName }}</h2>
                    <div class="info-row-grid">
                       <div class="info-item">
                          <span class="label">Ngày khởi hành</span>
                          <span class="value">{{ formatDate(booking.departureDate) }}</span>
                       </div>
                       <div class="info-item">
                          <span class="label">Số lượng khách</span>
                          <span class="value">{{ booking.numberOfPassengers }} người</span>
                       </div>
                    </div>
                 </div>
              </div>

              <!-- Passengers Card -->
              <div class="info-card">
                 <div class="card-title">
                    <i class="pi pi-users"></i>
                    Danh sách hành khách
                 </div>
                 <div class="passenger-list">
                    <div v-for="(p, index) in booking.passengers" :key="index" class="passenger-item">
                       <div class="p-num">{{ index + 1 }}</div>
                       <div class="p-info">
                          <div class="p-name">{{ p.fullName }}</div>
                          <div class="p-meta">
                             <span>{{ getPassengerTypeLabel(p.type) }}</span>
                             <span class="dot">•</span>
                             <span>{{ p.gender }}</span>
                             <span v-if="p.dateOfBirth" class="dot">•</span>
                             <span v-if="p.dateOfBirth">{{ calculateAge(p.dateOfBirth) }} tuổi</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <!-- Contact Info -->
              <div class="info-card">
                 <div class="card-title">
                    <i class="pi pi-user"></i>
                    Thông tin người liên hệ
                 </div>
                 <div class="info-row-grid">
                    <div class="info-item">
                       <span class="label">Họ tên</span>
                       <span class="value">{{ booking.contactName }}</span>
                    </div>
                    <div class="info-item">
                       <span class="label">Số điện thoại</span>
                       <span class="value">{{ booking.contactPhone }}</span>
                    </div>
                    <div class="info-item span-two">
                       <span class="label">Email</span>
                       <span class="value">{{ booking.contactEmail }}</span>
                    </div>
                    <div class="info-item span-two" v-if="booking.notes">
                       <span class="label">Ghi chú</span>
                       <span class="value note-text">"{{ booking.notes }}"</span>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Sidebar Column -->
           <div class="booking-sidebar-col">
              <div class="summary-card sticky-sidebar">
                 <div class="card-title">Tóm tắt thanh toán</div>
                 <div class="payment-breakdown">
                    <div class="breakdown-row total">
                       <span>Tổng cộng</span>
                       <span class="amount">{{ formatPrice(booking.totalAmount) }} đ</span>
                    </div>
                 </div>
                 
                 <div class="payment-status-box" :class="getStatusSeverity(booking.status)">
                    <i class="pi pi-wallet"></i>
                    <span>Trạng thái: <strong>{{ getStatusLabel(booking.status) }}</strong></span>
                 </div>

                 <div class="action-btns-stack">
                    <Button v-if="booking.status === 1 || booking.status === 2" 
                       label="Thanh toán ngay" 
                       icon="pi pi-credit-card" 
                       class="full-width"
                       raised
                       @click="router.push({ name: 'checkout', query: { bookingId: booking.id } })" />
                    
                    <Button label="Hỗ trợ 24/7" icon="pi pi-phone" class="full-width" outlined severity="secondary" />
                 </div>

                 <div class="qr-ticket-section" v-if="booking.status === 3 || booking.status === 5">
                    <div class="qr-container">
                       <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`" alt="QR Code" class="qr-image">
                    </div>
                    <div class="qr-text">
                       <p class="ticket-label">VÉ ĐIỆN TỬ</p>
                       <p class="ticket-hint">Quét mã để xem chi tiết</p>
                    </div>
                 </div>
                 <div v-else class="qr-placeholder-section">
                    <div class="qr-box">
                       <i class="pi pi-qrcode empty-qr-icon"></i>
                       <span class="ticket-hint">Mã QR sẽ hiện khi đã xác nhận</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bookingApi } from '@/api/bookingApi'
import { getFullImageUrl } from '@/utils/imageHelper'
import ProgressSpinner from 'primevue/progressspinner'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const route = useRoute()
const router = useRouter()
const booking = ref(null)
const loading = ref(true)

const currentUrl = computed(() => window.location.href)

// Tải chi tiết đơn đặt tour từ API dựa trên ID từ route params
async function fetchDetail() {
  loading.value = true
  try {
    const id = route.params.id
    const res = await bookingApi.getById(id)
    booking.value = res.data || res
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Định dạng ngày tháng sang kiểu Việt Nam đầy đủ
function formatDate(d) {
  if (!d) return 'N/A'
  return new Date(d).toLocaleDateString('vi-VN', { 
    month: 'long', day: 'numeric', year: 'numeric' 
  })
}

// Định dạng số tiền sang kiểu VNĐ
function formatPrice(val) {
  if (!val) return '0'
  return new Intl.NumberFormat('vi-VN').format(val)
}

// Lấy nhãn hiển thị cho trạng thái đơn hàng (tiếng Việt)
function getStatusLabel(s) {
  const map = {
    1: 'Chờ thanh toán',
    2: 'Đang xác thực',
    3: 'Đã xác nhận',
    4: 'Đã hủy',
    5: 'Đã hoàn thành'
  }
  return map[s] || 'Không xác định'
}

// Xác định màu sắc (severity) cho Tag trạng thái đơn hàng
function getStatusSeverity(s) {
  const map = { 1: 'warn', 2: 'info', 3: 'success', 4: 'danger', 5: 'secondary' }
  return map[s] || 'info'
}

// Chuyển đổi mã loại hành khách sang tên hiển thị
function getPassengerTypeLabel(t) {
  const map = { 1: 'Người lớn', 2: 'Trẻ em', 3: 'Em bé' }
  return map[t] || 'Khách'
}

// Tính toán tuổi từ ngày sinh
function calculateAge(dob) {
  const diff = Date.now() - new Date(dob).getTime()
  return Math.abs(new Date(diff).getUTCFullYear() - 1970)
}

onMounted(fetchDetail)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.booking-detail-page { background: #f8fafc; min-height: 100vh; padding: 4rem 1rem; }
.detail-container { max-width: 1200px; }

.detail-header {
   display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
   @media (max-width: 640px) { flex-direction: column; align-items: flex-start; gap: 1rem; }
   .page-title { font-size: 2rem; font-weight: 800; color: #1e293b; letter-spacing: -0.02em; }
   .subtitle { color: #64748b; margin-top: 4px; }
}

.info-card {
   background: white; border-radius: 24px; padding: 1.5rem; border: 1px solid #f1f5f9; box-shadow: $shadow-sm;
   .card-title {
      font-size: 0.9rem; font-weight: 800; color: #1e293b; text-transform: uppercase; letter-spacing: 0.05em;
      display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;
      i { color: $color-primary; font-size: 1.1rem; }
   }
}

.tour-banner-small {
   height: 180px; border-radius: 16px; overflow: hidden; margin-bottom: 1.5rem;
   img { width: 100%; height: 100%; object-fit: cover; }
}

.info-row-grid {
   display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;
   .info-item {
      display: flex; flex-direction: column; gap: 4px;
      .label { font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
      .value { font-size: 1rem; font-weight: 700; color: #334155; }
   }
}

.passenger-list {
   display: flex; flex-direction: column; gap: 1rem;
   .passenger-item {
      display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f8fafc; border-radius: 16px;
      .p-num { width: 32px; height: 32px; background: white; border-radius: 50%; @include flex-center; font-weight: 800; font-size: 0.85rem; color: $color-primary; }
      .p-name { font-weight: 700; color: #1e293b; }
      .p-meta { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #64748b; .dot { opacity: 0.3; } }
   }
}

.summary-card {
   background: white; border-radius: 24px; padding: 1.5rem; border: 1px solid #f1f5f9; box-shadow: $shadow-lg;
   .card-title { font-weight: 800; color: #1e293b; margin-bottom: 1.5rem; }
}

.breakdown-row {
   display: flex; justify-content: space-between; margin-bottom: 1rem;
   &.total {
      padding-top: 1.5rem; border-top: 2px dashed #f1f5f9;
      flex-direction: column; align-items: flex-start; gap: 8px;
      span { font-size: 1rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
      .amount { color: $color-primary; font-size: 2.25rem; font-weight: 900; line-height: 1; }
   }
}

.payment-status-box {
   display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 12px; font-size: 0.85rem;
   &.warn { background: #fffbeb; color: #92400e; }
   &.success { background: #f0fdf4; color: #15803d; }
   &.danger { background: #fef2f2; color: #b91c1c; }
   &.info { background: #eff6ff; color: #1d4ed8; }
}

.qr-box-wrap {
   display: flex; flex-direction: column; align-items: center; gap: 1rem;
   padding: 1.5rem; background: #f8fafc; border-radius: 20px; border: 1px solid #f1f5f9;
   
   .qr-container {
      background: white; padding: 10px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      .qr-image { width: 140px; height: 140px; display: block; }
   }
   
   .qr-text { text-align: center; color: #1e293b; }
}

.qr-placeholder {
   .qr-box {
      width: 100%; aspect-ratio: 1; border: 2px dashed #e2e8f0; border-radius: 20px;
      @include flex-center; flex-direction: column;
   }
}

.animate-fade-in { animation: fadeIn 0.5s ease-out both; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.empty-error-state {
  min-height: 400px;
  @include flex-center;
  flex-direction: column;
  gap: 1rem;
  .error-icon-large {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #ef4444;
  }
}

.header-left-side {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-title-box {
  display: flex;
  flex-direction: column;
}

.booking-grid-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @include lg {
    grid-template-columns: repeat(3, 1fr);
  }
}

.booking-main-col {
  @include lg {
    grid-column: span 2;
  }
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tour-detail-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.span-two {
  @include md {
    grid-column: span 2;
  }
}

.note-text {
  font-size: 0.875rem;
  font-style: italic;
  color: #64748b;
}

.booking-sidebar-col {
  @include lg {
    grid-column: span 1;
  }
}

.sticky-sidebar {
  position: sticky;
  top: 6rem;
}

.action-btns-stack {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.full-width {
  width: 100%;
}

.qr-ticket-section {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
}

.ticket-label {
  font-weight: 700;
}

.ticket-hint {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.5rem;
}

.qr-placeholder-section {
  margin-top: 2rem;
  .qr-box {
    width: 100%;
    aspect-ratio: 1;
    border: 2px dashed #e2e8f0;
    border-radius: 20px;
    @include flex-center;
    flex-direction: column;
  }
  .empty-qr-icon {
    font-size: 3.75rem;
    opacity: 0.1;
  }
}

.loading-state, .error-state { min-height: 400px; @include flex-center; flex-direction: column; gap: 1rem; }

</style>
