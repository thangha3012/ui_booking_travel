<template>
  <div class="tours-page">
    <!-- HERO SECTION -->
    <div class="tours-hero">
      <div class="tours-hero__overlay"></div>
      <div class="container tours-hero__content">
        <h1 class="tours-hero__title">{{ t('nav.destinations') }}</h1>
        <div class="tours-hero__breadcrumb">
          <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
          <i class="pi pi-chevron-right"></i>
          <span>{{ t('common.pages') }}</span>
          <i class="pi pi-chevron-right"></i>
          <span class="current">{{ t('nav.destinations') }}</span>
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
              <div class="p-input-icon-left w-full">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters.keyword"
                  :placeholder="t('common.search') + '...'"
                  @input="debouncedSearch"
                  fluid
                />
              </div>
            </div>

            <div class="filter-section">
              <h3>Category</h3>
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <RadioButton
                    v-model="filters.categoryId"
                    :value="null"
                    inputId="cat-all"
                    @change="loadTours"
                  />
                  <label for="cat-all" class="text-sm cursor-pointer">All Categories</label>
                </div>
                <div v-for="cat in categories" :key="cat.id" class="flex items-center gap-2">
                  <RadioButton
                    v-model="filters.categoryId"
                    :value="cat.id"
                    :inputId="'cat-' + cat.id"
                    @change="loadTours"
                  />
                  <label :for="'cat-' + cat.id" class="text-sm cursor-pointer">{{
                    cat.name
                  }}</label>
                </div>
              </div>
            </div>

            <div class="filter-section">
              <h3>Price Range</h3>
              <div class="px-2 pt-4 pb-2">
                <Slider
                  v-model="filters.priceRange"
                  :range="true"
                  :min="0"
                  :max="2000"
                  class="w-full"
                />
                <div class="flex justify-between mt-4 text-xs font-bold text-slate-500">
                  <span>${{ filters.priceRange[0] }}</span>
                  <span>${{ filters.priceRange[1] }}</span>
                </div>
              </div>
            </div>

            <Button
              label="Clear Filters"
              icon="pi pi-filter-slash"
              text
              class="w-full mt-4"
              @click="clearFilters"
            />
          </div>

          <!-- Featured Offer -->
          <div class="featured-offer-card mt-6">
            <div class="offer-badge">Special</div>
            <h4>Summer in Sapa</h4>
            <p>Up to 30% off on all mountain trekking tours.</p>
            <Button label="Explore Now" size="small" outlined severity="contrast" />
          </div>
        </aside>

        <!-- Tours List -->
        <div class="tours-content">
          <div class="tours-toolbar">
            <div class="results-count">
              Found <strong>{{ tours.length }}</strong> tours
            </div>
            <div class="toolbar-actions">
              <Select
                v-model="sortBy"
                :options="sortOptions"
                optionLabel="label"
                placeholder="Sort by"
                class="w-48"
                @change="loadTours"
              />
            </div>
          </div>

          <div v-if="loading" class="tours-grid">
            <div v-for="n in 6" :key="n" class="tour-skeleton-card">
              <Skeleton height="200px" borderRadius="16px" class="mb-4"></Skeleton>
              <Skeleton width="60%" height="1.5rem" class="mb-2"></Skeleton>
              <Skeleton width="100%" height="1rem" class="mb-2"></Skeleton>
              <Skeleton width="80%" height="1rem"></Skeleton>
            </div>
          </div>

          <div v-else-if="tours.length === 0" class="empty-state">
            <div class="empty-icon">
              <i class="pi pi-search"></i>
            </div>
            <h3>No tours found</h3>
            <p>We couldn't find any tours matching your criteria. Try adjusting your filters.</p>
            <Button label="Clear All Filters" severity="secondary" @click="clearFilters" />
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
          <InputText type="email" :placeholder="t('auth.email')" fluid />
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
import TourCard from '@/components/ui/TourCard.vue'

// PrimeVue
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import RadioButton from 'primevue/radiobutton'
import Slider from 'primevue/slider'
import Select from 'primevue/select'
import Skeleton from 'primevue/skeleton'
import Paginator from 'primevue/paginator'
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
  priceRange: [0, 2000],
})

const sortBy = ref({ label: 'Latest', value: 'latest' })
const sortOptions = [
  { label: 'Latest', value: 'latest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
]

// Pagination
const first = ref(0)
const rows = ref(9)
const page = ref(1)
const totalRecords = ref(0)

async function loadCategories() {
  try {
    const res = await categoryApi.getAll()
    if (res.success) categories.value = res.data
  } catch (err) {
    console.error(err)
  }
}

async function loadDestinations() {
  try {
    const res = await destinationApi.getAll()
    if (res.success) destinations.value = res.data
  } catch (err) {
    console.error(err)
  }
}

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

    // Chỉ gửi min/max price lên server nếu người dùng có thay đổi dải lọc (khác default 0 - 2000)
    // Điều này giúp tránh bị mất các Tour chưa được cấu hình bảng giá (Pricing)
    if (filters.priceRange[0] > 0) {
      params.minPrice = filters.priceRange[0]
    }
    if (filters.priceRange[1] < 2000) {
      params.maxPrice = filters.priceRange[1]
    }

    const res = await tourApi.getAll(params)
    if (res.success && res.data) {
      let items = res.data.items || []

      // Lấy ảnh của điểm đến làm ảnh mặc định nếu Tour không có ảnh
      items = items.map((t) => {
        if (!t.imageUrl) {
          const dest = destinations.value.find((d) => d.id === t.destinationId)
          t.imageUrl =
            dest?.coverImageUrl ||
            'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80'
        }
        return t
      })

      tours.value = items
      totalRecords.value = res.data.totalCount || 0
    }
  } catch (err) {
    console.error(err)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Could not load tours', life: 3000 })
  } finally {
    loading.value = false
  }
}

let timeout = null
function debouncedSearch() {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    page.value = 1 // Reset về trang 1 khi search
    first.value = 0
    loadTours()
  }, 500)
}

function clearFilters() {
  filters.keyword = ''
  filters.categoryId = null
  filters.priceRange = [0, 2000]
  page.value = 1
  first.value = 0
  loadTours()
}

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
    width: 300px;
    position: sticky;
    top: $navbar-height + $space-6;
  }
}

.filter-card {
  background: white;
  border-radius: $border-radius-xl;
  padding: $space-6;
  box-shadow: $shadow-lg;
  border: 1px solid #f1f5f9;

  .filter-section {
    margin-bottom: $space-6;
    &:last-child {
      margin-bottom: 0;
    }

    h3 {
      font-size: 13px;
      font-weight: 800;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: $space-4;
    }
  }
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
