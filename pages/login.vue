<template>
  <div class="space-y-6">
    <div>
      <p class="text-sm font-bold uppercase tracking-[0.18em] text-primary">Welcome back</p>
      <h1 class="mt-2 text-3xl font-bold tracking-normal">Sign in to {{ config.public.appName }}</h1>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">Open your clinic workspace and continue today’s patient flow.</p>
    </div>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <FormField id="email" label="Email address">
        <BaseInput
          id="email"
          v-model="email"
          type="email"
          required
          autocomplete="email"
          placeholder="you@clinic.test"
        />
      </FormField>

      <FormField id="password" label="Password">
        <BaseInput
          id="password"
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          placeholder="Enter your password"
        />
      </FormField>

      <div v-if="error" class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
        {{ error }}
      </div>

      <BaseButton type="submit" block :loading="loading">
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </BaseButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useTenantStore } from '~/stores/tenant'
import { useRouter } from 'vue-router'
import type { ApiResponse, AuthTokenResponse } from '~/types'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const auth = useAuthStore()
const tenantStore = useTenantStore()
const router = useRouter()
const config = useRuntimeConfig()

definePageMeta({
  layout: 'auth',
})

async function onSubmit() {
  loading.value = true
  error.value = null
  try {
    const res = await $fetch<ApiResponse<AuthTokenResponse>>(`${config.public.apiBaseUrl}/api/login`, {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    })

    if (res.success && res.data) {
      auth.setAuth(res.data)

      if (res.data.tenant) {
        tenantStore.setTenant(res.data.tenant)
      }

      const tenantSlug = res.data.tenant?.slug ?? config.public.defaultTenant
      router.push(`/${tenantSlug}/dashboard`)
    } else {
      error.value = res.message || 'Invalid credentials'
    }
  } catch (e: any) {
    error.value = e?.data?.message || e.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
