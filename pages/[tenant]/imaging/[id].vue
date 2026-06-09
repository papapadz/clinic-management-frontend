<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Diagnostics" title="Imaging request detail" description="Manage imaging status, findings, impression, and reporting date.">
      <template #actions>
        <BaseButton variant="outline" :to="`/${route.params.tenant}/imaging`">Back</BaseButton>
        <BaseButton v-if="request" variant="outline" :icon="Printer" @click="printRequest">Print</BaseButton>
      </template>
    </PageHeader>

    <div v-if="error" class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{{ error }}</div>
    <LoadingState v-if="loading" />
    <section v-else-if="request" class="space-y-5">
      <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-lg border border-border bg-card p-4">
          <p class="text-xs font-bold uppercase text-muted-foreground">Patient</p>
          <p class="mt-1 font-bold">{{ patientIdentity(request.patient, request.patient_id) }}</p>
        </div>
        <div class="rounded-lg border border-border bg-card p-4">
          <p class="text-xs font-bold uppercase text-muted-foreground">Requesting doctor</p>
          <p class="mt-1 font-bold">{{ staffIdentity(request.requesting_clinician, request.requesting_clinician_id) }}</p>
        </div>
        <div class="rounded-lg border border-border bg-card p-4">
          <p class="text-xs font-bold uppercase text-muted-foreground">Study</p>
          <p class="mt-1 font-bold">{{ request.modality }} {{ request.body_part }}</p>
        </div>
      </div>

      <form class="rounded-lg border border-border bg-card p-4" @submit.prevent="save">
        <div class="grid gap-4 md:grid-cols-2">
          <FormField id="status" label="Status">
            <select id="status" v-model="form.status" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option v-for="status in statuses" :key="status" :value="status">{{ normalizeStatus(status) }}</option>
            </select>
          </FormField>
          <FormField id="reported-at" label="Reported at">
            <BaseInput id="reported-at" v-model="form.reported_at" type="datetime-local" />
          </FormField>
          <FormField id="findings" label="Findings">
            <BaseInput id="findings" v-model="form.radiologist_findings" placeholder="Findings" />
          </FormField>
          <FormField id="impression" label="Impression">
            <BaseInput id="impression" v-model="form.impression" placeholder="Impression" />
          </FormField>
        </div>
        <div class="mt-4 flex justify-end">
          <BaseButton type="submit" :loading="saving">Save imaging update</BaseButton>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Printer } from 'lucide-vue-next'
import { useImaging } from '~/composables/useImaging'
import { patientIdentity, staffIdentity } from '~/utils/clinicalDisplay'
import { normalizeStatus } from '~/utils/status'
import type { LabStatus } from '~/types'

const route = useRoute()
const { launchPrint } = usePrintLauncher()
const { request, loading, saving, error, fetchRequest, updateRequest } = useImaging()
const statuses: LabStatus[] = ['REQUESTED', 'COLLECTED', 'IN_PROGRESS', 'RESULTED', 'VALIDATED', 'RELEASED']
const form = reactive({
  status: 'REQUESTED' as LabStatus,
  reported_at: '',
  radiologist_findings: '',
  impression: '',
})

onMounted(() => fetchRequest(route.params.id as string))

watch(request, (value) => {
  if (!value) return
  form.status = value.status
  form.reported_at = value.reported_at?.slice(0, 16) ?? ''
  form.radiologist_findings = value.radiologist_findings ?? ''
  form.impression = value.impression ?? ''
})

async function save() {
  await updateRequest(route.params.id as string, form)
}

function printRequest() {
  launchPrint(`/${route.params.tenant}/imaging/${route.params.id}/print`)
}
</script>
