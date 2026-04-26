<template>
  <div class="payment-return-page">
    <div class="container return-container">
       <div v-if="loading" class="status-card loading-card">
          <ProgressSpinner />
          <h3>Verifying Payment...</h3>
          <p>Please do not close or refresh this page.</p>
       </div>

       <div v-else class="status-card" :class="{ 'success': isSuccess, 'failure': !isSuccess }">
          <div class="result-icon">
             <i v-if="isSuccess" class="pi pi-check-circle scale-in"></i>
             <i v-else class="pi pi-times-circle scale-in"></i>
          </div>

          <h1 v-if="isSuccess" class="fade-in">{{ t('payment.return.successTitle') }}</h1>
          <h1 v-else class="fade-in">{{ t('payment.return.failureTitle') }}</h1>

          <p class="fade-in text-slate-500 mb-8 max-w-md mx-auto">
             <span v-if="isSuccess">
                Thank you for your booking! Your payment has been processed successfully. A confirmation email with your ticket has been sent to your inbox.
             </span>
             <span v-else>
                Oops! Something went wrong with your payment. Please check your card balance or contact your bank for more details.
             </span>
          </p>

          <div class="payment-details fade-in mb-10" v-if="paymentInfo">
             <div class="detail-row">
                <span>Transaction ID</span>
                <strong>{{ paymentInfo.vnp_TransactionNo || 'N/A' }}</strong>
             </div>
             <div class="detail-row">
                <span>Amount</span>
                <strong class="text-primary">${{ (paymentInfo.vnp_Amount / 100).toLocaleString() }}</strong>
             </div>
             <div class="detail-row">
                <span>Description</span>
                <strong>{{ paymentInfo.vnp_OrderInfo || 'Travel Booking' }}</strong>
             </div>
          </div>

          <div class="action-btns flex gap-4 justify-center fade-in">
             <Button v-if="isSuccess" label="View My Bookings" icon="pi pi-ticket" raised @click="router.push('/my-bookings')" />
             <Button v-else label="Try Again" icon="pi pi-refresh" severity="danger" raised @click="router.push('/tours')" />
             <Button label="Back to Home" icon="pi pi-home" text severity="secondary" @click="router.push('/')" />
          </div>
       </div>

       <!-- Travel Advice / Upsell -->
       <div v-if="isSuccess && !loading" class="travel-advice-card mt-12 fade-in">
          <div class="advice-icon">
             <i class="pi pi-lightbulb"></i>
          </div>
          <div class="advice-content">
             <h4>Pro Tip for your journey</h4>
             <p>Remember to arrive at least 30 minutes before departure time. You can view your detailed itinerary and guide contact in your account dashboard.</p>
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

async function verifyPayment() {
  loading.value = true
  try {
    const query = route.query
    paymentInfo.value = query
    
    // Call backend to verify and update status
    const res = await paymentApi.vnpayReturn(query)
    if (res.success || res.vnp_ResponseCode === '00') {
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
  background: #f8fafc; min-height: 100vh; padding: $space-24 0;
  display: flex; align-items: center; justify-content: center;
}

.return-container { max-width: 600px; text-align: center; }

.status-card {
  background: white; border-radius: 32px; padding: $space-16 $space-8;
  box-shadow: $shadow-2xl; border: 1px solid #f1f5f9; position: relative; overflow: hidden;
  
  &::before {
     content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 8px;
  }
  
  &.success::before { background: #10b981; }
  &.failure::before { background: #ef4444; }
}

.result-icon {
  font-size: 6rem; margin-bottom: $space-8;
  .pi-check-circle { color: #10b981; }
  .pi-times-circle { color: #ef4444; }
}

h1 { font-size: 2.25rem; font-weight: 800; color: #1e293b; margin-bottom: $space-4; letter-spacing: -0.02em; }

.payment-details {
  background: #f8fafc; border-radius: 20px; padding: $space-6; text-align: left;
  .detail-row {
     display: flex; justify-content: space-between; padding: $space-3 0; border-bottom: 1px solid #f1f5f9;
     &:last-child { border: none; }
     span { color: #64748b; font-size: 14px; }
     strong { color: #1e293b; font-size: 14px; }
  }
}

.travel-advice-card {
   background: white; border-radius: 20px; padding: $space-6; display: flex; gap: $space-6;
   align-items: center; text-align: left; border: 1px solid #f1f5f9; box-shadow: $shadow-md;
   .advice-icon {
      width: 48px; height: 48px; background: transparentize($color-accent, 0.9); border-radius: 12px;
      @include flex-center; color: $color-accent; font-size: 1.5rem;
   }
   h4 { font-weight: 700; color: #1e293b; margin-bottom: 4px; }
   p { font-size: 0.85rem; color: #64748b; margin: 0; }
}

// Animations
.scale-in { animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.fade-in { animation: fadeIn 0.8s ease-out both; }

@keyframes scaleIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes fadeIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.loading-card {
   @include flex-center; flex-direction: column; gap: $space-4; min-height: 400px;
   h3 { font-weight: 700; color: #1e293b; }
}
</style>
