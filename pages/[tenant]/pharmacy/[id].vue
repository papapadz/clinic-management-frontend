<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Dispensing" title="Pharmacy transaction detail" description="Review patient, ordering doctor, pharmacist, items, and total amount.">
      <template #actions>
        <BaseButton variant="outline" :to="`/${route.params.tenant}/pharmacy`">Back</BaseButton>
        <BaseButton v-if="transaction" variant="outline" :icon="Printer" @click="printTransaction">Print</BaseButton>
      </template>
    </PageHeader>

    <div v-if="error" class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{{ error }}</div>
    <LoadingState v-if="loading" />
    <section v-else-if="transaction" class="space-y-5">
      <div class="grid gap-4 md:grid-cols-4">
        <div class="rounded-lg border border-border bg-card p-4">
          <p class="text-xs font-bold uppercase text-muted-foreground">Patient</p>
          <p class="mt-1 font-bold">{{ patientIdentity(transaction.patient, transaction.patient_id) }}</p>
        </div>
        <div class="rounded-lg border border-border bg-card p-4">
          <p class="text-xs font-bold uppercase text-muted-foreground">Requesting doctor</p>
          <p class="mt-1 font-bold">{{ staffIdentity(transaction.requesting_clinician, transaction.requesting_clinician_id) }}</p>
        </div>
        <div class="rounded-lg border border-border bg-card p-4">
          <p class="text-xs font-bold uppercase text-muted-foreground">Pharmacist</p>
          <p class="mt-1 font-bold">{{ staffIdentity(transaction.pharmacist, transaction.pharmacist_id) }}</p>
        </div>
        <div class="rounded-lg border border-border bg-card p-4">
          <p class="text-xs font-bold uppercase text-muted-foreground">Amount</p>
          <p class="mt-1 font-bold">{{ formatMoney(transaction.total_amount) }}</p>
        </div>
      </div>

      <DataTable :columns="columns" :rows="transaction.items" empty-title="No items" empty-description="This transaction has no item rows.">
        <template #cell-item="{ row }">
          <span class="font-semibold">{{ row.item?.brand_name || row.item?.generic_name || row.item_id }}</span>
        </template>
        <template #cell-unit_price="{ row }">
          {{ formatMoney(row.unit_price) }}
        </template>
      </DataTable>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Printer } from 'lucide-vue-next'
import { usePharmacy } from '~/composables/usePharmacy'
import { patientIdentity, staffIdentity } from '~/utils/clinicalDisplay'
import type { DataTableColumn } from '~/types/ui'

const route = useRoute()
const { launchPrint } = usePrintLauncher()
const { transaction, loading, error, fetchTransaction } = usePharmacy()
const columns: DataTableColumn[] = [
  { key: 'item', label: 'Item' },
  { key: 'quantity', label: 'Qty' },
  { key: 'unit_price', label: 'Unit price', align: 'right' },
  { key: 'lot_number', label: 'Lot' },
]

onMounted(() => fetchTransaction(route.params.id as string))

function printTransaction() {
  launchPrint(`/${route.params.tenant}/pharmacy/${route.params.id}/print`)
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(value ?? 0))
}
</script>
