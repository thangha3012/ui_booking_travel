<template>
  <div class="payment-return-page">
    <div class="container return-container">
       <div v-if="loading" class="status-card loading-card shadow-elevated">
          <ProgressSpinner strokeWidth="3" />
          <h3 class="loading-title">Đang xác thực giao dịch...</h3>
          <p class="loading-desc">Vui lòng không đóng hoặc tải lại trang này.</p>
       </div>

       <div v-else class="status-card" :class="{ 'success': isSuccess, 'failure': !isSuccess }">
          <div class="result-icon-wrapper">
             <div v-if="isSuccess" class="success-icon scale-in">
                <i class="pi pi-check icon-size-large"></i>
             </div>
             <div v-else class="failure-icon scale-in">
                <i class="pi pi-times icon-size-large"></i>
             </div>
          </div>

          <h1 v-if="isSuccess" class="fade-in result-title">Thanh toán thành công!</h1>
          <h1 v-else class="fade-in result-title">Thanh toán thất bại</h1>

          <p class="fade-in result-description">
             <span v-if="isSuccess">
                Cảm ơn bạn đã đặt tour! Giao dịch của bạn đã được xử lý thành công. Chúng tôi đã gửi thông tin chi tiết qua email.
             </span>
             <span v-else>
                Rất tiếc, đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng kiểm tra lại số dư tài khoản hoặc thử lại sau.
             </span>
          </p>

          <div class="payment-details-box fade-in bottom-gap" v-if="paymentInfo">
             <div class="detail-item">
                <span class="label">Mã giao dịch</span>
                <span class="value font-mono">{{ paymentInfo.apptransid || 'N/A' }}</span>
             </div>
             <div class="detail-item">
                <span class="label">Số tiền</span>
                <span class="value price-highlight">{{ formatPrice(paymentInfo.amount) }} đ</span>
             </div>
             <div class="detail-item">
                <span class="label">Ngân hàng</span>
                <span class="value">{{ paymentInfo.bankcode || 'Cổng ZaloPay' }}</span>
             </div>
             <div class="detail-item" v-if="paymentInfo.pmcid">
                <span class="label">Hình thức</span>
                <span class="value">{{ paymentInfo.pmcid }}</span>
             </div>
          </div>

          <div class="action-btns-row fade-in">
             <Button v-if="isSuccess" label="Xem đơn hàng của tôi" icon="pi pi-ticket" class="btn-success-main" raised @click="router.push('/my-bookings')" />
             <Button v-else label="Thử lại ngay" icon="pi pi-refresh" severity="danger" raised @click="router.push('/tours')" />
             <Button label="Về trang chủ" icon="pi pi-home" text severity="secondary" @click="router.push('/')" />
          </div>
       </div>

       <!-- Travel Advice -->
       <div v-if="isSuccess && !loading" class="travel-tip-card fade-in">
          <div class="tip-icon">
             <i class="pi pi-sparkles"></i>
          </div>
          <div class="tip-body">
             <h4 class="tip-title">Lời khuyên cho chuyến đi</h4>
             <p class="tip-text">Hãy có mặt tại điểm đón ít nhất 30 phút trước giờ khởi hành để làm thủ tục thuận lợi nhất bạn nhé!</p>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { paymentApi } from '@/api/paymentApi'
import { useI18n } from 'vue-i18n'

import ProgressSpinner from 'primevue/progressspinner'
import Button from 'primevue/button'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const isSuccess = ref(false)
const paymentInfo = ref(null)

function formatPrice(val) {
  if (!val) return '0'
  return new Intl.NumberFormat('vi-VN').format(val)
}

async function verifyPayment() {
  loading.value = true
  try {
    const query = route.query
    paymentInfo.value = query
    
    // Xác thực trạng thái giao dịch với server
    const res = await paymentApi.zalopayReturn(query)
    if (res.success) {
      isSuccess.value = true
    } else {
      isSuccess.value = false
    }
  } catch (err) {
    console.error(err)
    isSuccess.value = false
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  verifyPayment()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.payment-return-page {
  background: #f8fafc; min-height: 100vh; padding: 4rem 1rem;
  display: flex; align-items: center; justify-content: center;
}

.return-container { max-width: 520px; width: 100%; text-align: center; }

.status-card {
  background: white; border-radius: 32px; padding: 3.5rem 2rem;
  box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; position: relative; overflow: hidden;
  
  &::before {
     content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 8px;
  }
  
  &.success::before { background: #10b981; }
  &.failure::before { background: #ef4444; }
}

.result-icon-wrapper {
  margin-bottom: 2rem; display: flex; justify-content: center;
  
  .success-icon {
     width: 80px; height: 80px; background: #ecfdf5; color: #10b981;
     border-radius: 50%; display: flex; align-items: center; justify-content: center;
  }
  .failure-icon {
     width: 80px; height: 80px; background: #fef2f2; color: #ef4444;
     border-radius: 50%; display: flex; align-items: center; justify-content: center;
  }
}

.payment-details-box {
  background: #f8fafc; border-radius: 24px; padding: 1.5rem; text-align: left;
  border: 1px solid #f1f5f9;
  
  .detail-item {
     display: flex; justify-content: space-between; padding: 0.75rem 0;
     border-bottom: 1px solid #f1f5f9;
     &:last-child { border: none; }
     .label { color: #94a3b8; font-size: 0.85rem; font-weight: 600; }
     .value { color: #1e293b; font-size: 0.9rem; font-weight: 700; }
  }
}

.travel-tip-card {
   background: white; border-radius: 24px; padding: 1.5rem; display: flex; gap: 1.25rem;
   align-items: center; text-align: left; border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.02);
   
   .tip-icon {
      width: 48px; height: 48px; background: #fff7ed; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; color: #f97316; font-size: 1.5rem;
   }
   p { margin: 0; line-height: 1.5; }
}

.btn-success-main {
   background: #1e293b !important; border: none !important; padding: 0.75rem 1.5rem !important;
   font-weight: 700 !important; border-radius: 12px !important;
}

.shadow-elevated {
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
}

.loading-title {
  font-weight: 700;
  font-size: 1.25rem;
  color: #1e293b;
}

.loading-desc {
  color: #94a3b8;
}

.icon-size-large {
  font-size: 2.25rem;
}

.result-title {
  font-size: 1.875rem;
  font-weight: 900;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.result-description {
  color: #64748b;
  margin-bottom: 2rem;
  max-width: 24rem;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.625;
}

.bottom-gap {
  margin-bottom: 2.5rem;
}

.price-highlight {
  color: $color-primary;
  font-weight: 700;
}


.action-btns-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  @include sm {
    flex-direction: row;
  }
}

.tip-title {
  font-weight: 700;
  color: #1e293b;
}

.tip-text {
  font-size: 0.875rem;
  color: #64748b;
}

// Animations
.scale-in { animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.fade-in { animation: fadeIn 0.8s ease-out both; }

@keyframes scaleIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes fadeIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.loading-card {
   display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 1.5rem; min-height: 400px;
}

</style>
