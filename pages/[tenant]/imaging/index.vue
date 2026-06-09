<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Diagnostics" title="Imaging requests" description="Follow imaging orders by modality, priority, and reporting status.">
      <template #actions>
        <BaseButton :icon="Plus" @click="showCreate = true">Create request</BaseButton>
      </template>
    </PageHeader>
    <div v-if="error" class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      {{ error }}
    </div>
    <SearchToolbar v-model="search" placeholder="Search imaging..." label="Search imaging requests" />
    <DataTable :columns="columns" :rows="requests" :loading="loading" empty-title="No imaging requests found" empty-description="Imaging requests will appear here after they are ordered.">
      <template #cell-patient="{ row }">
        <span class="font-semibold">{{ patientIdentity(row.patient, row.patient_id) }}</span>
      </template>
      <template #cell-requesting_clinician="{ row }">
        <span class="text-muted-foreground">{{ staffIdentity(row.requesting_clinician, row.requesting_clinician_id) }}</span>
      </template>
      <template #cell-priority="{ row }">
        <StatusBadge :status="row.priority" />
      </template>
      <template #cell-status="{ row }">
        <StatusBadge :status="row.status" />
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <BaseButton :to="`/${route.params.tenant}/imaging/${row.id}`" variant="outline" size="sm">View</BaseButton>
          <BaseButton
            variant="outline"
            size="icon"
            :icon="Printer"
            :aria-label="isEncounterLinkedRequest(row) ? 'Print encounter diagnostics' : 'Print request'"
            :title="isEncounterLinkedRequest(row) ? 'Print encounter diagnostics' : 'Print request'"
            @click="printDiagnosticRequest(row)"
          />
        </div>
      </template>
      <template #mobile-card="{ row }">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-bold">{{ patientIdentity(row.patient, row.patient_id) }}</p>
            <p class="mt-1 text-xs text-muted-foreground">{{ row.modality }} • {{ row.body_part }}</p>
          </div>
          <StatusBadge :status="row.priority" />
        </div>
        <StatusBadge :status="row.status" />
        <p class="text-sm text-muted-foreground">{{ staffIdentity(row.requesting_clinician, row.requesting_clinician_id) }}</p>
        <div class="flex flex-wrap gap-2">
          <BaseButton :to="`/${route.params.tenant}/imaging/${row.id}`" variant="outline" size="sm">View request</BaseButton>
          <BaseButton
            variant="outline"
            size="icon"
            :icon="Printer"
            :aria-label="isEncounterLinkedRequest(row) ? 'Print encounter diagnostics' : 'Print request'"
            :title="isEncounterLinkedRequest(row) ? 'Print encounter diagnostics' : 'Print request'"
            @click="printDiagnosticRequest(row)"
          />
        </div>
      </template>
    </DataTable>

    <BaseDialog v-model:open="showCreate" title="Create imaging request" description="Order imaging for a patient with a requesting doctor.">
      <form class="space-y-4 overflow-y-auto p-5" @submit.prevent="submitCreate">
        <div class="grid gap-4 md:grid-cols-2">
          <FormField id="patient-search" label="Find patient">
            <BaseInput id="patient-search" v-model="patientSearch" placeholder="Name or hospital number" />
          </FormField>
          <FormField id="staff-search" label="Find requesting doctor">
            <BaseInput id="staff-search" v-model="staffSearch" placeholder="Name or employee ID" />
          </FormField>
          <FormField id="patient-id" label="Patient" :errors="validationErrors?.patient_id">
            <select id="patient-id" v-model="form.patient_id" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="">Select patient</option>
              <option v-for="patient in patients" :key="patient.id" :value="patient.id">{{ patientIdentity(patient) }}</option>
            </select>
          </FormField>
          <FormField id="doctor-id" label="Requesting doctor" :errors="validationErrors?.requesting_clinician_id">
            <select id="doctor-id" v-model="form.requesting_clinician_id" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="">Select doctor</option>
              <option v-for="person in staff" :key="person.id" :value="person.id">{{ staffIdentity(person) }}</option>
            </select>
          </FormField>
          <FormField id="modality" label="Modality" :errors="validationErrors?.modality">
            <BaseInput id="modality" v-model="form.modality" placeholder="XRAY" />
          </FormField>
          <FormField id="body-part" label="Body part">
            <BaseInput id="body-part" v-model="form.body_part" placeholder="Chest" />
          </FormField>
          <FormField id="priority" label="Priority">
            <select id="priority" v-model="form.priority" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="ROUTINE">Routine</option>
              <option value="URGENT">Urgent</option>
              <option value="STAT">Stat</option>
            </select>
          </FormField>
          <FormField id="indication" label="Clinical indication">
            <BaseInput id="indication" v-model="form.clinical_indication" placeholder="Reason for imaging" />
          </FormField>
        </div>
        <div class="flex justify-end gap-2 border-t border-border pt-4">
          <BaseButton variant="outline" @click="showCreate = false">Cancel</BaseButton>
          <BaseButton type="submit" :loading="saving">Create</BaseButton>
        </div>
      </form>
    </BaseDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Plus, Printer } from 'lucide-vue-next'
import { useImaging } from '~/composables/useImaging'
import { usePatient } from '~/composables/usePatient'
import { useStaffOptions } from '~/composables/useStaffOptions'
import { useRoute } from 'vue-router'
import { patientIdentity, staffIdentity } from '~/utils/clinicalDisplay'
import { isEncounterLinkedRequest } from '~/utils/diagnosticPrint'
import type { ImagingQuickOrderForm, ImagingRequest } from '~/types'
import type { DataTableColumn } from '~/types/ui'

const search = ref('')
const showCreate = ref(false)
const patientSearch = ref('')
const staffSearch = ref('')
const form = ref<ImagingQuickOrderForm>({
  patient_id: '',
  requesting_clinician_id: '',
  modality: '',
  body_part: '',
  priority: 'ROUTINE',
  clinical_indication: '',
})
const { requests, loading, saving, error, validationErrors, fetchRequests, createRequest } = useImaging()
const { launchPrint } = usePrintLauncher()
const { patients, fetchPatients } = usePatient()
const { staff, fetchStaff } = useStaffOptions()
const route = useRoute()
const columns: DataTableColumn[] = [
  { key: 'created_at', label: 'Date' },
  { key: 'patient', label: 'Patient' },
  { key: 'requesting_clinician', label: 'Doctor' },
  { key: 'modality', label: 'Modality' },
  { key: 'body_part', label: 'Body part' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

onMounted(() => {
  fetchRequests()
  fetchPatients({ per_page: 20 })
  fetchStaff()
})

watch(search, (val) => {
  fetchRequests(val ? { search: val } : {})
})

watch(patientSearch, (val) => {
  fetchPatients(val ? { search: val, per_page: 20 } : { per_page: 20 })
})

watch(staffSearch, (val) => {
  fetchStaff(val ? { search: val } : {})
})

async function submitCreate() {
  const res = await createRequest(form.value)
  if (res?.success) {
    showCreate.value = false
    form.value = {
      patient_id: '',
      requesting_clinician_id: '',
      modality: '',
      body_part: '',
      priority: 'ROUTINE',
      clinical_indication: '',
    }
    await fetchRequests()
  }
}

function printDiagnosticRequest(row: ImagingRequest) {
  launchPrint(`/${route.params.tenant}/imaging/${row.id}/print`)
}
</script>
