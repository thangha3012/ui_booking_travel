<template>
  <div class="checkout-page">
    <!-- HERO SECTION -->
    <div class="checkout-hero">
      <div class="checkout-hero__overlay"></div>
      <div class="container checkout-hero__content">
        <h1 class="checkout-hero__title">{{ $t('booking.checkout.title') }}</h1>
        <div class="checkout-hero__breadcrumb">
          <RouterLink to="/">{{ $t('nav.home') }}</RouterLink>
          <i class="pi pi-chevron-right text-[10px] mx-1 opacity-50"></i>
          <span class="current">{{ $t('booking.checkout.breadcrumb') }}</span>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="container checkout-main">
      <div v-if="!tour && !loading" class="error-state py-20 text-center">
         <i class="pi pi-search text-4xl text-slate-300 mb-4"></i>
         <p class="text-slate-500">{{ $t('booking.checkout.noTour') }}</p>
         <Button :label="$t('booking.checkout.browseTours')" icon="pi pi-arrow-left" text @click="router.push('/tours')" />
      </div>
      
      <div v-else class="checkout-layout">
        <!-- LEFT COLUMN: Forms -->
        <div class="checkout-form-col">
          <div class="flex items-center gap-4 mb-10">
             <Button icon="pi pi-arrow-left" text rounded @click="router.back()" />
             <h2 class="section-heading mb-0">{{ $t('booking.checkout.confirmPay') }}</h2>
          </div>

          <!-- Section 1: Information -->
          <div class="checkout-section">
            <h3 class="section-title">
              <span class="icon-circle">1</span> {{ $t('booking.contactInfo') }}
            </h3>
            
            <div class="form-block">
               <h4 class="block-title">{{ $t('booking.checkout.contactDetails') }}</h4>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div class="field">
                    <label>{{ $t('auth.fullName') }} *</label>
                    <InputText v-model="contactForm.contactName" :placeholder="$t('auth.fullName')" fluid />
                 </div>
                 <div class="field">
                    <label>{{ $t('auth.phone') }} *</label>
                    <InputText v-model="contactForm.contactPhone" :placeholder="$t('auth.phone')" fluid />
                 </div>
               </div>
               <div class="field mb-4">
                 <label>{{ $t('auth.email') }} *</label>
                 <InputText v-model="contactForm.contactEmail" type="email" :placeholder="$t('auth.email')" fluid />
               </div>
               <div class="field">
                 <label>{{ $t('booking.checkout.notes') }}</label>
                 <Textarea v-model="contactForm.notes" rows="3" :placeholder="$t('booking.checkout.anyRequests')" autoResize fluid />
               </div>
            </div>

            <div class="form-block mt-10 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
               <div class="flex justify-between items-center mb-4">
                 <h4 class="block-title mb-0">{{ $t('booking.checkout.primaryPassenger') }}</h4>
                 <Tag :value="$t('tour.adult')" severity="info" rounded />
               </div>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div class="field">
                    <label>{{ $t('auth.fullName') }} *</label>
                    <InputText v-model="passengers[0].fullName" :placeholder="$t('booking.checkout.idPlaceholder')" fluid />
                 </div>
                 <div class="field">
                    <label>{{ $t('booking.gender') }} *</label>
                    <Select v-model="passengers[0].gender" :options="[t('booking.male'), t('booking.female'), t('booking.other')]" :placeholder="$t('common.search')" fluid />
                 </div>
               </div>
               <div class="field mt-4">
                 <label>{{ $t('booking.idDoc') }}</label>
                 <InputText v-model="passengers[0].idDocument" :placeholder="$t('admin.destinations.dialog.descPlaceholder')" fluid />
               </div>
            </div>
          </div>

          <!-- Section 2: Payment -->
          <div class="checkout-section mt-12">
            <h3 class="section-title">
              <span class="icon-circle">2</span> {{ $t('booking.checkout.paymentMethods') }}
            </h3>

            <div class="payment-methods flex flex-col gap-4">
              <!-- Method: PayPal -->
              <div class="payment-method-item" :class="{ active: paymentType === 'paypal' }" @click="paymentType = 'paypal'">
                <RadioButton v-model="paymentType" inputId="pay-paypal" name="payment" value="paypal" />
                <div class="method-body">
                  <label for="pay-paypal" class="font-bold text-slate-800 cursor-pointer block mb-1">{{ $t('booking.checkout.paypal') }}</label>
                  <p class="text-xs text-slate-500">{{ $t('booking.checkout.paypalDesc') }}</p>
                </div>
                <div class="method-logo">
                  <i class="pi pi-paypal text-2xl text-blue-800"></i>
                </div>
              </div>

              <!-- Method: Credit Card -->
              <div class="payment-method-item" :class="{ active: paymentType === 'card' }" @click="paymentType = 'card'">
                <RadioButton v-model="paymentType" inputId="pay-card" name="payment" value="card" />
                <div class="method-body">
                  <label for="pay-card" class="font-bold text-slate-800 cursor-pointer block mb-1">Credit / Debit Card</label>
                  <p class="text-xs text-slate-500">We support Visa, Mastercard, and American Express.</p>
                  
                  <!-- Card Form Expand -->
                  <div v-if="paymentType === 'card'" class="card-details-expand mt-6 pt-6 border-t animate-fade-in" @click.stop>
                     <div class="field mb-4">
                       <label>{{ $t('booking.checkout.cardNumber') }}</label>
                       <InputText placeholder="0000 0000 0000 0000" fluid icon="pi pi-credit-card" />
                     </div>
                     <div class="grid grid-cols-2 gap-4">
                        <div class="field">
                          <label>{{ $t('booking.checkout.expiryDate') }}</label>
                          <InputText placeholder="MM/YY" fluid />
                        </div>
                        <div class="field">
                          <label>{{ $t('booking.checkout.cvc') }}</label>
                          <Password :feedback="false" placeholder="***" fluid />
                        </div>
                     </div>
                  </div>
                </div>
                <div class="method-logo flex gap-2">
                   <i class="pi pi-credit-card text-2xl text-slate-400"></i>
                </div>
              </div>
              
              <!-- Method: VNPay (Primary for this app) -->
               <div class="payment-method-item" :class="{ active: paymentType === 'vnpay' }" @click="paymentType = 'vnpay'">
                <RadioButton v-model="paymentType" inputId="pay-vnpay" name="payment" value="vnpay" />
                <div class="method-body">
                  <label for="pay-vnpay" class="font-bold text-slate-800 cursor-pointer block mb-1">{{ $t('booking.checkout.vnpay') }}</label>
                  <p class="text-xs text-slate-500">{{ $t('booking.checkout.vnpayDesc') }}</p>
                </div>
                <div class="method-logo">
                  <Tag :value="$t('booking.checkout.recommended')" severity="success" class="text-[10px]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Order Summary -->
        <div class="checkout-sidebar">
          <div class="summary-box sticky top-24">
            <h3 class="flex items-center gap-3 font-bold text-lg mb-6">
               <i class="pi pi-shopping-bag text-primary"></i>
               {{ $t('booking.checkout.summary') }}
            </h3>
            
            <div v-if="tour" class="summary-tour-card mb-6">
               <img :src="tour.coverImage || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=200&q=80'" alt="Tour" />
               <div class="tour-info mt-3">
                 <h4 class="font-bold text-slate-800 leading-tight mb-1">{{ tour.title }}</h4>
                 <div class="flex items-center gap-2">
                    <Rating :modelValue="5" readonly :cancel="false" class="text-xs" />
                    <span class="text-[10px] text-slate-400 font-bold">(Based on 234 reviews)</span>
                 </div>
               </div>
            </div>

            <div class="price-breakdown space-y-3 mb-8">
               <div class="flex justify-between text-sm">
                  <span class="text-slate-500">{{ $t('tour.adult') }} x1</span>
                  <span class="font-bold text-slate-700">${{ totalAmountComputed }}</span>
               </div>
               <div class="flex justify-between text-sm">
                  <span class="text-slate-500">{{ $t('booking.checkout.serviceFee') }}</span>
                  <span class="font-bold text-slate-700">$20.00</span>
               </div>
               <div class="flex justify-between text-sm text-green-600">
                  <span>{{ $t('tour.detail.booking.discount') }}</span>
                  <span class="font-bold">-$20.00</span>
               </div>
            </div>

            <div class="total-row pt-6 border-t border-dashed flex justify-between items-end mb-8">
               <div class="flex flex-col">
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ $t('booking.checkout.total') }}</span>
                  <span class="text-3xl font-black text-primary leading-none">${{ totalAmountComputed }}</span>
               </div>
               <div class="text-[10px] text-slate-400 font-medium italic">{{ $t('booking.checkout.vat') }}</div>
            </div>

            <Button :label="$t('booking.checkout.complete')" icon="pi pi-lock" :loading="loading" raised class="w-full py-4 text-lg font-bold book-btn" @click="handleVNPayCheckout" />
            
            <div class="mt-6 flex items-center justify-center gap-4 border-t pt-6 opacity-40">
               <i class="pi pi-verified text-xl"></i>
               <i class="pi pi-lock text-xl"></i>
               <i class="pi pi-shield text-xl"></i>
            </div>
            <p class="text-center text-[10px] text-slate-400 mt-4 px-4 line-height-15">
               {{ $t('booking.checkout.agreeTerms') }}
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tourApi } from '@/api/tourApi'
import { bookingApi } from '@/api/bookingApi'
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
const tour = ref(null)
const paymentType = ref('vnpay')

const contactForm = reactive({
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  notes: ''
})

const passengers = ref([
  { fullName: '', gender: 'Male', dateOfBirth: '1990-01-01', idDocument: '', type: 1 }
])

const totalAmountComputed = computed(() => {
  const schedule = tour.value?.schedules?.[0]
  if (schedule) {
    return schedule.pricings?.find(p => p.passengerType === 1)?.price || 150
  }
  return 150
})

async function loadTourInfo() {
  const tId = route.query.tourId
  if (!tId) return
  loading.value = true
  try {
    const res = await tourApi.getById(tId)
    if (res.success) {
      tour.value = res.data
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function handleVNPayCheckout() {
  if (!authStore.isLoggedIn) {
    toast.add({ severity: 'warn', summary: t('booking.checkout.authRequired'), detail: t('booking.checkout.loginToBook'), life: 3000 })
    router.push('/login?redirect=' + route.fullPath)
    return
  }

  if (!contactForm.contactName || !contactForm.contactPhone) {
    toast.add({ severity: 'error', summary: t('booking.checkout.validationError'), detail: t('admin.tours.dialog.enterName'), life: 3000 })
    return
  }

  loading.value = true
  try {
    const schedule = tour.value?.schedules?.[0]
    if (!schedule) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No departures found for this tour', life: 3000 })
      return
    }

    const bookingData = {
      tourId: tour.value.id,
      departureScheduleId: schedule.id,
      contactName: contactForm.contactName,
      contactPhone: contactForm.contactPhone,
      contactEmail: contactForm.contactEmail,
      notes: contactForm.notes,
      scheduleRowVersion: schedule.rowVersion || "",
      passengers: passengers.value
    }

    const res = await bookingApi.create(bookingData)
    if (res.success) {
      toast.add({ severity: 'success', summary: t('booking.checkout.bookingSuccess'), detail: t('booking.checkout.adventureConfirmed'), life: 3000 })
      setTimeout(() => router.push('/my-bookings'), 1500)
    } else {
      toast.add({ severity: 'error', summary: t('common.error'), detail: res.message, life: 4000 })
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: error.message, life: 4000 })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTourInfo()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.checkout-page { background: $color-bg-page; min-height: 100vh; padding-bottom: $space-24; }

// =======================
// HERO SECTION
// =======================
.checkout-hero {
  position: relative; height: 320px;
  background: url('https://images.unsplash.com/photo-1518182170546-076616fd6251?w=1920&q=80') center/cover;
  display: flex; align-items: center; justify-content: center; padding-top: $navbar-height;

  &__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(35, 87, 137, 0.9), rgba(36, 49, 25, 0.75));
  }

  &__content { position: relative; z-index: 1; text-align: center; color: white; }
  &__title { font-size: clamp(2.25rem, 5vw, 3.25rem); font-weight: 700; margin-bottom: $space-4; letter-spacing: -0.02em; }
  &__breadcrumb {
    font-size: 14px; display: flex; align-items: center; justify-content: center; gap: $space-3;
    a { color: rgba(255,255,255,0.8); &:hover { color: white; } }
    .current { color: $color-accent; font-weight: 600; }
  }
}

// =======================
// MAIN LAYOUT
// =======================
.checkout-main { margin-top: -$space-12; position: relative; z-index: 10; }

.checkout-layout {
  display: flex; flex-direction: column; gap: $space-8;
  @include lg { flex-direction: row; align-items: flex-start; }
}

.checkout-form-col {
  flex: 1; background: white; border-radius: $border-radius-xl;
  padding: $space-8; box-shadow: $shadow-xl; border: 1px solid $color-border-light;
  @include lg { padding: $space-12; }
}

.checkout-sidebar { width: 100%; @include lg { width: 400px; } }

.section-heading { font-size: 28px; font-weight: 800; color: $color-text-primary; letter-spacing: -0.01em; margin-bottom: $space-10; }

.section-title {
  display: flex; align-items: center; gap: $space-4;
  font-size: 18px; font-weight: 700; color: $color-text-primary; margin-bottom: $space-8;
}

.icon-circle {
  width: 32px; height: 32px; background: $color-primary; color: white;
  border-radius: 50%; @include flex-center; font-size: 14px; font-weight: 700;
}

.block-title { font-size: 11px; color: $color-text-secondary; margin-bottom: $space-4; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }

.field {
  display: flex; flex-direction: column; gap: 6px;
  label { font-size: 12px; font-weight: 600; color: $color-text-secondary; }
}

// =======================
// PAYMENT METHODS
// =======================
.payment-method-item {
  display: flex; align-items: flex-start; gap: $space-4; padding: $space-6;
  border: 1px solid #e2e8f0; border-radius: 16px; cursor: pointer; transition: all 0.3s;
  background: white;

  &:hover { border-color: $color-primary-light; background: #f8fafc; }
  &.active { border-color: $color-primary; border-width: 2px; padding: calc($space-6 - 1px); box-shadow: 0 4px 20px rgba(35,87,137,0.08); }

  .method-body { flex: 1; padding-top: 2px; }
  .method-logo { opacity: 0.8; }
}

// =======================
// SIDEBAR SUMMARY
// =======================
.summary-box {
  background: white; border-radius: $border-radius-xl; padding: $space-8;
  box-shadow: $shadow-xl; border: 1px solid $color-border-light;
}

.summary-tour-card {
  img { width: 100%; height: 160px; object-fit: cover; border-radius: $border-radius-lg; }
}

.book-btn { background: $color-primary !important; border: none !important; transition: $transition-base; &:hover { transform: translateY(-2px); box-shadow: $shadow-lg; } }

.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>
