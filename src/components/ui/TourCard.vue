<template>
  <RouterLink :to="`/tours/${tour.id}`" class="tour-card" :class="`tour-card--${variant}`">
    <!-- Background Image -->
    <img
      :src="tour.imageUrl || defaultImage"
      :alt="tour.title"
      class="tour-card__img"
      loading="lazy"
    />
    
    <!-- Gradient Overlay for text readability at the bottom -->
    <div class="tour-card__overlay"></div>
    <div class="tour-card__hover-overlay"></div>

    <!-- Rating Badge (Top Left) -->
    <div class="tour-card__badge">
      {{ tour.rating ? tour.rating.toFixed(1) : '5.0' }}
    </div>

    <!-- Offer text (Optional, if it's an offer card) -->
    <div class="tour-card__offer" v-if="tour.discountPercentage">
      {{ tour.discountPercentage }}% Off on First Travel
    </div>

    <!-- Content (Bottom) -->
    <div class="tour-card__content">
      <h3 class="tour-card__title">{{ tour.title }}</h3>
      <p class="tour-card__subtitle">
        {{ tour.destinationName || 'Destination' }}, 100 Trips
      </p>

      <!-- If we want to display a Book Now button for specific variants like Figma shows -->
      <button class="tour-card__btn" v-if="variant === 'offer'">
        Book Now
      </button>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tour: { type: Object, required: true },
  variant: { type: String, default: 'normal' } // normal, large, wide, offer
})

const defaultImage = 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80'
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.tour-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: $border-radius-xl;
  overflow: hidden;
  text-decoration: none;
  background: $color-bg-dark; // fallback
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  height: 380px;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    .tour-card__img { transform: scale(1.05); }
  }

  // Variants for masonry layout
  &--large {
    grid-row: span 2;
    height: 100%;
    min-height: 500px;
  }
  
  &--wide {
    grid-column: span 1;
    @include md { grid-column: span 2; }
    height: 380px;
  }

  // Figma has a specific dark card "It will be the best experience"
  &--offer {
    background: #0A2342; // Deep blue
    .tour-card__img, .tour-card__overlay { display: none; }
    justify-content: center;
    padding: $space-8;
    .tour-card__title { font-size: $font-size-2xl; margin-bottom: $space-6; }
  }

  // Image & Overlay
  &__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
    transition: transform 0.8s ease;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: linear-gradient(to top, rgba(0,30,60,0.9) 0%, rgba(0,30,60,0.2) 50%, rgba(0,0,0,0) 100%);
  }

  &__hover-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: rgba($color-primary, 0.4);
    opacity: 0;
    transition: opacity 0.4s ease;
    .tour-card:hover & { opacity: 1; }
  }

  // Rating Badge
  &__badge {
    position: absolute;
    top: $space-4;
    left: $space-4;
    z-index: 3;
    background: rgba(10, 35, 66, 0.85); // Dark blue badge
    color: white;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    padding: 6px 12px;
    border-radius: $border-radius-full;
    backdrop-filter: blur(4px);
  }

  &__offer {
    position: absolute;
    top: 30%;
    left: $space-8;
    z-index: 3;
    color: #FF6B35;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
  }

  // Content
  &__content {
    position: relative;
    z-index: 3;
    padding: $space-6;
    color: white;
    
    .tour-card--offer & {
      padding: 0;
    }
  }

  &__title {
    font-family: $font-heading;
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    margin-bottom: $space-1;
    line-height: 1.3;
  }

  &__subtitle {
    font-size: $font-size-xs;
    color: rgba(255,255,255,0.7);
  }

  &__btn {
    margin-top: $space-6;
    background: #FF6B35;
    color: white;
    border: none;
    border-radius: $border-radius-sm;
    padding: 10px 24px;
    font-weight: $font-weight-bold;
    cursor: pointer;
    transition: $transition-fast;

    &:hover { background: #e55a28; }
  }
}
</style>
