<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Schedule" title="Appointment detail" description="Review the appointment identity, status, and visit management actions.">
      <template #actions>
        <BaseButton variant="outline" :to="`/${route.params.tenant}/appointments`">Back</BaseButton>
        <BaseButton v-if="appointment" variant="outline" :icon="Printer" @click="printAppointment">Print</BaseButton>
        <BaseButton v-if="appointment?.status === 'SCHEDULED'" :loading="saving" @click="checkIn">Check in</BaseButton>
      </template>
    </PageHeader>

    <div v-if="error" class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      {{ error }}
    </div>

    <LoadingState v-if="loading" />
    <section v-else-if="appointment" class="space-y-5">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-lg border border-border bg-card p-4">
          <p class="text-xs font-bold uppercase text-muted-foreground">Patient</p>
          <p class="mt-1 text-lg font-bold">{{ patientIdentity(appointment.patient, appointment.patient_id) }}</p>
        </div>
        <div class="rounded-lg border border-border bg-card p-4">
          <p class="text-xs font-bold uppercase text-muted-foreground">Clinician</p>
          <p class="mt-1 text-lg font-bold">{{ staffIdentity(appointment.clinician, appointment.clinician_id) }}</p>
        </div>
      </div>

      <form class="rounded-lg border border-border bg-card p-4" @submit.prevent="save">
        <div class="grid gap-4 md:grid-cols-4">
          <FormField id="date" label="Date">
            <BaseInput id="date" v-model="form.appointment_date" type="date" />
          </FormField>
          <FormField id="time" label="Time">
            <BaseInput id="time" v-model="form.time_slot" type="time" />
          </FormField>
          <FormField id="status" label="Status">
            <select id="status" v-model="form.status" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option v-for="status in statuses" :key="status" :value="status">{{ normalizeStatus(status) }}</option>
            </select>
          </FormField>
          <FormField id="type" label="Type">
            <BaseInput id="type" v-model="form.appointment_type" />
          </FormField>
        </div>
        <div class="mt-4 flex justify-end">
          <BaseButton type="submit" :loading="saving">Save changes</BaseButton>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Printer } from 'lucide-vue-next'
import { useAppointment } from '~/composables/useAppointment'
import { patientIdentity, staffIdentity } from '~/utils/clinicalDisplay'
import { normalizeStatus } from '~/utils/status'
import type { AppointmentStatus } from '~/types'

const route = useRoute()
const { launchPrint } = usePrintLauncher()
const { appointment, loading, saving, error, fetchAppointment, updateAppointment, checkInAppointment } = useAppointment()
const statuses: AppointmentStatus[] = ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']
const form = reactive({
  appointment_date: '',
  time_slot: '',
  appointment_type: '',
  status: 'SCHEDULED' as AppointmentStatus,
})

onMounted(() => fetchAppointment(route.params.id as string))

watch(appointment, (value) => {
  if (!value) return
  form.appointment_date = value.appointment_date
  form.time_slot = value.time_slot
  form.appointment_type = value.appointment_type
  form.status = value.status
})

async function save() {
  await updateAppointment(route.params.id as string, form)
}

async function checkIn() {
  await checkInAppointment(route.params.id as string)
}

function printAppointment() {
  launchPrint(`/${route.params.tenant}/appointments/${route.params.id}/print`)
}
</script>
