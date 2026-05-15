<template>
  <div class="tours-page">
    <!-- HERO SECTION -->
    <div class="page-hero">
      <div class="container">
        <span class="page-hero__label">Khám phá</span>
        <h1 class="page-hero__title">Tour Du Lịch</h1>
        <div class="page-hero__breadcrumb">
          <RouterLink to="/">Trang chủ</RouterLink>
          <i class="pi pi-angle-right"></i>
          <span class="current">Tour du lịch</span>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="container tours-main">
      <div class="tours-layout">
        <!-- Sidebar Filter -->
        <aside class="tours-sidebar">
          <div class="filter-card">
            <div class="filter-section">
              <h3>{{ t('common.search') }}</h3>
              <div class="search-input-wrap">
                <InputText
                  v-model="filters.keyword"
                  :placeholder="t('common.search') + '...'"
                  class="search-field"
                  @keyup.enter="handleSearch"
                />
                <Button icon="pi pi-search" class="search-btn" @click="handleSearch" />
              </div>
            </div>

            <div class="filter-section">
              <h3>Danh mục</h3>
              <Select
                v-model="filters.categoryId"
                :options="[{ id: null, name: 'Tất cả danh mục' }, ...categories]"
                optionLabel="name"
                optionValue="id"
                placeholder="Chọn danh mục"
                class="category-select-full"
              />
            </div>

            <div class="filter-section">
              <div class="price-filter-header">
                <h3>Khoảng giá</h3>
                <span class="price-display">
                  {{ filters.priceRange[0].toLocaleString() }}đ -
                  {{ filters.priceRange[1].toLocaleString() }}đ
                </span>
              </div>
              <div class="slider-container">
                <Slider
                  v-model="filters.priceRange"
                  range
                  :min="0"
                  :max="50000000"
                  :step="500000"
                  class="price-slider"
                />
              </div>
              <div class="price-range-labels">
                <span>Từ 0đ</span>
                <span>Đến 50tr</span>
              </div>
            </div>

            <Button
              label="Xóa bộ lọc"
              icon="pi pi-filter-slash"
              text
              class="clear-filters-btn"
              @click="clearFilters"
            />
          </div>
        </aside>

        <!-- Tours List -->
        <div class="tours-content">
          <div class="tours-toolbar">
            <div class="results-count">
              Tìm thấy <strong>{{ tours.length }}</strong> tour
            </div>
            <div class="toolbar-actions">
              <Select
                v-model="sortBy"
                :options="sortOptions"
                optionLabel="label"
                placeholder="Sắp xếp"
                class="sort-select"
                @change="loadTours"
              />
            </div>
          </div>

          <div v-if="loading" class="tours-grid">
            <div v-for="n in 6" :key="n" class="tour-skeleton-card">
              <Skeleton height="200px" borderRadius="16px" class="skeleton-img-gap"></Skeleton>
              <Skeleton width="60%" height="1.5rem" class="skeleton-title-gap"></Skeleton>
              <Skeleton width="100%" height="1rem" class="skeleton-line-gap"></Skeleton>
              <Skeleton width="80%" height="1rem"></Skeleton>
            </div>
          </div>

          <div v-else-if="tours.length === 0" class="empty-state">
            <div class="empty-icon">
              <i class="pi pi-search"></i>
            </div>
            <h3>Không tìm thấy tour</h3>
            <p>Không tìm thấy tour phù hợp với tiêu chí tìm kiếm. Hãy thử điều chỉnh bộ lọc.</p>
            <Button label="Xóa tất cả bộ lọc" severity="secondary" @click="clearFilters" />
          </div>

          <div v-else class="tours-grid">
            <TourCard
              v-for="(tour, idx) in tours"
              :key="tour.id"
              :tour="tour"
              :variant="getVariant(idx)"
            />
          </div>

          <!-- Pagination -->
          <div class="pagination-wrap" v-if="tours.length > 0">
            <Paginator
              :rows="rows"
              :totalRecords="totalRecords"
              :first="first"
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
              @page="onPage($event)"
            />
          </div>
        </div>
      </div>

      <!-- PRO OFFERS BANNER -->
      <div class="pro-offers-banner">
        <div class="pro-offers-banner__content">
          <h2>{{ t('home.proOffers.title') }}</h2>
          <p>{{ t('home.proOffers.desc') }}</p>
        </div>
        <div class="pro-offers-banner__form">
          <InputText type="email" :placeholder="t('auth.email')" class="email-input-fix" />
          <Button :label="t('home.proOffers.subscribe')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { tourApi } from '@/api/tourApi'
import { categoryApi } from '@/api/categoryApi'
import { destinationApi } from '@/api/destinationApi'
import { getFullImageUrl } from '@/utils/imageHelper'
import TourCard from '@/components/ui/TourCard.vue'

// PrimeVue
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import RadioButton from 'primevue/radiobutton'
import InputNumber from 'primevue/inputnumber'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import Skeleton from 'primevue/skeleton'
import Paginator from 'primevue/paginator'
import Slider from 'primevue/slider'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const toast = useToast()

const tours = ref([])
const categories = ref([])
const destinations = ref([])
const loading = ref(true)

const filters = reactive({
  keyword: '',
  categoryId: null,
  priceRange: [0, 50000000],
})

const sortBy = ref({ label: 'Mới nhất', value: 'latest' })
const sortOptions = [
  { label: 'Mới nhất', value: 'latest' },
  { label: 'Giá: Thấp đến Cao', value: 'price_asc' },
  { label: 'Giá: Cao đến Thấp', value: 'price_desc' },
  { label: 'Đánh giá cao', value: 'rating' },
]

// Pagination
const first = ref(0)
const rows = ref(9)
const page = ref(1)
const totalRecords = ref(0)

// Lấy danh sách các danh mục tour từ API
async function loadCategories() {
  try {
    const res = await categoryApi.getAll()
    if (res.success) categories.value = res.data
  } catch (err) {
    console.error(err)
  }
}

// Lấy danh sách các điểm đến từ API
async function loadDestinations() {
  try {
    const res = await destinationApi.getAll()
    if (res.success) destinations.value = res.data
  } catch (err) {
    console.error(err)
  }
}

// Tải danh sách Tour dựa trên các tham số lọc, sắp xếp và phân trang
async function loadTours() {
  loading.value = true
  try {
    const params = {
      keyword: filters.keyword,
      categoryId: filters.categoryId,
      page: page.value,
      pageSize: rows.value,
      sortBy: sortBy.value?.value || 'latest',
      status: 2, // Chỉ lấy Tour Published
    }

    // Gửi min/max price lên server
    if (filters.priceRange[0] > 0) {
      params.minPrice = filters.priceRange[0]
    }
    if (filters.priceRange[1] < 50000000) {
      params.maxPrice = filters.priceRange[1]
    }

    console.log('Fetching tours with params:', params) // Log để kiểm tra tham số gửi đi

    const res = await tourApi.getAll(params)
    if (res.success && res.data) {
      let items = res.data.items || []

      // Lấy ảnh của điểm đến làm ảnh mặc định nếu Tour không có ảnh
      items = items.map((t) => {
        if (!t.imageUrl) {
          const dest = destinations.value.find((d) => d.id === t.destinationId)
          t.imageUrl =
            getFullImageUrl(dest?.coverImageUrl) ||
            'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80'
        }
        return t
      })

      tours.value = items
      totalRecords.value = res.data.totalCount || 0
    }
  } catch (err) {
    console.error(err)
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể tải danh sách tour',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

// Xử lý khi người dùng nhấn tìm kiếm
function handleSearch() {
  page.value = 1
  first.value = 0
  loadTours()
}

// Thiết lập lại toàn bộ các bộ lọc về mặc định
function clearFilters() {
  filters.keyword = ''
  filters.categoryId = null
  filters.priceRange = [0, 50000000]
  page.value = 1
  first.value = 0
  loadTours()
}

// Xử lý sự kiện khi người dùng chuyển trang
function onPage(event) {
  first.value = event.first
  page.value = event.page + 1 // Paginator của PrimeVue tính page từ 0
  loadTours()
}

function getVariant(index) {
  const pattern = index % 5
  if (pattern === 0) return 'large'
  if (pattern === 3) return 'wide'
  return 'normal'
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadDestinations()])
  loadTours()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.tours-page {
  background: #f8fafc;
  min-height: 100vh;
  padding-bottom: $space-24;
}

.tours-hero {
  position: relative;
  height: 380px;
  background: url('https://images.unsplash.com/photo-1518182170546-076616fd6251?w=1920&q=80')
    center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: $navbar-height;

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(35, 87, 137, 0.85), rgba(0, 0, 0, 0.5));
  }

  &__content {
    position: relative;
    z-index: 1;
    text-align: center;
    color: white;
  }

  &__title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    margin-bottom: $space-4;
    letter-spacing: -0.02em;
  }

  &__breadcrumb {
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    color: rgba(255, 255, 255, 0.7);
    a {
      color: white;
      &:hover {
        color: $color-accent;
      }
    }
    span.current {
      color: $color-accent;
      font-weight: 700;
    }
  }
}

.tours-main {
  margin-top: -$space-12;
  position: relative;
  z-index: 10;
}

.tours-layout {
  display: flex;
  flex-direction: column;
  gap: $space-8;
  @include lg {
    flex-direction: row;
    align-items: flex-start;
  }
}

// Sidebar
.tours-sidebar {
  width: 100%;
  @include lg {
    width: 350px;
    position: sticky;
    top: $navbar-height + $space-6;
  }
}

.filter-card {
  background: white;
  border-radius: $border-radius-xl;
  padding: $space-8;
  box-shadow: $shadow-lg;
  border: 1px solid #f1f5f9;

  .filter-section {
    margin-bottom: $space-8;
    &:last-child {
      margin-bottom: 0;
    }

    h3 {
      font-size: 12px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: $space-3;
      display: flex;
      align-items: center;
      gap: $space-2;

      &::before {
        content: '';
        width: 3px;
        height: 12px;
        background: $color-primary;
        border-radius: 2px;
      }
    }

    .category-select {
      height: 46px;
      border-radius: 12px;
      border: 1.5px solid #e2e8f0;
      background: white;
      width: 283px;

      &:focus {
        border-color: $color-primary;
      }

      :deep(.p-select-label) {
        padding: 10px 14px;
        font-size: 14px;
        font-weight: 500;
        color: #475569;
      }
    }

    .search-input-wrap {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .search-field {
      flex: 1;
      height: 46px;
      border-radius: 12px;
      border: 1.5px solid #e2e8f0;
      font-size: 14px;
      transition: all 0.3s ease;
      min-width: 0; // Để flex không bị tràn

      &:focus {
        border-color: $color-primary;
        box-shadow: 0 0 0 3px rgba($color-primary-rgb, 0.1);
      }
    }

    .search-btn {
      width: 46px;
      height: 46px;
      flex-shrink: 0; // Đảm bảo nút không bị co lại
      border-radius: 12px;
      background: $color-primary !important;
      border: none !important;
      transition: all 0.3s ease;
      color: white !important;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba($color-primary-rgb, 0.3);
      }
    }
  }
}

.price-slider {
  height: 6px !important;
  background: #f1f5f9 !important;
  border-radius: 3px !important;
  border: none !important;

  :deep(.p-slider-range) {
    background: linear-gradient(to right, $color-primary, $color-accent) !important;
  }

  :deep(.p-slider-handle) {
    height: 18px !important;
    width: 18px !important;
    background: white !important;
    border: 3px solid $color-primary !important;
    border-radius: 50% !important;
    transition:
      transform 0.2s,
      box-shadow 0.2s !important;
    cursor: grab !important;
    margin-top: -6px !important;

    &:active {
      cursor: grabbing !important;
      transform: scale(1.2) !important;
      box-shadow: 0 0 0 8px rgba($color-primary-rgb, 0.1) !important;
    }

    &::before {
      display: none !important;
    }
  }
}

.price-filter-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-3;
  margin-bottom: $space-4;
}

.price-range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  margin-top: $space-2;
}

.price-display {
  padding: 8px 12px;
  background: rgba($color-primary-rgb, 0.08);
  border-radius: 10px;
  color: $color-primary;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  width: 100%;
  text-align: center;
  border: 1px solid rgba($color-primary-rgb, 0.1);
}

.featured-offer-card {
  background: linear-gradient(135deg, $color-primary, #6366f1);
  border-radius: $border-radius-xl;
  padding: $space-6;
  color: white;
  position: relative;
  overflow: hidden;

  .offer-badge {
    position: absolute;
    top: 12px;
    right: -25px;
    background: #fbbf24;
    color: #92400e;
    font-size: 10px;
    font-weight: 800;
    padding: 4px 30px;
    transform: rotate(45deg);
    text-transform: uppercase;
  }

  h4 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: $space-2;
  }
  p {
    font-size: 0.85rem;
    opacity: 0.9;
    margin-bottom: $space-4;
    line-height: 1.5;
  }
}

// Content List
.tours-content {
  flex: 1;
}

.tours-toolbar {
  background: white;
  border-radius: $border-radius-xl;
  padding: $space-4 $space-6;
  margin-bottom: $space-6;
  box-shadow: $shadow-sm;
  border: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .results-count {
    font-size: 15px;
    color: #64748b;
  }
}

.tours-grid {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.tour-skeleton-card {
  background: white;
  padding: $space-4;
  border-radius: $border-radius-xl;
  border: 1px solid #f1f5f9;
}

.empty-state {
  text-align: center;
  padding: $space-20 $space-6;
  background: white;
  border-radius: $border-radius-xl;
  border: 2px dashed #e2e8f0;

  .empty-icon {
    font-size: 3rem;
    color: #cbd5e1;
    margin-bottom: $space-4;
  }
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: $space-2;
  }
  p {
    color: #64748b;
    margin-bottom: $space-6;
  }
}

.pagination-wrap {
  margin-top: $space-12;
  display: flex;
  justify-content: center;
  :deep(.p-paginator) {
    background: transparent;
    border: none;
    .p-paginator-page,
    .p-paginator-next,
    .p-paginator-last,
    .p-paginator-first,
    .p-paginator-prev {
      background: white;
      border-radius: 12px;
      margin: 0 4px;
      border: 1px solid #e2e8f0;
      &.p-highlight {
        background: $color-primary;
        border-color: $color-primary;
        color: white;
      }
    }
  }
}

.category-select-full {
  width: 100%;
}

.slider-container {
  padding: 1rem 0.5rem;
}

.clear-filters-btn {
  width: 100%;
  margin-top: 1rem;
}

.sort-select {
  width: 12rem;
}

.skeleton-img-gap {
  margin-bottom: 1rem;
}

.skeleton-title-gap, .skeleton-line-gap {
  margin-bottom: 0.5rem;
}

.email-input-fix {
  width: 100%;
}

// Pro Offer banner (same as Home but customized)
.pro-offers-banner {
  background: #38b2ac;
  border-radius: $border-radius-2xl;
  padding: $space-12;
  display: flex;
  flex-direction: column;
  gap: $space-8;
  color: white;
  margin-top: $space-24;
  box-shadow: $shadow-2xl;

  @include md {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: $space-16 $space-24;
  }

  &__content {
    flex: 1;
    h2 {
      font-size: 2.25rem;
      font-weight: 800;
      margin-bottom: $space-2;
    }
    p {
      opacity: 0.9;
      font-size: 1.1rem;
    }
  }

  &__form {
    display: flex;
    background: white;
    padding: 6px;
    border-radius: 16px;
    width: 100%;
    max-width: 450px;
    :deep(.p-inputtext) {
      border: none !important;
      box-shadow: none !important;
      flex: 1;
      padding-left: 1rem;
    }
    button {
      border-radius: 12px;
      padding: 0.75rem 1.5rem;
      background: #2c7a7b !important;
      border: none !important;
    }
  }
}
</style>
