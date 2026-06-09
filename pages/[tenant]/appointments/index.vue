<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Schedule"
      title="Appointments"
      description="Coordinate check-ins, clinicians, visit types, and appointment status from one clear list."
    >
      <template #actions>
        <BaseButton :icon="Plus" @click="showCreate = true">Add appointment</BaseButton>
      </template>
    </PageHeader>

    <div v-if="error" class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      {{ error }}
    </div>

    <SearchToolbar v-model="search" placeholder="Search appointments..." label="Search appointments" />

    <DataTable
      :columns="columns"
      :rows="appointments"
      :loading="loading"
      empty-title="No appointments found"
      empty-description="Scheduled appointments will appear here."
    >
      <template #cell-patient="{ row }">
        <span class="font-semibold">{{ patientIdentity(row.patient, row.patient_id) }}</span>
      </template>
      <template #cell-clinician="{ row }">
        <span class="text-muted-foreground">{{ staffIdentity(row.clinician, row.clinician_id) }}</span>
      </template>
      <template #cell-status="{ row }">
        <StatusBadge :status="row.status" />
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <BaseButton :to="`/${route.params.tenant}/appointments/${row.id}`" variant="outline" size="sm">
            View
          </BaseButton>
          <BaseButton
            variant="outline"
            size="icon"
            :icon="Printer"
            aria-label="Print appointment"
            title="Print appointment"
            @click="printAppointment(row.id)"
          />
        </div>
      </template>
      <template #mobile-card="{ row }">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-bold">{{ patientIdentity(row.patient, row.patient_id) }}</p>
            <p class="mt-1 text-xs text-muted-foreground">{{ row.appointment_date }} at {{ row.time_slot }}</p>
          </div>
          <StatusBadge :status="row.status" />
        </div>
        <p class="text-sm text-muted-foreground">{{ row.appointment_type }} with {{ staffIdentity(row.clinician, row.clinician_id) }}</p>
        <div class="flex flex-wrap gap-2">
          <BaseButton :to="`/${route.params.tenant}/appointments/${row.id}`" variant="outline" size="sm">
            View appointment
          </BaseButton>
          <BaseButton
            variant="outline"
            size="icon"
            :icon="Printer"
            aria-label="Print appointment"
            title="Print appointment"
            @click="printAppointment(row.id)"
          />
        </div>
      </template>
    </DataTable>

    <BaseDialog v-model:open="showCreate" title="Add appointment" description="Schedule a clinic visit for a selected patient and clinician.">
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
              <option v-for="patient in patients" :key="patient.id" :value="patient.id">
                {{ patientIdentity(patient) }}
              </option>
            </select>
          </FormField>
          <FormField id="clinician-id" label="Clinician" :errors="validationErrors?.clinician_id">
            <select id="clinician-id" v-model="form.clinician_id" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="">Select clinician</option>
              <option v-for="person in staff" :key="person.id" :value="person.id">
                {{ staffIdentity(person) }}
              </option>
            </select>
          </FormField>
          <FormField id="appointment-date" label="Date" :errors="validationErrors?.appointment_date">
            <BaseInput id="appointment-date" v-model="form.appointment_date" type="date" />
          </FormField>
          <FormField id="time-slot" label="Time">
            <BaseInput id="time-slot" v-model="form.time_slot" type="time" />
          </FormField>
          <FormField id="appointment-type" label="Type">
            <BaseInput id="appointment-type" v-model="form.appointment_type" placeholder="Consultation" />
          </FormField>
          <FormField id="reason" label="Reason">
            <BaseInput id="reason" v-model="form.reason" placeholder="Visit reason" />
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
import { useAppointment } from '~/composables/useAppointment'
import { usePatient } from '~/composables/usePatient'
import { useStaffOptions } from '~/composables/useStaffOptions'
import { useRoute } from 'vue-router'
import { patientIdentity, staffIdentity } from '~/utils/clinicalDisplay'
import type { AppointmentForm } from '~/types'
import type { DataTableColumn } from '~/types/ui'

const search = ref('')
const showCreate = ref(false)
const patientSearch = ref('')
const staffSearch = ref('')
const form = ref<AppointmentForm>({
  patient_id: '',
  clinician_id: '',
  appointment_date: '',
  time_slot: '',
  appointment_type: 'Consultation',
  reason: '',
  status: 'SCHEDULED',
})
const { appointments, loading, saving, error, validationErrors, fetchAppointments, createAppointment } = useAppointment()
const { launchPrint } = usePrintLauncher()
const { patients, fetchPatients } = usePatient()
const { staff, fetchStaff } = useStaffOptions()
const route = useRoute()
const columns: DataTableColumn[] = [
  { key: 'appointment_date', label: 'Date' },
  { key: 'time_slot', label: 'Time' },
  { key: 'patient', label: 'Patient' },
  { key: 'clinician', label: 'Clinician' },
  { key: 'appointment_type', label: 'Type' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

onMounted(() => {
  fetchAppointments()
  fetchPatients({ per_page: 20 })
  fetchStaff()
})

watch(search, (val) => {
  fetchAppointments(val ? { search: val } : {})
})

watch(patientSearch, (val) => {
  fetchPatients(val ? { search: val, per_page: 20 } : { per_page: 20 })
})

watch(staffSearch, (val) => {
  fetchStaff(val ? { search: val } : {})
})

async function submitCreate() {
  const res = await createAppointment(form.value)
  if (res?.success) {
    showCreate.value = false
    form.value = {
      patient_id: '',
      clinician_id: '',
      appointment_date: '',
      time_slot: '',
      appointment_type: 'Consultation',
      reason: '',
      status: 'SCHEDULED',
    }
  }
}

function printAppointment(id: string | number) {
  launchPrint(`/${route.params.tenant}/appointments/${id}/print`)
}
</script>
