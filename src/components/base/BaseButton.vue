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
    background: $gradient-primary;
    color: #fff;
    box-shadow: 0 4px 14px rgba(35, 87, 137, 0.25);
    &:hover:not(:disabled) {
      box-shadow: $shadow-gradient;
      transform: translateY(-1px);
    }
  }

  &--accent {
    background: $color-accent;
    color: #fff;
    font-weight: $font-weight-bold;
    &:hover:not(:disabled) { box-shadow: $shadow-accent; transform: translateY(-1px); }
  }

  &--secondary {
    background: $color-bg-surface;
    color: $color-text-primary;
    border: 1px solid $color-border;
    &:hover:not(:disabled) { background: $color-border; }
  }

  &--ghost {
    background: transparent;
    color: $color-text-body;
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
