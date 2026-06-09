<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Document control"
      title="Medical records"
      description="Create record metadata, monitor releases, and keep staff-facing document handoffs traceable."
    />

    <div v-if="error" class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      {{ error }}
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Records" :value="summary.total" helper="Metadata entries" :icon="Files" :loading="loading" />
      <MetricCard label="Released" :value="summary.released" helper="Sent to recipients" :icon="Send" tone="success" :loading="loading" />
      <MetricCard label="Unreleased" :value="summary.unreleased" helper="Awaiting release" :icon="FileClock" tone="warning" :loading="loading" />
      <MetricCard label="Recent" :value="summary.recent" helper="Created in the last 7 days" :icon="CalendarClock" tone="primary" :loading="loading" />
    </div>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
      <div class="space-y-4">
        <div class="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <SearchToolbar v-model="filters.search" placeholder="Search records..." label="Search medical records" class="md:min-w-80" />
          <select v-model="filters.release" class="h-10 rounded-lg border border-input bg-background px-3 text-sm font-semibold text-foreground shadow-sm focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-ring/15">
            <option value="">All records</option>
            <option value="released">Released</option>
            <option value="unreleased">Unreleased</option>
          </select>
        </div>

        <DataTable :columns="columns" :rows="filteredRecords" :loading="loading" empty-title="No medical records found" empty-description="Create record metadata or adjust filters to see document activity.">
          <template #cell-record_type="{ row }">
            <div>
              <p class="font-semibold">{{ statusLabel(row.record_type) }}</p>
              <p class="text-xs text-muted-foreground">{{ row.file_name || row.file_path || 'No file metadata' }}</p>
            </div>
          </template>
          <template #cell-patient="{ row }">
            <span class="font-semibold">{{ row.patient?.full_name || `Patient #${row.patient_id}` }}</span>
          </template>
          <template #cell-created_at="{ row }">
            <span>{{ formatDateTime(row.created_at) }}</span>
          </template>
          <template #cell-is_released="{ row }">
            <StatusBadge :status="row.is_released" :label="row.is_released ? 'Released' : 'Unreleased'" :tone="row.is_released ? 'success' : 'warning'" />
          </template>
          <template #cell-actions="{ row }">
            <div class="flex justify-end">
              <BaseButton size="sm" variant="outline" :disabled="row.is_released" @click="selectRelease(row)">
                Release
              </BaseButton>
            </div>
          </template>
          <template #mobile-card="{ row }">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-bold">{{ statusLabel(row.record_type) }}</p>
                <p class="mt-1 text-xs text-muted-foreground">{{ row.file_name || row.file_path || 'No file metadata' }}</p>
              </div>
              <StatusBadge :status="row.is_released" :label="row.is_released ? 'Released' : 'Unreleased'" :tone="row.is_released ? 'success' : 'warning'" />
            </div>
            <p class="text-sm text-muted-foreground">{{ row.patient?.full_name || `Patient #${row.patient_id}` }}</p>
          </template>
        </DataTable>
      </div>

      <aside class="space-y-4">
        <form class="rounded-xl border border-border bg-card p-4 shadow-sm" @submit.prevent="handleCreate">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-bold">Create record</h2>
              <p class="text-sm text-muted-foreground">Store document metadata for staff release workflows.</p>
            </div>
            <BaseButton type="button" variant="ghost" size="sm" @click="resetForm">Reset</BaseButton>
          </div>

          <div class="space-y-4">
            <div class="grid gap-3 sm:grid-cols-2">
              <FormField id="record_patient_id" label="Patient ID" :errors="validationErrors?.patient_id">
                <BaseInput id="record_patient_id" v-model="form.patient_id" :has-error="Boolean(validationErrors?.patient_id)" />
              </FormField>
              <FormField id="record_reference_id" label="Reference ID">
                <BaseInput id="record_reference_id" v-model="form.reference_id" />
              </FormField>
            </div>

            <FormField id="record_type" label="Record type" :errors="validationErrors?.record_type">
              <select id="record_type" v-model="form.record_type" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
                <option v-for="type in recordTypes" :key="type" :value="type">{{ statusLabel(type) }}</option>
              </select>
            </FormField>

            <FormField id="file_name" label="File name">
              <BaseInput id="file_name" v-model="form.file_name" placeholder="signed-encounter.pdf" />
            </FormField>

            <FormField id="file_path" label="File path">
              <BaseInput id="file_path" v-model="form.file_path" placeholder="records/patient/file.pdf" />
            </FormField>

            <FormField id="purpose" label="Purpose">
              <textarea id="purpose" v-model="form.purpose" rows="3" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </FormField>

            <BaseButton type="submit" block :loading="saving">Create record</BaseButton>
          </div>
        </form>

        <form v-if="releaseTarget" class="rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-sm" @submit.prevent="handleRelease">
          <h2 class="text-base font-bold">Release {{ statusLabel(releaseTarget.record_type) }}</h2>
          <p class="mt-1 text-sm text-muted-foreground">{{ releaseTarget.file_name || releaseTarget.file_path || `Record #${releaseTarget.id}` }}</p>
          <div class="mt-4 space-y-4">
            <FormField id="released_to" label="Released to">
              <BaseInput id="released_to" v-model="releaseForm.released_to" />
            </FormField>
            <FormField id="release_purpose" label="Purpose">
              <textarea id="release_purpose" v-model="releaseForm.purpose" rows="3" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </FormField>
          </div>
          <div class="mt-4 flex gap-2">
            <BaseButton type="submit" :loading="saving">Release</BaseButton>
            <BaseButton type="button" variant="ghost" @click="releaseTarget = null">Cancel</BaseButton>
          </div>
        </form>
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { CalendarClock, FileClock, Files, Send } from 'lucide-vue-next'
import type { DataTableColumn } from '~/types/ui'
import type { MedicalRecord, MedicalRecordQuickForm, RecordType } from '~/types'
import { formatDateTime, statusLabel } from '~/utils/format'
import { useRecords } from '~/composables/useRecords'

const recordTypes: RecordType[] = ['ENCOUNTER', 'LAB', 'IMAGING', 'PRESCRIPTION', 'CERT', 'REFERRAL']
const columns: DataTableColumn[] = [
  { key: 'record_type', label: 'Record' },
  { key: 'patient', label: 'Patient' },
  { key: 'created_at', label: 'Created' },
  { key: 'is_released', label: 'Release' },
  { key: 'actions', label: 'Actions', align: 'right' },
]

const { records, loading, saving, error, validationErrors, fetchRecords, createRecord, releaseRecord } = useRecords()
const filters = reactive({ search: '', release: '' })
const releaseTarget = ref<MedicalRecord | null>(null)
const releaseForm = reactive({ released_to: '', purpose: '' })
const form = reactive<MedicalRecordQuickForm>({
  patient_id: '',
  record_type: 'ENCOUNTER',
  reference_id: '',
  file_name: '',
  file_path: '',
  purpose: '',
})

const filteredRecords = computed(() => {
  if (!filters.release) return records.value
  return records.value.filter((record) => filters.release === 'released' ? record.is_released : !record.is_released)
})

const summary = computed(() => {
  const released = records.value.filter((record) => record.is_released).length
  const recent = records.value.filter((record) => {
    if (!record.created_at) return false
    return Date.now() - new Date(record.created_at).getTime() <= 7 * 24 * 60 * 60 * 1000
  }).length

  return {
    total: records.value.length,
    released,
    unreleased: records.value.length - released,
    recent,
  }
})

onMounted(() => fetchRecords())

watch(() => filters.search, (search) => {
  fetchRecords(search ? { search } : {})
})

async function handleCreate() {
  const res = await createRecord({
    ...form,
    reference_id: form.reference_id || undefined,
    file_name: form.file_name || undefined,
    file_path: form.file_path || undefined,
    purpose: form.purpose || undefined,
  })

  if (res.success) {
    resetForm()
    await fetchRecords()
  }
}

function selectRelease(record: MedicalRecord) {
  releaseTarget.value = record
  releaseForm.released_to = record.released_to || ''
  releaseForm.purpose = record.purpose || ''
}

async function handleRelease() {
  if (!releaseTarget.value || !releaseForm.released_to.trim()) return
  const res = await releaseRecord(releaseTarget.value.id, {
    released_to: releaseForm.released_to.trim(),
    purpose: releaseForm.purpose.trim(),
  })
  if (res.success) {
    releaseTarget.value = null
    await fetchRecords()
  }
}

function resetForm() {
  form.patient_id = ''
  form.record_type = 'ENCOUNTER'
  form.reference_id = ''
  form.file_name = ''
  form.file_path = ''
  form.purpose = ''
}
</script>
