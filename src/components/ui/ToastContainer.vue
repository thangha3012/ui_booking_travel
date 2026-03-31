<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast" tag="div" class="toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast--${toast.type}`]"
          @click="remove(toast.id)"
        >
          <span class="toast__icon">{{ icons[toast.type] }}</span>
          <span class="toast__message">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()

const icons = {
  success: '✅',
  error:   '❌',
  info:    'ℹ️',
  warning: '⚠️',
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.toast-container {
  position: fixed;
  top: $space-6;
  right: $space-6;
  z-index: 9999;
  pointer-events: none;
}

.toast-list { display: flex; flex-direction: column; gap: $space-3; }

.toast {
  @include glass(rgba(15,15,26,0.95));
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-4 $space-5;
  border-radius: $border-radius-lg;
  min-width: 300px;
  max-width: 420px;
  cursor: pointer;
  pointer-events: all;
  box-shadow: $shadow-lg;

  &--success { border-left: 3px solid $color-success; }
  &--error   { border-left: 3px solid $color-danger; }
  &--warning { border-left: 3px solid $color-warning; }
  &--info    { border-left: 3px solid $color-gradient-start; }

  &__icon { font-size: $font-size-lg; flex-shrink: 0; }
  &__message { font-size: $font-size-sm; color: $color-text-primary; line-height: 1.4; }
}

// Transitions
.toast-enter-active { animation: toast-in 0.3s ease both; }
.toast-leave-active { animation: toast-in 0.2s ease reverse both; position: absolute; right: 0; }
.toast-move         { transition: transform 0.3s ease; }

@keyframes toast-in {
  from { opacity: 0; transform: translateX(100%); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>
