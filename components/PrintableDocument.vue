<template>
  <main class="print-document mx-auto max-w-4xl bg-white p-6 text-slate-950 shadow-sm print:mx-0 print:max-w-none print:p-0 print:shadow-none">
    <header class="border-b-2 border-slate-900 pb-4" :style="headerStyle">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex min-w-0 gap-3">
          <img
            v-if="document.facility.logo_url"
            :src="document.facility.logo_url"
            alt=""
            class="h-14 w-14 shrink-0 object-contain"
          >
          <div class="min-w-0">
          <p class="text-xs font-bold uppercase tracking-wide text-slate-500">Clinic document</p>
          <h1 class="mt-1 text-2xl font-bold text-slate-950">{{ document.facility.tenant_name || 'Clinic' }}</h1>
          <p v-if="subtitle" class="mt-1 text-sm text-slate-600">{{ subtitle }}</p>
          <p v-if="document.facility.email" class="mt-1 text-sm text-slate-600">{{ document.facility.email }}</p>
          </div>
        </div>
        <div class="text-left sm:text-right">
          <h2 class="text-xl font-bold text-slate-950">{{ document.title }}</h2>
          <p class="mt-1 text-sm text-slate-600">No. {{ document.document_number }}</p>
          <p class="text-sm text-slate-600">Generated {{ document.generated_at }}</p>
        </div>
      </div>
    </header>

    <section class="mt-5 grid gap-4 sm:grid-cols-2">
      <div class="border border-slate-300 p-3">
        <h3 class="text-xs font-bold uppercase tracking-wide text-slate-500">Patient</h3>
        <dl class="mt-2 space-y-1 text-sm">
          <div class="flex justify-between gap-3">
            <dt class="text-slate-500">Name</dt>
            <dd class="font-semibold text-slate-950">{{ document.patient.full_name || '-' }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-slate-500">Patient code</dt>
            <dd>{{ document.patient.patient_code || '-' }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-slate-500">DOB / Gender</dt>
            <dd>{{ [document.patient.dob, document.patient.gender].filter(Boolean).join(' / ') || '-' }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-slate-500">Contact</dt>
            <dd>{{ document.patient.contact_number || '-' }}</dd>
          </div>
        </dl>
      </div>

      <div class="border border-slate-300 p-3">
        <h3 class="text-xs font-bold uppercase tracking-wide text-slate-500">Staff</h3>
        <dl class="mt-2 space-y-1 text-sm">
          <div v-for="field in document.staff" :key="field.label" class="flex justify-between gap-3">
            <dt class="text-slate-500">{{ field.label }}</dt>
            <dd class="text-right font-semibold text-slate-950">{{ field.value }}</dd>
          </div>
          <div v-if="document.staff.length === 0" class="text-slate-500">-</div>
        </dl>
      </div>
    </section>

    <section v-for="section in document.sections" :key="section.title" class="mt-5">
      <h3 class="border-b border-slate-300 pb-1 text-sm font-bold uppercase tracking-wide text-slate-700">{{ section.title }}</h3>
      <dl class="mt-3 grid gap-2 sm:grid-cols-2">
        <div v-for="field in section.fields" :key="`${section.title}-${field.label}`" class="break-inside-avoid">
          <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ field.label }}</dt>
          <dd class="mt-1 whitespace-pre-line text-sm text-slate-950">{{ field.value }}</dd>
        </div>
      </dl>
    </section>

    <section v-if="document.line_items.length" class="mt-5">
      <h3 class="border-b border-slate-300 pb-1 text-sm font-bold uppercase tracking-wide text-slate-700">Line items</h3>
      <div class="mt-3 overflow-x-auto">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th v-for="column in itemColumns" :key="column.value" class="border border-slate-300 bg-slate-100 px-2 py-1 text-left font-bold">
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in document.line_items" :key="index">
              <td v-for="column in itemColumns" :key="`${index}-${column.value}`" class="border border-slate-300 px-2 py-1 align-top">
                {{ printableValue(item[column.value]) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="document.totals.length" class="ml-auto mt-5 max-w-sm space-y-1 text-sm">
      <div v-for="total in document.totals" :key="total.label" class="flex justify-between gap-4 border-b border-slate-200 py-1">
        <span class="font-semibold text-slate-600">{{ total.label }}</span>
        <strong class="text-slate-950">{{ total.value }}</strong>
      </div>
    </section>

    <footer v-if="document.signature_lines.length" class="mt-12 grid gap-8 sm:grid-cols-2">
      <div v-for="line in document.signature_lines" :key="line.label" class="pt-8 text-center">
        <div class="border-t border-slate-900 pt-2 text-sm font-semibold">{{ line.label }}</div>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PrintableDocument } from '~/types'
import { printableLineItemColumns, printableSubtitle, printableValue } from '~/utils/printableDocument'

const props = defineProps<{
  document: PrintableDocument
}>()

const subtitle = computed(() => printableSubtitle(props.document))
const itemColumns = computed(() => printableLineItemColumns(props.document.line_items))
const headerStyle = computed(() => {
  const primary = props.document.facility.theme?.primary
  return primary ? { borderColor: primary } : undefined
})
</script>
