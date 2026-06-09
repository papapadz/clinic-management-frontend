<template>
  <input
    :value="modelValue"
    :class="[
      'h-10 w-full rounded-lg border border-input bg-background/90 px-3 text-sm text-foreground shadow-sm outline-none transition duration-150 placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none',
      hasError ? 'border-destructive/60 focus:border-destructive focus:ring-destructive/10' : '',
    ]"
    v-bind="$attrs"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  >
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string | number
  hasError?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
