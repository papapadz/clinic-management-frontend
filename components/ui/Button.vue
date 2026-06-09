<template>
  <button
    :type="type"
    :class="[
      'btn',
      variantClass,
      sizeClass,
      { 'btn-block': block, 'btn-disabled': disabled },
      customClass,
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: string
  size?: string
  block?: boolean
  disabled?: boolean
  customClass?: string
}>()

const variantClass = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'btn-secondary'
    case 'outline':
      return 'btn-outline'
    case 'ghost':
      return 'btn-ghost'
    case 'danger':
      return 'btn-danger'
    default:
      return 'btn-primary'
  }
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'btn-sm'
    case 'lg':
      return 'btn-lg'
    default:
      return ''
  }
})
</script>