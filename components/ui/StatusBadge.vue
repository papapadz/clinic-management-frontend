<template>
  <span :class="badgeClass">
    <span class="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
    {{ label ?? normalizeStatus(status) }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getStatusTone, normalizeStatus, type StatusTone } from '~/utils/status'

const props = defineProps<{
  status?: string | boolean | null
  label?: string
  tone?: StatusTone
}>()

const toneClass: Record<StatusTone, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
  warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  danger: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
  info: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300',
  neutral: 'border-border bg-muted text-muted-foreground',
}

const badgeClass = computed(() => [
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none',
  toneClass[props.tone ?? getStatusTone(props.status)],
])
</script>
