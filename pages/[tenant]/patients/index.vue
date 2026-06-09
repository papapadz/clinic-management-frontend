<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Patient registry"
      title="Patients"
      :description="`Search, review, and register patient records. ${metaSummary}`"
    >
      <template #actions>
        <BaseButton v-if="canCreatePatients" :icon="UserPlus" @click="openCreateModal">
          Add patient
        </BaseButton>
      </template>
    </PageHeader>

    <div v-if="successMessage" class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {{ successMessage }}
    </div>
    <div v-if="error" class="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {{ error }}
    </div>

    <SearchToolbar v-model="search" placeholder="Search by name, code, email, or contact" label="Search patients">
      <select
        v-model.number="perPage"
        class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-ring/15 sm:w-32"
        aria-label="Rows per page"
      >
        <option :value="10">10 rows</option>
        <option :value="20">20 rows</option>
        <option :value="50">50 rows</option>
      </select>
    </SearchToolbar>

    <DataTable
      :columns="patientColumns"
      :rows="patients"
      :loading="loading"
      :empty-title="search ? 'No matching patients' : 'No patients yet'"
      :empty-description="search ? 'Try a different search term.' : 'New patient records will appear here after registration.'"
    >
      <template #cell-patient_code="{ row }">
        <span class="font-semibold">{{ row.patient_code }}</span>
      </template>
      <template #cell-full_name="{ row }">
        <NuxtLink :to="`/${route.params.tenant}/patients/${row.id}`" class="font-semibold text-primary hover:underline">
          {{ patientName(row) }}
        </NuxtLink>
      </template>
      <template #cell-dob="{ row }">
        <span class="text-muted-foreground">{{ formatDate(row.dob) }}</span>
      </template>
      <template #cell-contact_number="{ row }">
        <span class="text-muted-foreground">{{ row.contact_number || '-' }}</span>
      </template>
      <template #cell-is_active="{ row }">
        <StatusBadge :status="row.is_active" />
      </template>
      <template #cell-registered_at="{ row }">
        <span class="text-muted-foreground">{{ formatDate(row.registered_at || row.created_at) }}</span>
      </template>
      <template #mobile-card="{ row }">
        <div class="flex items-start justify-between gap-3">
          <div>
            <NuxtLink :to="`/${route.params.tenant}/patients/${row.id}`" class="font-bold text-primary">
              {{ patientName(row) }}
            </NuxtLink>
            <p class="mt-1 text-xs text-muted-foreground">{{ row.patient_code }} • {{ row.gender }} • {{ formatDate(row.dob) }}</p>
          </div>
          <StatusBadge :status="row.is_active" />
        </div>
        <div class="grid gap-2 text-sm text-muted-foreground">
          <p>Contact: {{ row.contact_number || '-' }}</p>
          <p>Registered: {{ formatDate(row.registered_at || row.created_at) }}</p>
        </div>
      </template>
    </DataTable>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-muted-foreground">
        Page {{ meta?.page ?? page }} of {{ meta?.last_page ?? 1 }}
      </p>
      <div class="flex gap-2">
        <BaseButton
          variant="outline"
          :disabled="!canGoPrevious || loading"
          @click="goToPage(page - 1)"
        >
          Previous
        </BaseButton>
        <BaseButton
          variant="outline"
          :disabled="!canGoNext || loading"
          @click="goToPage(page + 1)"
        >
          Next
        </BaseButton>
      </div>
    </div>

    <BaseDialog v-model:open="showCreate" title="Add patient" description="Register the patient details used across appointments, records, and billing.">
      <form class="min-h-0 overflow-y-auto" @submit.prevent="submitCreate">
        <div class="space-y-6 overflow-y-auto p-5">
          <section class="space-y-3">
            <h3 class="text-sm font-semibold uppercase text-muted-foreground">Personal information</h3>
            <div class="grid gap-4 md:grid-cols-3">
              <FormField id="first_name" label="First name" :errors="fieldErrors('first_name')">
                <BaseInput id="first_name" v-model="form.first_name" required :has-error="fieldErrors('first_name').length > 0" />
              </FormField>
              <FormField id="middle_name" label="Middle name" :errors="fieldErrors('middle_name')">
                <BaseInput id="middle_name" v-model="form.middle_name" :has-error="fieldErrors('middle_name').length > 0" />
              </FormField>
              <FormField id="last_name" label="Last name" :errors="fieldErrors('last_name')">
                <BaseInput id="last_name" v-model="form.last_name" required :has-error="fieldErrors('last_name').length > 0" />
              </FormField>
              <FormField id="dob" label="Date of birth" :errors="fieldErrors('dob')">
                <BaseInput id="dob" v-model="form.dob" type="date" required :has-error="fieldErrors('dob').length > 0" />
              </FormField>
              <FormField id="gender" label="Gender" :errors="fieldErrors('gender')">
                <select id="gender" v-model="form.gender" required class="field-input">
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </FormField>
              <FormField id="civil_status" label="Civil status" :errors="fieldErrors('civil_status')">
                <BaseInput id="civil_status" v-model="form.civil_status" :has-error="fieldErrors('civil_status').length > 0" />
              </FormField>
              <FormField id="nationality" label="Nationality" :errors="fieldErrors('nationality')">
                <BaseInput id="nationality" v-model="form.nationality" :has-error="fieldErrors('nationality').length > 0" />
              </FormField>
              <FormField id="religion" label="Religion" :errors="fieldErrors('religion')">
                <BaseInput id="religion" v-model="form.religion" :has-error="fieldErrors('religion').length > 0" />
              </FormField>
            </div>
          </section>

          <section class="space-y-3">
            <h3 class="text-sm font-semibold uppercase text-muted-foreground">Contact and address</h3>
            <div class="grid gap-4 md:grid-cols-2">
              <FormField id="contact_number" label="Contact number" :errors="fieldErrors('contact_number')">
                <BaseInput id="contact_number" v-model="form.contact_number" :has-error="fieldErrors('contact_number').length > 0" />
              </FormField>
              <FormField id="email" label="Email" :errors="fieldErrors('email')">
                <BaseInput id="email" v-model="form.email" type="email" :has-error="fieldErrors('email').length > 0" />
              </FormField>
              <FormField id="address" label="Address" :errors="fieldErrors('address')" class="md:col-span-2">
                <textarea id="address" v-model="form.addressText" rows="3" class="field-input" />
              </FormField>
            </div>
          </section>

          <section class="space-y-3">
            <h3 class="text-sm font-semibold uppercase text-muted-foreground">Emergency contact</h3>
            <FormField id="emergency_contact" label="Emergency contact" :errors="fieldErrors('emergency_contact')">
              <textarea id="emergency_contact" v-model="form.emergencyContactText" rows="2" class="field-input" />
            </FormField>
          </section>

          <section class="space-y-3">
            <h3 class="text-sm font-semibold uppercase text-muted-foreground">Insurance</h3>
            <div class="grid gap-4 md:grid-cols-3">
              <FormField id="philhealth_number" label="PhilHealth number" :errors="fieldErrors('philhealth_number')">
                <BaseInput id="philhealth_number" v-model="form.philhealth_number" :has-error="fieldErrors('philhealth_number').length > 0" />
              </FormField>
              <FormField id="hmo_provider" label="HMO provider" :errors="fieldErrors('hmo_provider')">
                <BaseInput id="hmo_provider" v-model="form.hmo_provider" :has-error="fieldErrors('hmo_provider').length > 0" />
              </FormField>
              <FormField id="hmo_id" label="HMO number" :errors="fieldErrors('hmo_id')">
                <BaseInput id="hmo_id" v-model="form.hmo_id" :has-error="fieldErrors('hmo_id').length > 0" />
              </FormField>
            </div>
          </section>

          <section class="space-y-3">
            <h3 class="text-sm font-semibold uppercase text-muted-foreground">Medical notes</h3>
            <div class="grid gap-4 md:grid-cols-3">
              <FormField id="blood_type" label="Blood type" :errors="fieldErrors('blood_type')">
                <BaseInput id="blood_type" v-model="form.blood_type" :has-error="fieldErrors('blood_type').length > 0" />
              </FormField>
              <FormField id="allergies" label="Allergies" :errors="fieldErrors('allergies')">
                <textarea id="allergies" v-model="form.allergiesText" rows="3" class="field-input" />
              </FormField>
              <FormField id="chronic_conditions" label="Chronic conditions" :errors="fieldErrors('chronic_conditions')">
                <textarea id="chronic_conditions" v-model="form.chronicConditionsText" rows="3" class="field-input" />
              </FormField>
            </div>
          </section>
        </div>

        <div class="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-background/95 px-5 py-4 backdrop-blur">
          <BaseButton type="button" variant="outline" @click="closeCreateModal">
            Cancel
          </BaseButton>
          <BaseButton
            type="submit"
            :loading="creating"
          >
            {{ creating ? 'Saving...' : 'Save patient' }}
          </BaseButton>
        </div>
      </form>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { UserPlus } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import type { Patient, PatientForm } from '~/types'
import type { DataTableColumn } from '~/types/ui'
import { usePatient } from '~/composables/usePatient'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: ['auth', 'tenant'],
})

const route = useRoute()
const auth = useAuthStore()
const {
  patients,
  meta,
  loading,
  creating,
  error,
  validationErrors,
  fetchPatients,
  createPatient,
} = usePatient()

const search = ref('')
const page = ref(1)
const perPage = ref(20)
const showCreate = ref(false)
const successMessage = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

const emptyForm = () => ({
  first_name: '',
  middle_name: '',
  last_name: '',
  dob: '',
  gender: '',
  civil_status: '',
  nationality: '',
  religion: '',
  contact_number: '',
  email: '',
  addressText: '',
  emergencyContactText: '',
  philhealth_number: '',
  hmo_provider: '',
  hmo_id: '',
  blood_type: '',
  allergiesText: '',
  chronicConditionsText: '',
})

const form = reactive(emptyForm())

const canCreatePatients = computed(() => auth.user?.permissions?.includes('patients.create') ?? false)
const canGoPrevious = computed(() => (meta.value?.page ?? page.value) > 1)
const canGoNext = computed(() => (meta.value?.page ?? page.value) < (meta.value?.last_page ?? 1))
const metaSummary = computed(() => {
  const total = meta.value?.total ?? 0
  return `${total} ${total === 1 ? 'record' : 'records'}`
})

const patientColumns: DataTableColumn[] = [
  { key: 'patient_code', label: 'Patient code' },
  { key: 'full_name', label: 'Full name' },
  { key: 'dob', label: 'Birth date' },
  { key: 'gender', label: 'Gender' },
  { key: 'contact_number', label: 'Contact' },
  { key: 'is_active', label: 'Status' },
  { key: 'registered_at', label: 'Registered' },
]

function currentParams() {
  return {
    page: page.value,
    per_page: perPage.value,
    search: search.value || undefined,
  }
}

async function loadPatients() {
  await fetchPatients(currentParams())
}

function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > (meta.value?.last_page ?? 1)) {
    return
  }

  page.value = nextPage
  loadPatients()
}

function openCreateModal() {
  successMessage.value = ''
  showCreate.value = true
}

function closeCreateModal() {
  showCreate.value = false
}

function resetForm() {
  Object.assign(form, emptyForm())
}

function fieldErrors(field: string): string[] {
  return validationErrors.value?.[field] ?? []
}

function textToList(value: string): string[] | undefined {
  const items = value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)

  return items.length > 0 ? items : undefined
}

function optional(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

function buildPayload(): PatientForm {
  return {
    first_name: form.first_name,
    middle_name: optional(form.middle_name),
    last_name: form.last_name,
    dob: form.dob,
    gender: form.gender,
    civil_status: optional(form.civil_status),
    nationality: optional(form.nationality),
    religion: optional(form.religion),
    contact_number: optional(form.contact_number),
    email: optional(form.email),
    address: optional(form.addressText) ? { street: form.addressText.trim() } : undefined,
    emergency_contact: optional(form.emergencyContactText) ? { name: form.emergencyContactText.trim() } : undefined,
    philhealth_number: optional(form.philhealth_number),
    hmo_provider: optional(form.hmo_provider),
    hmo_id: optional(form.hmo_id),
    blood_type: optional(form.blood_type),
    allergies: textToList(form.allergiesText),
    chronic_conditions: textToList(form.chronicConditionsText),
  }
}

async function submitCreate() {
  const res = await createPatient(buildPayload())

  if (!res?.success) {
    return
  }

  resetForm()
  closeCreateModal()
  successMessage.value = res.message || 'Patient created successfully.'
  page.value = 1
  await loadPatients()
}

function patientName(patient: Patient): string {
  return patient.full_name || [patient.first_name, patient.middle_name, patient.last_name].filter(Boolean).join(' ')
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

watch(search, () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  searchTimer = setTimeout(() => {
    page.value = 1
    loadPatients()
  }, 250)
})

watch(perPage, () => {
  page.value = 1
  loadPatients()
})

onMounted(loadPatients)
</script>

<style scoped>
.field-input {
  @apply h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-ring/15;
}
</style>
