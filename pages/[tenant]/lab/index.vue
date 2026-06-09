<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Diagnostics" title="Lab requests" description="Track specimen flow, priorities, and result release status.">
      <template #actions>
        <BaseButton :icon="Plus" @click="showCreate = true">Create request</BaseButton>
      </template>
    </PageHeader>
    <div v-if="error" class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      {{ error }}
    </div>
    <SearchToolbar v-model="search" placeholder="Search lab..." label="Search lab requests" />
    <DataTable :columns="columns" :rows="requests" :loading="loading" empty-title="No lab requests found" empty-description="Lab requests will appear here after they are ordered.">
      <template #cell-patient="{ row }">
        <span class="font-semibold">{{ patientIdentity(row.patient, row.patient_id) }}</span>
      </template>
      <template #cell-requesting_clinician="{ row }">
        <span class="text-muted-foreground">{{ staffIdentity(row.requesting_clinician, row.requesting_clinician_id) }}</span>
      </template>
      <template #cell-tests="{ row }">
        <span class="text-muted-foreground">{{ panelNames(row.test_panels) }}</span>
      </template>
      <template #cell-priority="{ row }">
        <StatusBadge :status="row.priority" />
      </template>
      <template #cell-status="{ row }">
        <StatusBadge :status="row.status" />
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <BaseButton :to="`/${route.params.tenant}/lab/${row.id}`" variant="outline" size="sm">View</BaseButton>
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
            <p class="mt-1 text-xs text-muted-foreground">{{ row.created_at }}</p>
          </div>
          <StatusBadge :status="row.priority" />
        </div>
        <p class="text-sm text-muted-foreground">{{ panelNames(row.test_panels) }}</p>
        <StatusBadge :status="row.status" />
        <p class="text-sm text-muted-foreground">{{ staffIdentity(row.requesting_clinician, row.requesting_clinician_id) }}</p>
        <div class="flex flex-wrap gap-2">
          <BaseButton :to="`/${route.params.tenant}/lab/${row.id}`" variant="outline" size="sm">View request</BaseButton>
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

    <BaseDialog v-model:open="showCreate" title="Create lab request" description="Order lab work for a patient with an accountable requesting doctor.">
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
          <FormField id="test-name" label="Test panel">
            <BaseInput id="test-name" v-model="testName" placeholder="CBC, FBS, Urinalysis" />
          </FormField>
          <FormField id="specimen-type" label="Specimen">
            <BaseInput id="specimen-type" v-model="form.specimen_type" placeholder="Blood" />
          </FormField>
          <FormField id="priority" label="Priority">
            <select id="priority" v-model="form.priority" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="ROUTINE">Routine</option>
              <option value="URGENT">Urgent</option>
              <option value="STAT">Stat</option>
            </select>
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
import { useLab } from '~/composables/useLab'
import { usePatient } from '~/composables/usePatient'
import { useStaffOptions } from '~/composables/useStaffOptions'
import { useRoute } from 'vue-router'
import { patientIdentity, staffIdentity } from '~/utils/clinicalDisplay'
import { isEncounterLinkedRequest } from '~/utils/diagnosticPrint'
import type { LabQuickOrderForm, LabRequest } from '~/types'
import type { DataTableColumn } from '~/types/ui'

const search = ref('')
const showCreate = ref(false)
const patientSearch = ref('')
const staffSearch = ref('')
const testName = ref('')
const form = ref<LabQuickOrderForm>({
  patient_id: '',
  requesting_clinician_id: '',
  priority: 'ROUTINE',
  specimen_type: '',
  test_panels: [],
})
const { requests, loading, saving, error, validationErrors, fetchRequests, createRequest } = useLab()
const { launchPrint } = usePrintLauncher()
const { patients, fetchPatients } = usePatient()
const { staff, fetchStaff } = useStaffOptions()
const route = useRoute()
const columns: DataTableColumn[] = [
  { key: 'created_at', label: 'Date' },
  { key: 'patient', label: 'Patient' },
  { key: 'requesting_clinician', label: 'Doctor' },
  { key: 'tests', label: 'Tests' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

function panelNames(panels: Array<{ name: string }> = []): string {
  return panels.map((panel) => panel.name).join(', ') || '-'
}

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
  form.value.test_panels = testName.value.trim() ? [{ name: testName.value.trim() }] : []
  const res = await createRequest(form.value)
  if (res?.success) {
    showCreate.value = false
    testName.value = ''
    form.value = {
      patient_id: '',
      requesting_clinician_id: '',
      priority: 'ROUTINE',
      specimen_type: '',
      test_panels: [],
    }
    await fetchRequests()
  }
}

function printDiagnosticRequest(row: LabRequest) {
  launchPrint(`/${route.params.tenant}/lab/${row.id}/print`)
}
</script>
