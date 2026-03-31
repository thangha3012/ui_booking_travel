<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--loading': loading, 'btn--block': block }]"
    :disabled="disabled || loading"
    :type="type"
    v-bind="$attrs"
  >
    <span v-if="loading" class="btn__spinner" />
    <span v-if="$slots.icon && !loading" class="btn__icon"><slot name="icon" /></span>
    <span class="btn__label"><slot /></span>
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | ghost | danger | accent
  size:    { type: String, default: 'md' },       // sm | md | lg
  type:    { type: String, default: 'button' },
  loading: { type: Boolean, default: false },
  disabled:{ type: Boolean, default: false },
  block:   { type: Boolean, default: false },
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.btn {
  @include btn-base;
  position: relative;

  // --- SIZES ---
  &--sm { padding: $space-2 $space-4;  font-size: $font-size-xs; }
  &--md { padding: $space-3 $space-6;  font-size: $font-size-sm; }
  &--lg { padding: $space-4 $space-8;  font-size: $font-size-base; }

  // --- VARIANTS ---
  &--primary {
    background: linear-gradient(135deg, $color-gradient-start, $color-gradient-end);
    color: #fff;
    &:hover:not(:disabled) {
      box-shadow: $shadow-gradient;
      filter: brightness(1.1);
    }
  }

  &--accent {
    background: $color-accent;
    color: $color-primary;
    font-weight: $font-weight-bold;
    &:hover:not(:disabled) { box-shadow: $shadow-accent; filter: brightness(1.1); }
  }

  &--secondary {
    background: $color-bg-surface-hover;
    color: $color-text-primary;
    border: 1px solid $color-border;
    &:hover:not(:disabled) { background: rgba(255,255,255,0.12); }
  }

  &--ghost {
    background: transparent;
    color: $color-text-secondary;
    &:hover:not(:disabled) { color: $color-text-primary; background: $color-bg-surface; }
  }

  &--danger {
    background: $color-danger;
    color: #fff;
    &:hover:not(:disabled) { filter: brightness(1.1); }
  }

  &--block { width: 100%; }

  // Spinner
  &__spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  &__icon { display: flex; align-items: center; }

  @keyframes spin { to { transform: rotate(360deg); } }
}
</style>
