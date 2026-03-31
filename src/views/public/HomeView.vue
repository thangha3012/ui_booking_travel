<template>
  <div class="home">
    <!-- ==================== HERO ==================== -->
    <section class="hero">
      <!-- Animated background slides -->
      <div class="hero__bg">
        <div
          v-for="(slide, i) in heroSlides"
          :key="i"
          :class="['hero__slide', { 'hero__slide--active': currentSlide === i }]"
          :style="{ backgroundImage: `url(${slide.image})` }"
        />
        <div class="hero__overlay" />
      </div>

      <div class="container hero__content">
        <p class="hero__label animate-fade-in-up">{{ t('home.heroSubtitle') }}</p>
        <h1 class="hero__title animate-fade-in-up">
          {{ t('home.heroTitle') }}<br />
          <span class="text-gradient">{{ t('hero.northernVietnam') }}</span>
        </h1>
        <p class="hero__desc animate-fade-in-up">{{ t('home.heroDesc') }}</p>

        <!-- Search Bar -->
        <div class="hero__search animate-fade-in-up">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchQuery"
              :placeholder="t('home.searchPlaceholder')"
              class="search-input"
              @keyup.enter="handleSearch"
            />
            <BaseButton variant="accent" @click="handleSearch">
              {{ t('home.searchBtn') }}
            </BaseButton>
          </div>
        </div>

        <!-- Stats -->
        <div class="hero__stats animate-fade-in-up">
          <div v-for="stat in stats" :key="stat.label" class="stat-item">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ t(stat.label) }}</span>
          </div>
        </div>
      </div>

      <!-- Slide indicators -->
      <div class="hero__dots">
        <button
          v-for="(_, i) in heroSlides"
          :key="i"
          :class="['dot', { 'dot--active': currentSlide === i }]"
          @click="currentSlide = i"
        />
      </div>

      <!-- Scroll indicator -->
      <div class="hero__scroll">
        <div class="scroll-arrow">↓</div>
      </div>
    </section>

    <!-- ==================== DESTINATIONS ==================== -->
    <section class="section destinations">
      <div class="container">
        <div class="section-header">
          <p class="section-label">{{ t('hero.explore') }}</p>
          <h2 class="section-title">{{ t('hero.topDestinations') }}</h2>
          <p class="section-desc">{{ t('hero.destinationDesc') }}</p>
        </div>

        <div class="destinations__grid">
          <RouterLink
            v-for="dest in destinations"
            :key="dest.id"
            :to="`/tours?destination=${dest.id}`"
            :class="['dest-card', { 'dest-card--large': dest.large }]"
            :style="{ backgroundImage: `url(${dest.image})` }"
          >
            <div class="dest-card__overlay" />
            <div class="dest-card__content">
              <span class="dest-card__tag">{{ dest.tourCount }} tours</span>
              <h3 class="dest-card__name">{{ dest.name }}</h3>
              <p class="dest-card__desc">{{ dest.desc }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ==================== WHY US ==================== -->
    <section class="section why-us">
      <div class="container">
        <div class="section-header">
          <p class="section-label">{{ t('hero.whyUs') }}</p>
          <h2 class="section-title">{{ t('hero.whyUsTitle') }}</h2>
        </div>
        <div class="why-us__grid">
          <div v-for="item in whyItems" :key="item.icon" class="why-card">
            <div class="why-card__icon">{{ item.icon }}</div>
            <h3 class="why-card__title">{{ t(item.title) }}</h3>
            <p class="why-card__desc">{{ t(item.desc) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== FEATURED TOURS ==================== -->
    <section class="section featured-tours">
      <div class="container">
        <div class="section-header">
          <p class="section-label">{{ t('hero.trending') }}</p>
          <h2 class="section-title">{{ t('home.featuredTours') }}</h2>
          <p class="section-desc">{{ t('home.featuredDesc') }}</p>
        </div>

        <div v-if="loadingTours" class="tours-grid">
          <div v-for="n in 6" :key="n" class="tour-skeleton" />
        </div>

        <div v-else class="tours-grid">
          <TourCard v-for="tour in featuredTours" :key="tour.id" :tour="tour" />
        </div>

        <div class="section-footer">
          <RouterLink to="/tours">
            <BaseButton variant="secondary" size="lg">
              {{ t('home.viewAll') }} →
            </BaseButton>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ==================== CTA BANNER ==================== -->
    <section class="cta-banner">
      <div class="cta-banner__bg" />
      <div class="container cta-banner__content">
        <h2 class="cta-banner__title">{{ t('hero.ctaTitle') }}</h2>
        <p class="cta-banner__desc">{{ t('hero.ctaDesc') }}</p>
        <div class="cta-banner__actions">
          <RouterLink to="/tours"><BaseButton variant="accent" size="lg">{{ t('tour.bookNow') }}</BaseButton></RouterLink>
          <RouterLink to="/register"><BaseButton variant="ghost" size="lg">{{ t('nav.register') }}</BaseButton></RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import TourCard from '@/components/ui/TourCard.vue'
import { tourApi } from '@/api/tourApi'

const { t } = useI18n()
const router = useRouter()

// ---- Hero Slideshow ----
const heroSlides = [
  { image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=90' }, // Hạ Long Bay
  { image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&q=90' }, // Hà Nội
  { image: 'https://images.unsplash.com/photo-1573390016527-19ef6f38ebe3?w=1920&q=90' }, // Sapa rice terraces
  { image: 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=1920&q=90' }, // Ninh Bình
]

const currentSlide = ref(0)
let slideTimer = null

function startSlideshow() {
  slideTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % heroSlides.length
  }, 5000)
}

// ---- Search ----
const searchQuery = ref('')
function handleSearch() {
  router.push({ name: 'tours', query: { q: searchQuery.value } })
}

// ---- Stats ----
const stats = [
  { value: '200+', label: 'hero.statTours' },
  { value: '50+', label: 'hero.statDestinations' },
  { value: '10K+', label: 'hero.statCustomers' },
  { value: '4.9★', label: 'hero.statRating' },
]

// ---- Destinations (static for now, later from API) ----
const destinations = [
  { id: 1, name: 'Hạ Long Bay', desc: 'Kỳ quan thiên nhiên thế giới', tourCount: 45, large: true, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80' },
  { id: 2, name: 'Sapa', desc: 'Ruộng bậc thang huyền thoại', tourCount: 32, image: 'https://images.unsplash.com/photo-1573390016527-19ef6f38ebe3?w=800&q=80' },
  { id: 3, name: 'Hà Nội', desc: 'Thủ đô ngàn năm văn hiến', tourCount: 28, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80' },
  { id: 4, name: 'Ninh Bình', desc: 'Hạ Long trên cạn', tourCount: 19, image: 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&q=80' },
]

// ---- Why Us ----
const whyItems = [
  { icon: '🛡️', title: 'hero.why1Title', desc: 'hero.why1Desc' },
  { icon: '💎', title: 'hero.why2Title', desc: 'hero.why2Desc' },
  { icon: '🌿', title: 'hero.why3Title', desc: 'hero.why3Desc' },
  { icon: '📞', title: 'hero.why4Title', desc: 'hero.why4Desc' },
]

// ---- Featured Tours ----
const featuredTours = ref([])
const loadingTours = ref(true)

async function loadFeaturedTours() {
  try {
    const res = await tourApi.getAll()
    if (res.success) {
      featuredTours.value = res.data.slice(0, 6)
    }
  } catch {
    // If backend not ready, show empty
  } finally {
    loadingTours.value = false
  }
}

onMounted(() => {
  startSlideshow()
  loadFeaturedTours()
})

onUnmounted(() => {
  clearInterval(slideTimer)
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

// ============================
// HERO
// ============================
.hero {
  position: relative;
  height: 100vh;
  min-height: 680px;
  @include flex-center;
  overflow: hidden;

  &__bg { position: absolute; inset: 0; }

  &__slide {
    position: absolute; inset: 0;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: opacity 1.5s ease;
    &--active { opacity: 1; }
  }

  &__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.3) 0%,
      rgba(10,15,30,0.65) 60%,
      rgba(10,15,30,0.9) 100%
    );
  }

  &__content {
    position: relative; z-index: 2;
    text-align: center;
    padding-top: $navbar-height;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-6;
  }

  &__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: $color-accent;
    padding: $space-2 $space-4;
    border: 1px solid rgba(212,175,55,0.4);
    border-radius: $border-radius-full;
    backdrop-filter: blur(8px);
  }

  &__title {
    font-family: $font-heading;
    font-size: clamp(2.5rem, 6vw, 5rem);
    font-weight: $font-weight-bold;
    line-height: 1.1;
    color: $color-text-primary;
    text-shadow: 0 4px 24px rgba(0,0,0,0.5);
  }

  &__desc {
    font-size: $font-size-lg;
    color: rgba(255,255,255,0.75);
    max-width: 560px;
    line-height: 1.7;
  }

  &__search {
    width: 100%;
    max-width: 640px;
  }

  &__stats {
    display: flex;
    gap: $space-8;
    flex-wrap: wrap;
    justify-content: center;
    padding: $space-6 $space-8;
    @include glass;
    border-radius: $border-radius-xl;
    margin-top: $space-4;
  }

  &__dots {
    position: absolute;
    bottom: $space-20;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: $space-2;
    z-index: 3;
  }

  &__scroll {
    position: absolute;
    bottom: $space-6;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
  }
}

.search-box {
  display: flex;
  align-items: center;
  gap: $space-3;
  @include glass;
  border-radius: $border-radius-full;
  padding: $space-2 $space-2 $space-2 $space-5;
}

.search-icon { font-size: $font-size-lg; color: $color-text-muted; }

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: $color-text-primary;
  font-size: $font-size-base;
  &::placeholder { color: $color-text-muted; }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-accent;
  font-family: $font-heading;
}

.stat-label {
  font-size: $font-size-xs;
  color: $color-text-secondary;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.4);
  cursor: pointer;
  transition: $transition-base;

  &--active {
    width: 24px;
    border-radius: 4px;
    background: $color-accent;
  }
}

.scroll-arrow {
  animation: bounce 2s infinite;
  color: rgba(255,255,255,0.5);
  font-size: $font-size-xl;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

// ============================
// SECTION COMMON
// ============================
.section-header {
  text-align: center;
  margin-bottom: $space-12;
}

.section-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: $color-accent;
  margin-bottom: $space-3;
}

.section-title {
  font-family: $font-heading;
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  color: $color-text-primary;
  margin-bottom: $space-4;
}

.section-desc {
  color: $color-text-secondary;
  font-size: $font-size-lg;
  max-width: 560px;
  margin: 0 auto;
}

.section-footer {
  text-align: center;
  margin-top: $space-10;
}

// ============================
// DESTINATIONS
// ============================
.destinations__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 280px 280px;
  gap: $space-4;

  @include lg {
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 340px 340px;
  }
}

.dest-card {
  position: relative;
  border-radius: $border-radius-xl;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: $transition-base;

  &--large {
    grid-row: span 2;
    @include lg { grid-row: span 2; }
  }

  &:hover { transform: scale(1.01); }
  &:hover .dest-card__overlay { opacity: 0.5; }

  &__overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%);
    transition: $transition-base;
  }

  &__content {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: $space-6;
    z-index: 1;
  }

  &__tag {
    display: inline-block;
    font-size: $font-size-xs;
    background: rgba(212,175,55,0.2);
    border: 1px solid rgba(212,175,55,0.4);
    color: $color-accent;
    padding: 2px $space-3;
    border-radius: $border-radius-full;
    margin-bottom: $space-2;
  }

  &__name {
    font-family: $font-heading;
    font-size: $font-size-2xl;
    color: #fff;
    margin-bottom: $space-1;
  }

  &__desc {
    font-size: $font-size-sm;
    color: rgba(255,255,255,0.7);
  }
}

// ============================
// WHY US
// ============================
.why-us { background: rgba(255,255,255,0.02); }

.why-us__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-6;

  @include lg { grid-template-columns: repeat(4, 1fr); }
}

.why-card {
  @include glass;
  border-radius: $border-radius-lg;
  padding: $space-8;
  text-align: center;
  transition: $transition-base;

  &:hover {
    border-color: rgba(212,175,55,0.3);
    transform: translateY(-4px);
  }

  &__icon { font-size: 2.5rem; margin-bottom: $space-4; }
  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    margin-bottom: $space-3;
  }
  &__desc { font-size: $font-size-sm; color: $color-text-secondary; line-height: 1.6; }
}

// ============================
// TOURS GRID
// ============================
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

  &__bg {
    position: absolute; inset: 0;
    background:
      url('https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80') center/cover,
      linear-gradient(135deg, #0A2342, #6366F1);
    opacity: 0.3;
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
