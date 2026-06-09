<template>
  <div class="space-y-1.5">
    <label :for="id" class="block text-sm font-semibold text-foreground">
      {{ label }}
    </label>
    <slot :has-error="errors.length > 0" />
    <p v-if="helper && errors.length === 0" class="text-xs text-muted-foreground">
      {{ helper }}
    </p>
    <p v-if="errors.length > 0" class="text-xs font-medium text-destructive">
      {{ errors[0] }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  id: string
  label: string
  helper?: string
  errors?: string[]
}>(), {
  helper: undefined,
  errors: () => [],
})
</script>
