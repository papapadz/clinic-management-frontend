<template>
  <div class="rounded-xl border border-border bg-card p-4">
    <div class="space-y-3">
      <div v-for="item in rows" :key="item" class="flex items-center gap-3">
        <div class="h-10 w-10 animate-pulse rounded-full bg-muted" />
        <div class="min-w-0 flex-1 space-y-2">
          <div class="h-3 w-2/3 animate-pulse rounded-full bg-muted" />
          <div class="h-3 w-1/3 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ rows?: number }>(), {
  rows: 5,
})
</script>
