<template>
  <!-- KIỂU 1: PREMIUM (Dùng cho trang Home) -->
  <RouterLink
    v-if="displayMode === 'premium'"
    :key="'premium-' + tour.id"
    :to="`/tours/${tour.id}`"
    class="tour-card-premium"
  >
    <div class="card-image">
      <img :src="mainImage" :alt="tour.title || tour.Title" @error="handleImageError" />
      <div class="image-overlay-bottom"></div>

      <div class="top-badges">
        <div v-if="tour.isLastHour" class="badge-last-hour">
          <i class="pi pi-bolt"></i> Giờ chót
        </div>
        <div v-if="tour.categoryName" class="badge-category">
          <i class="pi pi-tag"></i> {{ tour.categoryName }}
        </div>
      </div>

      <div class="basic-info">
        <h3 class="tour-title">{{ tour.title || tour.Title || 'Tour du lịch' }}</h3>
        <div class="tour-rating">
          <i class="pi pi-star-fill"></i>
          <span>{{ tour.rating > 0 ? tour.rating.toFixed(1) : '0.0' }}</span>
        </div>
      </div>
    </div>

    <div class="hover-overlay">
      <div class="detail-content">
        <div class="info-grid">
          <div class="info-item">
            <i class="pi pi-map-marker"></i>
            <span>{{ tour.locationName || 'Việt Nam' }}</span>
          </div>
          <div class="info-item">
            <i class="pi pi-clock"></i>
            <span>{{ tour.durationText || '3 ngày 2 đêm' }}</span>
          </div>
        </div>
        <p class="tour-desc">
          {{
            tour.description ||
            tour.Description ||
            'Khám phá hành trình tuyệt vời cùng Triptopia...'
          }}
        </p>
        <div class="price-section">
          <span class="price-label">Giá từ</span>
          <div class="price-value">{{ formatPrice(tour.basePrice || tour.BasePrice) }}</div>
        </div>
        <button class="btn-detail">Xem chi tiết <i class="pi pi-arrow-right"></i></button>
      </div>
    </div>
  </RouterLink>

  <!-- KIỂU 2: HORIZONTAL (Dùng cho trang danh sách Tour) -->
  <RouterLink v-else :key="'hz-' + tour.id" :to="`/tours/${tour.id}`" class="tour-card-hz">
    <div class="tour-card-hz__image">
      <img :src="mainImage" :alt="tour.title || tour.Title" @error="handleImageError" />
      <div class="tour-card-hz__badge" v-if="tour.isLastHour">
        <i class="pi pi-bolt"></i> GIỜ CHÓT
      </div>
      <button class="tour-card-hz__fav" @click.prevent="toggleFavorite">
        <i class="pi" :class="isFavorite ? 'pi-heart-fill' : 'pi-heart'"></i>
      </button>
    </div>

    <div class="tour-card-hz__content">
      <div class="tour-card-hz__header">
        <div class="tour-card-hz__meta">
          <span class="tour-card-hz__tag">{{ tour.categoryName || 'Tour' }}</span>
          <div class="tour-card-hz__rating">
            <i class="pi pi-star-fill"></i>
            <span>{{ tour.rating > 0 ? tour.rating.toFixed(1) : '0.0' }}</span>
          </div>
        </div>
        <h3 class="tour-card-hz__title">{{ tour.title || tour.Title || 'Tour du lịch' }}</h3>
        <p class="tour-card-hz__code">Mã: {{ tour.tourCode || 'VTR-123' }}</p>
      </div>

      <div class="tour-card-hz__info-grid">
        <div class="info-item">
          <i class="pi pi-map-marker"></i>
          <span>{{ tour.locationName || 'Việt Nam' }}</span>
        </div>
        <div class="info-item">
          <i class="pi pi-send"></i>
          <span>Khởi hành: {{ tour.departurePoint || 'Hà Nội' }}</span>
        </div>
        <div class="info-item">
          <i class="pi pi-calendar"></i>
          <span>{{ tour.durationText || '3 ngày 2 đêm' }}</span>
        </div>
      </div>

      <div class="tour-card-hz__footer">
        <div class="tour-card-hz__price">
          <span class="price-label">Giá chỉ từ</span>
          <div class="price-amount">{{ formatPrice(tour.basePrice || tour.BasePrice) }}</div>
        </div>
        <button class="btn-book">Xem chi tiết</button>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getFullImageUrl } from '@/utils/imageHelper'

const props = defineProps({
  tour: { type: Object, required: true },
  displayMode: { type: String, default: 'horizontal' },
})

const isFavorite = ref(false)

const mainImage = computed(() => {
  const t = props.tour
  const rawUrl =
    t.coverUrl ||
    t.CoverUrl ||
    t.imageUrl ||
    t.ImageUrl ||
    t.image ||
    t.Image ||
    (t.images && t.images.length > 0 ? t.images[0].url || t.images[0].Url || t.images[0] : null)

  return (
    getFullImageUrl(rawUrl) ||
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80'
  )
})

function formatPrice(price) {
  if (!price) return 'Liên hệ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

function handleImageError(e) {
  e.target.src = 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80'
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

// PREMIUM STYLE (HOME PAGE)
.tour-card-premium {
  position: relative;
  display: block;
  height: 420px; // Tăng thêm chiều cao cho thoáng
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  background: #1e293b;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Inter', sans-serif;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
    .card-image img {
      transform: scale(1.1);
    }
    .hover-overlay {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .basic-info {
      opacity: 0;
      transform: translateY(20px);
    }
  }
}

.card-image {
  position: relative;
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s ease;
  }
}

.image-overlay-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent);
  transition: all 0.5s ease;
}

.top-badges {
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
}

.badge-last-hour {
  background: #ef4444;
  color: white;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 4px;
}

.badge-category {
  background: rgba(255, 255, 255, 0.95);
  color: #1e293b;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 700;
}

.basic-info {
  position: absolute;
  bottom: 25px;
  left: 20px;
  right: 20px;
  z-index: 2;
  transition: all 0.4s ease;
  .tour-title {
    color: white;
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
  .tour-rating {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #fbbf24;
    font-size: 0.95rem;
    font-weight: 700;
  }
}

.hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  padding: 25px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(30px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 3;
}

.detail-content {
  width: 100%;
  color: white;
  .info-grid {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    font-size: 0.85rem;
  }
  .tour-desc {
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 20px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    opacity: 0.9;
  }
  .price-section {
    margin-bottom: 20px;
    .price-label {
      font-size: 0.8rem;
      opacity: 0.7;
    }
    .price-value {
      font-size: 1.8rem;
      font-weight: 800;
      color: white;
    }
  }
  .btn-detail {
    width: 100%;
    background: white;
    color: #1d4ed8;
    border: none;
    padding: 14px;
    border-radius: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      background: #f8fafc;
      transform: scale(1.02);
    }
  }
}

// HORIZONTAL STYLE (TOUR LIST PAGE)
.tour-card-hz {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: auto;
  border: 1px solid #f1f5f9;
  font-family: 'Inter', sans-serif;
  @include md {
    flex-direction: row;
    height: 300px;
  }
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }
  &__image {
    position: relative;
    width: 100%;
    height: 220px;
    flex-shrink: 0;
    @include md {
      width: 340px;
      height: 100%;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__badge {
    position: absolute;
    top: 15px;
    left: 15px;
    background: #ef4444;
    color: white;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 800;
  }
  &__fav {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(255, 255, 255, 0.8);
    border: none;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748b;
  }
  &__content {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  &__tag {
    background: #eff6ff;
    color: #1d4ed8;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
  }
  &__rating {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #fbbf24;
    font-size: 0.9rem;
    font-weight: 700;
  }
  &__title {
    font-size: 1.35rem;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.3;
    margin-bottom: 6px;
  }
  &__code {
    font-size: 0.8rem;
    color: #64748b;
    margin-bottom: 15px;
  }
  &__info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      color: #475569;
      i {
        color: #3b82f6;
      }
    }
  }
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 15px;
    border-top: 1px dashed #e2e8f0;
  }
  &__price {
    .price-label {
      font-size: 0.75rem;
      color: #64748b;
      display: block;
    }
    .price-amount {
      font-size: 1.4rem;
      font-weight: 800;
      color: #1e293b;
    }
  }
  .btn-book {
    background: linear-gradient(135deg, #1d4ed8, #2563eb);
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
  }
}
</style>
