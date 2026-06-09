<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Cashier desk"
      title="Billing transactions"
      description="Create bills, inspect breakdowns, edit open snapshots, process payments, and void pending charges."
    >
      <template #actions>
        <BaseButton :icon="Plus" @click="openCreateModal">New bill</BaseButton>
      </template>
    </PageHeader>

    <div v-if="error" class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      {{ error }}
    </div>
    <div v-if="successMessage" class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
      {{ successMessage }}
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Pending balance" :value="formatCurrency(summary.pendingBalance)" helper="Open receivables" :icon="WalletCards" tone="warning" :loading="loading" />
      <MetricCard label="Paid revenue" :value="formatCurrency(summary.paidRevenue)" helper="Fully paid transactions" :icon="ReceiptText" tone="success" :loading="loading" />
      <MetricCard label="Partial" :value="summary.partialCount" helper="Partially paid bills" :icon="CircleDollarSign" tone="primary" :loading="loading" />
      <MetricCard label="Voided" :value="summary.voidedCount" helper="Cancelled bills" :icon="Ban" tone="danger" :loading="loading" />
    </div>

    <section class="space-y-4">
      <div class="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <SearchToolbar v-model="filters.search" placeholder="Search billing..." label="Search billing transactions" class="md:min-w-80" />
        <select v-model="filters.status" class="field-input md:w-48">
          <option value="">All statuses</option>
          <option v-for="status in billingStatuses" :key="status" :value="status">{{ statusLabel(status) }}</option>
        </select>
      </div>

      <DataTable :columns="columns" :rows="transactions" :loading="loading" empty-title="No billing transactions found" empty-description="Create a bill or adjust your filters to see cashier activity.">
        <template #cell-transaction_number="{ row }">
          <button class="text-left" type="button" @click="openBreakdown(row)">
            <span class="font-semibold text-primary hover:underline">{{ row.transaction_number }}</span>
            <span class="block text-xs text-muted-foreground">{{ formatDateTime(row.transaction_date) }}</span>
          </button>
        </template>
        <template #cell-patient="{ row }">
          <span class="font-semibold">{{ row.patient?.full_name || `Patient #${row.patient_id}` }}</span>
        </template>
        <template #cell-grand_total="{ row }">
          <span class="font-bold">{{ formatCurrency(Number(row.grand_total)) }}</span>
        </template>
        <template #cell-balance="{ row }">
          <span class="font-semibold">{{ formatCurrency(Number(row.balance)) }}</span>
        </template>
        <template #cell-status="{ row }">
          <StatusBadge :status="row.status" />
        </template>
        <template #cell-actions="{ row }">
          <div class="flex justify-end gap-2">
            <BaseButton size="sm" variant="outline" :icon="PanelRightOpen" @click="openBreakdown(row)">Breakdown</BaseButton>
            <BaseButton size="sm" variant="outline" :icon="Printer" @click="printInvoice(row.id)">Print</BaseButton>
            <BaseButton size="sm" variant="outline" :disabled="!canProcess(row)" :loading="processingId === row.id" @click="startProcess(row)">Pay</BaseButton>
            <BaseButton size="sm" variant="danger" :disabled="!canVoid(row)" :loading="voidingId === row.id" @click="startVoid(row)">Void</BaseButton>
          </div>
        </template>
        <template #mobile-card="{ row }">
          <button class="block w-full text-left" type="button" @click="openBreakdown(row)">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-bold text-primary">{{ row.transaction_number }}</p>
                <p class="mt-1 text-xs text-muted-foreground">{{ row.patient?.full_name || `Patient #${row.patient_id}` }}</p>
              </div>
              <StatusBadge :status="row.status" />
            </div>
            <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-xs font-semibold uppercase text-muted-foreground">Total</p>
                <p class="font-bold">{{ formatCurrency(Number(row.grand_total)) }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase text-muted-foreground">Balance</p>
                <p class="font-bold">{{ formatCurrency(Number(row.balance)) }}</p>
              </div>
            </div>
          </button>
        </template>
      </DataTable>
    </section>

    <BaseDialog v-model:open="showBreakdown" :title="selectedTransaction?.transaction_number || 'Billing breakdown'" :description="selectedTransaction ? `${selectedTransaction.patient?.full_name || `Patient #${selectedTransaction.patient_id}`} · ${formatDateTime(selectedTransaction.transaction_date)}` : undefined">
      <form v-if="selectedTransaction" class="min-h-0 overflow-y-auto" @submit.prevent="handleUpdate">
        <div class="grid min-h-0 gap-5 overflow-y-auto p-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div class="space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/35 p-3">
              <div>
                <p class="text-xs font-bold uppercase tracking-wide text-muted-foreground">Ownership</p>
                <p class="mt-1 text-sm font-semibold">{{ selectedTransaction.patient?.full_name || `Patient #${selectedTransaction.patient_id}` }}</p>
                <p class="mt-1 text-xs text-muted-foreground">Encounter {{ selectedTransaction.encounter_id || '-' }}</p>
              </div>
              <div class="flex items-center gap-2">
                <StatusBadge :status="selectedTransaction.status" />
                <BaseButton v-if="canEdit(selectedTransaction)" type="button" size="sm" variant="outline" :icon="editMode ? Eye : Pencil" @click="toggleEditMode">
                  {{ editMode ? 'View' : 'Edit' }}
                </BaseButton>
              </div>
            </div>

            <section class="space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold uppercase tracking-wide text-muted-foreground">Line items</h3>
                <BaseButton v-if="editMode" type="button" size="sm" variant="outline" :icon="Plus" @click="addEditLineItem">Add</BaseButton>
              </div>
              <div v-for="(item, index) in editForm.line_items" :key="index" class="space-y-3 rounded-lg border border-border bg-background/70 p-3">
                <template v-if="editMode">
                  <FormField :id="`edit-description-${index}`" label="Description" :errors="fieldErrors(`line_items.${index}.description`)">
                    <BaseInput :id="`edit-description-${index}`" v-model="item.description" :has-error="fieldErrors(`line_items.${index}.description`).length > 0" />
                  </FormField>
                  <div class="grid grid-cols-2 gap-2">
                    <FormField :id="`edit-quantity-${index}`" label="Qty">
                      <BaseInput :id="`edit-quantity-${index}`" v-model="item.quantity" type="number" min="1" />
                    </FormField>
                    <FormField :id="`edit-unit-${index}`" label="Price">
                      <BaseInput :id="`edit-unit-${index}`" v-model="item.unit_price" type="number" min="0" step="0.01" />
                    </FormField>
                  </div>
                </template>
                <template v-else>
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-sm font-semibold">{{ item.description }}</p>
                      <p class="mt-1 text-xs text-muted-foreground">{{ item.quantity }} x {{ formatCurrency(Number(item.unit_price)) }}</p>
                    </div>
                    <p class="text-sm font-bold">{{ formatCurrency(lineTotal(item)) }}</p>
                  </div>
                </template>
                <div v-if="editMode" class="flex items-center justify-between">
                  <p class="text-sm font-bold">{{ formatCurrency(lineTotal(item)) }}</p>
                  <BaseButton type="button" size="sm" variant="ghost" :disabled="editForm.line_items.length === 1" @click="removeEditLineItem(index)">Remove</BaseButton>
                </div>
              </div>
            </section>

            <section v-if="editMode" class="grid gap-3 sm:grid-cols-2">
              <FormField id="edit_discount_total" label="Bill discount" :errors="fieldErrors('discount_total')">
                <BaseInput id="edit_discount_total" v-model="editForm.discount_total" type="number" min="0" step="0.01" :has-error="fieldErrors('discount_total').length > 0" />
              </FormField>
              <FormField id="edit_vat_amount" label="VAT" :errors="fieldErrors('vat_amount')" :helper="vatHelper">
                <BaseInput id="edit_vat_amount" v-model="editForm.vat_amount" type="number" min="0" step="0.01" :placeholder="vatPlaceholder" :has-error="fieldErrors('vat_amount').length > 0" @input="editVatTouched = true" />
              </FormField>
              <FormField id="edit_amount_paid" label="Amount paid" :errors="fieldErrors('amount_paid')">
                <BaseInput id="edit_amount_paid" v-model="editForm.amount_paid" type="number" min="0" step="0.01" :has-error="fieldErrors('amount_paid').length > 0" />
              </FormField>
              <FormField id="edit_payment_mode" label="Payment mode" :errors="fieldErrors('payment_mode')">
                <select id="edit_payment_mode" v-model="editForm.payment_mode" class="field-input">
                  <option value="">No payment yet</option>
                  <option v-for="mode in selectablePaymentModes(editForm.payment_mode)" :key="mode.code" :value="mode.code">
                    {{ modeLabel(mode) }}
                  </option>
                </select>
              </FormField>
              <FormField v-if="editRequiresReference" id="edit_or_number" label="Reference number" :errors="fieldErrors('or_number')">
                <BaseInput id="edit_or_number" v-model="editForm.or_number" :has-error="fieldErrors('or_number').length > 0" />
              </FormField>
              <FormField id="edit_payee_name" label="Name of payee" :errors="fieldErrors('payee_name')">
                <BaseInput id="edit_payee_name" v-model="editForm.payee_name" :has-error="fieldErrors('payee_name').length > 0" />
              </FormField>
              <FormField id="edit_payee_address" label="Address" :errors="fieldErrors('payee_address')" class="sm:col-span-2">
                <textarea id="edit_payee_address" v-model="editForm.payee_address" rows="3" class="field-input h-auto py-2" />
              </FormField>
            </section>
          </div>

          <aside class="space-y-4 rounded-lg border border-border bg-muted/35 p-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-muted-foreground">Bill total</p>
              <h3 class="mt-1 text-xl font-bold">{{ formatCurrency(editTotals.grandTotal) }}</h3>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between"><span>Subtotal</span><strong>{{ formatCurrency(editTotals.subtotal) }}</strong></div>
              <div class="flex justify-between"><span>Discount</span><strong>{{ formatCurrency(editTotals.discountTotal) }}</strong></div>
              <div class="flex justify-between"><span>VAT</span><strong>{{ formatCurrency(editTotals.vatAmount) }}</strong></div>
              <div class="flex justify-between border-t border-border pt-2"><span>Grand total</span><strong>{{ formatCurrency(editTotals.grandTotal) }}</strong></div>
              <div class="flex justify-between"><span>Amount paid</span><strong>{{ formatCurrency(editTotals.amountPaid) }}</strong></div>
              <div class="flex justify-between"><span>Balance</span><strong>{{ formatCurrency(editTotals.balance) }}</strong></div>
              <div class="flex justify-between"><span>Change</span><strong>{{ formatCurrency(editTotals.changeAmount) }}</strong></div>
            </div>
            <div class="space-y-1 text-sm">
              <p><span class="font-semibold">Payment mode:</span> {{ displayPaymentMode(editForm.payment_mode) }}</p>
              <p><span class="font-semibold">Reference:</span> {{ editRequiresReference ? editForm.or_number || '-' : '-' }}</p>
              <p><span class="font-semibold">Payee:</span> {{ editForm.payee_name || '-' }}</p>
            </div>
            <div class="flex flex-col gap-2">
              <BaseButton v-if="editMode" type="submit" :loading="saving" :disabled="!canSubmitEdit">Save changes</BaseButton>
              <BaseButton type="button" variant="outline" :disabled="!canProcess(selectedTransaction)" @click="startProcess(selectedTransaction)">Process payment</BaseButton>
              <BaseButton type="button" variant="danger" :disabled="!canVoid(selectedTransaction)" @click="startVoid(selectedTransaction)">Void bill</BaseButton>
            </div>
          </aside>
        </div>
      </form>
    </BaseDialog>

    <BaseDialog v-model:open="showCreate" title="New bill" description="Look up the patient, choose an encounter when available, then enter line items and payment details.">
      <form class="min-h-0 overflow-y-auto" @submit.prevent="handleCreate">
        <div class="grid min-h-0 gap-5 overflow-y-auto p-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div class="space-y-5">
            <section class="space-y-3">
              <div class="flex items-center justify-between gap-3">
                <h3 class="text-sm font-bold uppercase tracking-wide text-muted-foreground">Patient lookup</h3>
                <BaseButton v-if="selectedPatient" type="button" size="sm" variant="ghost" @click="clearSelectedPatient">Clear</BaseButton>
              </div>
              <FormField id="patient_search" label="Find patient" :errors="fieldErrors('patient_id')" helper="Search by name, code, email, or contact number.">
                <BaseInput id="patient_search" v-model="patientSearch" :disabled="Boolean(selectedPatient)" :has-error="fieldErrors('patient_id').length > 0" placeholder="Type at least 2 characters" />
              </FormField>
              <div v-if="selectedPatient" class="rounded-lg border border-primary/25 bg-primary/5 p-3 text-sm">
                <p class="font-bold">{{ patientName(selectedPatient) }}</p>
                <p class="mt-1 text-xs text-muted-foreground">{{ selectedPatient.patient_code }} · {{ selectedPatient.gender }} · {{ selectedPatient.contact_number || 'No contact' }}</p>
              </div>
              <div v-else class="max-h-52 overflow-y-auto rounded-lg border border-border bg-background">
                <button v-for="patient in patientResults" :key="patient.id" type="button" class="block w-full border-b border-border px-3 py-2 text-left text-sm last:border-b-0 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" @click="selectPatient(patient)">
                  <span class="font-semibold">{{ patientName(patient) }}</span>
                  <span class="mt-1 block text-xs text-muted-foreground">{{ patient.patient_code }} · {{ patient.contact_number || 'No contact' }}</span>
                </button>
                <p v-if="patientLookupHint" class="px-3 py-4 text-sm text-muted-foreground">{{ patientLookupHint }}</p>
              </div>
            </section>

            <section class="space-y-3">
              <h3 class="text-sm font-bold uppercase tracking-wide text-muted-foreground">Encounter lookup</h3>
              <div v-if="selectedPatient" class="max-h-44 overflow-y-auto rounded-lg border border-border bg-background">
                <button v-for="encounter in encounterResults" :key="encounter.id" type="button" :class="['block w-full border-b border-border px-3 py-2 text-left text-sm last:border-b-0 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', form.encounter_id === encounter.id ? 'bg-primary/10 text-primary' : '']" @click="selectEncounter(encounter.id)">
                  <span class="font-semibold">{{ encounter.encounter_type }} · {{ statusLabel(encounter.status) }}</span>
                  <span class="mt-1 block text-xs text-muted-foreground">{{ formatDateTime(encounter.encounter_date) }} · {{ encounter.chief_complaint || 'No chief complaint' }}</span>
                </button>
                <p v-if="encounterLookupHint" class="px-3 py-4 text-sm text-muted-foreground">{{ encounterLookupHint }}</p>
              </div>
              <p v-else class="rounded-lg border border-border bg-muted/40 px-3 py-4 text-sm text-muted-foreground">Select a patient first to see encounters.</p>
            </section>

            <LineItemEditor :items="form.line_items" :field-errors="fieldErrors" @add="addLineItem" @remove="removeLineItem" />

            <section class="grid gap-3 sm:grid-cols-2">
              <FormField id="discount_total" label="Bill discount" :errors="fieldErrors('discount_total')">
                <BaseInput id="discount_total" v-model="form.discount_total" type="number" min="0" step="0.01" :has-error="fieldErrors('discount_total').length > 0" />
              </FormField>
              <FormField id="vat_amount" label="VAT" :errors="fieldErrors('vat_amount')" :helper="vatHelper">
                <BaseInput id="vat_amount" v-model="form.vat_amount" type="number" min="0" step="0.01" :placeholder="vatPlaceholder" :has-error="fieldErrors('vat_amount').length > 0" @input="createVatTouched = true" />
              </FormField>
              <FormField id="amount_paid" label="Amount paid" :errors="fieldErrors('amount_paid')">
                <BaseInput id="amount_paid" v-model="form.amount_paid" type="number" min="0" step="0.01" :has-error="fieldErrors('amount_paid').length > 0" />
              </FormField>
              <FormField id="payment_mode" label="Payment mode" :errors="fieldErrors('payment_mode')">
                <select id="payment_mode" v-model="form.payment_mode" class="field-input">
                  <option value="">No payment yet</option>
                  <option v-for="mode in activePaymentModes" :key="mode.code" :value="mode.code">{{ mode.name }}</option>
                </select>
              </FormField>
              <FormField v-if="createRequiresReference" id="or_number" label="Reference number" :errors="fieldErrors('or_number')">
                <BaseInput id="or_number" v-model="form.or_number" :has-error="fieldErrors('or_number').length > 0" />
              </FormField>
              <FormField id="payee_name" label="Name of payee" :errors="fieldErrors('payee_name')">
                <BaseInput id="payee_name" v-model="form.payee_name" :has-error="fieldErrors('payee_name').length > 0" />
              </FormField>
              <FormField id="payee_address" label="Address" :errors="fieldErrors('payee_address')" class="sm:col-span-2">
                <textarea id="payee_address" v-model="form.payee_address" rows="3" class="field-input h-auto py-2" />
              </FormField>
            </section>
          </div>

          <BillPreview :totals="totals" :status="statusPreview" />
        </div>

        <div class="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-background/95 px-5 py-4 backdrop-blur">
          <BaseButton type="button" variant="outline" @click="closeCreateModal">Cancel</BaseButton>
          <BaseButton type="submit" :loading="saving" :disabled="!canSubmitCreate">Create bill</BaseButton>
        </div>
      </form>
    </BaseDialog>

    <BaseDialog v-model:open="showProcess" title="Process payment" :description="processTarget ? `Apply a payment to ${processTarget.transaction_number}. Enter a smaller amount for partial payment.` : undefined">
      <form v-if="processTarget" class="min-h-0 overflow-y-auto" @submit.prevent="handleProcess">
        <div class="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div class="space-y-4">
            <div class="rounded-lg border border-border bg-muted/35 p-3 text-sm">
              <p class="font-bold">{{ processTarget.patient?.full_name || `Patient #${processTarget.patient_id}` }}</p>
              <p class="mt-1 text-xs text-muted-foreground">{{ processTarget.transaction_number }} · Balance {{ formatCurrency(Number(processTarget.balance)) }}</p>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <FormField id="process_payment_amount" label="Payment amount" :errors="fieldErrors('payment_amount')">
                <BaseInput id="process_payment_amount" v-model="processForm.payment_amount" type="number" min="0.01" step="0.01" required :has-error="fieldErrors('payment_amount').length > 0" />
              </FormField>
              <FormField id="process_payment_mode" label="Payment mode" :errors="fieldErrors('payment_mode')">
                <select id="process_payment_mode" v-model="processForm.payment_mode" required class="field-input">
                  <option v-for="mode in activePaymentModes" :key="mode.code" :value="mode.code">{{ mode.name }}</option>
                </select>
              </FormField>
              <FormField v-if="processRequiresReference" id="process_or_number" label="Reference number" :errors="fieldErrors('or_number')">
                <BaseInput id="process_or_number" v-model="processForm.or_number" :has-error="fieldErrors('or_number').length > 0" />
              </FormField>
              <FormField id="process_payee_name" label="Name of payee" :errors="fieldErrors('payee_name')">
                <BaseInput id="process_payee_name" v-model="processForm.payee_name" required :has-error="fieldErrors('payee_name').length > 0" />
              </FormField>
              <FormField id="process_payee_address" label="Address" :errors="fieldErrors('payee_address')" class="sm:col-span-2">
                <textarea id="process_payee_address" v-model="processForm.payee_address" rows="3" required class="field-input h-auto py-2" />
              </FormField>
            </div>
          </div>

          <aside class="space-y-3 rounded-lg border border-border bg-muted/35 p-4 text-sm">
            <p class="text-xs font-bold uppercase tracking-wide text-muted-foreground">Payment preview</p>
            <div class="flex justify-between"><span>Current paid</span><strong>{{ formatCurrency(Number(processTarget.amount_paid)) }}</strong></div>
            <div class="flex justify-between"><span>This payment</span><strong>{{ formatCurrency(processPaymentAmount) }}</strong></div>
            <div class="flex justify-between border-t border-border pt-2"><span>New paid</span><strong>{{ formatCurrency(processPreview.amountPaid) }}</strong></div>
            <div class="flex justify-between"><span>New balance</span><strong>{{ formatCurrency(processPreview.balance) }}</strong></div>
            <div class="flex justify-between"><span>Change</span><strong>{{ formatCurrency(processPreview.changeAmount) }}</strong></div>
            <StatusBadge :status="processPreview.status" />
          </aside>
        </div>
        <div class="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-background/95 px-5 py-4 backdrop-blur">
          <BaseButton type="button" variant="outline" @click="closeProcessModal">Cancel</BaseButton>
          <BaseButton type="submit" :loading="processingId === processTarget.id" :disabled="!canSubmitProcess">Apply payment</BaseButton>
        </div>
      </form>
    </BaseDialog>

    <BaseDialog v-model:open="showVoid" :title="voidTarget ? `Void ${voidTarget.transaction_number}` : 'Void bill'" description="A reason is required for cashier audit context.">
      <form v-if="voidTarget" class="space-y-4 p-5" @submit.prevent="handleVoid">
        <FormField id="void_reason" label="Void reason">
          <textarea id="void_reason" v-model="voidReason" rows="3" required class="field-input h-auto py-2" />
        </FormField>
        <div class="flex justify-end gap-2">
          <BaseButton type="button" variant="outline" @click="cancelVoid">Cancel</BaseButton>
          <BaseButton type="submit" variant="danger" :loading="voidingId === voidTarget.id">Void transaction</BaseButton>
        </div>
      </form>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, reactive, ref, watch } from 'vue'
import { Ban, CircleDollarSign, Eye, PanelRightOpen, Pencil, Plus, Printer, ReceiptText, WalletCards } from 'lucide-vue-next'
import type { BillingLineItem, BillingProcessPaymentForm, BillingQuickOrderForm, BillingStatus, BillingTransaction, Encounter, Patient, PaymentModeRecord } from '~/types'
import type { DataTableColumn } from '~/types/ui'
import { formatCurrency, formatDateTime, statusLabel } from '~/utils/format'
import { billingStatusPreview, blankBillingLineItem, buildBillingPayload, buildProcessPaymentPayload, calculateBillingTotals, defaultPayeeAddress, defaultPayeeName, lineTotal, paymentModeRequiresReference, toNumber } from '~/utils/billing'
import { useAuthStore } from '~/stores/auth'
import { useBilling } from '~/composables/useBilling'
import { useEncounter } from '~/composables/useEncounter'
import { usePatient } from '~/composables/usePatient'

definePageMeta({ middleware: ['auth', 'tenant'] })

const billingStatuses: BillingStatus[] = ['PENDING', 'PARTIAL', 'PAID', 'VOIDED', 'REFUNDED']
const columns: DataTableColumn[] = [
  { key: 'transaction_number', label: 'Transaction' },
  { key: 'patient', label: 'Patient' },
  { key: 'grand_total', label: 'Total', align: 'right' },
  { key: 'balance', label: 'Balance', align: 'right' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions', align: 'right' },
]

const auth = useAuthStore()
const route = useRoute()
const { launchPrint } = usePrintLauncher()
const {
  transactions,
  paymentModes,
  vatRates,
  loading,
  saving,
  error,
  validationErrors,
  fetchTransactions,
  fetchPaymentModes,
  fetchVatRates,
  createTransaction,
  updateTransaction,
  processTransaction,
  voidTransaction,
} = useBilling()
const { patients: patientResults, loading: patientsLoading, fetchPatients } = usePatient()
const encounterLookup = useEncounter()

const filters = reactive({ search: '', status: '' })
const form = reactive<BillingQuickOrderForm>(emptyForm())
const editForm = reactive<BillingQuickOrderForm>(emptyForm())
const processForm = reactive<BillingProcessPaymentForm>(emptyProcessForm())
const showCreate = ref(false)
const showBreakdown = ref(false)
const showProcess = ref(false)
const showVoid = ref(false)
const editMode = ref(false)
const successMessage = ref('')
const selectedTransaction = ref<BillingTransaction | null>(null)
const processTarget = ref<BillingTransaction | null>(null)
const voidTarget = ref<BillingTransaction | null>(null)
const selectedPatient = ref<Patient | null>(null)
const patientSearch = ref('')
const voidReason = ref('')
const processingId = ref<string | number | null>(null)
const voidingId = ref<string | number | null>(null)
const createVatTouched = ref(false)
const editVatTouched = ref(false)
let transactionSearchTimer: ReturnType<typeof setTimeout> | null = null
let patientSearchTimer: ReturnType<typeof setTimeout> | null = null

const permissions = computed(() => auth.user?.permissions ?? [])
const activePaymentModes = computed(() => paymentModes.value.filter((mode) => mode.is_active))
const defaultVatRate = computed(() => vatRates.value.find((rate) => rate.is_default) ?? vatRates.value[0])
const vatHelper = computed(() => defaultVatRate.value ? `Suggested from ${defaultVatRate.value.name}.` : 'No VAT rate suggestion available.')
const vatPlaceholder = computed(() => defaultVatRate.value ? `${Number(defaultVatRate.value.percentage).toFixed(2)}% of taxable charges` : '0.00')
const encounterResults = computed(() => encounterLookup.encounters.value)
const totals = computed(() => calculateBillingTotals(form))
const editTotals = computed(() => calculateBillingTotals(editForm))
const statusPreview = computed(() => billingStatusPreview(totals.value))
const createRequiresReference = computed(() => paymentModeRequiresReference(form.payment_mode, paymentModes.value))
const editRequiresReference = computed(() => paymentModeRequiresReference(editForm.payment_mode, paymentModes.value))
const processRequiresReference = computed(() => paymentModeRequiresReference(processForm.payment_mode, paymentModes.value))
const canSubmitCreate = computed(() => Boolean(form.patient_id) && form.line_items.some((item) => item.description.trim()) && !saving.value)
const canSubmitEdit = computed(() => Boolean(selectedTransaction.value) && editForm.line_items.some((item) => item.description.trim()) && !saving.value)
const processPaymentAmount = computed(() => toNumber(processForm.payment_amount))
const processPreview = computed(() => {
  const transaction = processTarget.value
  const grandTotal = Number(transaction?.grand_total ?? 0)
  const amountPaid = Number(transaction?.amount_paid ?? 0) + processPaymentAmount.value
  const balance = Math.max(0, grandTotal - amountPaid)

  return {
    amountPaid,
    balance,
    changeAmount: processForm.payment_mode === 'CASH' ? Math.max(0, amountPaid - grandTotal) : 0,
    status: amountPaid <= 0 && grandTotal > 0 ? 'PENDING' as BillingStatus : balance > 0 ? 'PARTIAL' as BillingStatus : 'PAID' as BillingStatus,
  }
})
const canSubmitProcess = computed(() => Boolean(processTarget.value) && processPaymentAmount.value > 0 && processForm.payment_mode && processForm.payee_name.trim().length > 0 && processForm.payee_address?.trim().length && !saving.value)
const patientLookupHint = computed(() => {
  if (patientsLoading.value) return 'Searching patients...'
  if (patientSearch.value.trim().length < 2) return 'Type at least 2 characters to search.'
  if (patientResults.value.length === 0) return 'No matching patients found.'
  return ''
})
const encounterLookupHint = computed(() => {
  if (encounterLookup.loading.value) return 'Loading encounters...'
  if (encounterResults.value.length === 0) return 'No encounters found for this patient.'
  return ''
})
const summary = computed(() => transactions.value.reduce((totals, transaction) => {
  if (transaction.status === 'PENDING' || transaction.status === 'PARTIAL') totals.pendingBalance += Number(transaction.balance ?? 0)
  if (transaction.status === 'PAID') totals.paidRevenue += Number(transaction.grand_total ?? 0)
  if (transaction.status === 'PARTIAL') totals.partialCount += 1
  if (transaction.status === 'VOIDED') totals.voidedCount += 1
  return totals
}, { pendingBalance: 0, paidRevenue: 0, partialCount: 0, voidedCount: 0 }))

onMounted(async () => {
  await Promise.all([fetchPaymentModes(true), fetchVatRates(), loadTransactions()])
})

watch(() => filters.search, () => {
  if (transactionSearchTimer) clearTimeout(transactionSearchTimer)
  transactionSearchTimer = setTimeout(loadTransactions, 250)
})
watch(() => filters.status, loadTransactions)
watch(patientSearch, () => {
  if (selectedPatient.value) return
  if (patientSearchTimer) clearTimeout(patientSearchTimer)
  patientSearchTimer = setTimeout(() => {
    const search = patientSearch.value.trim()
    if (search.length >= 2) fetchPatients({ search, per_page: 8 })
  }, 250)
})
watch([() => totals.value.subtotal, () => form.discount_total, defaultVatRate], () => {
  if (!createVatTouched.value) form.vat_amount = suggestedVatAmount(form)
})
watch([() => editTotals.value.subtotal, () => editForm.discount_total, defaultVatRate], () => {
  if (editMode.value && !editVatTouched.value) editForm.vat_amount = suggestedVatAmount(editForm)
})
watch(() => form.amount_paid, () => {
  if (toNumber(form.amount_paid) <= 0) form.payment_mode = ''
})
watch(() => editForm.amount_paid, () => {
  if (toNumber(editForm.amount_paid) <= 0) editForm.payment_mode = ''
})

function emptyForm(): BillingQuickOrderForm {
  return {
    patient_id: '',
    encounter_id: '',
    line_items: [blankBillingLineItem()],
    payment_mode: '',
    amount_paid: 0,
    discount_total: 0,
    vat_amount: 0,
    or_number: '',
    payee_name: '',
    payee_address: '',
  }
}

function emptyProcessForm(): BillingProcessPaymentForm {
  return { payment_amount: 0, or_number: '', payee_name: '', payee_address: '', payment_mode: 'CASH' }
}

async function loadTransactions() {
  await fetchTransactions({ search: filters.search || undefined, status: filters.status || undefined, per_page: 50 })
}

function openCreateModal() {
  successMessage.value = ''
  showCreate.value = true
  if (patientSearch.value.trim().length >= 2) fetchPatients({ search: patientSearch.value.trim(), per_page: 8 })
}

function closeCreateModal() {
  showCreate.value = false
}

function resetForm() {
  Object.assign(form, emptyForm())
  selectedPatient.value = null
  patientSearch.value = ''
  createVatTouched.value = false
  encounterLookup.encounters.value = []
}

function addLineItem() {
  form.line_items.push(blankBillingLineItem())
}

function removeLineItem(index: number) {
  form.line_items.splice(index, 1)
}

function addEditLineItem() {
  editForm.line_items.push(blankBillingLineItem())
}

function removeEditLineItem(index: number) {
  editForm.line_items.splice(index, 1)
}

function openBreakdown(transaction: BillingTransaction) {
  selectedTransaction.value = transaction
  loadEditForm(transaction)
  editMode.value = false
  showBreakdown.value = true
}

function printInvoice(id: string | number) {
  launchPrint(`/${route.params.tenant}/billing/${id}/invoice-print`)
}

function toggleEditMode() {
  editMode.value = !editMode.value
  if (selectedTransaction.value) loadEditForm(selectedTransaction.value)
}

function loadEditForm(transaction: BillingTransaction) {
  Object.assign(editForm, {
    patient_id: transaction.patient_id,
    encounter_id: transaction.encounter_id ?? '',
    line_items: transaction.line_items.map((item) => ({ ...item, discount: 0, total: lineTotal(item) })),
    payment_mode: transaction.payment_mode ?? '',
    amount_paid: Number(transaction.amount_paid ?? 0),
    discount_total: Number(transaction.discount_total ?? 0),
    vat_amount: Number(transaction.vat_amount ?? 0),
    or_number: transaction.or_number ?? '',
    payee_name: transaction.payee_name ?? '',
    payee_address: transaction.payee_address ?? '',
  })
  editVatTouched.value = true
}

async function handleCreate() {
  const res = await createTransaction(buildBillingPayload(form, paymentModes.value))
  if (!res.success) return
  resetForm()
  closeCreateModal()
  successMessage.value = res.message || 'Billing transaction created.'
  await loadTransactions()
  if (res.data) openBreakdown(res.data)
}

async function handleUpdate() {
  if (!selectedTransaction.value || !canEdit(selectedTransaction.value)) return
  const { patient_id: _patientId, encounter_id: _encounterId, ...payload } = buildBillingPayload(editForm, paymentModes.value)
  const res = await updateTransaction(selectedTransaction.value.id, payload)
  if (!res.success) return
  successMessage.value = res.message || 'Billing transaction updated.'
  editMode.value = false
  await loadTransactions()
  if (res.data) openBreakdown(res.data)
}

function startProcess(transaction: BillingTransaction) {
  if (!canProcess(transaction)) return
  processTarget.value = transaction
  selectedTransaction.value = transaction
  Object.assign(processForm, {
    payment_amount: Number(transaction.balance ?? 0),
    or_number: transaction.or_number ?? '',
    payee_name: transaction.payee_name || defaultPayeeName(transaction.patient),
    payee_address: transaction.payee_address || defaultPayeeAddress(transaction.patient),
    payment_mode: activePaymentModes.value[0]?.code ?? 'CASH',
  })
  showProcess.value = true
}

function closeProcessModal() {
  showProcess.value = false
  processTarget.value = null
  Object.assign(processForm, emptyProcessForm())
}

async function handleProcess() {
  if (!processTarget.value || !canProcess(processTarget.value)) return
  processingId.value = processTarget.value.id
  const res = await processTransaction(processTarget.value.id, buildProcessPaymentPayload(processForm, paymentModes.value))
  if (res.success) {
    successMessage.value = res.message || 'Billing transaction processed.'
    closeProcessModal()
    await loadTransactions()
    if (res.data) openBreakdown(res.data)
  }
  processingId.value = null
}

function startVoid(transaction: BillingTransaction) {
  if (!canVoid(transaction)) return
  voidTarget.value = transaction
  voidReason.value = ''
  showVoid.value = true
}

function cancelVoid() {
  showVoid.value = false
  voidTarget.value = null
  voidReason.value = ''
}

async function handleVoid() {
  if (!voidTarget.value || !voidReason.value.trim()) return
  voidingId.value = voidTarget.value.id
  const res = await voidTransaction(voidTarget.value.id, voidReason.value.trim())
  if (res.success) {
    successMessage.value = res.message || 'Billing transaction voided.'
    cancelVoid()
    await loadTransactions()
    if (res.data) openBreakdown(res.data)
  }
  voidingId.value = null
}

function selectPatient(patient: Patient) {
  selectedPatient.value = patient
  patientSearch.value = patientName(patient)
  form.patient_id = patient.id
  form.encounter_id = ''
  form.payee_name = defaultPayeeName(patient)
  form.payee_address = defaultPayeeAddress(patient)
  encounterLookup.fetchPatientEncounters(patient.id, { per_page: 8 })
}

function clearSelectedPatient() {
  selectedPatient.value = null
  patientSearch.value = ''
  form.patient_id = ''
  form.encounter_id = ''
  encounterLookup.encounters.value = []
}

function selectEncounter(encounterId: Encounter['id']) {
  form.encounter_id = form.encounter_id === encounterId ? '' : encounterId
}

function canEdit(transaction: BillingTransaction): boolean {
  return permissions.value.includes('billing.transactions.update') && ['PENDING', 'PARTIAL'].includes(transaction.status)
}

function canProcess(transaction: BillingTransaction): boolean {
  return ['PENDING', 'PARTIAL'].includes(transaction.status)
}

function canVoid(transaction: BillingTransaction): boolean {
  return ['PENDING', 'PARTIAL'].includes(transaction.status)
}

function selectablePaymentModes(current?: string) {
  const modes = [...activePaymentModes.value]
  const inactiveCurrent = paymentModes.value.find((mode) => mode.code === current && !mode.is_active)
  if (inactiveCurrent) modes.unshift(inactiveCurrent)
  return modes
}

function modeLabel(mode: PaymentModeRecord): string {
  return mode.is_active ? mode.name : `${mode.name} (inactive)`
}

function displayPaymentMode(code?: string): string {
  if (!code) return '-'
  return paymentModes.value.find((mode) => mode.code === code)?.name ?? code
}

function fieldErrors(field: string): string[] {
  return validationErrors.value?.[field] ?? []
}

function patientName(patient: Patient): string {
  return patient.full_name || [patient.first_name, patient.middle_name, patient.last_name].filter(Boolean).join(' ')
}

function suggestedVatAmount(target: BillingQuickOrderForm): number {
  const rate = Number(defaultVatRate.value?.percentage ?? 0)
  const taxable = Math.max(0, calculateBillingTotals({ ...target, vat_amount: 0 }).subtotal - toNumber(target.discount_total))
  return Math.round(taxable * (rate / 100) * 100) / 100
}

const BillPreview = defineComponent({
  props: {
    totals: { type: Object, required: true },
    status: { type: String, required: true },
  },
  setup(props) {
    return () => h('aside', { class: 'space-y-4 rounded-lg border border-border bg-muted/35 p-4' }, [
      h('div', [
        h('p', { class: 'text-xs font-bold uppercase tracking-wide text-muted-foreground' }, 'Bill preview'),
        h('h3', { class: 'mt-1 text-xl font-bold' }, formatCurrency((props.totals as any).grandTotal)),
      ]),
      h('div', { class: 'space-y-2 text-sm' }, [
        previewRow('Subtotal', (props.totals as any).subtotal),
        previewRow('Discount', (props.totals as any).discountTotal),
        previewRow('VAT', (props.totals as any).vatAmount),
        previewRow('Amount paid', (props.totals as any).amountPaid, true),
        previewRow('Balance', (props.totals as any).balance),
        previewRow('Change', (props.totals as any).changeAmount),
      ]),
      h(resolveComponent('StatusBadge') as any, { status: props.status }),
    ])
  },
})

const LineItemEditor = defineComponent({
  props: {
    items: { type: Array, required: true },
    fieldErrors: { type: Function, required: true },
  },
  emits: ['add', 'remove'],
  setup(props, { emit }) {
    return () => h('section', { class: 'space-y-3' }, [
      h('div', { class: 'flex items-center justify-between' }, [
        h('h3', { class: 'text-sm font-bold uppercase tracking-wide text-muted-foreground' }, 'Line items'),
        h(resolveComponent('BaseButton') as any, { type: 'button', size: 'sm', variant: 'outline', icon: Plus, onClick: () => emit('add') }, () => 'Add'),
      ]),
      ...(props.items as BillingLineItem[]).map((item, index) => h('div', { class: 'space-y-3 rounded-lg border border-border bg-background/70 p-3', key: index }, [
        h(resolveComponent('FormField') as any, { id: `description-${index}`, label: 'Description', errors: props.fieldErrors(`line_items.${index}.description`) }, () =>
          h(resolveComponent('BaseInput') as any, { id: `description-${index}`, modelValue: item.description, 'onUpdate:modelValue': (value: string) => { item.description = value }, hasError: props.fieldErrors(`line_items.${index}.description`).length > 0 }),
        ),
        h('div', { class: 'grid grid-cols-2 gap-2' }, [
          h(resolveComponent('FormField') as any, { id: `quantity-${index}`, label: 'Qty' }, () =>
            h(resolveComponent('BaseInput') as any, { id: `quantity-${index}`, modelValue: item.quantity, 'onUpdate:modelValue': (value: number | string) => { item.quantity = Number(value) }, type: 'number', min: '1' }),
          ),
          h(resolveComponent('FormField') as any, { id: `unit-${index}`, label: 'Price' }, () =>
            h(resolveComponent('BaseInput') as any, { id: `unit-${index}`, modelValue: item.unit_price, 'onUpdate:modelValue': (value: number | string) => { item.unit_price = Number(value) }, type: 'number', min: '0', step: '0.01' }),
          ),
        ]),
        h('div', { class: 'flex items-center justify-between' }, [
          h('p', { class: 'text-sm font-bold' }, formatCurrency(lineTotal(item))),
          h(resolveComponent('BaseButton') as any, { type: 'button', size: 'sm', variant: 'ghost', disabled: props.items.length === 1, onClick: () => emit('remove', index) }, () => 'Remove'),
        ]),
      ])),
    ])
  },
})

function previewRow(label: string, value: number, divider = false) {
  return h('div', { class: ['flex justify-between', divider ? 'border-t border-border pt-2' : ''] }, [
    h('span', label),
    h('strong', formatCurrency(value)),
  ])
}
</script>

<style scoped>
.field-input {
  @apply h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-ring/15;
}
</style>
