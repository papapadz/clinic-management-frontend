<template>
  <div class="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/70 px-6 py-10 text-center">
    <div class="mb-4 rounded-2xl bg-primary/10 p-4 text-primary">
      <component :is="icon ?? Inbox" class="h-7 w-7" aria-hidden="true" />
    </div>
    <h2 class="text-base font-bold text-foreground">{{ title }}</h2>
    <p v-if="description" class="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
      {{ description }}
    </p>
    <div v-if="$slots.actions" class="mt-5 flex flex-wrap justify-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'
import type { Component } from 'vue'

defineProps<{
  title: string
  description?: string
  icon?: Component
}>()
</script>
