<template>
  <div class="tour-detail-page">
    <!-- HERO SECTION -->
    <div class="detail-hero">
      <div class="detail-hero__overlay"></div>
      <div class="container detail-hero__content">
        <h1 class="detail-hero__title" v-if="tour">{{ tour.title }}</h1>
        <h1 class="detail-hero__title" v-else>{{ $t('tour.detail.breadcrumb') }}</h1>
        <div class="detail-hero__breadcrumb">
          <RouterLink to="/">{{ $t('nav.home') }}</RouterLink>
          <i class="pi pi-chevron-right text-[10px] mx-1 opacity-50"></i>
          <RouterLink to="/tours">{{ $t('nav.tours') }}</RouterLink>
          <i class="pi pi-chevron-right text-[10px] mx-1 opacity-50"></i>
          <span class="current">{{ tour?.categoryName || $t('tour.detail.breadcrumb') }}</span>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="container detail-main">
      <div v-if="loading" class="loading-state h-[400px] flex-center flex-col gap-4">
        <ProgressSpinner strokeWidth="4" />
        <p class="text-slate-500 font-medium">{{ $t('tour.detail.loading') }}</p>
      </div>
      <div v-else-if="!tour" class="error-state min-h-[400px] flex-center">
        <div class="text-center">
           <i class="pi pi pi-exclamation-circle text-4xl text-slate-300 mb-4"></i>
           <p class="text-xl font-bold text-slate-700">{{ $t('tour.detail.notFound') }}</p>
           <Button :label="$t('tour.detail.backToList')" icon="pi pi pi-arrow-left" @click="router.push('/tours')" text />
        </div>
      </div>
      <div v-else class="detail-layout">
        
        <!-- LEFT COLUMN: Information -->
        <div class="detail-info">
          <!-- Image Gallery (Using Custom Layout with Galleria for Lightbox) -->
          <div class="gallery">
             <div class="gallery__main">
               <Image :src="tour.coverImage || defaultCover" alt="Main" preview class="w-full h-full" imageClass="w-full h-full object-cover rounded-xl" />
             </div>
             <div class="gallery__side">
               <Image v-for="(img, idx) in thumbs" :key="idx" :src="img" preview imageClass="w-full h-full object-cover rounded-xl" />
             </div>
          </div>

          <!-- Tags & Rating -->
          <div class="tags-row">
            <Tag value="5.0" severity="secondary" rounded class="px-3" />
            <Tag :value="$t('hero.explore')" severity="success" rounded />
            <Tag :value="$t('hero.trending')" severity="info" rounded />
            <div class="flex gap-1 ml-2">
               <i v-for="i in 5" :key="i" class="pi pi-star-fill text-yellow-500 text-sm"></i>
            </div>
            <span class="ml-auto text-xs text-slate-400 font-medium">(256 {{ $t('tour.detail.reviews') }})</span>
          </div>

          <!-- Title -->
          <h1 class="tour-title">{{ tour.title }}</h1>
          <div class="flex items-center gap-2 mb-8 text-slate-500">
             <i class="pi pi-map-marker text-primary"></i>
             <span class="text-sm font-medium">{{ tour.destinationName || 'Northern Vietnam' }}</span>
          </div>

          <!-- Tabs (PrimeVue 4 Style) -->
          <div class="tour-content-tabs mb-10">
            <Tabs value="0">
              <TabList>
                <Tab value="0">{{ $t('tour.detail.tabs.desc') }}</Tab>
                <Tab value="1">{{ $t('tour.detail.tabs.schedules') }}</Tab>
                <Tab value="2">{{ $t('tour.detail.tabs.amenities') }}</Tab>
                <Tab value="3">{{ $t('tour.detail.tabs.priceHistory') }}</Tab>
              </TabList>
              <TabPanels>
                <TabPanel value="0">
                   <div class="tour-desc">
                     <p>{{ tour.description || 'Arabian Park Hotel is a great choice for travellers looking for a 3 star hotel...' }}</p>
                   </div>
                </TabPanel>
                <TabPanel value="1">
                   <div class="schedules-list py-4">
                     <div v-if="!tour.schedules?.length" class="text-slate-400">{{ $t('tour.detail.noSchedules') }}</div>
                     <div v-else v-for="s in tour.schedules" :key="s.id" class="schedule-item mb-4 p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <div class="font-bold text-slate-700">{{ s.tourName }}</div>
                          <div class="text-xs text-slate-500">{{ s.availableSeats }} {{ $t('tour.detail.seatsLeft') }}</div>
                        </div>
                        <Tag :value="$t('tour.detail.available')" severity="success" />
                     </div>
                   </div>
                </TabPanel>
                <TabPanel value="2">
                   <div class="tour-amenities">
                    <h3>{{ $t('tour.detail.amenitiesTitle') }}</h3>
                    <div class="amenities-grid">
                      <span class="amenity"><i class="pi pi-wifi"></i> Wifi</span>
                      <span class="amenity"><i class="pi pi-wave-pulse"></i> {{ $t('home.heroSubtitle') }}</span>
                      <span class="amenity"><i class="pi pi-coffee"></i> Breakfast</span>
                      <span class="amenity"><i class="pi pi-ticket"></i> Kids area</span>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value="3">
                   <div class="h-20 flex-center text-slate-400 italic">{{ $t('tour.detail.noPriceHistory') }}</div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>

          <!-- FAQs (Accordion) -->
          <div class="tour-faqs py-6 border-t">
            <h3 class="mb-6 font-bold text-slate-800">{{ $t('tour.detail.faqs') }}</h3>
            <Accordion value="0">
              <AccordionPanel value="0">
                <AccordionHeader>What destinations do you offer tours to?</AccordionHeader>
                <AccordionContent>
                  <p class="m-0 text-slate-600 leading-relaxed text-sm">
                    Quisque rutrum. Aenean imperdi. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus.
                  </p>
                </AccordionContent>
              </AccordionPanel>
              <AccordionPanel value="1">
                <AccordionHeader>What types of service do you provide?</AccordionHeader>
                <AccordionContent>
                  <p class="m-0 text-slate-600 leading-relaxed text-sm">
                    Our services include professional guides, luxury transportation, premium accommodation, and curated culinary experiences across Northern Vietnam.
                  </p>
                </AccordionContent>
              </AccordionPanel>
              <AccordionPanel value="2">
                <AccordionHeader>What is included in the tour package?</AccordionHeader>
                <AccordionContent>
                  <p class="m-0 text-slate-600 leading-relaxed text-sm">
                    Most packages include entrance fees, meals as specified, English/Vietnamese speaking guides, and high-quality hotels or resorts.
                  </p>
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </div>
        </div>

        <!-- RIGHT COLUMN: Booking Box -->
        <div class="detail-sidebar">
          <div class="booking-box-wrap sticky top-24">
            <div class="booking-box">
              <div class="booking-price">
                <div class="flex flex-col">
                  <span class="text-xs text-slate-400 font-bold uppercase mb-1">{{ $t('tour.from') }}</span>
                  <h2>${{ getMinPrice(tour) }} <span class="per-night">{{ $t('tour.perPerson') }}</span></h2>
                </div>
                <Tag value="Save 20%" severity="warn" class="px-2" />
              </div>

              <div class="booking-form">
                <!-- Check-in/out -->
                <div class="grid grid-cols-2 gap-3 mb-4">
                  <div class="field">
                    <label>{{ $t('tour.detail.booking.checkIn') }}</label>
                    <DatePicker v-model="bookingForm.checkIn" showIcon fluid :placeholder="$t('common.search')" />
                  </div>
                  <div class="field">
                    <label>{{ $t('tour.detail.booking.checkOut') }}</label>
                    <DatePicker v-model="bookingForm.checkOut" showIcon fluid :placeholder="$t('common.search')" />
                  </div>
                </div>

                <!-- Guests -->
                <div class="field mb-6">
                  <label>{{ $t('tour.detail.booking.guests') }}</label>
                  <Select v-model="bookingForm.guests" :options="guestOptions" optionLabel="label" fluid />
                </div>

                <!-- Extras -->
                <div class="booking-extras mb-6">
                  <p class="font-bold text-xs uppercase text-slate-500 mb-3 tracking-wider">{{ $t('tour.detail.booking.extras') }}</p>
                  <div class="flex flex-col gap-3">
                    <div v-for="(extra, i) in extrasList" :key="i" class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                         <Checkbox v-model="bookingForm.extras" :value="extra.id" :inputId="`extra-${extra.id}`" />
                         <label :for="`extra-${extra.id}`" class="text-sm cursor-pointer">{{ extra.label }}</label>
                      </div>
                      <span class="text-sm font-semibold text-slate-500">{{ extra.price > 0 ? `$${extra.price}` : 'Free' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Summary -->
                <div class="booking-summary mb-6">
                  <div class="summary-row">
                    <span>{{ $t('tour.detail.booking.summary') }}</span>
                    <span>${{ getMinPrice(tour) }}</span>
                  </div>
                  <div class="summary-row text-green-500">
                    <span>{{ $t('tour.detail.booking.discount') }}</span>
                    <span>-$20</span>
                  </div>
                  <div class="summary-row total pt-4 border-t border-dashed mt-4">
                    <span class="font-bold">{{ $t('tour.detail.booking.total') }}</span>
                    <span class="font-bold text-xl text-primary">${{ getMinPrice(tour) - 20 }}</span>
                  </div>
                </div>

                <Button :label="$t('tour.detail.booking.bookNow')" icon="pi pi-bolt" raised class="w-full book-btn py-4" @click="goToCheckout" />
                <p class="text-center text-[11px] text-slate-400 mt-4 leading-relaxed italic">
                  {{ $t('tour.detail.booking.payLater') }}
                </p>
              </div>
            </div>

            <!-- Trust Badge -->
            <div class="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-4">
               <div class="text-primary text-2xl"><i class="pi pi-shield"></i></div>
               <div>
                 <div class="text-xs font-bold text-slate-700">{{ $t('tour.detail.booking.guarantee') }}</div>
                 <div class="text-[11px] text-slate-500">{{ $t('tour.detail.booking.trustDesc') }}</div>
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
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import Image from 'primevue/image'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import ProgressSpinner from 'primevue/progressspinner'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const loading = ref(true)
const tour = ref(null)
const defaultCover = 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80'
const thumbs = [
  'https://images.unsplash.com/photo-1555921015-5532091f6026?w=400&q=80',
  'https://images.unsplash.com/photo-1573390016527-19ef6f38ebe3?w=400&q=80'
]

const bookingForm = reactive({
  checkIn: null,
  checkOut: null,
  guests: { label: '2 Adults, 1 Child', value: 3 },
  extras: []
})

const guestOptions = computed(() => [
  { label: `1 ${t('tour.adult')}`, value: 1 },
  { label: `2 ${t('tour.adult')}`, value: 2 },
  { label: `2 ${t('tour.adult')}, 1 ${t('tour.child')}`, value: 3 },
  { label: `2 ${t('tour.adult')}, 2 ${t('tour.child')}`, value: 4 }
])

const extrasList = computed(() => [
  { id: 'pet', label: t('tour.detail.booking.extras'), price: 13 },
  { id: 'breakfast', label: 'Daily Breakfast', price: 10 },
  { id: 'parking', label: 'Private Parking', price: 6 },
  { id: 'pillow', label: 'Extra Pillow', price: 0 }
])

function getMinPrice(t) {
  if (!t.schedules?.length) return 150
  try {
    const s = t.schedules.find(x => x.isActive && x.availableSeats > 0)
    if (s && s.pricings?.length) {
      return Math.min(...s.pricings.map(p => p.price))
    }
  } catch {}
  return 150
}

async function loadTour() {
  loading.value = true
  try {
    const res = await tourApi.getById(route.params.id)
    if (res.success) {
      tour.value = res.data
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function goToCheckout() {
  const s = tour.value.schedules?.find(x => x.isActive && x.availableSeats > 0);
  if (s) {
    router.push({ name: 'booking', params: { scheduleId: s.id }, query: { tourId: tour.value.id } });
  } else {
    alert("Dạ, hiện tại Tour này đang tạm hết chỗ hoặc không có lịch khởi hành phù hợp.");
  }
}

onMounted(() => {
  loadTour()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.tour-detail-page {
  background: white; min-height: 100vh; padding-bottom: $space-24;
}

// =======================
// HERO SECTION
// =======================
.detail-hero {
  position: relative; height: 280px;
  background: url('https://images.unsplash.com/photo-1518182170546-076616fd6251?w=1920&q=80') center/cover;
  display: flex; align-items: center; justify-content: center; padding-top: $navbar-height;

  &__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(35, 87, 137, 0.85), rgba(36, 49, 25, 0.7));
  }

  &__content { position: relative; z-index: 1; text-align: center; color: white; }
  &__title { font-size: clamp(1.85rem, 4vw, 2.75rem); font-weight: 700; margin-bottom: $space-3; letter-spacing: -0.02em; }
  &__breadcrumb {
    font-size: 13px; display: flex; align-items: center; justify-content: center; gap: $space-2;
    a { color: rgba(255,255,255,0.8); &:hover { color: white; } }
    .current { color: $color-accent; font-weight: 600; }
  }
}

// =======================
// MAIN LAYOUT
// =======================
.container { max-width: 1140px; margin: 0 auto; padding: 0 1rem; }
.detail-main { margin-top: -$space-10; position: relative; z-index: 10; }

.detail-layout {
  display: flex; flex-direction: column; gap: $space-6;
  @include lg { flex-direction: row; align-items: flex-start; }
}

.detail-info {
  flex: 1; background: white; border-radius: $border-radius-xl;
  padding: $space-6; box-shadow: $shadow-xl; border: 1px solid $color-border-light;
}

.detail-sidebar {
  width: 100%;
  @include lg { width: 350px; }
}

// =======================
// INFO (Left Col)
// =======================
.gallery {
  display: grid; grid-template-columns: 2fr 1fr; gap: $space-3; margin-bottom: $space-6;
  &__main { height: 340px; }
  &__side { display: grid; grid-template-rows: 1fr 1fr; gap: $space-3; }
}

.tags-row {
  display: flex; flex-wrap: wrap; gap: $space-3; margin-bottom: $space-4; align-items: center;
}

.tour-title {
  font-size: clamp(1.75rem, 3.5vw, 2.25rem); color: $color-text-primary;
  font-weight: 700; line-height: 1.2; margin-bottom: $space-2; letter-spacing: -0.02em;
}

.tour-desc { font-size: 15px; color: $color-text-body; line-height: 1.7; }

.tour-amenities {
  h3 { font-size: 16px; font-weight: 700; color: $color-text-primary; margin-bottom: $space-4; }
  .amenities-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: $space-4;
    @include sm { grid-template-columns: repeat(3, 1fr); }
  }
  .amenity { display: flex; align-items: center; gap: $space-2; font-size: 14px; color: $color-text-body; .pi { color: $color-primary; font-size: 14px; } }
}

// =======================
// BOOKING BOX
// =======================
.booking-box {
  background: white; border-radius: $border-radius-xl; padding: $space-6;
  box-shadow: $shadow-xl; border: 1px solid $color-border-light;

  .booking-price {
    display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: $space-6;
    h2 { font-size: 28px; font-weight: 800; color: $color-text-primary; letter-spacing: -1px; margin: 0; }
    .per-night { font-size: 13px; color: $color-text-secondary; font-weight: 500; }
  }
}

.field {
  display: flex; flex-direction: column; gap: 6px;
  label { font-size: 11px; font-weight: 700; color: $color-text-secondary; text-transform: uppercase; letter-spacing: 0.05em; }
}

.booking-summary {
  background: #f8fafc; padding: $space-5; border-radius: $border-radius-lg;
  .summary-row {
    display: flex; justify-content: space-between; font-size: 13px; color: $color-text-body; margin-bottom: $space-2;
    &.total { margin-bottom: 0; padding-top: $space-4; .font-bold { color: $color-text-primary; } }
  }
}

.book-btn { background: $color-primary !important; border: none !important; font-weight: 700 !important; }

.flex-center { @include flex-center; }
.text-primary { color: $color-primary; }
.w-full { width: 100%; }
.h-full { height: 100%; }
.relative { position: relative; }
</style>
