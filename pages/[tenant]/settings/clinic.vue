<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Settings"
      title="Clinic Profile"
      description="Manage the legal entity and default clinic identity used across the workspace."
    />

    <div v-if="error || successMessage" :class="error ? 'border-destructive/30 bg-destructive/10 text-destructive' : 'border-emerald-200 bg-emerald-50 text-emerald-800'" class="rounded-lg border px-4 py-3 text-sm font-medium">
      {{ error || successMessage }}
    </div>
    <div v-if="loading" class="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground">
      Loading clinic profile...
    </div>

    <section class="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div class="mb-5 flex flex-col gap-1">
        <h2 class="text-lg font-bold text-foreground">Legal entity</h2>
        <p class="text-sm text-muted-foreground">Tenant routing identity is restricted to global administrators.</p>
      </div>

      <form class="grid gap-4 md:grid-cols-3" @submit.prevent="saveProfile">
        <FormField id="tenant_name" label="Name" :errors="fieldErrors('tenant.name')">
          <BaseInput id="tenant_name" v-model="form.tenant.name" :has-error="fieldErrors('tenant.name').length > 0" />
        </FormField>
        <FormField id="tenant_slug" label="Slug" :errors="fieldErrors('tenant.slug')">
          <BaseInput id="tenant_slug" v-model="form.tenant.slug" :disabled="!isSuperAdmin" :has-error="fieldErrors('tenant.slug').length > 0" />
        </FormField>
        <FormField id="tenant_status" label="Status" :errors="fieldErrors('tenant.status')">
          <select
            id="tenant_status"
            v-model="form.tenant.status"
            :disabled="!isSuperAdmin"
            class="h-10 w-full rounded-lg border border-input bg-background/90 px-3 text-sm text-foreground shadow-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </FormField>

        <div class="flex justify-end md:col-span-3">
          <BaseButton type="submit" :loading="saving">Save profile</BaseButton>
        </div>
      </form>
    </section>

    <section class="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div class="mb-5 flex flex-col gap-1">
        <h2 class="text-lg font-bold text-foreground">Default clinic</h2>
        <p class="text-sm text-muted-foreground">{{ defaultClinicHelper }}</p>
      </div>

      <form class="grid gap-4 md:grid-cols-2" @submit.prevent="saveProfile">
        <FormField id="clinic_name" label="Name" :errors="fieldErrors('default_clinic.name')">
          <BaseInput id="clinic_name" v-model="form.default_clinic.name" :disabled="!hasDefaultClinic" :has-error="fieldErrors('default_clinic.name').length > 0" />
        </FormField>
        <FormField id="clinic_contact" label="Contact number" :errors="fieldErrors('default_clinic.contact_number')">
          <BaseInput id="clinic_contact" v-model="form.default_clinic.contact_number" :disabled="!hasDefaultClinic" :has-error="fieldErrors('default_clinic.contact_number').length > 0" />
        </FormField>
        <FormField id="clinic_email" label="Email" :errors="fieldErrors('default_clinic.email')">
          <BaseInput id="clinic_email" v-model="form.default_clinic.email" type="email" :disabled="!hasDefaultClinic" :has-error="fieldErrors('default_clinic.email').length > 0" />
        </FormField>
        <FormField id="clinic_website" label="Website" :errors="fieldErrors('default_clinic.website')">
          <BaseInput id="clinic_website" v-model="form.default_clinic.website" type="url" :disabled="!hasDefaultClinic" :has-error="fieldErrors('default_clinic.website').length > 0" />
        </FormField>
        <FormField id="clinic_address" label="Address" class="md:col-span-2" :errors="fieldErrors('default_clinic.address')">
          <textarea
            id="clinic_address"
            v-model="form.default_clinic.address"
            :disabled="!hasDefaultClinic"
            class="min-h-20 w-full rounded-lg border border-input bg-background/90 px-3 py-2 text-sm shadow-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </FormField>

        <div class="grid gap-4 md:col-span-2 md:grid-cols-3">
          <FormField id="theme_primary" label="Primary" :errors="fieldErrors('default_clinic.theme.primary')">
            <div class="flex gap-2">
              <input id="theme_primary" v-model="form.default_clinic.theme.primary" type="color" :disabled="!hasDefaultClinic" class="h-10 w-12 rounded border border-input bg-background disabled:opacity-60">
              <BaseInput v-model="form.default_clinic.theme.primary" :disabled="!hasDefaultClinic" :has-error="fieldErrors('default_clinic.theme.primary').length > 0" />
            </div>
          </FormField>
          <FormField id="theme_secondary" label="Secondary" :errors="fieldErrors('default_clinic.theme.secondary')">
            <div class="flex gap-2">
              <input id="theme_secondary" v-model="form.default_clinic.theme.secondary" type="color" :disabled="!hasDefaultClinic" class="h-10 w-12 rounded border border-input bg-background disabled:opacity-60">
              <BaseInput v-model="form.default_clinic.theme.secondary" :disabled="!hasDefaultClinic" :has-error="fieldErrors('default_clinic.theme.secondary').length > 0" />
            </div>
          </FormField>
          <FormField id="theme_accent" label="Accent" :errors="fieldErrors('default_clinic.theme.accent')">
            <div class="flex gap-2">
              <input id="theme_accent" v-model="form.default_clinic.theme.accent" type="color" :disabled="!hasDefaultClinic" class="h-10 w-12 rounded border border-input bg-background disabled:opacity-60">
              <BaseInput v-model="form.default_clinic.theme.accent" :disabled="!hasDefaultClinic" :has-error="fieldErrors('default_clinic.theme.accent').length > 0" />
            </div>
          </FormField>
        </div>

        <div class="md:col-span-2">
          <div class="overflow-hidden rounded-lg border border-border">
            <div class="flex items-center justify-between gap-4 px-4 py-3" :style="{ borderTop: `4px solid ${safePreviewPrimary}` }">
              <div class="min-w-0">
                <p class="truncate text-sm font-bold">{{ form.tenant.name || 'Clinic' }}</p>
                <p class="truncate text-xs text-muted-foreground">{{ form.default_clinic.name || 'Default clinic' }}</p>
              </div>
              <span class="rounded-md px-3 py-1 text-xs font-bold" :style="{ backgroundColor: safePreviewAccent, color: '#111827' }">Preview</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end md:col-span-2">
          <BaseButton type="submit" :loading="saving">Save profile</BaseButton>
        </div>
      </form>
    </section>

    <section class="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div class="mb-5 flex flex-col gap-1">
        <h2 class="text-lg font-bold text-foreground">Logo</h2>
        <p class="text-sm text-muted-foreground">{{ defaultClinicHelper }}</p>
      </div>

      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-20 w-20 items-center justify-center rounded-lg border border-border bg-muted/40">
            <img v-if="logoPreview" :src="logoPreview" alt="" class="max-h-16 max-w-16 object-contain">
            <span v-else class="text-xs font-bold text-muted-foreground">No logo</span>
          </div>
          <div>
            <p class="text-sm font-bold text-foreground">{{ profile?.default_clinic?.logo?.original_name || selectedLogo?.name || 'Default clinic logo' }}</p>
            <p class="mt-1 text-xs text-muted-foreground">PNG, JPEG, or WebP up to 2 MB.</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <label class="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-background/80 px-4 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-primary/5" :class="{ 'pointer-events-none opacity-50': !hasDefaultClinic || logoSaving }">
            Choose file
            <input class="sr-only" type="file" accept="image/png,image/jpeg,image/webp" :disabled="!hasDefaultClinic || logoSaving" @change="selectLogo">
          </label>
          <BaseButton :disabled="!selectedLogo || !hasDefaultClinic" :loading="logoSaving" @click="uploadLogo">Upload</BaseButton>
          <BaseButton variant="danger" :disabled="!profile?.default_clinic?.logo && !selectedLogo" :loading="logoSaving" @click="deleteLogo">Remove</BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ClinicProfileResponse } from '~/types'
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'
import { useTenantStore } from '~/stores/tenant'
import { applyClinicTheme, isFullHexColor } from '~/utils/clinicTheme'

definePageMeta({ middleware: ['auth', 'tenant'] })

const route = useRoute()
const router = useRouter()
const api = useApi()
const auth = useAuthStore()
const tenantStore = useTenantStore()
const profile = ref<ClinicProfileResponse | null>(null)
const loading = ref(false)
const saving = ref(false)
const logoSaving = ref(false)
const error = ref('')
const successMessage = ref('')
const validationErrors = ref<Record<string, string[]> | null>(null)
const selectedLogo = ref<File | null>(null)
const localLogoPreview = ref<string | null>(null)

const form = reactive({
  tenant: {
    name: '',
    slug: '',
    status: 'active',
  },
  default_clinic: {
    name: '',
    address: '',
    contact_number: '',
    email: '',
    website: '',
    theme: {
      primary: '#0F766E',
      secondary: '#F8FAFC',
      accent: '#F59E0B',
    },
  },
})

const isSuperAdmin = computed(() => auth.user?.roles?.includes('super_admin') ?? false)
const hasDefaultClinic = computed(() => Boolean(profile.value?.default_clinic))
const defaultClinicHelper = computed(() => hasDefaultClinic.value ? 'Default branch identity and branding.' : 'Configure a default clinic in branch management before editing this section.')
const tenantSlug = computed(() => String(route.params.tenant))
const logoPreview = computed(() => localLogoPreview.value || profile.value?.default_clinic?.logo_url || '')
const safePreviewPrimary = computed(() => isFullHexColor(form.default_clinic.theme.primary) ? form.default_clinic.theme.primary : '#0F766E')
const safePreviewAccent = computed(() => isFullHexColor(form.default_clinic.theme.accent) ? form.default_clinic.theme.accent : '#F59E0B')

onMounted(loadProfile)

async function loadProfile() {
  loading.value = true
  error.value = ''
  const res = await api.api<ClinicProfileResponse>(`/api/v1/${tenantSlug.value}/settings/clinic-profile`)
  loading.value = false

  if (!res.success) {
    error.value = res.message || 'Clinic profile could not be loaded.'
    return
  }

  syncProfile(res.data)
}

async function saveProfile() {
  saving.value = true
  error.value = ''
  successMessage.value = ''
  validationErrors.value = null

  const body: Record<string, unknown> = {
    tenant: {
      name: form.tenant.name,
      ...(isSuperAdmin.value ? { slug: form.tenant.slug, status: form.tenant.status } : {}),
    },
  }

  if (hasDefaultClinic.value) {
    body.default_clinic = {
      name: form.default_clinic.name,
      address: form.default_clinic.address,
      contact_number: form.default_clinic.contact_number,
      email: form.default_clinic.email,
      website: form.default_clinic.website,
      theme: { ...form.default_clinic.theme },
    }
  }

  const res = await api.api<ClinicProfileResponse>(`/api/v1/${tenantSlug.value}/settings/clinic-profile`, {
    method: 'PATCH',
    body,
  })
  saving.value = false

  if (!res.success) {
    validationErrors.value = res.errors
    error.value = res.message || 'Clinic profile could not be saved.'
    return
  }

  const previousSlug = tenantSlug.value
  syncProfile(res.data)
  successMessage.value = res.message || 'Clinic profile saved.'

  if (previousSlug !== res.data.tenant.slug) {
    await router.replace(`/${res.data.tenant.slug}/settings/clinic`)
  }
}

function selectLogo(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  selectedLogo.value = file
  localLogoPreview.value = file ? URL.createObjectURL(file) : null
}

async function uploadLogo() {
  if (!selectedLogo.value) {
    return
  }

  logoSaving.value = true
  error.value = ''
  successMessage.value = ''
  validationErrors.value = null

  const formData = new FormData()
  formData.append('logo', selectedLogo.value)
  const res = await api.api<ClinicProfileResponse>(`/api/v1/${tenantSlug.value}/settings/clinic-profile/logo`, {
    method: 'POST',
    body: formData,
  })
  logoSaving.value = false

  if (!res.success) {
    validationErrors.value = res.errors
    error.value = res.message || 'Logo could not be uploaded.'
    return
  }

  selectedLogo.value = null
  localLogoPreview.value = null
  syncProfile(res.data)
  successMessage.value = res.message || 'Logo uploaded.'
}

async function deleteLogo() {
  logoSaving.value = true
  error.value = ''
  successMessage.value = ''
  const res = await api.api<ClinicProfileResponse>(`/api/v1/${tenantSlug.value}/settings/clinic-profile/logo`, {
    method: 'DELETE',
  })
  logoSaving.value = false

  if (!res.success) {
    error.value = res.message || 'Logo could not be removed.'
    return
  }

  selectedLogo.value = null
  localLogoPreview.value = null
  syncProfile(res.data)
  successMessage.value = res.message || 'Logo removed.'
}

function syncProfile(nextProfile: ClinicProfileResponse) {
  profile.value = nextProfile
  tenantStore.setClinicProfile(nextProfile)
  Object.assign(form.tenant, {
    name: nextProfile.tenant.name,
    slug: nextProfile.tenant.slug,
    status: nextProfile.tenant.status,
  })

  Object.assign(form.default_clinic, {
    name: nextProfile.default_clinic?.name ?? '',
    address: nextProfile.default_clinic?.address ?? '',
    contact_number: nextProfile.default_clinic?.contact_number ?? '',
    email: nextProfile.default_clinic?.email ?? '',
    website: nextProfile.default_clinic?.website ?? '',
    theme: {
      primary: nextProfile.default_clinic?.theme?.primary ?? '#0F766E',
      secondary: nextProfile.default_clinic?.theme?.secondary ?? '#F8FAFC',
      accent: nextProfile.default_clinic?.theme?.accent ?? '#F59E0B',
    },
  })
  applyClinicTheme(nextProfile.default_clinic?.theme)
}

function fieldErrors(field: string): string[] {
  return validationErrors.value?.[field] ?? []
}
</script>
