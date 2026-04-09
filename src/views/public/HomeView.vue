<template>
  <div class="home">
    <!-- ==================== HERO TripGlobe Layout ==================== -->
    <section class="hero-section">
      <div class="container hero__inner">
        <!-- Content Left -->
        <div class="hero__content animate-fade-in-up">
          <p class="hero__subtitle text-accent">{{ $t('home.startTravelling') }}</p>
          <h1 class="hero__title">
            {{ $t('home.enjoyTrip') }}<br />
            <span class="text-gradient">VoyageVN</span>
          </h1>
          <p class="hero__desc text-muted">
            {{ $t('home.heroDesc') }}
          </p>
        </div>

        <!-- Image Collage Right -->
        <div class="hero__images animate-fade-in-up" style="animation-delay: 0.1s">
          <div class="hero-img-wrapper hero-img-1">
             <img src="https://images.unsplash.com/photo-1555921015-5532091f6026?w=600&q=80" alt="Destination 1" />
          </div>
          <div class="hero-img-wrapper hero-img-2">
             <img src="https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80" alt="Destination 2" />
          </div>
          <button class="hero-play-btn">
             <i class="pi pi-play" style="font-size: 1.5rem"></i>
          </button>
        </div>
      </div>

      <!-- Floating Search Bar -->
      <div class="container animate-fade-in-up" style="animation-delay: 0.2s">
        <div class="search-bar">
          <div class="search-col">
            <span class="search-label">{{ $t('home.search.destination') }}</span>
            <div class="search-input-group">
               <InputText v-model="searchDest" :placeholder="$t('home.searchPlaceholder')" variant="filled" />
            </div>
          </div>
          <div class="search-divider"></div>
          <div class="search-col">
            <span class="search-label">{{ $t('home.search.duration') }}</span>
            <div class="search-input-group">
               <Select v-model="searchDuration" :options="durationOptions" 
                 :placeholder="$t('common.search')" variant="filled" />
            </div>
          </div>
          <div class="search-divider"></div>
          <div class="search-col">
            <span class="search-label">{{ $t('home.search.type') }}</span>
            <div class="search-input-group">
               <Select v-model="searchType" :options="typeOptions" 
                 :placeholder="$t('common.search')" variant="filled" />
            </div>
          </div>
          <div class="search-divider"></div>
          <div class="search-col">
            <span class="search-label">{{ $t('home.search.travellers') }}</span>
            <div class="search-input-group">
               <Select v-model="searchTravellers" :options="travellerOptions" 
                 :placeholder="$t('common.search')" variant="filled" />
            </div>
          </div>
          <Button :label="$t('home.search.findBtn')" icon="pi pi-search" @click="handleSearch" size="large" raised />
        </div>
      </div>
    </section>

    <!-- ==================== SERVICES ==================== -->
    <section class="section services-section">
      <div class="container">
        <div class="section-header">
          <p class="section-label">{{ $t('home.services.label') }}</p>
          <h2 class="section-title">{{ $t('home.services.title') }}</h2>
        </div>
        
        <div class="services-grid">
           <div class="service-card" v-for="item in services" :key="item.title">
             <div class="service-icon"><i :class="item.icon"></i></div>
             <h3 class="service-title">{{ item.title }}</h3>
             <p class="service-desc text-muted">{{ item.desc }}</p>
           </div>
        </div>
      </div>
    </section>

    <!-- ==================== ABOUT US ==================== -->
    <section class="section about-section">
      <div class="container about__inner">
         <!-- Left Images Collage -->
         <div class="about__images">
            <img class="img-top" src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80" alt="About 1" />
            <img class="img-bottom-left" src="https://images.unsplash.com/photo-1573390016527-19ef6f38ebe3?w=400&q=80" alt="About 2" />
            <img class="img-bottom-right" src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80" alt="About 3" />
         </div>
         
         <!-- Right Text -->
         <div class="about__content">
            <p class="section-label">{{ $t('home.about.label') }}</p>
            <h2 class="section-title text-left">{{ $t('home.about.title') }}</h2>
            <p class="text-muted">{{ $t('home.about.desc1') }}</p>
            <p class="text-muted">{{ $t('hero.destinationDesc') }}</p>
            <div class="about__read-more">
               <span class="read-more-text">{{ $t('home.about.readMore') }}</span>
               <button class="read-more-btn"><i class="pi pi-arrow-right"></i></button>
            </div>
         </div>
      </div>
    </section>

    <!-- ==================== FEATURED TOURS ==================== -->
    <section class="section featured-tours">
      <div class="container">
        <div class="features-header">
          <div class="header-text">
             <p class="section-label">{{ $t('home.featured.label') }}</p>
             <h2 class="section-title text-left">{{ $t('home.featured.title') }}</h2>
          </div>
          <BaseButton variant="secondary" @click="$router.push('/tours')">{{ $t('home.featured.viewAll') }} →</BaseButton>
        </div>

        <div v-if="loadingTours" class="tours-grid">
          <div v-for="n in 3" :key="n" class="tour-skeleton" />
        </div>
        <div v-else class="tours-grid">
          <TourCard v-for="tour in featuredTours" :key="tour.id" :tour="tour" />
        </div>
      </div>
    </section>

    <!-- ==================== CTA BANNER ==================== -->
    <section class="cta-banner">
      <div class="cta-banner__bg" />
      <div class="container cta-banner__content">
        <h2 class="cta-banner__title">{{ t('hero.ctaTitle', 'Ready to Explore?') }}</h2>
        <p class="cta-banner__desc">{{ t('hero.ctaDesc', 'Hundreds of journeys are waiting for you. Book your tour today!') }}</p>
        <div class="cta-banner__actions">
          <RouterLink to="/tours"><BaseButton variant="primary" size="lg">{{ $t('tour.bookNow') }}</BaseButton></RouterLink>
          <RouterLink to="/register"><BaseButton variant="secondary" size="lg">{{ $t('nav.register') }}</BaseButton></RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import TourCard from '@/components/ui/TourCard.vue'
import { tourApi } from '@/api/tourApi'

// PrimeVue Components
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'

const { t } = useI18n()
const router = useRouter()

// ---- Search State ----
const searchDest = ref('')
const searchDuration = ref('4 Days')
const searchType = ref('Adventure')
const searchTravellers = ref('04')

const durationOptions = ['4 Days', '7 Days', '14 Days']
const typeOptions = ['Adventure', 'Relaxation', 'Culture']
const travellerOptions = ['01', '02', '04', '06', '10+']

function handleSearch() {
  router.push({ name: 'tours', query: { q: searchDest.value } })
}

// ---- Services Data ----
const services = computed(() => [
  { icon: 'pi pi-sun', title: t('home.services.weather.title'), desc: t('home.services.weather.desc') },
  { icon: 'pi pi-map', title: t('home.services.flight.title'), desc: t('home.services.flight.desc') },
  { icon: 'pi pi-calendar', title: t('home.services.events.title'), desc: t('home.services.events.desc') },
  { icon: 'pi pi-cog', title: t('home.services.custom.title'), desc: t('home.services.custom.desc') }
])

// ---- Featured Tours ----
const featuredTours = ref([])
const loadingTours = ref(true)

async function loadFeaturedTours() {
  try {
    const res = await tourApi.getAll()
    if (res.success) {
      featuredTours.value = res.data.slice(0, 3)
    }
  } catch {
    // Backend empty fallback
  } finally {
    loadingTours.value = false
  }
}

onMounted(() => {
  loadFeaturedTours()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

// ============================
// HERO
// ============================
.hero-section {
  padding-top: calc(#{$navbar-height} + #{$space-16});
  padding-bottom: $space-16;
  position: relative;
  overflow: hidden;
  background: $gradient-hero;
  color: white;
}

.hero__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-12;
  align-items: center;

  @include lg {
    grid-template-columns: 1fr 1.2fr;
  }
}

.hero__content {
  max-width: 540px;
}

.hero__subtitle {
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: $space-4;
}

.hero__title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: $font-weight-bold;
  line-height: 1.1;
  margin-bottom: $space-6;
  letter-spacing: -0.03em;
}

.hero__desc {
  font-size: $font-size-lg;
  line-height: 1.6;
  opacity: 0.85;
}

// Hero Images Collage
.hero__images {
  position: relative;
  height: 480px;
  width: 100%;

  @include sm {
    height: 540px;
  }
}

.hero-img-wrapper {
  position: absolute;
  border-radius: $border-radius-xl;
  overflow: hidden;
  box-shadow: $shadow-lg;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.hero-img-1 {
  right: 0;
  top: 0;
  width: 65%;
  height: 75%;
}

.hero-img-2 {
  left: 0;
  bottom: 0;
  width: 55%;
  height: 60%;
  border: 8px solid white;
}

.hero-play-btn {
  position: absolute;
  top: 20%;
  left: 35%;
  width: 64px;
  height: 64px;
  background: $color-accent;
  background: $color-accent;
  color: white;
  border-radius: 50%;
  border: none;
  font-size: 24px;
  @include flex-center;
  cursor: pointer;
  box-shadow: 0 0 0 12px rgba(255,255,255,0.1);
  transition: $transition-fast;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 0 16px rgba(255,255,255,0.15);
  }
}

// ============================
// SEARCH BAR
// ============================
.hero__search-wrapper {
  margin-top: $space-16;
}

.search-bar {
  background: $color-bg-card;
  box-shadow: $shadow-lg;
  display: flex;
  flex-direction: column;
  gap: $space-4;
  padding: $space-4;
  border-radius: $border-radius-xl;

  @include md {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: $space-3 $space-3 $space-3 $space-8;
    border-radius: $border-radius-full;
  }
}

.search-col {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.search-label {
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  color: $color-text-secondary;
  text-transform: uppercase;
}

.search-input-group {
  :deep(.p-inputtext), :deep(.p-select) {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    
    .p-select-label {
      padding: 0;
      color: $color-text-primary;
    }
    
    .p-select-dropdown {
      width: 1.5rem;
    }

    input {
      font-weight: $font-weight-semibold;
      &::placeholder {
        color: $color-text-muted;
        opacity: 0.6;
      }
    }
  }
}

.search-divider {
  display: none;
  width: 1px;
  height: 32px;
  background: $color-border;
  @include md {
    display: block;
    margin: 0 $space-4;
  }
}

// ============================
// COMMON TITLES
// ============================
.section-header {
  text-align: center;
  margin-bottom: $space-12;
}
.section-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: $color-primary;
  margin-bottom: $space-3;
}
.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-family: $font-heading;
  color: $color-text-primary;
  &.text-left { text-align: left; }
}

// ============================
// SERVICES
// ============================
.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-6;

  @include sm { grid-template-columns: repeat(2, 1fr); }
  @include lg { grid-template-columns: repeat(4, 1fr); }
}

.service-card {
  background: $color-bg-card;
  border: 1px solid $color-border;
  box-shadow: $shadow-sm;
  padding: $space-8 $space-6;
  border-radius: $border-radius-lg;
  text-align: left;
  transition: $transition-base;

  &:hover {
    transform: translateY(-6px);
    box-shadow: $shadow-card-hover;
    border-color: $color-primary;
  }
}

.service-icon {
  font-size: 2.5rem;
  margin-bottom: $space-4;
}

.service-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  margin-bottom: $space-2;
}

.service-desc {
  font-size: $font-size-sm;
  line-height: 1.6;
}

// ============================
// ABOUT US
// ============================
.about__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-12;
  align-items: center;

  @include lg {
    grid-template-columns: 1fr 1fr;
    gap: $space-16;
  }
}

.about__images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 240px 200px;
  gap: $space-4;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: $border-radius-lg;
  }

  .img-top {
    grid-column: span 2;
  }
}

.about__content {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  p {
    line-height: 1.7;
    margin-bottom: $space-2;
  }
}

.about__read-more {
  display: flex;
  align-items: center;
  gap: $space-3;
  margin-top: $space-2;
  cursor: pointer;

  &:hover .read-more-btn {
    background: $color-primary;
    color: #111;
  }
}

.read-more-text {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.read-more-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid $color-border;
  background: transparent;
  color: $color-text-primary;
  @include flex-center;
  transition: $transition-fast;
  cursor: pointer;
}

// ============================
// FEATURED TOURS
// ============================
.features-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-4;
  margin-bottom: $space-10;

  @include md {
    flex-direction: row;
    align-items: flex-end;
  }
}

.tours-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-6;

  @include md { grid-template-columns: repeat(2, 1fr); }
  @include lg { grid-template-columns: repeat(3, 1fr); }
}

.tour-skeleton {
  height: 360px;
  border-radius: $border-radius-lg;
  background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

// ============================
// CTA BANNER
// ============================
.cta-banner {
  position: relative;
  overflow: hidden;
  padding: $space-24 0;
  margin-top: $space-24;

  &__bg {
    position: absolute; inset: 0;
    background:
      url('https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80') center/cover,
      $gradient-hero;
    opacity: 0.2;
  }

  &__content {
    position: relative;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-6;
  }

  &__title {
    font-family: $font-heading;
    font-size: clamp(2rem, 4vw, 3.5rem);
    color: $color-text-primary;
  }

  &__desc { color: $color-text-secondary; font-size: $font-size-lg; max-width: 500px; }

  &__actions { display: flex; gap: $space-4; flex-wrap: wrap; justify-content: center; }
}
</style>
