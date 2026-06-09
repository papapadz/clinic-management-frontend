<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Clinic insight"
      title="Reports and analytics"
      description="Review operational reports as summary cards, chart bars, and tabular rows."
    />

    <div v-if="error" class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      {{ error }}
    </div>

    <section class="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div class="grid gap-3 md:grid-cols-[1fr_160px_160px_auto] md:items-end">
        <FormField id="report_type" label="Report type">
          <select id="report_type" v-model="params.type" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-semibold">
            <option v-for="option in reportOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </FormField>
        <FormField id="date_from" label="From">
          <BaseInput id="date_from" v-model="params.date_from" type="date" />
        </FormField>
        <FormField id="date_to" label="To">
          <BaseInput id="date_to" v-model="params.date_to" type="date" />
        </FormField>
        <BaseButton :loading="loading" @click="loadReport">Run report</BaseButton>
      </div>
    </section>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        v-for="(item, index) in displayReport.summary"
        :key="item.label"
        :label="item.label"
        :value="item.value"
        :helper="item.helper"
        :tone="item.tone"
        :icon="metricIcon(index)"
        :delay="index * 40"
        :loading="loading"
      />
    </div>

    <section class="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div class="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-base font-bold">{{ activeReportLabel }}</h2>
          <p class="text-sm text-muted-foreground">
            {{ rawReport?.date_from || params.date_from || 'Start' }} to {{ rawReport?.date_to || params.date_to || 'today' }}
          </p>
        </div>
        <div class="inline-flex rounded-lg border border-border bg-muted p-1">
          <button
            v-for="mode in viewModes"
            :key="mode.value"
            type="button"
            class="rounded-md px-3 py-1.5 text-sm font-semibold transition"
            :class="viewMode === mode.value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
            @click="viewMode = mode.value"
          >
            {{ mode.label }}
          </button>
        </div>
      </div>

      <LoadingState v-if="loading" :rows="5" class="border-0 shadow-none" />
      <EmptyState v-else-if="displayReport.chartRows.length === 0" title="No report rows" description="Run a report or choose a different date range." :icon="BarChart3" />

      <div v-else-if="viewMode === 'chart'" class="space-y-4 p-4">
        <div v-for="row in displayReport.chartRows" :key="row.label" class="space-y-2">
          <div class="flex items-center justify-between gap-3 text-sm">
            <div>
              <p class="font-bold">{{ row.label }}</p>
              <p class="text-xs text-muted-foreground">{{ row.detail }}</p>
            </div>
            <p class="font-bold">{{ formatNumber(row.value) }}</p>
          </div>
          <div class="h-3 overflow-hidden rounded-full bg-muted">
            <div class="h-full rounded-full transition-all duration-500" :class="barTone(row.tone)" :style="{ width: `${barWidth(row.value)}%` }" />
          </div>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border text-sm">
          <thead class="bg-muted/60">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">Metric</th>
              <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">Value</th>
              <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">Detail</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="row in displayReport.tableRows" :key="row.label" class="transition hover:bg-muted/40">
              <td class="px-4 py-3 font-semibold">{{ row.label }}</td>
              <td class="px-4 py-3">{{ row.value }}</td>
              <td class="px-4 py-3 text-muted-foreground">{{ row.detail }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { BarChart3, CalendarDays, ClipboardList, Coins, PackageSearch } from 'lucide-vue-next'
import type { Component } from 'vue'
import type { ReportType } from '~/types'
import { formatNumber } from '~/utils/format'
import { normalizeReportResult, type NormalizedReport, type ReportTone } from '~/utils/reports'
import { useReports } from '~/composables/useReports'

const reportOptions: Array<{ label: string, value: ReportType }> = [
  { label: 'Daily census', value: 'daily_census' },
  { label: 'Revenue', value: 'revenue' },
  { label: 'Lab turnaround', value: 'lab_turnaround' },
  { label: 'Appointment analytics', value: 'appointment_analytics' },
  { label: 'Inventory valuation', value: 'inventory_valuation' },
]

const viewModes = [
  { label: 'Graphical', value: 'chart' },
  { label: 'Tabular', value: 'table' },
] as const

const params = reactive({
  type: 'daily_census' as ReportType,
  date_from: '',
  date_to: '',
  format: 'json' as const,
})
const viewMode = ref<'chart' | 'table'>('chart')
const { report, rawReport, loading, error, fetchReport } = useReports()

const displayReport = computed<NormalizedReport>(() => report.value ?? normalizeReportResult(params.type, null))
const activeReportLabel = computed(() => reportOptions.find((option) => option.value === params.type)?.label ?? 'Report')
const maxChartValue = computed(() => Math.max(1, ...displayReport.value.chartRows.map((row) => row.value)))

onMounted(() => loadReport())

async function loadReport() {
  await fetchReport({ ...params })
}

function barWidth(value: number): number {
  return Math.max(4, Math.round((value / maxChartValue.value) * 100))
}

function barTone(tone: ReportTone): string {
  const tones: Record<ReportTone, string> = {
    primary: 'bg-primary',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
  }

  return tones[tone]
}

function metricIcon(index: number): Component {
  return [ClipboardList, Coins, CalendarDays, PackageSearch][index % 4]
}
</script>
