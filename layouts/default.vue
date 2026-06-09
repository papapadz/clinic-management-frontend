<template>
  <AppShell v-if="auth.token">
    <template #header>
      <slot name="header" />
    </template>
    <template #actions>
      <slot name="actions" />
    </template>
    <slot />
  </AppShell>
  <div v-else class="min-h-screen bg-background text-foreground">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
</script>
