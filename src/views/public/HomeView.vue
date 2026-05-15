<template>
  <div class="home-view">
    <!-- ==================== HERO ==================== -->
    <section class="hero-section">
      <div class="hero-shape hero-shape--1"></div>
      <div class="hero-shape hero-shape--2"></div>

      <div class="container hero__inner">
        <div class="hero__content">
          <div class="hero__badge">
            <span class="badge-dot"></span>
            {{ t('hero.northernVietnam') }}
          </div>
          <h1 class="hero__title">
            {{ t('home.heroTitle') }} <br />
            <span class="text-highlight">{{ t('home.heroSubtitle') }}</span>
          </h1>
          <p class="hero__desc">
            {{ t('home.heroDesc') }}
          </p>
          <div class="hero__actions">
            <button class="btn-primary" @click="scrollToFeatured">
              {{ t('home.startTravelling') }}
              <i class="pi pi-arrow-right"></i>
            </button>
            <div class="hero__rating">
              <div class="avatars">
                <img src="https://i.pravatar.cc/100?img=1" alt="user" />
                <img src="https://i.pravatar.cc/100?img=2" alt="user" />
                <img src="https://i.pravatar.cc/100?img=3" alt="user" />
                <div class="avatar-plus">+12k</div>
              </div>
              <div class="rating-info">
                <div class="stars">
                  <i class="pi pi-star-fill" v-for="i in 5" :key="i"></i>
                </div>
                <span>4.9/5 (2.5k {{ t('tour.detail.reviews') }})</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Xóa thanh tìm kiếm theo yêu cầu -->
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
          <div v-for="s in services" :key="s.title" class="service-card">
            <div class="service-icon">
              <i :class="s.icon"></i>
            </div>
            <div class="service-body">
              <h3>{{ s.title }}</h3>
              <p>{{ s.desc }}</p>
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
        <div v-if="destinations.length > 0" class="destinations-grid">
          <RouterLink
            to="/tours"
            class="dest-card dest-card--big"
            :style="{
              backgroundImage: `url(${getFullImageUrl(destinations[0].coverImageUrl) || 'https://images.unsplash.com/photo-1606204619745-fdf4e2a7e96a?w=800&q=80'})`,
            }"
          >
            <div class="dest-overlay"></div>
            <div class="dest-info">
              <span class="dest-tag">Phổ biến #1</span>
              <h3>{{ destinations[0].name }}</h3>
            </div>
          </RouterLink>
          <div class="dest-right">
            <RouterLink
              to="/tours"
              class="dest-card"
              v-for="d in destinations.slice(1, 5)"
              :key="d.id"
              :style="{
                backgroundImage: `url(${getFullImageUrl(d.coverImageUrl) || 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80'})`,
              }"
            >
              <div class="dest-overlay"></div>
              <div class="dest-info">
                <h3>{{ d.name }}</h3>
              </div>
            </RouterLink>
          </div>
        </div>
        <div v-else-if="!loadingDest" class="destinations-empty">
          <p>Chưa có địa điểm nào được tạo.</p>
        </div>
      </div>
    </section>

    <!-- ==================== FEATURED TOURS ==================== -->
    <section id="featured-tours" class="section featured-section">
      <div class="container">
        <div class="featured-header">
          <div class="header-left">
            <p class="section-label">{{ $t('home.featured.label') }}</p>
            <h2 class="section-title">{{ $t('home.featured.title') }}</h2>
          </div>
          <RouterLink to="/tours" class="view-all-btn">
            {{ $t('home.featured.viewAll') }} <i class="pi pi-arrow-right"></i>
          </RouterLink>
        </div>

        <div v-if="loadingTours" class="tours-grid">
          <div v-for="i in 3" :key="i" class="tour-skeleton">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
              <div class="skeleton-line"></div>
              <div class="skeleton-line short"></div>
              <div class="skeleton-line"></div>
            </div>
          </div>
        </div>
        <div v-else-if="featuredTours.length === 0" class="destinations-empty">
          <i class="pi pi-map empty-icon-large"></i>
          <p>Chưa có tour nào. Hãy thêm tour từ trang Admin!</p>
        </div>
        <div v-else class="tours-grid">
          <TourCard
            v-for="tour in featuredTours"
            :key="tour.id"
            :tour="tour"
            displayMode="premium"
          />
        </div>
      </div>
    </section>

    <!-- ==================== ABOUT ==================== -->
    <section class="section about-section">
      <div class="container about__inner">
        <div class="about__image">
          <img
            src="https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80"
            alt="About"
            class="main-img"
          />
          <div class="floating-card floating-card--1">
            <i class="pi pi-check-circle"></i>
            <div>
              <p class="card-val">20+</p>
              <p class="card-lab">Năm kinh nghiệm</p>
            </div>
          </div>
          <div class="floating-card floating-card--2">
            <div class="avatars-small">
              <img src="https://i.pravatar.cc/100?img=4" alt="user" />
              <img src="https://i.pravatar.cc/100?img=5" alt="user" />
              <span>+2k khách</span>
            </div>
          </div>
        </div>
        <div class="about__content">
          <p class="section-label">{{ $t('home.about.label') }}</p>
          <h2 class="section-title">{{ $t('home.about.title') }}</h2>
          <p class="about-desc">
            {{ $t('home.about.desc1') }}
          </p>
          <div class="about-features">
            <div class="feat-item">
              <div class="feat-icon"><i class="pi pi-shield"></i></div>
              <p>Dịch vụ an toàn & tin cậy</p>
            </div>
            <div class="feat-item">
              <div class="feat-icon"><i class="pi pi-dollar"></i></div>
              <p>Giá cả cạnh tranh nhất</p>
            </div>
            <div class="feat-item">
              <div class="feat-icon"><i class="pi pi-users"></i></div>
              <p>Hướng dẫn viên chuyên nghiệp</p>
            </div>
          </div>
          <div class="about-stats">
            <div v-for="stat in aboutStats" :key="stat.label" class="stat-item">
              <h3>{{ stat.value }}</h3>
              <p>{{ stat.label }}</p>
            </div>
          </div>
          <button class="btn-secondary">
            {{ $t('home.about.readMore') }}
            <i class="pi pi-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- ==================== TESTIMONIALS ==================== -->
    <section class="section test-section">
      <div class="container">
        <div class="section-header center-align">
          <p class="section-label">KHÁCH HÀNG NÓI GÌ</p>
          <h2 class="section-title">Trải Nghiệm Từ Du Khách</h2>
        </div>
        <div class="test-grid">
          <div v-for="(item, index) in testimonialsList" :key="item.id || index" class="test-card">
            <div class="test-quote" :style="{ background: item.color || getRandomGradient(index) }">
              <span class="avatar-initials">{{ getInitials(item.user?.fullName || item.name) }}</span>
            </div>
            <p class="test-text">"{{ item.content || item.text }}"</p>
            <div class="test-user">
              <div class="user-info">
                <h4>{{ item.user?.fullName || item.name }}</h4>
                <p>{{ item.tour?.title || item.tour?.name || item.tour }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== CTA BANNER ==================== -->
    <section class="cta-banner">
      <div class="container cta-banner__inner">
        <h2 class="cta-banner__title">{{ t('hero.ctaTitle', 'Sẵn Sàng Khám Phá Chưa?') }}</h2>
        <p class="cta-banner__desc">
          {{ t('hero.ctaDesc', 'Hàng trăm hành trình đang chờ bạn. Đặt tour ngay hôm nay!') }}
        </p>
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
import { categoryApi } from '@/api/categoryApi'
import { destinationApi } from '@/api/destinationApi'
import reviewApi from '@/api/reviewApi'
import { getFullImageUrl } from '@/utils/imageHelper'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

const { t } = useI18n()
const router = useRouter()

// ---- Search ----
const searchDest = ref('')
const searchDuration = ref(null)
const searchType = ref(null)
const searchTravellers = ref(null)

const durationOptions = ['1-3 ngày', '4-7 ngày', 'Trên 7 ngày']
const categoryOptions = ref([])
const travellerOptions = ['1 người', '2 người', '3-5 người', 'Trên 5 người']

// Tải danh sách các danh mục tour từ API để phục vụ tìm kiếm
async function loadCategories() {
  try {
    const res = await categoryApi.getAll()
    if (res && (res.success || Array.isArray(res))) {
      const data = res.data || res
      categoryOptions.value = data.map((c) => ({
        label: c.name,
        value: c.id,
      }))
    }
  } catch (err) {
    console.error('Failed to load categories:', err)
  }
}

// Xử lý chuyển hướng đến trang danh sách tour với các tham số tìm kiếm
function handleSearch() {
  router.push({
    name: 'tours',
    query: {
      q: searchDest.value,
      duration: searchDuration.value,
      categoryId: searchType.value?.value,
      guests: searchTravellers.value,
    },
  })
}

// Cuộn mượt xuống phần các tour nổi bật
function scrollToFeatured() {
  const el = document.getElementById('featured-tours')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

// ---- Destinations ----
const destinations = ref([])
const loadingDest = ref(true)

// Tải danh sách 5 điểm đến nổi bật nhất từ API
async function loadDestinations() {
  try {
    const res = await destinationApi.getAll()
    if (res && (res.success || Array.isArray(res))) {
      const data = res.data || res
      destinations.value = data.slice(0, 5)
    }
  } catch (err) {
    console.error('Failed to load destinations:', err)
  } finally {
    loadingDest.value = false
  }
}

// ---- Services ----
const services = computed(() => [
  {
    icon: 'pi pi-sun',
    title: t('home.services.weather.title'),
    desc: t('home.services.weather.desc'),
  },
  {
    icon: 'pi pi-map',
    title: t('home.services.flight.title'),
    desc: t('home.services.flight.desc'),
  },
  {
    icon: 'pi pi-calendar',
    title: t('home.services.events.title'),
    desc: t('home.services.events.desc'),
  },
  {
    icon: 'pi pi-cog',
    title: t('home.services.custom.title'),
    desc: t('home.services.custom.desc'),
  },
])

// ---- Featured Tours ----
const featuredTours = ref([])
const loadingTours = ref(true)

// Tải danh sách các tour nổi bật dựa trên đánh giá cao nhất
async function loadFeaturedTours() {
  try {
    const res = await tourApi.getAll({ pageSize: 10, status: 2 })
    if (res.success && res.data && res.data.items) {
      featuredTours.value = [...res.data.items]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3)
    }
  } catch (err) {
    console.error('Failed to load featured tours:', err)
  } finally {
    loadingTours.value = false
  }
}

// ---- About Stats ----
const aboutStats = [
  { value: '500+', label: 'Tour du lịch' },
  { value: '10K+', label: 'Du khách hài lòng' },
  { value: '50+', label: 'Điểm đến' },
]

// ---- Testimonials ----
const realReviews = ref([])
const fallbackTestimonials = [
  {
    name: 'Nguyễn Minh Anh',
    tour: 'Tour Hà Giang Loop 3N2Đ',
    text: 'Chuyến đi Hà Giang thực sự là trải nghiệm tuyệt vời nhất trong cuộc đời tôi. Đội ngũ hướng dẫn viên rất chuyên nghiệp và thân thiện.',
    color: 'linear-gradient(135deg, #235789, #1E6B8C)',
  },
  {
    name: 'Trần Thu Hương',
    tour: 'Tour Sa Pa Fansipan 2N1Đ',
    text: 'Dịch vụ xuất sắc từ khâu đặt tour đến khi kết thúc hành trình. Tôi sẽ giới thiệu Triptopia với tất cả bạn bè của mình!',
    color: 'linear-gradient(135deg, #FF6B35, #f59e0b)',
  },
  {
    name: 'Lê Văn Đức',
    tour: 'Tour Hạ Long 2N1Đ',
    text: 'Đặt tour qua app rất tiện lợi và nhanh chóng. Thanh toán dễ dàng, giá cả hợp lý. Nhất định sẽ quay lại lần nữa.',
    color: 'linear-gradient(135deg, #10b981, #059669)',
  },
]

const testimonialsList = computed(() => {
  return realReviews.value.length > 0 ? realReviews.value : fallbackTestimonials
})

// Tải các đánh giá mới nhất từ khách hàng để hiển thị
async function loadLatestReviews() {
  try {
    const res = await reviewApi.getLatest(3)
    if (res.success && res.data) {
      realReviews.value = res.data
    }
  } catch (err) {
    console.error('Failed to load reviews:', err)
  }
}

// Tạo dải màu gradient ngẫu nhiên cho avatar người dùng
function getRandomGradient(index) {
  const gradients = [
    'linear-gradient(135deg, #235789, #1E6B8C)',
    'linear-gradient(135deg, #FF6B35, #f59e0b)',
    'linear-gradient(135deg, #10b981, #059669)',
  ]
  return gradients[index % gradients.length]
}

// Lấy ký tự đầu của tên người dùng để hiển thị trên avatar mặc định
function getInitials(name) {
  if (!name) return '??'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

onMounted(() => {
  loadFeaturedTours()
  loadDestinations()
  loadCategories()
  loadLatestReviews()
})
</script>

<style lang="scss" scoped>
@use 'sass:color';
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
  padding-bottom: 80px;
  color: white;
}

// Background decorative shapes
.hero-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  &--1 {
    width: 600px;
    height: 600px;
    background: rgba(255, 107, 53, 0.12);
    top: -200px;
    right: -100px;
  }
  &--2 {
    width: 400px;
    height: 400px;
    background: rgba(30, 107, 140, 0.2);
    bottom: -100px;
    left: -100px;
  }
}

.hero__inner {
  position: relative;
  z-index: 10;
}

.hero__content {
  max-width: 720px;
  margin-bottom: $space-16;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: $space-3;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: $border-radius-full;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: $font-weight-semibold;
  font-size: $font-size-sm;
  margin-bottom: $space-6;
  .badge-dot {
    width: 8px;
    height: 8px;
    background: $color-primary;
    border-radius: 50%;
    box-shadow: 0 0 12px $color-primary;
  }
}

.hero__title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: $space-6;
  letter-spacing: -0.02em;

  @include lg {
    font-size: 4.5rem;
  }

  .text-highlight {
    background: linear-gradient(to right, #ff6b35, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.hero__desc {
  font-size: 1.25rem;
  line-height: 1.6;
  opacity: 0.85;
  margin-bottom: $space-10;
  max-width: 600px;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $space-10;
}

.btn-primary {
  background: linear-gradient(135deg, #ff6b35, #f59e0b);
  color: white;
  border: none;
  padding: 18px 36px;
  border-radius: $border-radius-full;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  display: flex;
  align-items: center;
  gap: $space-3;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 20px rgba(255, 107, 53, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(255, 107, 53, 0.4);
  }

  i {
    transition: transform 0.3s ease;
  }
  &:hover i {
    transform: translateX(5px);
  }
}

.hero__rating {
  display: flex;
  align-items: center;
  gap: $space-4;

  .avatars {
    display: flex;
    margin-right: $space-2;
    img {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 3px solid #1a3a5c;
      margin-left: -12px;
      &:first-child {
        margin-left: 0;
      }
    }
    .avatar-plus {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: $color-primary;
      border: 3px solid #1a3a5c;
      margin-left: -12px;
      @include flex-center;
      font-size: 12px;
      font-weight: $font-weight-bold;
    }
  }

  .rating-info {
    .stars {
      color: #f59e0b;
      font-size: 14px;
      margin-bottom: 2px;
    }
    span {
      font-size: 13px;
      font-weight: $font-weight-medium;
      opacity: 0.8;
    }
  }
}

// Search Bar
.hero__search-bar {
  position: absolute;
  bottom: -60px;
  left: 0;
  right: 0;
  background: white;
  padding: 20px;
  border-radius: $border-radius-2xl;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-4;
  z-index: 100;

  @include lg {
    grid-template-columns: 1.5fr auto 1fr auto 1fr auto 1fr auto;
    padding: 10px 10px 10px 30px;
    align-items: center;
    border-radius: $border-radius-full;
  }
}

.search-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.search-label {
  font-size: 11px;
  font-weight: $font-weight-bold;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 6px;
  i {
    color: $color-primary;
  }
}

.search-input {
  border: none !important;
  box-shadow: none !important;
  font-weight: $font-weight-semibold;
  font-size: $font-size-base;
  padding: 0 !important;
  background: transparent;
  width: 100%;
}

.search-select {
  border: none !important;
  box-shadow: none !important;
  font-weight: $font-weight-semibold;
  font-size: $font-size-base;
  padding: 0 !important;
  background: transparent;
  width: 100%;
  :deep(.p-select-label) {
    padding: 0;
  }
}

.search-divider {
  display: none;
  @include lg {
    display: block;
    width: 1px;
    height: 40px;
    background: #e2e8f0;
  }
}

.search-btn {
  background: #1e3a5a;
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: $border-radius-full;
  font-weight: $font-weight-bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-3;
  transition: all 0.3s ease;

  @include lg {
    height: 60px;
  }

  &:hover {
    background: #2d5582;
    transform: scale(1.02);
  }
}

.center-align {
  text-align: center;
  .section-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
}

.empty-icon-large {
  font-size: 2.25rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
  display: block;
}

.section-label {
  font-size: $font-size-sm;
  font-weight: 800;
  color: $color-primary;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: $space-3;
  display: block;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
  position: relative;
  padding-bottom: $space-4;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(to right, $color-primary, #f59e0b);
    border-radius: $border-radius-full;
  }

  @include md {
    font-size: 3rem;
  }
}

// ============================================================
// SERVICES
// ============================================================
.services-section {
  padding-top: 80px;
  padding-bottom: $space-20;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $space-10;

  @include md {
    grid-template-columns: repeat(2, 1fr);
  }
  @include lg {
    grid-template-columns: repeat(4, 1fr);
  }
}

.service-card {
  padding: $space-10;
  border-radius: $border-radius-2xl;
  background: white;
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
    border-color: #f1f5f9;
    .service-icon {
      background: $color-primary;
      color: white;
      transform: rotate(10deg);
    }
  }
}

.service-icon {
  width: 70px;
  height: 70px;
  background: #fff7ed;
  color: $color-primary;
  border-radius: 20px;
  @include flex-center;
  font-size: 28px;
  margin-bottom: $space-8;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-body {
  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: $space-3;
    color: #1e293b;
  }
  p {
    color: $color-text-secondary;
    line-height: 1.6;
    font-size: $font-size-sm;
  }
}

// ============================================================
// DESTINATIONS
// ============================================================
.destinations-section {
  padding-bottom: $space-20;
}

.destinations-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-6;
  height: auto;

  @include lg {
    grid-template-columns: 1.2fr 1fr;
    height: 600px;
  }
}

.dest-card {
  position: relative;
  border-radius: $border-radius-2xl;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  text-decoration: none;
  display: flex;
  align-items: flex-end;
  padding: $space-8;
  transition: all 0.5s ease;

  &:hover {
    .dest-overlay {
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2));
    }
    transform: scale(1.02);
  }

  &--big {
    height: 400px;
    @include lg {
      height: 100%;
    }
  }
}

.dest-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  z-index: 1;
  transition: all 0.4s ease;
}

.dest-info {
  position: relative;
  z-index: 2;
  color: white;

  .dest-tag {
    display: inline-block;
    background: $color-primary;
    padding: 4px 12px;
    border-radius: $border-radius-full;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: $space-3;
  }

  h3 {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: $space-1;
  }
  p {
    font-size: $font-size-sm;
    opacity: 0.8;
  }
}

.dest-right {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-6;

  .dest-card {
    height: 280px;
    h3 {
      font-size: 1.5rem;
    }
  }
}

// ============================================================
// FEATURED TOURS
// ============================================================
.featured-section {
  background: #f8fafc;
  padding: $space-24 0;
}

.featured-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: $space-12;
}

.view-all-btn {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  color: $color-primary;
  font-weight: $font-weight-bold;
  text-decoration: none;
  transition: all 0.2s;
  &:hover {
    gap: $space-4;
  }
}

.tours-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $space-6;
  @include md {
    grid-template-columns: repeat(3, 1fr);
  }
}

.tour-skeleton {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  height: 420px;
  .skeleton-img {
    height: 250px;
    background: #e2e8f0;
  }
  .skeleton-body {
    padding: 20px;
  }
  .skeleton-line {
    height: 20px;
    background: #e2e8f0;
    margin-bottom: 10px;
    border-radius: 4px;
    &.short {
      width: 60%;
    }
  }
}

// ============================================================
// ABOUT
// ============================================================
.about-section {
  padding: $space-24 0;
}

.about__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-20;
  align-items: center;
  @include lg {
    grid-template-columns: 1fr 1.1fr;
  }
}

.about__image {
  position: relative;
  .main-img {
    width: 100%;
    border-radius: 30px;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
  }
}

.floating-card {
  position: absolute;
  background: white;
  padding: $space-5 $space-8;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: $space-4;

  &--1 {
    top: -30px;
    right: -20px;
    i {
      font-size: 40px;
      color: #10b981;
    }
    .card-val {
      font-size: 1.5rem;
      font-weight: 800;
      color: #1e293b;
    }
    .card-lab {
      font-size: 12px;
      color: #64748b;
    }
  }

  &--2 {
    bottom: -20px;
    left: -20px;
    .avatars-small {
      display: flex;
      align-items: center;
      img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid white;
        margin-left: -10px;
        &:first-child {
          margin-left: 0;
        }
      }
      span {
        margin-left: $space-3;
        font-size: 13px;
        font-weight: 700;
        color: #1e293b;
      }
    }
  }
}

.about-features {
  display: grid;
  grid-template-columns: 1fr;
  gap: $space-4;
  margin: $space-8 0;

  .feat-item {
    display: flex;
    align-items: center;
    gap: $space-4;
    .feat-icon {
      width: 36px;
      height: 36px;
      background: #eff6ff;
      color: #3b82f6;
      border-radius: 10px;
      @include flex-center;
      font-size: 18px;
    }
    p {
      font-weight: 600;
      color: #334155;
    }
  }
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $space-8;
  margin-top: $space-10;
  padding-top: $space-10;
  border-top: 1px solid #f1f5f9;

  .stat-item {
    h3 {
      font-size: 1.75rem;
      font-weight: 800;
      color: $color-primary;
    }
    p {
      font-size: 13px;
      color: #64748b;
      font-weight: 600;
    }
  }
}

.btn-secondary {
  margin-top: $space-10;
  background: #1e293b;
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: $border-radius-full;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: $space-3;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background: #0f172a;
    transform: translateY(-2px);
  }
}

// ============================================================
// TESTIMONIALS
// ============================================================
.test-section {
  padding: $space-24 0;
  background: #f8fafc;
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $space-10;
  margin-top: $space-16; // Tránh đè tiêu đề khi hover
  @include lg {
    grid-template-columns: repeat(3, 1fr);
  }
}

.test-card {
  background: white;
  padding: $space-10;
  border-radius: 30px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.03);
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f1f5f9;

  &:hover {
    transform: translateY(-20px); // Đẩy cao hơn để trông chuyên nghiệp
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.08);
    border-color: rgba($color-primary-rgb, 0.2);
  }
}

.test-quote {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  @include flex-center;
  color: white;
  font-size: 20px;
  margin-bottom: $space-6;
}

.test-text {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #475569;
  font-style: italic;
  margin-bottom: $space-8;
}

.test-user {
  display: flex;
  align-items: center;
  gap: $space-4;
  .user-info {
    h4 {
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 2px;
    }
    p {
      font-size: 12px;
      color: $color-primary;
      font-weight: 600;
    }
  }
}

// ============================================================
// CTA BANNER
// ============================================================
.cta-banner {
  margin: $space-20 0;
  &__inner {
    background: linear-gradient(135deg, #235789, #1a3a5c);
    border-radius: 40px;
    padding: $space-20;
    text-align: center;
    color: white;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: -100px;
      right: -100px;
      width: 300px;
      height: 300px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
    }
  }

  &__title {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: $space-6;
  }
  &__desc {
    font-size: 1.2rem;
    opacity: 0.8;
    max-width: 600px;
    margin: 0 auto $space-10;
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: $space-6;
    flex-wrap: wrap;
  }
}

.cta-btn-primary {
  background: white;
  color: #1a3a5c;
  padding: 16px 36px;
  border-radius: $border-radius-full;
  font-weight: 700;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: $space-3;
  transition: all 0.3s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
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
