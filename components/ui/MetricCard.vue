<template>
  <section
    v-motion
    :initial="{ opacity: 0, y: 14 }"
    :enter="{ opacity: 1, y: 0, transition: { delay, duration: 260 } }"
    class="group overflow-hidden rounded-xl border border-border/80 bg-card p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none"
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm font-medium text-muted-foreground">{{ label }}</p>
        <div class="mt-2 flex items-end gap-2">
          <span v-if="loading" class="h-8 w-20 animate-pulse rounded-md bg-muted" />
          <p v-else class="text-3xl font-bold tracking-normal text-foreground">{{ value }}</p>
        </div>
      </div>
      <div :class="iconClass">
        <component :is="icon" class="h-5 w-5" aria-hidden="true" />
      </div>
    </div>
    <p v-if="helper" class="mt-3 text-sm text-muted-foreground">{{ helper }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

const props = withDefaults(defineProps<{
  label: string
  value: string | number
  helper?: string
  icon: Component
  tone?: 'primary' | 'success' | 'warning' | 'danger'
  loading?: boolean
  delay?: number
}>(), {
  tone: 'primary',
  delay: 0,
  helper: undefined,
})

const iconClass = computed(() => {
  const tones = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  }

  return ['rounded-xl p-3 transition duration-200 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100', tones[props.tone]]
})
</script>
