<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Dispensing" title="Pharmacy transactions" description="Review dispensing, returns, restocks, adjustments, and waste transactions.">
      <template #actions>
        <BaseButton :icon="Plus" @click="showCreate = true">Dispense</BaseButton>
      </template>
    </PageHeader>
    <div v-if="error" class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      {{ error }}
    </div>
    <SearchToolbar v-model="search" placeholder="Search pharmacy..." label="Search pharmacy transactions" />
    <DataTable :columns="columns" :rows="transactions" :loading="loading" empty-title="No pharmacy transactions found" empty-description="Pharmacy activity will appear here.">
      <template #cell-transaction_type="{ row }">
        <StatusBadge :status="row.transaction_type" />
      </template>
      <template #cell-patient="{ row }">
        <span class="font-semibold">{{ patientIdentity(row.patient, row.patient_id) }}</span>
      </template>
      <template #cell-requesting_clinician="{ row }">
        <span class="text-muted-foreground">{{ staffIdentity(row.requesting_clinician, row.requesting_clinician_id) }}</span>
      </template>
      <template #cell-pharmacist="{ row }">
        <span class="text-muted-foreground">{{ staffIdentity(row.pharmacist, row.pharmacist_id) }}</span>
      </template>
      <template #cell-items="{ row }">
        <span class="text-muted-foreground">{{ itemSummary(row.items) }}</span>
      </template>
      <template #cell-total_amount="{ row }">
        <span class="font-semibold">{{ formatMoney(row.total_amount) }}</span>
      </template>
      <template #cell-actions="{ row }">
        <BaseButton :to="`/${route.params.tenant}/pharmacy/${row.id}`" variant="outline" size="sm">View</BaseButton>
      </template>
      <template #mobile-card="{ row }">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-bold">{{ patientIdentity(row.patient, row.patient_id) }}</p>
            <p class="mt-1 text-xs text-muted-foreground">{{ row.transaction_date }}</p>
          </div>
          <StatusBadge :status="row.transaction_type" />
        </div>
        <p class="text-sm text-muted-foreground">{{ itemSummary(row.items) }}</p>
        <p class="text-sm text-muted-foreground">{{ staffIdentity(row.requesting_clinician, row.requesting_clinician_id) }}</p>
        <p class="text-sm font-bold">{{ formatMoney(row.total_amount) }}</p>
        <BaseButton :to="`/${route.params.tenant}/pharmacy/${row.id}`" variant="outline" size="sm">View transaction</BaseButton>
      </template>
    </DataTable>

    <BaseDialog v-model:open="showCreate" title="Dispense medication" description="Record a dispensing transaction with the ordering doctor and dispensing pharmacist.">
      <form class="space-y-4 overflow-y-auto p-5" @submit.prevent="submitCreate">
        <div class="grid gap-4 md:grid-cols-2">
          <FormField id="patient-search" label="Find patient">
            <BaseInput id="patient-search" v-model="patientSearch" placeholder="Name or hospital number" />
          </FormField>
          <FormField id="staff-search" label="Find doctor">
            <BaseInput id="staff-search" v-model="staffSearch" placeholder="Name or employee ID" />
          </FormField>
          <FormField id="patient-id" label="Patient" :errors="validationErrors?.patient_id">
            <select id="patient-id" v-model="draft.patient_id" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="">Select patient</option>
              <option v-for="patient in patients" :key="patient.id" :value="patient.id">{{ patientIdentity(patient) }}</option>
            </select>
          </FormField>
          <FormField id="doctor-id" label="Requesting doctor" :errors="validationErrors?.requesting_clinician_id">
            <select id="doctor-id" v-model="draft.requesting_clinician_id" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="">Select doctor</option>
              <option v-for="person in staff" :key="person.id" :value="person.id">{{ staffIdentity(person) }}</option>
            </select>
          </FormField>
          <FormField id="pharmacist-id" label="Pharmacist">
            <select id="pharmacist-id" v-model="draft.pharmacist_id" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="">Current user</option>
              <option v-for="person in staff" :key="person.id" :value="person.id">{{ staffIdentity(person) }}</option>
            </select>
          </FormField>
          <FormField id="notes" label="Notes">
            <BaseInput id="notes" v-model="draft.notes" placeholder="Directions or remarks" />
          </FormField>
        </div>
        <div class="space-y-3 rounded-lg border border-border p-3">
          <div v-for="(item, index) in draft.items" :key="index" class="grid gap-3 md:grid-cols-[1fr_96px_120px_40px]">
            <select v-model="item.item_id" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="">Select medicine</option>
              <option v-for="medicine in pharmacyItems" :key="medicine.id" :value="medicine.id">
                {{ medicine.brand_name || medicine.generic_name }} - stock {{ medicine.current_stock }}
              </option>
            </select>
            <BaseInput v-model="item.quantity" type="number" min="1" placeholder="Qty" />
            <BaseInput v-model="item.unit_price" type="number" min="0" step="0.01" placeholder="Price" />
            <BaseButton variant="ghost" size="icon" @click="removeItem(index)">
              <Trash2 class="h-4 w-4" />
            </BaseButton>
          </div>
          <div class="flex items-center justify-between gap-3">
            <BaseButton variant="outline" size="sm" :icon="Plus" @click="addItem">Add item</BaseButton>
            <p class="text-sm font-bold">{{ formatMoney(totalAmount) }}</p>
          </div>
        </div>
        <div class="flex justify-end gap-2 border-t border-border pt-4">
          <BaseButton variant="outline" @click="showCreate = false">Cancel</BaseButton>
          <BaseButton type="submit" :loading="saving">Dispense</BaseButton>
        </div>
      </form>
    </BaseDialog>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { usePharmacy } from '~/composables/usePharmacy'
import { usePatient } from '~/composables/usePatient'
import { useStaffOptions } from '~/composables/useStaffOptions'
import { useCatalogs } from '~/composables/useCatalogs'
import { useRoute } from 'vue-router'
import type { PharmacyTransactionItem } from '~/types'
import { buildPharmacyDispensePayload, patientIdentity, staffIdentity } from '~/utils/clinicalDisplay'
import type { DataTableColumn } from '~/types/ui'

const search = ref('')
const showCreate = ref(false)
const patientSearch = ref('')
const staffSearch = ref('')
const draft = ref({
  patient_id: '',
  requesting_clinician_id: '',
  pharmacist_id: '',
  notes: '',
  items: [{ item_id: '', quantity: 1, unit_price: 0 }] as PharmacyTransactionItem[],
})
const { transactions, loading, saving, error, validationErrors, fetchTransactions, dispense } = usePharmacy()
const { patients, fetchPatients } = usePatient()
const { staff, fetchStaff } = useStaffOptions()
const { pharmacyItems, fetchPharmacyItems } = useCatalogs()
const route = useRoute()
const columns: DataTableColumn[] = [
  { key: 'transaction_date', label: 'Date' },
  { key: 'transaction_type', label: 'Type' },
  { key: 'patient', label: 'Patient' },
  { key: 'requesting_clinician', label: 'Doctor' },
  { key: 'pharmacist', label: 'Pharmacist' },
  { key: 'items', label: 'Items' },
  { key: 'total_amount', label: 'Amount', align: 'right' },
  { key: 'actions', label: 'Actions' },
]

function itemSummary(items: PharmacyTransactionItem[] = []): string {
  return items
    .map((item) => `${item.item?.brand_name || item.item?.generic_name || item.item_id} x ${item.quantity}`)
    .join(', ') || '-'
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value)
}

const totalAmount = computed(() => draft.value.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price || 0)), 0))

function addItem() {
  draft.value.items.push({ item_id: '', quantity: 1, unit_price: 0 })
}

function removeItem(index: number) {
  if (draft.value.items.length === 1) {
    draft.value.items = [{ item_id: '', quantity: 1, unit_price: 0 }]
    return
  }
  draft.value.items.splice(index, 1)
}

onMounted(() => {
  fetchTransactions()
  fetchPatients({ per_page: 20 })
  fetchStaff()
  fetchPharmacyItems({ per_page: 50 })
})

watch(search, (val) => {
  fetchTransactions(val ? { search: val } : {})
})

watch(patientSearch, (val) => {
  fetchPatients(val ? { search: val, per_page: 20 } : { per_page: 20 })
})

watch(staffSearch, (val) => {
  fetchStaff(val ? { search: val } : {})
})

async function submitCreate() {
  const res = await dispense(buildPharmacyDispensePayload(draft.value))
  if (res?.success) {
    showCreate.value = false
    draft.value = {
      patient_id: '',
      requesting_clinician_id: '',
      pharmacist_id: '',
      notes: '',
      items: [{ item_id: '', quantity: 1, unit_price: 0 }],
    }
  }
}
</script>
