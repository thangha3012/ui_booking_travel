<template>
  <div class="home">
    <!-- ==================== HERO ==================== -->
    <section class="hero-section">
      <!-- BG Shapes -->
      <div class="hero-shape hero-shape--1"></div>
      <div class="hero-shape hero-shape--2"></div>
      <div class="hero-shape hero-shape--3"></div>

      <div class="container hero__inner">
        <!-- Content Left -->
        <div class="hero__content">
          <div class="hero__badge">
            <i class="pi pi-star-fill"></i>
            <span>{{ $t('home.startTravelling') }}</span>
          </div>
          <h1 class="hero__title">
            {{ $t('home.enjoyTrip') }}<br/>
            <span class="text-gradient">Việt Nam</span>
          </h1>
          <p class="hero__desc">
            {{ $t('home.heroDesc') }}
          </p>
          <div class="hero__cta">
            <RouterLink to="/tours" class="hero-btn-primary">
              <i class="pi pi-map"></i> Khám phá ngay
            </RouterLink>
            <button class="hero-btn-ghost" @click="scrollToFeatured">
              <span class="play-icon"><i class="pi pi-play"></i></span>
              Xem tour nổi bật
            </button>
          </div>
          <div class="hero__stats">
            <div class="stat-item" v-for="s in heroStats" :key="s.label">
              <span class="stat-value">{{ s.value }}</span>
              <span class="stat-label">{{ s.label }}</span>
            </div>
          </div>
        </div>

        <!-- Images Right -->
        <div class="hero__images">
          <div class="hero-img-grid">
            <div class="himg himg--main">
              <img src="https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&q=85" alt="Ha Giang" />
              <div class="himg-badge">
                <i class="pi pi-map-marker"></i> Hà Giang
              </div>
            </div>
            <div class="himg himg--sm">
              <img src="https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80" alt="Sa Pa" />
            </div>
            <div class="himg himg--sm himg--bottom">
              <img src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80" alt="Ha Long" />
              <div class="himg-badge himg-badge--accent">
                <i class="pi pi-star-fill"></i> 4.9 Rating
              </div>
            </div>
          </div>

          <!-- Float card -->
          <div class="hero-float-card">
            <div class="float-icon">✈️</div>
            <div>
              <div class="float-title">Chuyến bay ngay hôm nay</div>
              <div class="float-sub">Đặt trước 20% tiết kiệm</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="container">
        <div class="search-bar">
          <div class="search-col">
            <span class="search-label"><i class="pi pi-map-marker"></i> {{ $t('home.search.destination') }}</span>
            <InputText v-model="searchDest" :placeholder="$t('home.searchPlaceholder')" class="search-input" />
          </div>
          <div class="search-divider"></div>
          <div class="search-col">
            <span class="search-label"><i class="pi pi-clock"></i> {{ $t('home.search.duration') }}</span>
            <Select v-model="searchDuration" :options="durationOptions" :placeholder="$t('common.search')" class="search-select" />
          </div>
          <div class="search-divider"></div>
          <div class="search-col">
            <span class="search-label"><i class="pi pi-tag"></i> {{ $t('home.search.type') }}</span>
            <Select v-model="searchType" :options="typeOptions" :placeholder="$t('common.search')" class="search-select" />
          </div>
          <div class="search-divider"></div>
          <div class="search-col">
            <span class="search-label"><i class="pi pi-users"></i> {{ $t('home.search.travellers') }}</span>
            <Select v-model="searchTravellers" :options="travellerOptions" :placeholder="$t('common.search')" class="search-select" />
          </div>
          <button class="search-btn" @click="handleSearch">
            <i class="pi pi-search"></i>
            {{ $t('home.search.findBtn') }}
          </button>
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
          <div class="service-card" v-for="(item, i) in services" :key="item.title">
            <div class="service-icon-wrap" :class="`color-${i % 4}`">
              <i :class="item.icon"></i>
            </div>
            <h3 class="service-title">{{ item.title }}</h3>
            <p class="service-desc">{{ item.desc }}</p>
            <div class="service-arrow">
              <i class="pi pi-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== POPULAR DESTINATIONS ==================== -->
    <section class="section destinations-section">
      <div class="container">
        <div class="section-header">
          <p class="section-label">Khám phá ngay</p>
          <h2 class="section-title">Điểm đến nổi bật</h2>
        </div>
        <div class="destinations-grid">
          <RouterLink to="/tours" class="dest-card dest-card--big"
            :style="{ backgroundImage: `url(${destinations[0].img})` }">
            <div class="dest-overlay"></div>
            <div class="dest-info">
              <span class="dest-tag">Phổ biến #1</span>
              <h3>{{ destinations[0].name }}</h3>
              <p>{{ destinations[0].count }} tour</p>
            </div>
          </RouterLink>
          <div class="dest-right">
            <RouterLink to="/tours" class="dest-card"
              v-for="d in destinations.slice(1)" :key="d.name"
              :style="{ backgroundImage: `url(${d.img})` }">
              <div class="dest-overlay"></div>
              <div class="dest-info">
                <h3>{{ d.name }}</h3>
                <p>{{ d.count }} tour</p>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== FEATURED TOURS ==================== -->
    <section class="section featured-tours" id="featured-tours">
      <div class="container">
        <div class="features-header">
          <div>
            <p class="section-label">{{ $t('home.featured.label') }}</p>
            <h2 class="section-title text-left">{{ $t('home.featured.title') }}</h2>
          </div>
          <RouterLink to="/tours" class="view-all-btn">
            {{ $t('home.featured.viewAll') }} <i class="pi pi-arrow-right"></i>
          </RouterLink>
        </div>

        <div v-if="loadingTours" class="tours-grid">
          <div v-for="n in 3" :key="n" class="tour-skeleton">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
              <div class="skeleton-line"></div>
              <div class="skeleton-line short"></div>
              <div class="skeleton-line"></div>
            </div>
          </div>
        </div>
        <div v-else-if="featuredTours.length === 0" class="empty-tours">
          <i class="pi pi-map text-4xl mb-4 text-slate-300"></i>
          <p>Chưa có tour nào. Hãy thêm tour từ trang Admin!</p>
        </div>
        <div v-else class="tours-grid">
          <TourCard v-for="tour in featuredTours" :key="tour.id" :tour="tour" />
        </div>
      </div>
    </section>

    <!-- ==================== ABOUT ==================== -->
    <section class="section about-section">
      <div class="container about__inner">
        <div class="about__images">
          <img class="img-main" src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=700&q=80" alt="About" />
          <img class="img-overlay" src="https://images.unsplash.com/photo-1573390016527-19ef6f38ebe3?w=400&q=80" alt="About 2" />
          <div class="about-exp-badge">
            <div class="exp-number">10+</div>
            <div class="exp-text">Năm kinh nghiệm</div>
          </div>
        </div>
        <div class="about__content">
          <p class="section-label">{{ $t('home.about.label') }}</p>
          <h2 class="section-title text-left">{{ $t('home.about.title') }}</h2>
          <p class="about-desc">{{ $t('home.about.desc1') }}</p>
          <div class="about-stats-row">
            <div class="astat" v-for="s in aboutStats" :key="s.label">
              <div class="astat-value">{{ s.value }}</div>
              <div class="astat-label">{{ s.label }}</div>
            </div>
          </div>
          <RouterLink to="/tours" class="about-cta">
            {{ $t('home.about.readMore') }} <i class="pi pi-arrow-right"></i>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ==================== TESTIMONIALS ==================== -->
    <section class="section testimonials-section">
      <div class="container">
        <div class="section-header">
          <p class="section-label">Đánh giá</p>
          <h2 class="section-title">Khách hàng nói gì?</h2>
        </div>
        <div class="testimonials-grid">
          <div class="testimonial-card" v-for="t in testimonials" :key="t.name">
            <div class="testimonial-stars">
              <i class="pi pi-star-fill" v-for="i in 5" :key="i"></i>
            </div>
            <p class="testimonial-text">"{{ t.text }}"</p>
            <div class="testimonial-author">
              <div class="author-avatar" :style="{ background: t.color }">{{ t.name.charAt(0) }}</div>
              <div>
                <div class="author-name">{{ t.name }}</div>
                <div class="author-tour">{{ t.tour }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== CTA BANNER ==================== -->
    <section class="cta-banner">
      <div class="cta-banner__bg"></div>
      <div class="cta-particles">
        <span v-for="i in 6" :key="i"></span>
      </div>
      <div class="container cta-banner__content">
        <div class="cta-badge">🎉 Ưu đãi đặc biệt hôm nay</div>
        <h2 class="cta-banner__title">{{ t('hero.ctaTitle', 'Sẵn sàng khám phá chưa?') }}</h2>
        <p class="cta-banner__desc">{{ t('hero.ctaDesc', 'Hàng trăm hành trình đang chờ bạn. Đặt tour ngay hôm nay!') }}</p>
        <div class="cta-banner__actions">
          <RouterLink to="/tours" class="cta-btn-primary">
            <i class="pi pi-map"></i> {{ $t('tour.bookNow') }}
          </RouterLink>
          <RouterLink to="/register" class="cta-btn-ghost">
            {{ $t('nav.register') }} <i class="pi pi-arrow-right"></i>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import TourCard from '@/components/ui/TourCard.vue'
import { tourApi } from '@/api/tourApi'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

const { t } = useI18n()
const router = useRouter()

// ---- Search ----
const searchDest = ref('')
const searchDuration = ref(null)
const searchType = ref(null)
const searchTravellers = ref(null)
const durationOptions = ['4 ngày', '7 ngày', '14 ngày']
const typeOptions = ['Khám phá', 'Nghỉ dưỡng', 'Văn hóa']
const travellerOptions = ['1 người', '2 người', '4 người', '6+ người']

function handleSearch() {
  router.push({ name: 'tours', query: { q: searchDest.value } })
}

function scrollToFeatured() {
  document.getElementById('featured-tours')?.scrollIntoView({ behavior: 'smooth' })
}

// ---- Hero Stats ----
const heroStats = [
  { value: '500+', label: 'Tour khám phá' },
  { value: '10K+', label: 'Khách hàng' },
  { value: '4.9★', label: 'Đánh giá' },
]

// ---- Services ----
const services = computed(() => [
  { icon: 'pi pi-sun', title: t('home.services.weather.title'), desc: t('home.services.weather.desc') },
  { icon: 'pi pi-map', title: t('home.services.flight.title'), desc: t('home.services.flight.desc') },
  { icon: 'pi pi-calendar', title: t('home.services.events.title'), desc: t('home.services.events.desc') },
  { icon: 'pi pi-cog', title: t('home.services.custom.title'), desc: t('home.services.custom.desc') },
])

// ---- Destinations ----
const destinations = [
  { name: 'Hà Giang', count: 24, img: 'https://images.unsplash.com/photo-1606204619745-fdf4e2a7e96a?w=800&q=80' },
  { name: 'Sa Pa', count: 18, img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80' },
  { name: 'Hạ Long', count: 32, img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80' },
  { name: 'Ninh Bình', count: 15, img: 'https://images.unsplash.com/photo-1595959183082-7b570a7a3829?w=600&q=80' },
  { name: 'Đà Lạt', count: 20, img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80' },
]

// ---- Featured Tours ----
const featuredTours = ref([])
const loadingTours = ref(true)

async function loadFeaturedTours() {
  try {
    const res = await tourApi.getAll()
    if (res.success) featuredTours.value = res.data.slice(0, 3)
  } catch {}
  finally { loadingTours.value = false }
}

// ---- About Stats ----
const aboutStats = [
  { value: '500+', label: 'Tour du lịch' },
  { value: '10K+', label: 'Du khách hài lòng' },
  { value: '50+', label: 'Điểm đến' },
]

// ---- Testimonials ----
const testimonials = [
  {
    name: 'Nguyễn Minh Anh',
    tour: 'Tour Hà Giang Loop 3N2Đ',
    text: 'Chuyến đi Hà Giang thực sự là trải nghiệm tuyệt vời nhất trong cuộc đời tôi. Đội ngũ hướng dẫn viên rất chuyên nghiệp và thân thiện.',
    color: 'linear-gradient(135deg, #235789, #1E6B8C)'
  },
  {
    name: 'Trần Thu Hương',
    tour: 'Tour Sa Pa Fansipan 2N1Đ',
    text: 'Dịch vụ xuất sắc từ khâu đặt tour đến khi kết thúc hành trình. Tôi sẽ giới thiệu Triptopia với tất cả bạn bè của mình!',
    color: 'linear-gradient(135deg, #FF6B35, #f59e0b)'
  },
  {
    name: 'Lê Văn Đức',
    tour: 'Tour Hạ Long 2N1Đ',
    text: 'Đặt tour qua app rất tiện lợi và nhanh chóng. Thanh toán dễ dàng, giá cả hợp lý. Nhất định sẽ quay lại lần nữa.',
    color: 'linear-gradient(135deg, #10b981, #059669)'
  }
]

onMounted(loadFeaturedTours)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

// ============================================================
// HERO
// ============================================================
.hero-section {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0d2137 0%, #1a3a5c 40%, #235789 70%, #2d6da3 100%);
  padding-top: calc(#{$navbar-height} + #{$space-16});
  padding-bottom: 140px;
  color: white;
}

// Background decorative shapes
.hero-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  &--1 { width: 600px; height: 600px; background: rgba(255, 107, 53, 0.12); top: -200px; right: -100px; }
  &--2 { width: 400px; height: 400px; background: rgba(35, 87, 137, 0.3); bottom: -100px; left: -50px; }
  &--3 { width: 300px; height: 300px; background: rgba(45, 109, 163, 0.2); top: 40%; left: 50%; }
}

.hero__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-12;
  align-items: center;
  position: relative;
  z-index: 1;

  @include lg { grid-template-columns: 1fr 1.1fr; }
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  background: rgba(255, 107, 53, 0.15);
  border: 1px solid rgba(255, 107, 53, 0.3);
  color: #FFA07A;
  padding: 6px 16px;
  border-radius: $border-radius-full;
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: $space-5;
  width: fit-content;

  i { font-size: 0.6rem; color: $color-accent; }
}

.hero__title {
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: $space-5;
}

.hero__desc {
  font-size: $font-size-base;
  line-height: 1.7;
  opacity: 0.8;
  max-width: 460px;
  margin-bottom: $space-8;
}

.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: $space-4;
  margin-bottom: $space-10;
}

.hero-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: 14px 28px;
  background: $color-accent;
  color: white;
  border-radius: $border-radius-full;
  font-weight: $font-weight-bold;
  font-size: $font-size-base;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.35);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(255, 107, 53, 0.5);
    background: darken(#FF6B35, 6%);
  }
}

.hero-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: $space-3;
  padding: 14px 24px;
  color: white;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  border-radius: $border-radius-full;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .play-icon {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
  }
}

.hero__stats {
  display: flex;
  gap: $space-8;
  flex-wrap: wrap;

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .stat-value {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.03em;
    }

    .stat-label {
      font-size: $font-size-xs;
      opacity: 0.6;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
  }
}

// ---- Hero Image Grid ----
.hero__images {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.hero-img-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  grid-template-rows: 260px 200px;
  gap: 12px;
}

.himg {
  position: relative;
  border-radius: $border-radius-xl;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  &:hover img { transform: scale(1.05); }

  &--main { grid-row: span 2; }
  &--sm { }
  &--bottom { }

  &-badge {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    color: white;
    padding: 5px 12px;
    border-radius: $border-radius-full;
    font-size: 0.75rem;
    font-weight: $font-weight-semibold;
    display: flex;
    align-items: center;
    gap: 5px;

    &--accent {
      background: rgba(255, 107, 53, 0.85);
    }
  }
}

// Float card on hero
.hero-float-card {
  position: absolute;
  bottom: -20px;
  left: -20px;
  background: white;
  border-radius: $border-radius-lg;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
  z-index: 10;
  animation: float 3s ease-in-out infinite;

  .float-icon { font-size: 1.6rem; }
  .float-title { font-size: 0.82rem; font-weight: 700; color: #1a202c; }
  .float-sub { font-size: 0.7rem; color: #718096; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

// ============================================================
// SEARCH BAR
// ============================================================
.search-bar {
  position: relative;
  z-index: 2;
  margin-top: $space-10;
  background: white;
  border-radius: $border-radius-xl;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: $space-4;
  padding: $space-6;

  @include md {
    flex-direction: row;
    align-items: center;
    padding: $space-3 $space-3 $space-3 $space-6;
    border-radius: 60px;
    gap: 0;
  }
}

.search-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;

  .search-label {
    font-size: 11px;
    font-weight: 700;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    display: flex;
    align-items: center;
    gap: 4px;
    i { font-size: 0.65rem; color: $color-primary; }
  }

  :deep(.p-inputtext), :deep(.p-select) {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 2px 0 !important;
    font-size: 0.875rem;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;

    &:focus { outline: none !important; box-shadow: none !important; }
  }
}

.search-divider {
  display: none;
  width: 1px;
  height: 40px;
  background: $color-border;
  margin: 0 $space-4;
  @include md { display: block; }
}

.search-btn {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: 14px 28px;
  background: linear-gradient(135deg, $color-primary, #1E6B8C);
  color: white;
  border: none;
  border-radius: $border-radius-full;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(35, 87, 137, 0.35);
  transition: all 0.25s ease;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(35, 87, 137, 0.45);
  }
}

// ============================================================
// COMMON
// ============================================================
.section { padding: $space-24 0; }

.section-header {
  text-align: center;
  margin-bottom: $space-12;
}

.section-label {
  font-size: $font-size-xs;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: $color-accent;
  margin-bottom: $space-3;
  display: block;
}

.section-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-family: $font-heading;
  font-weight: 800;
  color: $color-text-primary;
  letter-spacing: -0.03em;
  &.text-left { text-align: left; }
}

// ============================================================
// SERVICES
// ============================================================
.services-section {
  background: $color-bg-surface;
}

.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-5;
  @include sm { grid-template-columns: repeat(2, 1fr); }
  @include lg { grid-template-columns: repeat(4, 1fr); }
}

.service-card {
  background: white;
  border: 1px solid $color-border-light;
  border-radius: $border-radius-xl;
  padding: $space-8 $space-6;
  position: relative;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-card-hover;
    &::before { height: 4px; }
  }

  &:nth-child(1)::before { background: $color-primary; }
  &:nth-child(2)::before { background: $color-accent; }
  &:nth-child(3)::before { background: #10b981; }
  &:nth-child(4)::before { background: #f59e0b; }
}

.service-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: $border-radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  margin-bottom: $space-5;

  &.color-0 { background: rgba(35, 87, 137, 0.1); color: $color-primary; }
  &.color-1 { background: rgba(255, 107, 53, 0.1); color: $color-accent; }
  &.color-2 { background: rgba(16, 185, 129, 0.1); color: #10b981; }
  &.color-3 { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
}

.service-title {
  font-size: $font-size-base;
  font-weight: 700;
  color: $color-text-primary;
  margin-bottom: $space-2;
}

.service-desc {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  line-height: 1.6;
}

.service-arrow {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: $color-bg-surface;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: $color-text-muted;
  transition: $transition-fast;

  .service-card:hover & {
    background: $color-primary;
    color: white;
    transform: translateX(2px);
  }
}

// ============================================================
// DESTINATIONS
// ============================================================
.destinations-section {
  background: white;
}

.destinations-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-4;
  @include lg { grid-template-columns: 1.5fr 1fr; }
}

.dest-right {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-4;
}

.dest-card {
  position: relative;
  border-radius: $border-radius-xl;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  text-decoration: none;
  display: block;
  min-height: 200px;
  transition: $transition-base;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: $border-radius-xl;
    border: 2px solid transparent;
    transition: $transition-fast;
  }

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    &::after { border-color: rgba(255, 255, 255, 0.4); }
  }

  &--big {
    min-height: 420px;
    @include lg { min-height: 100%; }
  }
}

.dest-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%);
}

.dest-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $space-5;
  color: white;
  z-index: 1;

  .dest-tag {
    display: inline-block;
    background: $color-accent;
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: $border-radius-full;
    margin-bottom: $space-2;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0 0 4px;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  p {
    font-size: 0.8rem;
    opacity: 0.8;
    margin: 0;
  }
}

// ============================================================
// FEATURED TOURS
// ============================================================
.featured-tours { background: $color-bg-surface; }

.features-header {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  margin-bottom: $space-10;
  @include md { flex-direction: row; justify-content: space-between; align-items: flex-end; }
}

.view-all-btn {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: 10px 22px;
  border: 1.5px solid $color-border;
  border-radius: $border-radius-full;
  color: $color-text-body;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  text-decoration: none;
  transition: $transition-fast;
  white-space: nowrap;

  &:hover {
    border-color: $color-primary;
    color: $color-primary;
    background: rgba(35, 87, 137, 0.05);
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
  border-radius: $border-radius-xl;
  background: white;
  overflow: hidden;
  box-shadow: $shadow-sm;

  .skeleton-img {
    height: 220px;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-body {
    padding: $space-5;
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  .skeleton-line {
    height: 14px;
    background: #f1f5f9;
    border-radius: 6px;
    &.short { width: 60%; }
  }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.empty-tours {
  text-align: center;
  padding: $space-20;
  color: $color-text-muted;
  background: white;
  border-radius: $border-radius-xl;
  p { margin-top: $space-3; }
}

// ============================================================
// ABOUT
// ============================================================
.about-section { background: white; }

.about__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-12;
  align-items: center;
  @include lg { grid-template-columns: 1fr 1fr; gap: $space-16; }
}

.about__images {
  position: relative;
  
  .img-main {
    width: 100%;
    border-radius: $border-radius-xl;
    object-fit: cover;
    height: 420px;
    box-shadow: $shadow-lg;
  }

  .img-overlay {
    position: absolute;
    bottom: -30px;
    right: -20px;
    width: 200px;
    height: 200px;
    border-radius: $border-radius-xl;
    object-fit: cover;
    border: 6px solid white;
    box-shadow: $shadow-lg;
    display: none;
    @include md { display: block; }
  }
}

.about-exp-badge {
  position: absolute;
  top: 30px;
  left: -20px;
  background: $color-accent;
  color: white;
  border-radius: $border-radius-xl;
  padding: $space-4 $space-5;
  text-align: center;
  box-shadow: 0 12px 28px rgba(255, 107, 53, 0.3);
  display: none;
  @include md { display: block; }

  .exp-number { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; }
  .exp-text { font-size: 0.75rem; opacity: 0.85; font-weight: 600; }
}

.about__content {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.about-desc {
  color: $color-text-secondary;
  line-height: 1.7;
  font-size: $font-size-base;
}

.about-stats-row {
  display: flex;
  gap: $space-8;
  flex-wrap: wrap;

  .astat-value {
    font-size: 2rem;
    font-weight: 800;
    color: $color-primary;
    letter-spacing: -0.04em;
  }

  .astat-label {
    font-size: 0.75rem;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 2px;
  }
}

.about-cta {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: 12px 24px;
  background: linear-gradient(135deg, $color-primary, #1E6B8C);
  color: white;
  border-radius: $border-radius-full;
  font-weight: 700;
  text-decoration: none;
  font-size: $font-size-sm;
  box-shadow: 0 4px 16px rgba(35, 87, 137, 0.3);
  transition: all 0.25s ease;
  width: fit-content;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(35, 87, 137, 0.4);
  }
}

// ============================================================
// TESTIMONIALS
// ============================================================
.testimonials-section { background: $color-bg-surface; }

.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-5;
  @include md { grid-template-columns: repeat(3, 1fr); }
}

.testimonial-card {
  background: white;
  border-radius: $border-radius-xl;
  padding: $space-8;
  border: 1px solid $color-border-light;
  box-shadow: $shadow-sm;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: $space-4;

  &:hover {
    transform: translateY(-5px);
    box-shadow: $shadow-card-hover;
  }
}

.testimonial-stars {
  display: flex;
  gap: 4px;
  i { color: #f59e0b; font-size: 0.85rem; }
}

.testimonial-text {
  font-size: $font-size-sm;
  line-height: 1.7;
  color: $color-text-secondary;
  flex: 1;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: $space-3;

  .author-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    color: white;
    font-size: 1rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .author-name { font-weight: 700; font-size: 0.875rem; color: $color-text-primary; }
  .author-tour { font-size: 0.75rem; color: $color-text-muted; margin-top: 2px; }
}

// ============================================================
// CTA BANNER
// ============================================================
.cta-banner {
  position: relative;
  overflow: hidden;
  padding: $space-24 0;
  background: linear-gradient(135deg, #0d2137 0%, #235789 60%, #1E6B8C 100%);
}

.cta-banner__bg {
  position: absolute;
  inset: 0;
  background: url('https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=70') center/cover;
  opacity: 0.08;
}

.cta-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;

  span {
    position: absolute;
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    animation: particle-float 8s infinite linear;

    @for $i from 1 through 6 {
      &:nth-child(#{$i}) {
        left: #{$i * 15}%;
        animation-delay: #{$i * -1.5}s;
        width: #{4 + $i}px;
        height: #{4 + $i}px;
      }
    }
  }
}

@keyframes particle-float {
  0% { transform: translateY(100%) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 0.5; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
}

.cta-banner__content {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-5;
  color: white;
}

.cta-badge {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  background: rgba(255, 107, 53, 0.2);
  border: 1px solid rgba(255, 107, 53, 0.4);
  color: #FFA07A;
  padding: 6px 18px;
  border-radius: $border-radius-full;
  font-size: 0.8rem;
  font-weight: 700;
}

.cta-banner__title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.cta-banner__desc {
  opacity: 0.75;
  font-size: $font-size-lg;
  max-width: 480px;
  line-height: 1.6;
}

.cta-banner__actions {
  display: flex;
  gap: $space-4;
  flex-wrap: wrap;
  justify-content: center;
}

.cta-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: 14px 30px;
  background: $color-accent;
  color: white;
  border-radius: $border-radius-full;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(255, 107, 53, 0.55);
  }
}

.cta-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  padding: 14px 28px;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  color: white;
  border-radius: $border-radius-full;
  font-weight: $font-weight-semibold;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.08);
  transition: all 0.25s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(255, 255, 255, 0.6);
  }
}
</style>
