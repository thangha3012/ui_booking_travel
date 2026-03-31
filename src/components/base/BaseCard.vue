<template>
  <div class="card" :class="[`card--${variant}`, { 'card--hoverable': hoverable }]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  variant:  { type: String, default: 'glass' }, // glass | solid | bordered
  hoverable:{ type: Boolean, default: false },
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.card {
  border-radius: $border-radius-lg;
  overflow: hidden;

  &--glass {
    @include glass;
  }

  &--solid {
    background: lighten(#0F0F1A, 5%);
    border: 1px solid $color-border;
  }

  &--bordered {
    background: transparent;
    border: 1px solid $color-border;
  }

  &--hoverable {
    @include card-hover;
    cursor: pointer;
  }
}
</style>
