<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Diagnostics" title="Lab request detail" description="Manage specimen status, results, critical flags, and release details.">
      <template #actions>
        <BaseButton variant="outline" :to="`/${route.params.tenant}/lab`">Back</BaseButton>
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
          <p class="text-xs font-bold uppercase text-muted-foreground">Status</p>
          <StatusBadge class="mt-2" :status="request.status" />
        </div>
      </div>

      <form class="rounded-lg border border-border bg-card p-4" @submit.prevent="save">
        <div class="grid gap-4 md:grid-cols-3">
          <FormField id="status" label="Status">
            <select id="status" v-model="form.status" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option v-for="status in statuses" :key="status" :value="status">{{ normalizeStatus(status) }}</option>
            </select>
          </FormField>
          <FormField id="critical" label="Critical flag">
            <select id="critical" v-model="criticalFlag" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option :value="false">No</option>
              <option :value="true">Yes</option>
            </select>
          </FormField>
          <FormField id="result" label="Result note">
            <BaseInput id="result" v-model="resultNote" placeholder="Result summary" />
          </FormField>
        </div>
        <div class="mt-4 flex justify-end">
          <BaseButton type="submit" :loading="saving">Save lab update</BaseButton>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Printer } from 'lucide-vue-next'
import { useLab } from '~/composables/useLab'
import { patientIdentity, staffIdentity } from '~/utils/clinicalDisplay'
import { normalizeStatus } from '~/utils/status'
import type { LabStatus } from '~/types'

const route = useRoute()
const { launchPrint } = usePrintLauncher()
const { request, loading, saving, error, fetchRequest, recordResults } = useLab()
const statuses: LabStatus[] = ['REQUESTED', 'COLLECTED', 'IN_PROGRESS', 'RESULTED', 'VALIDATED', 'RELEASED']
const form = reactive({ status: 'REQUESTED' as LabStatus })
const criticalFlag = ref(false)
const resultNote = ref('')

onMounted(() => fetchRequest(route.params.id as string))

watch(request, (value) => {
  if (!value) return
  form.status = value.status
  criticalFlag.value = value.critical_flag
  resultNote.value = String(value.results?.summary ?? '')
})

async function save() {
  await recordResults(route.params.id as string, {
    status: form.status,
    critical_flag: criticalFlag.value,
    results: { summary: resultNote.value },
  })
}

function printRequest() {
  launchPrint(`/${route.params.tenant}/lab/${route.params.id}/print`)
}
</script>
