<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="modal" :class="`modal--${size}`">
          <div class="modal__header">
            <h3 class="modal__title">{{ title }}</h3>
            <button class="modal__close" @click="$emit('update:modelValue', false)">✕</button>
          </div>
          <div class="modal__body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title:      { type: String,  default: '' },
  size:       { type: String,  default: 'md' }, // sm | md | lg
})
defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  @include flex-center;
  padding: $space-4;
}

.modal {
  @include glass(rgba(15,15,26,0.9));
  border-radius: $border-radius-xl;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;

  &--sm { max-width: 400px; }
  &--md { max-width: 600px; }
  &--lg { max-width: 900px; }

  &__header {
    @include flex-between;
    padding: $space-6;
    border-bottom: 1px solid $color-border;
  }

  &__title {
    font-family: $font-heading;
    font-size: $font-size-xl;
    color: $color-text-primary;
  }

  &__close {
    background: none; border: none; cursor: pointer;
    color: $color-text-muted; font-size: $font-size-lg;
    padding: $space-1;
    transition: $transition-fast;
    &:hover { color: $color-text-primary; }
  }

  &__body { padding: $space-6; }

  &__footer {
    padding: $space-4 $space-6;
    border-top: 1px solid $color-border;
    display: flex;
    justify-content: flex-end;
    gap: $space-3;
  }
}

// Transition
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal, .modal-leave-active .modal { transition: transform 0.25s ease; }
.modal-enter-from .modal, .modal-leave-to .modal { transform: scale(0.95) translateY(-10px); }
</style>
