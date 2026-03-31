<template>
  <div class="input-wrapper" :class="{ 'input-wrapper--error': error }">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>

    <div class="input-field" :class="{ 'input-field--has-icon-left': $slots['icon-left'], 'input-field--has-icon-right': $slots['icon-right'] || type === 'password' }">
      <span v-if="$slots['icon-left']" class="input-icon input-icon--left">
        <slot name="icon-left" />
      </span>

      <input
        :id="inputId"
        v-bind="$attrs"
        :type="showPassword ? 'text' : type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="input-element"
        @input="$emit('update:modelValue', $event.target.value)"
      />

      <button v-if="type === 'password'" type="button" class="input-icon input-icon--right input-toggle" @click="showPassword = !showPassword">
        {{ showPassword ? '🙈' : '👁️' }}
      </button>
      <span v-else-if="$slots['icon-right']" class="input-icon input-icon--right">
        <slot name="icon-right" />
      </span>
    </div>

    <p v-if="error" class="input-error">{{ error }}</p>
    <p v-else-if="hint" class="input-hint">{{ hint }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label:      { type: String, default: '' },
  placeholder:{ type: String, default: '' },
  type:       { type: String, default: 'text' },
  error:      { type: String, default: '' },
  hint:       { type: String, default: '' },
  disabled:   { type: Boolean, default: false },
  required:   { type: Boolean, default: false },
  id:         { type: String, default: '' },
})

defineEmits(['update:modelValue'])

const showPassword = ref(false)
const inputId = computed(() => props.id || `input-${Math.random().toString(36).slice(2, 7)}`)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &--error .input-element { border-color: $color-danger !important; }
}

.input-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-secondary;
}

.input-required { color: $color-danger; margin-left: 2px; }

.input-field {
  position: relative;

  &--has-icon-left .input-element  { padding-left: 2.75rem; }
  &--has-icon-right .input-element { padding-right: 2.75rem; }
}

.input-element {
  @include input-base;
}

.input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: $color-text-muted;
  display: flex;
  align-items: center;

  &--left  { left: $space-4; }
  &--right { right: $space-4; }
}

.input-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: $font-size-base;
  line-height: 1;
}

.input-error { font-size: $font-size-xs; color: $color-danger; }
.input-hint  { font-size: $font-size-xs; color: $color-text-muted; }
</style>
