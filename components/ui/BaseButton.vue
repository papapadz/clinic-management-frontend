<template>
  <component
    :is="href || to ? NuxtLink : 'button'"
    :to="to"
    :href="href"
    :type="!href && !to ? type : undefined"
    :disabled="disabled || loading"
    :class="buttonClass"
    v-bind="$attrs"
  >
    <component :is="icon" v-if="icon && !loading" class="h-4 w-4 shrink-0" aria-hidden="true" />
    <span
      v-if="loading"
      class="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NuxtLink } from '#components'
import type { Component } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  block?: boolean
  disabled?: boolean
  loading?: boolean
  icon?: Component | null
  to?: string
  href?: string
}>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  icon: null,
  to: undefined,
  href: undefined,
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80'
    case 'outline':
      return 'border border-border bg-background/80 text-foreground hover:border-primary/40 hover:bg-primary/5'
    case 'ghost':
      return 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    case 'danger':
      return 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90'
    default:
      return 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90'
  }
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 rounded-md px-3 text-xs'
    case 'lg':
      return 'h-11 rounded-lg px-5 text-base'
    case 'icon':
      return 'h-10 w-10 rounded-lg p-0'
    default:
      return 'h-10 rounded-lg px-4 text-sm'
  }
})

const buttonClass = computed(() => [
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100',
  variantClass.value,
  sizeClass.value,
  props.block ? 'w-full' : '',
])
</script>
