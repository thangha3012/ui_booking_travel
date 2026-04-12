<template>
  <div class="tour-detail-page">
    <div v-if="loading" class="loading-overlay">
       <ProgressSpinner />
    </div>

    <!-- HERO SECTION -->
    <div class="detail-hero" v-if="tour">
      <div class="detail-hero__overlay"></div>
      <div class="container detail-hero__content">
        <h1 class="detail-hero__title">{{ tour.title }}</h1>
        <div class="detail-hero__breadcrumb">
          <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
          <i class="pi pi-chevron-right"></i>
          <RouterLink to="/tours">{{ t('nav.destinations') }}</RouterLink>
          <i class="pi pi-chevron-right"></i>
          <span class="current">{{ tour.title }}</span>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="container detail-main" v-if="tour">
      <div class="detail-layout">
        <!-- LEFT COLUMN: Info & Content -->
        <div class="detail-info">
          <!-- Gallery -->
          <div class="gallery">
            <div class="gallery__main">
               <Image :src="tour.imageUrl || defaultCover" alt="Tour" preview class="w-full h-full object-cover rounded-xl" />
            </div>
            <div class="gallery__side">
               <div v-for="(img, i) in thumbs" :key="i" class="relative group">
                  <Image :src="img" alt="Tour side" preview class="w-full h-full object-cover rounded-xl" />
                  <div class="img-overlay opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </div>
            </div>
          </div>

          <!-- Tags & Title -->
          <div class="tags-row">
            <Tag :value="tour.categoryName" severity="info" rounded />
            <Tag :value="tour.destinationName" severity="secondary" rounded icon="pi pi-map-marker" />
            <div class="rating-badge ml-auto">
               <i class="pi pi-star-fill text-yellow-400"></i>
               <span class="font-bold">4.9 / 5</span>
               <span class="text-xs text-slate-400">(125 reviews)</span>
            </div>
          </div>

          <h1 class="tour-title">{{ tour.title }}</h1>
          
          <!-- Tabs Description/Itinerary/Schedules -->
          <div class="tour-tabs mt-8">
            <Tabs value="0">
              <TabList>
                <Tab value="0"><i class="pi pi-info-circle mr-2"></i>{{ t('tour.detail.overview') }}</Tab>
                <Tab value="1"><i class="pi pi-map mr-2"></i>{{ t('tour.detail.itinerary') }}</Tab>
                <Tab value="2"><i class="pi pi-calendar-plus mr-2"></i>Availability</Tab>
                <Tab value="3"><i class="pi pi-comments mr-2"></i>Reviews</Tab>
              </TabList>
              <TabPanels>
                <!-- Overview -->
                <TabPanel value="0">
                  <div class="tab-content py-6 animate-fade-in">
                    <h3 class="mb-4 font-bold text-slate-800">About this journey</h3>
                    <div class="tour-desc mb-8" v-html="tour.description"></div>
                    
                    <div class="tour-highlights">
                      <h3 class="mb-4 font-bold text-slate-800">Highlights</h3>
                      <div class="tour-desc" v-html="tour.highlights"></div>
                    </div>
                  </div>
                </TabPanel>
                
                <!-- Itinerary -->
                <TabPanel value="1">
                  <div class="tab-content py-6 animate-fade-in">
                    <div class="rich-text" v-html="tour.itinerary"></div>
                  </div>
                </TabPanel>
                
                <!-- Schedules -->
                <TabPanel value="2">
                  <div class="tab-content py-6 animate-fade-in">
                    <div v-if="!tour.schedules?.length" class="empty-schedules">
                       <i class="pi pi-calendar-times"></i>
                       <p>Currently no departure schedules available.</p>
                    </div>
                    <div v-else class="schedules-list">
                       <div v-for="s in tour.schedules" :key="s.id" class="schedule-item">
                          <div class="schedule-dates">
                             <div class="date-box">
                                <span class="label">DEP</span>
                                <span class="date">{{ formatDate(s.departureDate) }}</span>
                             </div>
                             <div class="date-arrow"><i class="pi pi-arrow-right"></i></div>
                             <div class="date-box">
                                <span class="label">RET</span>
                                <span class="date">{{ formatDate(s.returnDate) }}</span>
                             </div>
                          </div>
                          <div class="schedule-info">
                             <div class="seats-left" :class="{ 'text-red-500': s.availableSeats < 5 }">
                                <i class="pi pi-users mr-1"></i> {{ s.availableSeats }} seats left
                             </div>
                             <div class="schedule-prices">
                                <div v-for="p in s.pricings" :key="p.passengerType" class="price-chip">
                                   {{ getPassengerTypeName(p.passengerType) }}: <strong>${{ p.price }}</strong>
                                </div>
                             </div>
                          </div>
                          <Button label="Select" icon="pi pi-check" size="small" @click="selectSchedule(s)" />
                       </div>
                    </div>
                  </div>
                </TabPanel>

                <!-- Reviews -->
                <TabPanel value="3">
                  <div class="tab-content py-6 animate-fade-in">
                    <div class="reviews-header flex justify-between items-center mb-8">
                       <div class="avg-rating">
                          <span class="number">4.9</span>
                          <div class="stars">
                             <i class="pi pi-star-fill" v-for="n in 5" :key="n"></i>
                          </div>
                          <span class="total">Based on 125 reviews</span>
                       </div>
                       <Button label="Write a Review" icon="pi pi-pencil" outlined />
                    </div>
                    
                    <div class="reviews-list">
                       <div v-for="n in 3" :key="n" class="review-card mb-6">
                          <div class="review-author flex gap-4 mb-4">
                             <Avatar image="https://i.pravatar.cc/150?u=1" shape="circle" size="large" />
                             <div>
                                <h4 class="font-bold text-slate-800">Ha Duc Thang</h4>
                                <div class="stars text-yellow-400 text-xs">
                                   <i class="pi pi-star-fill mr-1" v-for="i in 5" :key="i"></i>
                                   <span class="text-slate-400 ml-2">2 days ago</span>
                                </div>
                             </div>
                          </div>
                          <p class="review-text text-sm text-slate-600 leading-relaxed italic">
                            "This tour was absolutely incredible! The guide was very knowledgeable and the landscapes were breathtaking. High recommend for anyone visiting Northern Vietnam."
                          </p>
                       </div>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </div>

        <!-- RIGHT COLUMN: Booking Sidebar -->
        <div class="detail-sidebar">
          <div class="booking-box-wrap sticky top-24">
            <div class="booking-box">
              <div class="booking-price">
                <div class="flex flex-col">
                  <span class="text-xs text-slate-400 font-bold uppercase mb-1">{{ t('tour.from') }}</span>
                  <div class="flex items-baseline gap-2">
                    <h2>${{ getMinPrice(tour) }}</h2>
                    <span class="per-night">{{ t('tour.perPerson') }}</span>
                  </div>
                </div>
                <Tag value="Save 20%" severity="warn" class="px-2" />
              </div>

              <div class="booking-form">
                <!-- Select Schedule -->
                <div class="field mb-4">
                  <label>Departure Schedule</label>
                  <Select v-model="bookingForm.schedule" :options="tour.schedules" optionLabel="departureDate" placeholder="Search & pick a date" fluid class="schedule-select">
                     <template #option="slotProps">
                        <div class="flex flex-col gap-1">
                           <div class="font-bold text-sm">{{ formatDate(slotProps.option.departureDate) }}</div>
                           <div class="text-[10px] text-slate-400 mt-1">Available: {{ slotProps.option.availableSeats }} seats</div>
                        </div>
                     </template>
                     <template #value="slotProps">
                        <span v-if="slotProps.value">{{ formatDate(slotProps.value.departureDate) }}</span>
                        <span v-else>{{ slotProps.placeholder }}</span>
                     </template>
                  </Select>
                </div>

                <!-- Passenger Counts -->
                <div class="passengers-flex mb-6">
                   <div class="p-field">
                      <label>Adults</label>
                      <InputNumber v-model="bookingForm.adults" showButtons :min="1" :max="10" fluid class="mini-spinner" />
                   </div>
                   <div class="p-field">
                      <label>Children</label>
                      <InputNumber v-model="bookingForm.children" showButtons :min="0" :max="10" fluid class="mini-spinner" />
                   </div>
                   <div class="p-field">
                      <label>Infants</label>
                      <InputNumber v-model="bookingForm.infants" showButtons :min="0" :max="5" fluid class="mini-spinner" />
                   </div>
                </div>

                <!-- Summary -->
                <div class="booking-summary mb-6">
                  <div class="summary-row">
                    <span>Base Price</span>
                    <span>${{ getMinPrice(tour) }} x {{ totalPax }}</span>
                  </div>
                  <div class="summary-row text-green-500">
                    <span>Member Discount</span>
                    <span>-$20</span>
                  </div>
                  <div class="summary-row total pt-4 border-t border-dashed mt-4">
                    <span class="font-bold">{{ t('tour.detail.booking.total') }}</span>
                    <span class="font-bold text-2xl text-primary">${{ calculateTotal() }}</span>
                  </div>
                </div>

                <Button :label="t('tour.detail.booking.bookNow')" icon="pi pi-bolt" raised class="w-full book-btn py-4" @click="goToCheckout" />
                <p class="text-center text-[11px] text-slate-400 mt-4 leading-relaxed italic">
                  Instant confirmation upon payment.
                </p>
              </div>
            </div>

            <!-- Trust Badge -->
            <div class="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-4">
               <div class="text-primary text-2xl"><i class="pi pi-shield"></i></div>
               <div>
                 <div class="text-xs font-bold text-slate-700">100% Satisfaction Guarantee</div>
                 <div class="text-[11px] text-slate-500">Secure payments & verified local guides.</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tourApi } from '@/api/tourApi'
import { useI18n } from 'vue-i18n'

// PrimeVue
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Image from 'primevue/image'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import ProgressSpinner from 'primevue/progressspinner'
import Avatar from 'primevue/avatar'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const loading = ref(true)
const tour = ref(null)
const defaultCover = 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200'
const thumbs = [
  'https://images.unsplash.com/photo-1555921015-5532091f6026?w=600',
  'https://images.unsplash.com/photo-1573390016527-19ef6f38ebe3?w=600'
]

const bookingForm = reactive({
  schedule: null,
  adults: 2,
  children: 0,
  infants: 0
})

const totalPax = computed(() => bookingForm.adults + bookingForm.children + bookingForm.infants)

function getMinPrice(t) {
  if (!t.schedules?.length) return 150
  const activeSchedules = t.schedules.filter(x => x.isActive && x.availableSeats > 0)
  if (!activeSchedules.length) return 150
  
  let min = Infinity
  activeSchedules.forEach(s => {
    s.pricings.forEach(p => {
       if (p.price < min) min = p.price
    })
  })
  return min === Infinity ? 150 : min
}

function calculateTotal() {
  if (!bookingForm.schedule) return 0
  let total = 0
  const findPrice = (type) => bookingForm.schedule.pricings.find(p => p.passengerType === type)?.price || 150
  
  total += bookingForm.adults * findPrice(1) // Adult=1
  total += bookingForm.children * findPrice(2) // Child=2
  total += bookingForm.infants * findPrice(3) // Infant=3
  
  return total > 20 ? total - 20 : total
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB')
}

function getPassengerTypeName(type) {
  if (type === 1) return 'Adult'
  if (type === 2) return 'Child'
  if (type === 3) return 'Infant'
  return 'Pax'
}

function selectSchedule(s) {
  bookingForm.schedule = s
  window.scrollTo({ top: 500, behavior: 'smooth' })
}

async function loadTour() {
  loading.value = true
  try {
    const res = await tourApi.getById(route.params.id)
    if (res.success) {
      tour.value = res.data
      // Auto select first active schedule
      if (tour.value.schedules?.length) {
         bookingForm.schedule = tour.value.schedules.find(x => x.isActive && x.availableSeats > 0)
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function goToCheckout() {
  if (!bookingForm.schedule) {
    alert("Vui lòng chọn lịch khởi hành phù hợp.");
    return
  }
  
  // Pass details to checkout
  router.push({ 
    name: 'booking', 
    params: { scheduleId: bookingForm.schedule.id }, 
    query: { 
      tourId: tour.value.id,
      adults: bookingForm.adults,
      children: bookingForm.children,
      infants: bookingForm.infants
    } 
  });
}

onMounted(() => {
  loadTour()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.tour-detail-page {
  background: #fbfcfd; min-height: 100vh; padding-bottom: $space-24;
}

// Hero
.detail-hero {
  position: relative; height: 320px;
  background: url('https://images.unsplash.com/photo-1518182170546-076616fd6251?w=1920&q=80') center/cover;
  display: flex; align-items: center; justify-content: center; padding-top: $navbar-height;

  &__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(35, 87, 137, 0.9), rgba(15, 23, 42, 0.7));
  }

  &__content { position: relative; z-index: 1; text-align: center; color: white; }
  &__title { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; margin-bottom: $space-4; letter-spacing: -0.02em; }
  &__breadcrumb {
    font-size: 14px; display: flex; align-items: center; justify-content: center; gap: $space-2; color: #cbd5e1;
    a { color: white; &:hover { color: $color-accent; } }
    .current { color: $color-accent; font-weight: 700; }
  }
}

.detail-main { margin-top: -$space-16; position: relative; z-index: 10; }

.detail-layout {
  display: flex; flex-direction: column; gap: $space-8;
  @include lg { flex-direction: row; align-items: flex-start; }
}

.detail-info {
  flex: 1; background: white; border-radius: $border-radius-2xl;
  padding: $space-8; box-shadow: $shadow-xl; border: 1px solid #f1f5f9;
}

.detail-sidebar {
  width: 100%;
  @include lg { width: 360px; }
}

// Gallery
.gallery {
  display: grid; grid-template-columns: 2fr 1fr; gap: $space-4; margin-bottom: $space-8;
  &__main { height: 420px; :deep(img) { border-radius: 16px; width: 100%; height: 100%; object-fit: cover; } }
  &__side { display: grid; grid-template-rows: 1fr 1fr; gap: $space-4; :deep(img) { border-radius: 16px; width: 100%; height: 100%; object-fit: cover; } }
}

.tags-row {
  display: flex; flex-wrap: wrap; gap: $space-3; margin-bottom: $space-4; align-items: center;
  .p-tag { font-size: 11px; padding: 4px 12px; }
}

.tour-title {
  font-size: 2.25rem; font-weight: 800; color: #1e293b; line-height: 1.2; letter-spacing: -0.03em; margin-bottom: $space-6;
}

// Items
.schedule-item {
  display: grid; grid-template-columns: 1fr; gap: $space-4;
  padding: $space-5; border: 1.5px solid #f1f5f9; border-radius: 16px; margin-bottom: $space-4;
  transition: all 0.3s ease;
  &:hover { border-color: $color-primary; box-shadow: 0 4px 12px rgba($color-primary, 0.08); background: #fbfdff; }
  
  @include sm { grid-template-columns: auto 1fr auto; align-items: center; }
}

.date-box {
  display: flex; flex-direction: column; text-align: center;
  .label { font-size: 10px; font-weight: 800; color: #94a3b8; }
  .date { font-size: 15px; font-weight: 700; color: #1e293b; }
}
.schedule-dates { display: flex; align-items: center; gap: $space-4; }
.date-arrow { color: #cbd5e1; }

.schedule-prices {
   display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;
   .price-chip { font-size: 11px; color: #64748b; background: #f8fafc; padding: 2px 8px; border-radius: 6px; }
}

.seats-left { font-size: 13px; font-weight: 600; color: #10b981; }

// Review
.avg-rating {
   text-align: center;
   .number { font-size: 3rem; font-weight: 800; color: #1e293b; display: block; line-height: 1; }
   .stars { color: #fbbf24; margin: 8px 0; }
   .total { font-size: 12px; color: #64748b; }
}

// Booking Box
.booking-box {
  background: white; border-radius: $border-radius-2xl; padding: $space-8;
  box-shadow: $shadow-2xl; border: 1px solid #f1f5f9;

  .booking-price {
    display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: $space-6;
    h2 { font-size: 32px; font-weight: 800; color: $color-text-primary; letter-spacing: -1px; margin: 0; }
    .per-night { font-size: 14px; color: $color-text-secondary; font-weight: 500; }
  }
}

.passengers-flex {
   display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
   label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; display: block; }
}

.booking-summary {
  background: #f8fafc; padding: $space-6; border-radius: 16px;
  .summary-row {
    display: flex; justify-content: space-between; font-size: 14px; color: #475569; margin-bottom: $space-2;
    &.total { margin-bottom: 0; padding-top: $space-4; color: #1e293b; }
  }
}

.book-btn { height: 56px; font-weight: 800 !important; border-radius: 16px !important; }

.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.loading-overlay { position: fixed; inset: 0; background: rgba(255,255,255,0.8); z-index: 1000; @include flex-center; }
</style>
