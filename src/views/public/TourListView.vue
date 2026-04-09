<template>
  <div class="tours-page">
    <!-- HERO SECTION -->
    <div class="tours-hero">
      <div class="tours-hero__overlay"></div>
      <div class="container tours-hero__content">
        <h1 class="tours-hero__title">{{ $t('nav.destinations') }}</h1>
        <div class="tours-hero__breadcrumb">
          <RouterLink to="/">{{ $t('nav.home') }}</RouterLink>
          <i class="pi pi-chevron-right separator"></i>
          <span>{{ $t('common.pages') }}</span>
          <i class="pi pi-chevron-right separator"></i>
          <span class="current">{{ $t('nav.destinations') }}</span>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="container tours-main">
      <div v-if="loading" class="tours-grid">
        <div v-for="n in 6" :key="n" class="tour-skeleton"></div>
      </div>
      
      <div v-else-if="tours.length === 0" class="empty-state">
        <p>{{ $t('admin.destinations.noData') }}</p>
      </div>

      <div v-else class="tours-grid">
        <TourCard v-for="(tour, idx) in tours" :key="tour.id" :tour="tour" :variant="getVariant(idx)" />
      </div>

      <!-- PRO OFFERS BANNER (from Figma lower section) -->
      <div class="pro-offers-banner">
        <div class="pro-offers-banner__content">
          <h2>{{ $t('home.proOffers.title') }}</h2>
          <p>{{ $t('home.proOffers.desc') }}</p>
        </div>
        <div class="pro-offers-banner__form">
          <InputText type="email" :placeholder="$t('auth.email')" fluid />
          <Button :label="$t('home.proOffers.subscribe')" severity="contrast" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { tourApi } from '@/api/tourApi'
import TourCard from '@/components/ui/TourCard.vue'
import { useToast } from '@/composables/useToast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const { t } = useI18n()
const toast = useToast()
const tours = ref([])
const loading = ref(true)

async function loadTours() {
  loading.value = true
  try {
    const res = await tourApi.getAll()
    if (res.success) {
      tours.value = res.data
    } else {
      toast.error(res.message || t('common.error'))
    }
  } catch (err) {
    toast.error(t('common.error'))
  } finally {
    loading.value = false
  }
}

// Giả lập variant layout (to nhỏ xen kẽ) giống thiết kế Grid của TripGlobe
function getVariant(index) {
  // Figma mockup chắp vá các ảnh dài ngắn khác nhau, ta có thể đánh dấu class
  const pattern = index % 5
  if (pattern === 0) return 'large'
  if (pattern === 3) return 'wide'
  return 'normal'
}

onMounted(() => {
  loadTours()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.tours-page {
  background: #f7f9fc; // Theo Figma (Light Mode background)
  min-height: 100vh;
  padding-bottom: $space-24;
}

// =======================
// HERO SECTION
// =======================
.tours-hero {
  position: relative;
  height: 480px;
  background: url('https://images.unsplash.com/photo-1518182170546-076616fd6251?w=1920&q=80') center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: $navbar-height;

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(9, 32, 63, 0.8), rgba(83, 120, 149, 0.6));
  }

  &__content {
    position: relative;
    z-index: 1;
    text-align: center;
    color: white;
  }

  &__title {
    font-size: clamp(3rem, 5vw, 4.5rem);
    font-family: $font-heading;
    font-weight: $font-weight-bold;
    margin-bottom: $space-4;
  }

  &__breadcrumb {
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-3;
    color: rgba(255,255,255,0.7);

    a {
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      transition: $transition-fast;
      &:hover { color: white; }
    }
    
    .current { color: #FF6B35; font-weight: $font-weight-semibold; } // Orange accent
  }
}

// =======================
// MAIN CONTENT & GRID
// =======================
.tours-main {
  margin-top: -$space-16;
  position: relative;
  z-index: 10;
}

.tours-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $space-6;
  margin-bottom: $space-24;

  @include md { grid-template-columns: repeat(2, 1fr); }
  @include lg { grid-template-columns: repeat(3, 1fr); gap: $space-8; }
}

.tour-skeleton {
  height: 400px;
  border-radius: $border-radius-xl;
  background: #e2e8f0;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.empty-state {
  text-align: center;
  padding: $space-16;
  font-size: $font-size-lg;
  color: #718096;
}

// =======================
// PRO OFFERS BANNER
// =======================
.pro-offers-banner {
  background: #38B2AC; // Teal color from Figma
  border-radius: $border-radius-xl;
  padding: $space-12;
  display: flex;
  flex-direction: column;
  gap: $space-8;
  color: white;
  margin-top: $space-24;
  overflow: hidden;
  position: relative;

  @include md {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: $space-16 $space-20;
  }

  &__content {
    flex: 1;
    max-width: 500px;
    
    h2 {
      font-size: $font-size-3xl;
      font-family: $font-heading;
      margin-bottom: $space-2;
    }
    p {
      font-size: $font-size-sm;
      opacity: 0.9;
      line-height: 1.6;
    }
  }

  &__form {
    display: flex;
    gap: 8px;
    background: white;
    padding: 6px;
    border-radius: $border-radius-md;
    width: 100%;
    max-width: 440px;

    :deep(.p-inputtext) {
      flex: 1;
      border: none;
      box-shadow: none;
      background: transparent;
      padding: 0 $space-4;
    }
  }
}
</style>
