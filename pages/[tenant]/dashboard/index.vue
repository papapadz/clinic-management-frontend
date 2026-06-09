<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Clinic command"
      title="Good day, care team"
      description="A warm operational view of today’s patient flow, appointments, and clinical activity."
    >
      <template #actions>
        <BaseButton variant="outline" :icon="RefreshCw" :loading="loading" @click="fetchStats">
          Refresh
        </BaseButton>
      </template>
    </PageHeader>

    <div v-if="error" class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      {{ error }}
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <MetricCard
        label="Patients"
        :value="stats.patients"
        helper="Registered patient records"
        :icon="Users"
        :loading="loading"
      />
      <MetricCard
        label="Appointments"
        :value="stats.appointments"
        helper="Scheduled care moments"
        :icon="CalendarDays"
        tone="success"
        :loading="loading"
        :delay="80"
      />
      <MetricCard
        label="Encounters"
        :value="stats.encounters"
        helper="Clinical visits captured"
        :icon="Stethoscope"
        tone="warning"
        :loading="loading"
        :delay="160"
      />
    </div>

    <div class="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
      <section class="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-bold">Today’s flow</h2>
            <p class="mt-1 text-sm text-muted-foreground">A quick staff handoff view for the front desk and clinical team.</p>
          </div>
          <StatusBadge status="IN_PROGRESS" label="Live workspace" />
        </div>
        <div class="mt-5 grid gap-3 sm:grid-cols-3">
          <div v-for="item in flowItems" :key="item.label" class="rounded-xl border border-border bg-background/70 p-4">
            <p class="text-sm font-semibold text-muted-foreground">{{ item.label }}</p>
            <p class="mt-2 text-2xl font-bold">{{ item.value }}</p>
            <p class="mt-1 text-xs text-muted-foreground">{{ item.helper }}</p>
          </div>
        </div>
      </section>

      <section class="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 class="text-lg font-bold">Quick actions</h2>
        <div class="mt-4 space-y-2">
          <BaseButton :to="`/${route.params.tenant}/patients`" variant="outline" block :icon="Users">
            Find patient
          </BaseButton>
          <BaseButton :to="`/${route.params.tenant}/appointments`" variant="outline" block :icon="CalendarDays">
            Review appointments
          </BaseButton>
          <BaseButton :to="`/${route.params.tenant}/billing`" variant="outline" block :icon="CreditCard">
            Open billing
          </BaseButton>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { CalendarDays, CreditCard, RefreshCw, Stethoscope, Users } from 'lucide-vue-next'
import { useApi } from '~/composables/useApi'
import { useRoute } from 'vue-router'

const stats = ref({ patients: 0, appointments: 0, encounters: 0 })
const loading = ref(false)
const error = ref<string | null>(null)
const api = useApi()
const route = useRoute()

const flowItems = computed(() => [
  { label: 'Waiting room', value: stats.value.appointments, helper: 'Appointments to coordinate' },
  { label: 'Clinical activity', value: stats.value.encounters, helper: 'Encounters in the record' },
  { label: 'Patient base', value: stats.value.patients, helper: 'People in care' },
])


async function fetchStats() {
  loading.value = true
  error.value = null
  try {
    const res = await api.api(api.tenantPath('/reports'))
    // The API returns { type, date_from, date_to, format, results }
    const results = (res.data as any)?.results ?? {}
    if (res.success) {
      stats.value = {
        patients: results.patients ?? 0,
        appointments: results.appointments ?? 0,
        encounters: results.encounters ?? 0,
      }
    } else {
      error.value = res.message || 'Failed to load stats'
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to load stats'
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
</script>
