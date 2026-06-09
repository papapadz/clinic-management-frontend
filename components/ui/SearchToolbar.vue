<template>
  <div class="flex flex-col gap-3 rounded-xl border border-border/80 bg-card/80 p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
    <label class="relative min-w-0 flex-1 sm:max-w-md">
      <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <span class="sr-only">{{ label }}</span>
      <BaseInput
        :model-value="modelValue"
        type="search"
        class="pl-9"
        :placeholder="placeholder"
        @update:model-value="$emit('update:modelValue', $event)"
      />
    </label>
    <div class="flex shrink-0 flex-wrap items-center gap-2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'

withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  label?: string
}>(), {
  placeholder: 'Search',
  label: 'Search records',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
