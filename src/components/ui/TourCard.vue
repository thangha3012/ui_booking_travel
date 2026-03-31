<template>
  <RouterLink :to="`/tours/${tour.id}`" class="tour-card">
    <!-- Thumbnail -->
    <div class="tour-card__thumb">
      <img
        :src="tour.coverImage || defaultImage"
        :alt="tour.title"
        class="tour-card__img"
        loading="lazy"
      />
      <div class="tour-card__thumb-overlay" />

      <!-- Status Badge -->
      <span :class="['tour-card__badge', `tour-card__badge--${tour.status}`]">
        {{ t(`tour.status.${statusKey(tour.status)}`) }}
      </span>

      <!-- Wishlist btn -->
      <button class="tour-card__wishlist" @click.prevent="toggleWishlist">
        {{ isWishlisted ? '❤️' : '🤍' }}
      </button>
    </div>

    <!-- Info -->
    <div class="tour-card__body">
      <div class="tour-card__meta">
        <span class="tour-card__dest">📍 {{ tour.destinationName }}</span>
        <span class="tour-card__category">{{ tour.categoryName }}</span>
      </div>

      <h3 class="tour-card__title">{{ tour.title }}</h3>

      <div class="tour-card__details">
        <span class="detail-item" v-if="minSchedule">
          📅 {{ formatDate(minSchedule.departureDate) }}
        </span>
        <span class="detail-item" v-if="durationDays">
          ⏱ {{ durationDays }} {{ t('tour.days') }}
        </span>
        <span class="detail-item" v-if="minSchedule">
          💺 {{ minSchedule.availableSeats }} {{ t('tour.seats') }}
        </span>
      </div>

      <div class="tour-card__footer">
        <div class="tour-card__price">
          <span class="price-from">{{ t('tour.from') }}</span>
          <span class="price-value">{{ formatCurrency(minPrice) }}</span>
          <span class="price-per">{{ t('tour.perPerson') }}</span>
        </div>
        <span class="tour-card__cta">{{ t('tour.viewDetail') }} →</span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatCurrency, formatDate, daysBetween } from '@/utils/formatters'

const { t } = useI18n()

const props = defineProps({
  tour: { type: Object, required: true },
})

const defaultImage = 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80'
const isWishlisted = ref(false)

function toggleWishlist() { isWishlisted.value = !isWishlisted.value }

// Lịch khởi hành sớm nhất còn vé
const minSchedule = computed(() => {
  if (!props.tour.schedules?.length) return null
  return props.tour.schedules
    .filter(s => s.availableSeats > 0 && s.isActive)
    .sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate))[0] || null
})

// Giá thấp nhất
const minPrice = computed(() => {
  if (!minSchedule.value?.pricings?.length) return 0
  return Math.min(...minSchedule.value.pricings.map(p => p.price))
})

// Số ngày tour
const durationDays = computed(() => {
  if (!minSchedule.value) return null
  return daysBetween(minSchedule.value.departureDate, minSchedule.value.returnDate)
})

function statusKey(status) {
  const map = { 1: 'draft', 2: 'published', 3: 'archived' }
  return map[status] || 'draft'
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.tour-card {
  display: block;
  text-decoration: none;
  border-radius: $border-radius-lg;
  overflow: hidden;
  @include glass;
  transition: $transition-base;

  &:hover {
    transform: translateY(-6px);
    box-shadow: $shadow-lg;
    border-color: rgba(212,175,55,0.2);
  }

  &:hover .tour-card__img { transform: scale(1.06); }

  // ---- THUMBNAIL ----
  &__thumb {
    position: relative;
    height: 220px;
    overflow: hidden;
  }

  &__img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  &__thumb-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%);
  }

  &__badge {
    position: absolute;
    top: $space-3; left: $space-3;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    padding: 3px $space-3;
    border-radius: $border-radius-full;

    &--1 { background: rgba(100,100,100,0.8); color: #ccc; }        // Draft
    &--2 { background: rgba(16,185,129,0.85); color: #fff; }         // Published
    &--3 { background: rgba(100,100,100,0.8); color: #ccc; }        // Archived
  }

  &__wishlist {
    position: absolute;
    top: $space-3; right: $space-3;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(8px);
    border: none; cursor: pointer;
    width: 32px; height: 32px;
    border-radius: 50%;
    font-size: $font-size-base;
    transition: $transition-fast;
    &:hover { transform: scale(1.2); }
  }

  // ---- BODY ----
  &__body { padding: $space-5; }

  &__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-3;
  }

  &__dest {
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__category {
    font-size: $font-size-xs;
    color: $color-accent;
    background: rgba(212,175,55,0.1);
    border: 1px solid rgba(212,175,55,0.2);
    padding: 2px $space-2;
    border-radius: $border-radius-full;
  }

  &__title {
    font-family: $font-heading;
    font-size: $font-size-lg;
    color: $color-text-primary;
    margin-bottom: $space-3;
    @include truncate(2);
    line-height: 1.4;
  }

  &__details {
    display: flex;
    flex-wrap: wrap;
    gap: $space-3;
    margin-bottom: $space-4;
  }

  &__footer {
    @include flex-between;
    padding-top: $space-4;
    border-top: 1px solid $color-border;
  }

  &__price {
    @include flex-col;
    gap: 2px;
  }

  &__cta {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-accent;
    transition: $transition-fast;

    .tour-card:hover & { letter-spacing: 0.05em; }
  }
}

.detail-item {
  font-size: $font-size-xs;
  color: $color-text-secondary;
  display: flex;
  align-items: center;
  gap: 4px;
}

.price-from { font-size: $font-size-xs; color: $color-text-muted; }
.price-value {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-accent;
  font-family: $font-heading;
}
.price-per { font-size: $font-size-xs; color: $color-text-muted; }
</style>
