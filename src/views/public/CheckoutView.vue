<template>
  <div class="checkout-page">
    <!-- HERO SECTION -->
    <div class="checkout-hero">
      <div class="checkout-hero__overlay"></div>
      <div class="container checkout-hero__content">
        <h1 class="checkout-hero__title">{{ $t('booking.checkout.title') }}</h1>
        <div class="checkout-hero__breadcrumb">
          <RouterLink to="/">{{ $t('nav.home') }}</RouterLink>
          <i class="pi pi-chevron-right separator-icon"></i>
          <span class="current">{{ $t('booking.checkout.breadcrumb') }}</span>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="container checkout-main">
      <div v-if="!booking && !loading" class="empty-booking-state">
         <i class="pi pi-search empty-icon"></i>
         <p class="empty-text">{{ $t('booking.checkout.noTour') }}</p>
         <Button :label="$t('booking.checkout.browseTours')" icon="pi pi-arrow-left" text @click="router.push('/tours')" />
      </div>
      
      <div v-else class="checkout-layout">
        <!-- LEFT COLUMN: Forms -->
        <div class="checkout-form-col">
          <div class="checkout-header-row">
             <Button icon="pi pi-arrow-left" text rounded @click="router.back()" />
             <h2 class="section-heading no-margin">{{ $t('booking.checkout.confirmPay') }}</h2>
          </div>

          <!-- Section 1: Information summary -->
          <div class="checkout-section">
            <h3 class="section-title">
              <span class="icon-circle">1</span> {{ $t('booking.contactInfo', 'Thông tin liên hệ') }}
            </h3>
            
            <div class="contact-info-grid bg-slate-50 rounded-2xl p-6 border border-slate-100">
               <div class="info-item">
                  <span class="info-label">Họ và tên</span>
                  <span class="info-value">{{ booking?.contactName }}</span>
               </div>
               <div class="info-item">
                  <span class="info-label">Số điện thoại</span>
                  <span class="info-value">{{ booking?.contactPhone }}</span>
               </div>
               <div class="info-item md:col-span-2">
                  <span class="info-label">Địa chỉ Email</span>
                  <span class="info-value">{{ booking?.contactEmail }}</span>
               </div>
            </div>
          </div>

          <div class="checkout-section spacing-top-large">
            <h3 class="section-title">
              <span class="icon-circle">2</span> {{ $t('booking.checkout.paymentMethods', 'Phương thức thanh toán') }}
            </h3>

            <div class="payment-methods-stack">
               <!-- Method: ZaloPay (Recommended) -->
               <div class="payment-card" :class="{ active: paymentType === 'zalopay' }" @click="paymentType = 'zalopay'">
                <RadioButton v-model="paymentType" inputId="pay-zalopay" name="payment" value="zalopay" />
                <div class="method-content">
                  <div class="method-header-box">
                    <label for="pay-zalopay" class="method-name">Thanh toán ZaloPay</label>
                    <Tag value="Khuyên dùng" severity="success" rounded class="tag-micro" />
                  </div>
                  <p class="method-desc">Thanh toán nhanh chóng qua ứng dụng ZaloPay hoặc ví ZaloPay.</p>
                </div>
                <div class="method-icon zalopay-logo">
                  <img src="https://images.careerbuilder.vn/content/images/ZaloPay-Logo.png" alt="ZaloPay" class="logo-height-fix" />
                </div>
              </div>

              <!-- Method: PayPal -->
              <div class="payment-card" :class="{ active: paymentType === 'paypal' }" @click="paymentType = 'paypal'">
                <RadioButton v-model="paymentType" inputId="pay-paypal" name="payment" value="paypal" />
                <div class="method-content">
                  <label for="pay-paypal" class="method-name">PayPal</label>
                  <p class="method-desc">Thanh toán nhanh chóng và bảo mật qua cổng quốc tế PayPal.</p>
                </div>
                <div class="method-icon">
                  <i class="pi pi-paypal icon-paypal"></i>
                </div>
              </div>

              <!-- Method: Credit Card -->
              <div class="payment-card" :class="{ active: paymentType === 'card' }" @click="paymentType = 'card'">
                <RadioButton v-model="paymentType" inputId="pay-card" name="payment" value="card" />
                <div class="method-content">
                  <label for="pay-card" class="method-name">Thẻ tín dụng / Ghi nợ</label>
                  <p class="method-desc">Hỗ trợ Visa, Mastercard, và American Express.</p>
                </div>
                <div class="method-icon">
                  <i class="pi pi-credit-card icon-card"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Order Summary -->
          <div class="checkout-sidebar">
          <div class="order-summary-card sticky-sidebar">
            <h3 class="summary-title">
               <i class="pi pi-shopping-bag icon-spacing"></i>Chi tiết đơn hàng
            </h3>
            
            <div v-if="booking" class="booking-tour-preview">
               <img :src="getFullImageUrl(booking.tourThumbnail || booking.tourImage) || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400'" class="preview-img" />
               <div class="preview-content">
                 <h4 class="tour-title">{{ booking.tourName }}</h4>
                 <div class="tour-meta">
                    <span><i class="pi pi-calendar"></i> {{ formatDate(booking.departureDate) }}</span>
                 </div>
               </div>
            </div>

            <div class="summary-breakdown">
               <div class="breakdown-row">
                  <span class="label">Số lượng khách</span>
                  <span class="value">{{ booking?.numberOfPassengers || 0 }} người</span>
               </div>
               <div class="breakdown-row">
                  <span class="label">Giá tour</span>
                  <span class="value">{{ formatPrice(booking?.totalAmount) }} đ</span>
               </div>
               <div class="breakdown-row">
                  <span class="label">Phí dịch vụ</span>
                  <span class="value text-green-600">Miễn phí</span>
               </div>
               
               <div class="final-total">
                  <div class="flex justify-between items-baseline">
                    <span class="total-label">Tổng thanh toán</span>
                    <span class="total-value">{{ formatPrice(booking?.totalAmount) }} đ</span>
                  </div>
                  <p class="vat-note">Giá đã bao gồm VAT và các loại thuế</p>
               </div>
            </div>

            <Button 
              label="Hoàn tất thanh toán" 
              icon="pi pi-shield" 
              :loading="loading" 
              class="btn-complete-payment full-width" 
              @click="handleCheckout" 
            />
            
            <div class="trust-badges">
               <div class="badge"><i class="pi pi-verified"></i> Đã xác minh</div>
               <div class="badge"><i class="pi pi-lock"></i> Bảo mật</div>
               <div class="badge"><i class="pi pi-shield"></i> Được bảo hiểm</div>
            </div>
            
            <p class="terms-text">
               Bằng việc nhấn vào "Hoàn tất thanh toán", bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của Triptopia.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bookingApi } from '@/api/bookingApi'
import { paymentApi } from '@/api/paymentApi'
import { getFullImageUrl } from '@/utils/imageHelper'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from 'vue-i18n'

// PrimeVue
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import RadioButton from 'primevue/radiobutton'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Rating from 'primevue/rating'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const { t } = useI18n()

const loading = ref(false)
const booking = ref(null)
const paymentType = ref('zalopay')

const totalAmountComputed = computed(() => {
  return booking.value ? booking.value.totalAmount : 0
})

// Định dạng số tiền sang kiểu VNĐ
function formatPrice(val) {
  if (!val) return '0'
  return new Intl.NumberFormat('vi-VN').format(val)
}

// Định dạng ngày tháng sang kiểu Việt Nam
function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

// Tải thông tin đơn đặt tour từ API dựa trên query parameter
async function loadBookingInfo() {
  const bId = route.query.bookingId
  if (!bId) return
  loading.value = true
  try {
    const res = await bookingApi.getById(bId)
    if (res.success) {
      booking.value = res.data
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Xử lý nút thanh toán: gọi API tạo đơn thanh toán ZaloPay và chuyển hướng người dùng
async function handleCheckout() {
  if (!authStore.isLoggedIn) {
    toast.add({ severity: 'warn', summary: t('booking.checkout.authRequired'), detail: t('booking.checkout.loginToBook'), life: 3000 })
    router.push('/login?redirect=' + route.fullPath)
    return
  }

  loading.value = true
  try {
    let res
    if (paymentType.value === 'zalopay') {
      res = await paymentApi.createZaloPayOrder(booking.value.id)
    } else {
      toast.add({ severity: 'info', summary: 'Sắp ra mắt', detail: 'Phương thức thanh toán này chưa được hỗ trợ. Vui lòng sử dụng ZaloPay.', life: 3000 })
      loading.value = false
      return
    }

    if (res.url) {
      window.location.href = res.url // Redirect sang trang thanh toán
    } else {
      toast.add({ severity: 'error', summary: t('common.error'), detail: 'Không thể tạo yêu cầu thanh toán', life: 4000 })
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: error.message, life: 4000 })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBookingInfo()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.checkout-page { background: #f8fafc; min-height: 100vh; padding-bottom: 5rem; }

.checkout-hero {
  position: relative; height: 260px;
  background: url('https://images.unsplash.com/photo-1518182170546-076616fd6251?w=1920&q=80') center/cover;
  display: flex; align-items: center; justify-content: flex-start;
  
  &__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(90deg, rgba(30, 41, 59, 0.9) 0%, rgba(30, 41, 59, 0.4) 100%);
  }
  &__content { position: relative; z-index: 1; color: white; }
  &__title { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; }
  &__breadcrumb {
    font-size: 0.85rem; display: flex; align-items: center; gap: 8px; opacity: 0.8;
    a { color: white; text-decoration: none; &:hover { text-decoration: underline; } }
  }
}

.checkout-main { margin-top: -3rem; position: relative; z-index: 10; }

.checkout-layout {
  display: flex; flex-direction: column; gap: 2rem;
  @media (min-width: 1024px) { flex-direction: row; align-items: flex-start; }
}

.checkout-form-col {
  flex: 1; background: white; border-radius: 24px; padding: 2.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;
}

.section-title {
  display: flex; align-items: center; gap: 1rem;
  font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 1.5rem;
  .icon-circle {
    width: 32px; height: 32px; background: $color-primary; color: white;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; font-weight: 800;
  }
}

.contact-info-grid {
  display: grid; grid-template-columns: 1fr; gap: 1.5rem;
  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
  
  .info-item {
    display: flex; flex-direction: column; gap: 4px;
    .info-label { font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
    .info-value { font-size: 1rem; font-weight: 700; color: #334155; }
  }
}

.payment-card {
  display: flex; align-items: center; gap: 1.25rem; padding: 1.5rem;
  border: 1px solid #e2e8f0; border-radius: 20px; cursor: pointer; transition: all 0.2s;
  background: white;
  
  &:hover { border-color: #cbd5e1; background: #f8fafc; }
  &.active { border-color: $color-primary; background: #f0f7ff; box-shadow: 0 0 0 2px $color-primary; }
  
  .method-content {
    flex: 1;
    .method-name { font-size: 1rem; font-weight: 800; color: #1e293b; cursor: pointer; }
    .method-desc { font-size: 0.75rem; color: #64748b; margin-top: 2px; }
  }
}

.checkout-sidebar { width: 100%; @media (min-width: 1024px) { width: 380px; } }

.order-summary-card {
  background: white; border-radius: 24px; padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08); border: 1px solid #f1f5f9;
  
  .summary-title { font-size: 1.15rem; font-weight: 800; color: #1e293b; margin-bottom: 1.5rem; }
}

.booking-tour-preview {
  display: flex; gap: 1rem; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9;
  .preview-img { width: 80px; height: 80px; object-fit: cover; border-radius: 12px; }
  .tour-title { font-size: 0.95rem; font-weight: 800; color: #1e293b; line-height: 1.4; }
  .tour-meta { font-size: 0.75rem; color: #64748b; margin-top: 4px; i { color: $color-primary; } }
}

.summary-breakdown {
  .breakdown-row {
    display: flex; justify-content: space-between; margin-bottom: 1rem;
    .label { font-size: 0.85rem; color: #64748b; }
    .value { font-size: 0.85rem; font-weight: 700; color: #1e293b; }
  }
}

.final-total {
  margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px dashed #f1f5f9;
  .total-label { font-size: 1rem; font-weight: 800; color: #1e293b; }
  .total-value { font-size: 1.75rem; font-weight: 900; color: #ef4444; }
  .vat-note { font-size: 0.65rem; color: #94a3b8; text-align: right; margin-top: 4px; }
}

.btn-complete-payment {
  background: linear-gradient(135deg, #1d4ed8, #2563eb); border: none; height: 56px;
  font-weight: 800; border-radius: 14px; margin-top: 2rem;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
  &:hover { transform: translateY(-1px); box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.4); }
}

.trust-badges {
  display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem; opacity: 0.4;
  .badge { font-size: 0.65rem; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 4px; }
}

.terms-text { font-size: 0.65rem; color: #94a3b8; text-align: center; margin-top: 1.5rem; line-height: 1.5; }

.sticky-sidebar {
  position: sticky;
  top: 6rem;
}

.icon-spacing {
  margin-right: 0.5rem;
}

.free-label {
  color: #16a34a;
}

.total-row-baseline {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.full-width {
  width: 100%;
}

.empty-booking-state {
  padding: 5rem 0;
  text-align: center;
  .empty-icon {
    font-size: 2.5rem;
    color: #cbd5e1;
    margin-bottom: 1rem;
  }
  .empty-text {
    color: #64748b;
  }
}

.checkout-header-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.no-margin {
  margin: 0;
}

.spacing-top-large {
  margin-top: 3rem;
}

.payment-methods-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.method-header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.tag-micro {
  font-size: 10px;
}

.logo-height-fix {
  height: 1.5rem;
}

.icon-paypal {
  font-size: 1.5rem;
  color: #1d4ed8;
}

.icon-card {
  font-size: 1.5rem;
  color: #94a3b8;
}

.separator-icon {
  font-size: 10px;
  margin: 0 0.25rem;
  opacity: 0.5;
}

.section-heading { font-size: 1.75rem; font-weight: 900; color: #1e293b; letter-spacing: -0.02em; }
</style>
