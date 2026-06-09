<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Patient chart"
      :title="patient ? patientName(patient) : 'Patient chart'"
      :description="patient ? `${patient.patient_code} • ${patient.gender} • ${formatDate(patient.dob)}` : 'Review demographics and encounter history.'"
    >
      <template #actions>
        <BaseButton variant="outline" :to="`/${tenant}/patients`">Back</BaseButton>
        <BaseButton v-if="canCreateEncounter" :icon="Plus" @click="openCreateEncounter">
          New encounter
        </BaseButton>
      </template>
    </PageHeader>

    <div v-if="successMessage" class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      {{ errorMessage }}
    </div>

    <LoadingState v-if="loadingPatient" :rows="4" />

    <template v-else-if="patient">
      <section class="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article class="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-base font-bold text-foreground">Demographics</h2>
              <p class="mt-1 text-sm text-muted-foreground">Core patient identifiers used across visits and orders.</p>
            </div>
            <StatusBadge :status="patient.is_active" />
          </div>
          <dl class="mt-5 grid gap-4 sm:grid-cols-2">
            <div v-for="item in demographics" :key="item.label" class="rounded-lg bg-muted/45 p-3">
              <dt class="text-xs font-bold uppercase tracking-wide text-muted-foreground">{{ item.label }}</dt>
              <dd class="mt-1 text-sm font-semibold text-foreground">{{ item.value }}</dd>
            </div>
          </dl>
        </article>

        <article class="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 class="text-base font-bold text-foreground">Clinical flags</h2>
          <div class="mt-4 space-y-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-muted-foreground">Allergies</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <StatusBadge v-for="item in patient.allergies ?? []" :key="item" :status="item" tone="warning" />
                <span v-if="!patient.allergies?.length" class="text-sm text-muted-foreground">No allergies recorded</span>
              </div>
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-muted-foreground">Chronic conditions</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <StatusBadge v-for="item in patient.chronic_conditions ?? []" :key="item" :status="item" tone="info" />
                <span v-if="!patient.chronic_conditions?.length" class="text-sm text-muted-foreground">No chronic conditions recorded</span>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section class="space-y-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-lg font-bold text-foreground">Encounters</h2>
            <p class="text-sm text-muted-foreground">Open draft visits, review signed notes, and continue the clinical flow.</p>
          </div>
          <select v-model="statusFilter" class="field-input sm:w-44" aria-label="Filter encounter status">
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SIGNED">Signed</option>
            <option value="LOCKED">Locked</option>
          </select>
        </div>

        <DataTable
          :columns="encounterColumns"
          :rows="encounters"
          :loading="loadingEncounters"
          empty-title="No encounters yet"
          empty-description="Create the first encounter to begin SOAP notes and orders."
        >
          <template #cell-encounter_date="{ row }">
            <span class="font-semibold">{{ formatDateTime(row.encounter_date || row.created_at) }}</span>
          </template>
          <template #cell-chief_complaint="{ row }">
            <span class="text-muted-foreground">{{ row.chief_complaint || '-' }}</span>
          </template>
          <template #cell-status="{ row }">
            <StatusBadge :status="row.status" />
          </template>
          <template #cell-actions="{ row }">
            <BaseButton :to="encounterPath(row.id)" variant="outline" size="sm">Open</BaseButton>
          </template>
          <template #mobile-card="{ row }">
            <div class="flex items-start justify-between gap-3">
              <div>
                <NuxtLink :to="encounterPath(row.id)" class="font-bold text-primary">
                  {{ row.encounter_type }} encounter
                </NuxtLink>
                <p class="mt-1 text-xs text-muted-foreground">{{ formatDateTime(row.encounter_date || row.created_at) }}</p>
              </div>
              <StatusBadge :status="row.status" />
            </div>
            <p class="text-sm text-muted-foreground">{{ row.chief_complaint || 'No chief complaint recorded' }}</p>
          </template>
        </DataTable>
      </section>
    </template>

    <EmptyState
      v-else
      title="Patient not found"
      description="The patient record could not be loaded for this clinic."
    />

    <BaseDialog v-model:open="showCreateEncounter" title="New encounter" description="Start a draft clinical encounter for this patient.">
      <form class="space-y-5 p-5" @submit.prevent="submitEncounter">
        <div class="grid gap-4 md:grid-cols-2">
          <FormField id="encounter_type_code" label="Encounter type" :errors="fieldErrors('encounter_type_code')">
            <select id="encounter_type_code" v-model="encounterForm.encounter_type_code" class="field-input" required>
              <option value="">Select type</option>
              <option v-for="item in catalog.libraryOptions.value.encounter_type" :key="item.code" :value="item.code">
                {{ item.name }}
              </option>
            </select>
          </FormField>
          <FormField id="encounter_date" label="Encounter date" :errors="fieldErrors('encounter_date')">
            <BaseInput id="encounter_date" v-model="encounterForm.encounter_date" type="datetime-local" />
          </FormField>
        </div>
        <FormField id="chief_complaint" label="Chief complaint" :errors="fieldErrors('chief_complaint')">
          <textarea id="chief_complaint" v-model="encounterForm.chief_complaint" rows="3" class="field-input min-h-24" />
        </FormField>
        <div class="flex justify-end gap-2 border-t border-border pt-4">
          <BaseButton type="button" variant="outline" @click="showCreateEncounter = false">Cancel</BaseButton>
          <BaseButton type="submit" :loading="savingEncounter">Create draft</BaseButton>
        </div>
      </form>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import type { Patient } from '~/types'
import type { DataTableColumn } from '~/types/ui'
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'
import { useEncounter } from '~/composables/useEncounter'
import { useCatalogs } from '~/composables/useCatalogs'
import { formatLocalDateTimeInput } from '~/utils/format'

definePageMeta({
  middleware: ['auth', 'tenant'],
})

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const api = useApi()
const encounter = useEncounter()
const catalog = useCatalogs()

const tenant = computed(() => String(route.params.tenant))
const patientId = computed(() => String(route.params.id))
const patient = ref<Patient | null>(null)
const loadingPatient = ref(true)
const statusFilter = ref('')
const showCreateEncounter = ref(false)
const successMessage = ref('')
const patientError = ref<string | null>(null)

const encounterForm = reactive({
  encounter_type_code: '',
  chief_complaint: '',
  encounter_date: '',
})

const encounters = computed(() => encounter.encounters.value)
const loadingEncounters = computed(() => encounter.loading.value)
const savingEncounter = computed(() => encounter.saving.value)
const errorMessage = computed(() => patientError.value || encounter.error.value)
const permissions = computed(() => auth.user?.permissions ?? [])
const canCreateEncounter = computed(() => permissions.value.includes('encounters.create'))

const encounterColumns: DataTableColumn[] = [
  { key: 'encounter_date', label: 'Date' },
  { key: 'encounter_type', label: 'Type' },
  { key: 'chief_complaint', label: 'Chief complaint' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

const demographics = computed(() => {
  if (!patient.value) {
    return []
  }

  return [
    { label: 'Patient code', value: patient.value.patient_code },
    { label: 'Birth date', value: formatDate(patient.value.dob) },
    { label: 'Contact', value: patient.value.contact_number || '-' },
    { label: 'Email', value: patient.value.email || '-' },
    { label: 'Civil status', value: patient.value.civil_status || '-' },
    { label: 'Blood type', value: patient.value.blood_type || '-' },
  ]
})

async function loadPatient() {
  loadingPatient.value = true
  patientError.value = null
  try {
    const res = await api.api<Patient>(api.tenantPath(`/patients/${patientId.value}`))
    if (res.success) {
      patient.value = res.data
    } else {
      patientError.value = res.message || 'Failed to load patient'
    }
  } catch (e: any) {
    patientError.value = e.message || 'Failed to load patient'
  } finally {
    loadingPatient.value = false
  }
}

async function loadEncounters() {
  await encounter.fetchPatientEncounters(patientId.value, {
    status: statusFilter.value || undefined,
  })
}

async function submitEncounter() {
  const res = await encounter.createEncounter(patientId.value, {
    encounter_type_code: encounterForm.encounter_type_code,
    chief_complaint: optional(encounterForm.chief_complaint),
    encounter_date: optional(encounterForm.encounter_date),
    status: 'DRAFT',
  })

  if (!res.success) {
    return
  }

  showCreateEncounter.value = false
  successMessage.value = 'Encounter draft created.'
  resetEncounterForm()
  await loadEncounters()
  await router.push(encounterPath(res.data.id))
}

function openCreateEncounter() {
  resetEncounterForm()
  showCreateEncounter.value = true
}

function resetEncounterForm() {
  encounterForm.encounter_type_code = catalog.libraryOptions.value.encounter_type[0]?.code ?? ''
  encounterForm.chief_complaint = ''
  encounterForm.encounter_date = formatLocalDateTimeInput()
}

function fieldErrors(field: string): string[] {
  return encounter.validationErrors.value?.[field] ?? []
}

function encounterPath(encounterId: string | number): string {
  return `/${tenant.value}/patients/${patientId.value}/encounters/${encounterId}`
}

function patientName(value: Patient): string {
  return value.full_name || [value.first_name, value.middle_name, value.last_name].filter(Boolean).join(' ')
}

function optional(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

function formatDate(value?: string): string {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(value))
}

function formatDateTime(value?: string): string {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

watch(statusFilter, loadEncounters)

onMounted(async () => {
  await Promise.all([loadPatient(), loadEncounters(), catalog.fetchOptions('encounter_type')])
  resetEncounterForm()
})
</script>

<style scoped>
.field-input {
  @apply h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-ring/15;
}
</style>
