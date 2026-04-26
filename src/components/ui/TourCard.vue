<template>
  <RouterLink :to="`/tours/${tour.id}`" class="tour-card-hz">
    <!-- Hình ảnh bên trái -->
    <div class="tour-card-hz__image">
      <img :src="tour.imageUrl || defaultImage" :alt="tour.title" loading="lazy" />

      <!-- Nút yêu thích -->
      <button class="tour-card-hz__fav" @click.prevent="toggleFav">
        <i class="pi pi-heart"></i>
      </button>

      <!-- Badge (Category hoặc Loại Tour) -->
      <div class="tour-card-hz__badge">
        <i class="pi pi-verified"></i>
        <span>{{ tour.categoryName || 'Tour Tiêu Chuẩn' }}</span>
      </div>

      <!-- Sale / Hot Badge kiểu Vietravel -->
      <div class="tour-card-hz__hot-badge" v-if="Math.random() > 0.5">🔥 Giờ chót</div>
    </div>

    <!-- Nội dung bên phải -->
    <div class="tour-card-hz__body">
      <div class="tour-card-hz__code-rating">
        <span class="code">Mã: {{ tour.tourCode || `TR-${tour.id}` }}</span>
        <span class="rating"
          ><i class="pi pi-star-fill text-yellow-500"></i>
          {{ (Math.random() * (5 - 4.5) + 4.5).toFixed(1) }}</span
        >
      </div>
      <h3 class="tour-card-hz__title">{{ tour.title }}</h3>

      <div class="tour-card-hz__info-grid">
        <div class="info-item">
          <i class="pi pi-map-marker"></i>
          <span
            >Khởi hành: <strong>{{ tour.departureLocation || 'Đang cập nhật' }}</strong></span
          >
        </div>
        <div class="info-item">
          <i class="pi pi-clock"></i>
          <span
            >Thời gian: <strong>{{ tour.duration || getDuration() }}</strong></span
          >
        </div>
        <div class="info-item">
          <i class="pi pi-send"></i>
          <span
            >Phương tiện: <strong>{{ tour.transport || 'Đang cập nhật' }}</strong></span
          >
        </div>
      </div>

      <!-- Hiển thị các ngày khởi hành (lấy từ schedules) -->
      <div class="tour-card-hz__dates" v-if="upcomingDates.length > 0">
        <i class="pi pi-calendar"></i>
        <span>Ngày khởi hành:</span>
        <div class="dates-list">
          <span v-for="d in upcomingDates.slice(0, 4)" :key="d" class="date-badge">
            {{ d }}
          </span>
          <span v-if="upcomingDates.length > 4" class="date-more">
            <i class="pi pi-arrow-right"></i>
          </span>
        </div>
      </div>
      <div class="tour-card-hz__dates" v-else>
        <i class="pi pi-calendar"></i>
        <span style="color: #94a3b8; font-style: italic">Đang cập nhật lịch khởi hành</span>
      </div>

      <!-- Dòng dưới cùng: Giá và Nút Book -->
      <div class="tour-card-hz__footer">
        <div class="price-box">
          <span class="price-label">Giá từ:</span>
          <span class="price-value" v-if="minPrice > 0"
            >{{ formatPrice(minPrice) }}<span class="currency">đ</span></span
          >
          <span class="price-value" v-else-if="tour.basePrice > 0"
            >{{ formatPrice(tour.basePrice) }}<span class="currency">đ</span></span
          >
          <span class="price-value" v-else style="font-size: 1.1rem; color: #64748b">Liên hệ</span>
        </div>
        <button class="btn-book">Xem chi tiết</button>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tour: { type: Object, required: true },
  variant: { type: String, default: 'normal' },
})

const defaultImage = 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80'

// Lấy ngày khởi hành
const upcomingDates = computed(() => {
  if (!props.tour.schedules || props.tour.schedules.length === 0) return []
  const dates = props.tour.schedules.map((s) => {
    const d = new Date(s.departureDate)
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
  })
  // Lọc unique date array
  return [...new Set(dates)]
})

// Tính thời lượng (Dựa vào schedule đầu tiên)
function getDuration() {
  if (props.tour.schedules && props.tour.schedules.length > 0) {
    const s = props.tour.schedules[0]
    const dep = new Date(s.departureDate)
    const ret = new Date(s.returnDate)
    const diffTime = Math.abs(ret - dep)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays + 1}N${diffDays}Đ`
  }
  return '3N2Đ'
}

// Tìm giá rẻ nhất trong các lịch trình
const minPrice = computed(() => {
  if (!props.tour.schedules || props.tour.schedules.length === 0) return 0
  let min = 999999999
  let found = false
  for (const s of props.tour.schedules) {
    if (s.pricings && s.pricings.length > 0) {
      for (const p of s.pricings) {
        if (p.price < min) {
          min = p.price
          found = true
        }
      }
    }
  }
  return found ? min : 0
})

function formatPrice(val) {
  return new Intl.NumberFormat('vi-VN').format(val)
}

function toggleFav() {
  // Toggle logic if needed
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.tour-card-hz {
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: $border-radius-xl;
  box-shadow: $shadow-sm;
  transition: all 0.3s ease;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  width: 100%;

  @include md {
    flex-direction: row;
    height: 250px; // Chiều cao cố định trên desktop
  }

  &:hover {
    box-shadow: $shadow-xl;
    transform: translateY(-3px);
    border-color: #cbd5e1;
    .tour-card-hz__image img {
      transform: scale(1.05);
    }
  }

  &__image {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;

    @include md {
      width: 340px;
      height: 100%;
      flex-shrink: 0;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .tour-card-hz__fav {
      position: absolute;
      top: 12px;
      left: 12px;
      background: transparent;
      border: none;
      color: white;
      font-size: 1.25rem;
      cursor: pointer;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
      transition: transform 0.2s;
      &:hover {
        transform: scale(1.2);
        color: #ff6b35;
      }
    }

    .tour-card-hz__badge {
      position: absolute;
      bottom: 0px;
      left: 0px;
      background: rgba(15, 23, 42, 0.8);
      color: white;
      padding: 6px 12px;
      font-size: 0.75rem;
      font-weight: 600;
      border-top-right-radius: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      backdrop-filter: blur(4px);
    }

    .tour-card-hz__hot-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #ef4444;
      color: white;
      padding: 4px 10px;
      font-size: 0.7rem;
      font-weight: 800;
      border-radius: 6px;
      text-transform: uppercase;
      box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);
    }
  }

  &__body {
    padding: $space-5 $space-6;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__code-rating {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    .code {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .rating {
      font-size: 0.75rem;
      font-weight: 700;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  &__title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.4;
    margin-bottom: $space-4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @include md {
      font-size: 1.25rem;
    }
  }

  &__info-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 8px 16px;
    margin-bottom: $space-4;

    @include md {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px 24px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      color: #475569;

      i {
        font-size: 1rem;
        color: #94a3b8;
      }
      strong {
        color: #0f172a;
        font-weight: 600;
      }
    }
  }

  &__dates {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: #475569;
    margin-bottom: $space-4;

    i {
      color: #94a3b8;
    }

    .dates-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;

      .date-badge {
        padding: 4px 8px;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        color: #ef4444;
        font-weight: 600;
        font-size: 0.8rem;
        background: #fef2f2;
      }
      .date-more {
        color: #64748b;
        font-size: 1rem;
      }
    }
  }

  &__footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: auto;
    border-top: 1px dashed #e2e8f0;
    padding-top: $space-4;

    .price-box {
      display: flex;
      flex-direction: column;

      .price-label {
        font-size: 0.8rem;
        color: #64748b;
        margin-bottom: -2px;
      }
      .price-value {
        font-size: 1.5rem;
        font-weight: 800;
        color: #ef4444; // Màu đỏ đặc trưng
        display: flex;
        align-items: flex-start;
        gap: 2px;
      }
      .currency {
        font-size: 0.9rem;
        margin-top: 4px;
        text-decoration: underline;
      }
    }

    .btn-book {
      background: #1d4ed8;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #1e3a8a;
      }
    }
  }
}
</style>
