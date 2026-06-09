<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Encounter"
      :title="summaryData ? `${summaryData.encounter.encounter_type} visit` : 'Encounter'"
      :description="summaryData ? `${patientName(summaryData.patient)} • ${formatDateTime(summaryData.encounter.encounter_date || summaryData.encounter.created_at)}` : 'Clinical notes and linked orders.'"
    >
      <template #actions>
        <BaseButton variant="outline" :to="`/${tenant}/patients/${patientId}`">Patient chart</BaseButton>
        <BaseButton v-if="summaryData" variant="outline" :icon="Printer" @click="printPrescription">Print prescription</BaseButton>
        <BaseButton
          v-if="canSign"
          :icon="CheckCircle2"
          :loading="saving"
          @click="signCurrentEncounter"
        >
          Sign encounter
        </BaseButton>
      </template>
    </PageHeader>

    <div v-if="successMessage" class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
      {{ successMessage }}
    </div>
    <div v-if="visibleError" class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      {{ visibleError }}
    </div>

    <LoadingState v-if="loading" :rows="6" />

    <template v-else-if="summaryData">
      <section class="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <article class="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-lg font-bold text-foreground">{{ patientName(summaryData.patient) }}</h2>
                <StatusBadge :status="summaryData.encounter.status" />
              </div>
              <p class="mt-1 text-sm text-muted-foreground">
                {{ summaryData.patient.patient_code }} • {{ summaryData.patient.gender }} • {{ formatDate(summaryData.patient.dob) }}
              </p>
            </div>
            <div class="text-sm text-muted-foreground">
              <p>Clinician: {{ summaryData.clinician?.name || '-' }}</p>
              <p>Signed: {{ formatDateTime(summaryData.encounter.signed_at) }}</p>
            </div>
          </div>
        </article>

        <article class="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p class="text-sm font-bold text-foreground">Orders linked</p>
          <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
            <button
              v-for="metric in orderMetrics"
              :key="metric.name"
              type="button"
              class="rounded-lg bg-muted/50 p-3 text-left transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              :aria-label="`Open ${metric.name} linked activity`"
              @click="openActivity(metric.name)"
            >
              <span class="block text-xs font-bold uppercase tracking-wide text-muted-foreground">{{ metric.name }}</span>
              <span class="mt-1 block text-lg font-bold text-foreground">{{ metric.count }}</span>
            </button>
          </div>
        </article>
      </section>

      <section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <form class="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm" @submit.prevent="saveSoap">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-lg font-bold text-foreground">SOAP note</h2>
              <p class="text-sm text-muted-foreground">{{ isReadOnly ? 'Signed encounters are read-only.' : 'Capture the clinical note before signing.' }}</p>
            </div>
            <BaseButton v-if="canUpdate" type="submit" :loading="saving" :icon="Save">Save note</BaseButton>
          </div>

          <fieldset :disabled="isReadOnly" class="space-y-5 disabled:opacity-70">
            <FormField id="chief_complaint" label="Chief complaint" :errors="fieldErrors('chief_complaint')">
              <textarea id="chief_complaint" v-model="soapForm.chief_complaint" rows="3" class="field-input min-h-24" />
            </FormField>
            <FormField id="history_of_present_illness" label="History of present illness" :errors="fieldErrors('history_of_present_illness')">
              <textarea id="history_of_present_illness" v-model="soapForm.history_of_present_illness" rows="4" class="field-input min-h-28" />
            </FormField>

            <div class="grid gap-4 md:grid-cols-3">
              <FormField id="bp" label="BP">
                <BaseInput id="bp" v-model="soapForm.bp" placeholder="120/80" />
              </FormField>
              <FormField id="hr" label="HR">
                <BaseInput id="hr" v-model="soapForm.hr" type="number" />
              </FormField>
              <FormField id="rr" label="RR">
                <BaseInput id="rr" v-model="soapForm.rr" type="number" />
              </FormField>
              <FormField id="temp" label="Temp">
                <BaseInput id="temp" v-model="soapForm.temp" type="number" step="0.1" />
              </FormField>
              <FormField id="o2sat" label="O2 sat">
                <BaseInput id="o2sat" v-model="soapForm.o2sat" type="number" />
              </FormField>
              <FormField id="weight" label="Weight">
                <BaseInput id="weight" v-model="soapForm.weight" type="number" step="0.1" />
              </FormField>
            </div>

            <FormField id="physical_examination" label="Objective / physical examination" :errors="fieldErrors('physical_examination')">
              <textarea id="physical_examination" v-model="soapForm.physical_examination" rows="4" class="field-input min-h-28" />
            </FormField>
            <FormField id="review_of_systems" label="Review of systems" :errors="fieldErrors('review_of_systems')">
              <textarea id="review_of_systems" v-model="soapForm.review_of_systems" rows="3" class="field-input min-h-24" />
            </FormField>
            <FormField id="diagnosis" label="Assessment / diagnosis" :errors="fieldErrors('assessment')">
              <textarea id="diagnosis" v-model="soapForm.diagnosis" rows="3" class="field-input min-h-24" />
            </FormField>
            <FormField id="medications" label="Plan / medications" helper="One medication or instruction per line." :errors="fieldErrors('plan')">
              <textarea id="medications" v-model="soapForm.medications" rows="4" class="field-input min-h-28" />
            </FormField>
          </fieldset>
        </form>

        <aside class="space-y-4">
          <article class="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 class="text-base font-bold text-foreground">Quick orders</h2>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ isReadOnly ? 'Orders are locked after signing from this screen.' : 'Create linked orders without leaving the encounter.' }}
            </p>
            <div class="mt-4 grid gap-2">
              <BaseButton v-if="canCreateLab" variant="outline" block :icon="TestTube2" @click="openOrder('lab')">Lab request</BaseButton>
              <BaseButton v-if="canCreateImaging" variant="outline" block :icon="Image" @click="openOrder('imaging')">Imaging request</BaseButton>
              <BaseButton v-if="canCreatePharmacy" variant="outline" block :icon="Pill" @click="openOrder('pharmacy')">Medicine dispensing request</BaseButton>
              <BaseButton v-if="canCreateAppointment" variant="outline" block :icon="CalendarPlus" @click="openOrder('appointment')">Appointment request</BaseButton>
              <BaseButton v-if="canCreateBilling" variant="outline" block :icon="CreditCard" @click="openOrder('billing')">Billing transaction</BaseButton>
              <BaseButton v-if="canCreateRecord" variant="outline" block :icon="FileText" @click="openOrder('record')">Medical record</BaseButton>
              <p v-if="isReadOnly" class="text-sm text-muted-foreground">Signed encounter controls are read-only.</p>
            </div>
          </article>

          <article class="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 class="text-base font-bold text-foreground">Patient flags</h2>
            <div class="mt-3 space-y-3 text-sm">
              <p><span class="font-semibold">Allergies:</span> {{ summaryData.patient.allergies?.join(', ') || '-' }}</p>
              <p><span class="font-semibold">Conditions:</span> {{ summaryData.patient.chronic_conditions?.join(', ') || '-' }}</p>
              <p><span class="font-semibold">Contact:</span> {{ summaryData.patient.contact_number || '-' }}</p>
            </div>
          </article>
        </aside>
      </section>
    </template>

    <EmptyState v-else title="Encounter not found" description="The encounter could not be loaded for this clinic." />

    <BaseDialog v-model:open="showOrderDialog" :title="orderTitle" :description="orderDescription">
      <form class="space-y-4 p-5" @submit.prevent="submitQuickOrder">
        <div v-if="localOrderError" class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {{ localOrderError }}
        </div>

        <template v-if="activeOrder === 'lab'">
          <FormField id="lab_procedure_code" label="Lab Procedures">
            <MultiSelect
              v-model="labForm.lab_procedure_code"
              :options="catalog.libraryOptions.value.lab_procedure"
              placeholder="Add procedure..."
            />
          </FormField>
        </template>

        <template v-else-if="activeOrder === 'imaging'">
          <FormField id="imaging_procedure_code" label="Imaging procedure">
            <select id="imaging_procedure_code" v-model="imagingForm.imaging_procedure_code" class="field-input" required>
              <option value="">Select procedure</option>
              <option v-for="item in catalog.libraryOptions.value.imaging_procedure" :key="item.code" :value="item.code">
                {{ item.name }}
              </option>
            </select>
          </FormField>
          <FormField id="clinical_indication" label="Clinical indication"><textarea id="clinical_indication" v-model="imagingForm.clinical_indication" rows="3" class="field-input min-h-24" /></FormField>
        </template>

        <template v-else-if="activeOrder === 'pharmacy'">
          <FormField id="item_id" label="Medication">
            <select id="item_id" v-model="pharmacyForm.item_id" class="field-input" required>
              <option value="">Select item</option>
              <option v-for="item in inventory" :key="item.id" :value="item.id">
                {{ item.generic_name }} {{ item.strength }} ({{ item.current_stock }} left)
              </option>
            </select>
          </FormField>
          <div class="grid gap-4 md:grid-cols-2">
            <FormField id="quantity" label="Quantity"><BaseInput id="quantity" v-model="pharmacyForm.quantity" type="number" min="1" required /></FormField>
            <FormField id="unit_price" label="Unit price"><BaseInput id="unit_price" v-model="pharmacyForm.unit_price" type="number" min="0" step="0.01" required /></FormField>
          </div>
          <FormField id="pharmacy_notes" label="Notes"><textarea id="pharmacy_notes" v-model="pharmacyForm.notes" rows="3" class="field-input min-h-24" /></FormField>
        </template>

        <template v-else-if="activeOrder === 'appointment'">
          <FormField id="appointment_date" label="Appointment date">
            <BaseInput id="appointment_date" v-model="appointmentForm.appointment_date" type="date" required />
          </FormField>
          <FormField id="time_slot" label="Time slot"><BaseInput id="time_slot" v-model="appointmentForm.time_slot" /></FormField>
          <FormField id="appointment_type_code" label="Appointment type">
            <select id="appointment_type_code" v-model="appointmentForm.appointment_type_code" class="field-input" required>
              <option value="">Select type</option>
              <option v-for="item in catalog.libraryOptions.value.appointment_type" :key="item.code" :value="item.code">
                {{ item.name }}
              </option>
            </select>
          </FormField>
          <FormField id="appointment_reason" label="Reason"><textarea id="appointment_reason" v-model="appointmentForm.reason" rows="3" class="field-input min-h-24" /></FormField>
          <FormField id="appointment_notes" label="Notes"><textarea id="appointment_notes" v-model="appointmentForm.notes" rows="3" class="field-input min-h-24" /></FormField>
        </template>

        <template v-else-if="activeOrder === 'billing'">
          <FormField id="description" label="Description"><BaseInput id="description" v-model="billingForm.description" required /></FormField>
          <div class="grid gap-4 md:grid-cols-2">
            <FormField id="billing_quantity" label="Quantity"><BaseInput id="billing_quantity" v-model="billingForm.quantity" type="number" min="1" required /></FormField>
            <FormField id="billing_unit_price" label="Unit price"><BaseInput id="billing_unit_price" v-model="billingForm.unit_price" type="number" min="0" step="0.01" required /></FormField>
          </div>
          <FormField id="payment_mode" label="Payment mode">
            <select id="payment_mode" v-model="billingForm.payment_mode" class="field-input">
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="GCASH">GCash</option>
              <option value="MAYA">Maya</option>
              <option value="PHILHEALTH">PhilHealth</option>
              <option value="HMO">HMO</option>
            </select>
          </FormField>
        </template>

        <template v-else-if="activeOrder === 'record'">
          <FormField id="record_type" label="Record type">
            <select id="record_type" v-model="recordForm.record_type" class="field-input">
              <option value="ENCOUNTER">Encounter</option>
              <option value="LAB">Lab</option>
              <option value="IMAGING">Imaging</option>
              <option value="PRESCRIPTION">Prescription</option>
              <option value="CERT">Certificate</option>
              <option value="REFERRAL">Referral</option>
            </select>
          </FormField>
          <FormField id="file_name" label="File name"><BaseInput id="file_name" v-model="recordForm.file_name" /></FormField>
          <FormField id="purpose" label="Purpose"><textarea id="purpose" v-model="recordForm.purpose" rows="3" class="field-input min-h-24" /></FormField>
        </template>

        <div class="flex justify-end gap-2 border-t border-border pt-4">
          <BaseButton type="button" variant="outline" @click="showOrderDialog = false">Cancel</BaseButton>
          <BaseButton type="submit" :loading="saving">Create</BaseButton>
        </div>
      </form>
    </BaseDialog>

    <BaseDialog v-model:open="showActivityDialog" :title="`${activeActivityCategory.name} activity`" :description="`${activeActivityCategory.count} linked item${activeActivityCategory.count === 1 ? '' : 's'}`">
      <div class="p-5">
        <div v-if="activeActivityCategory.items.length === 0" class="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
          {{ activeActivityCategory.emptyMessage }}
        </div>
        <div v-else class="divide-y divide-border">
          <article v-for="(item, index) in activeActivityCategory.items" :key="`${activeActivityCategory.name}-${index}`" class="py-3 first:pt-0 last:pb-0">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p class="font-semibold text-foreground">{{ item.title }}</p>
                <p class="mt-1 text-sm text-muted-foreground">{{ item.detail }}</p>
              </div>
              <BaseButton
                v-if="item.print"
                size="sm"
                variant="outline"
                :icon="Printer"
                @click="printActivityItem(item.print.kind, item.print.id)"
              >
                Print
              </BaseButton>
            </div>
          </article>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { CalendarPlus, CheckCircle2, CreditCard, FileText, Image, Pill, Printer, Save, TestTube2 } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import type {
  EncounterSummary,
  LabPriority,
  PaymentMode,
  PharmacyItem,
  RecordType,
} from '~/types'
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'
import { useEncounter } from '~/composables/useEncounter'
import { useCatalogs } from '~/composables/useCatalogs'
import {
  type ActivityCategoryName,
  type ActivityPrintKind,
  type AppointmentQuickOrderForm,
  buildActivityCategories,
  buildAppointmentPayload,
  createBlankAppointmentQuickOrderForm,
} from '~/utils/encounterQuickOrders'
import MultiSelect from '~/components/ui/MultiSelect.vue'

type QuickOrder = 'lab' | 'imaging' | 'pharmacy' | 'appointment' | 'billing' | 'record'

definePageMeta({
  middleware: ['auth', 'tenant'],
})

const route = useRoute()
const { launchPrint } = usePrintLauncher()
const api = useApi()
const auth = useAuthStore()
const encounterService = useEncounter()
const catalog = useCatalogs()

const tenant = computed(() => String(route.params.tenant))
const patientId = computed(() => String(route.params.id))
const encounterId = computed(() => String(route.params.encId))
const successMessage = ref('')
const localOrderError = ref('')
const showOrderDialog = ref(false)
const showActivityDialog = ref(false)
const activeOrder = ref<QuickOrder>('lab')
const activeActivityName = ref<ActivityCategoryName>('Lab')
const inventory = ref<PharmacyItem[]>([])

const summaryData = computed<EncounterSummary | null>(() => encounterService.summary.value)
const loading = computed(() => encounterService.loading.value)
const saving = computed(() => encounterService.saving.value)
const visibleError = computed(() => localOrderError.value || encounterService.error.value)
const permissions = computed(() => auth.user?.permissions ?? [])
const isReadOnly = computed(() => summaryData.value?.encounter.status !== 'DRAFT')
const canUpdate = computed(() => !isReadOnly.value && permissions.value.includes('encounters.update'))
const canSign = computed(() => !isReadOnly.value && permissions.value.includes('encounters.sign'))
const canCreateLab = computed(() => !isReadOnly.value && permissions.value.includes('lab.requests.create'))
const canCreateImaging = computed(() => !isReadOnly.value && permissions.value.includes('imaging.requests.create'))
const canCreatePharmacy = computed(() => !isReadOnly.value && permissions.value.includes('pharmacy.transactions.create'))
const canCreateAppointment = computed(() => !isReadOnly.value && permissions.value.includes('appointments.create'))
const canCreateBilling = computed(() => !isReadOnly.value && permissions.value.includes('billing.transactions.create'))
const canCreateRecord = computed(() => !isReadOnly.value && permissions.value.includes('records.create'))

const soapForm = reactive({
  chief_complaint: '',
  history_of_present_illness: '',
  bp: '',
  hr: '',
  rr: '',
  temp: '',
  o2sat: '',
  weight: '',
  physical_examination: '',
  review_of_systems: '',
  diagnosis: '',
  medications: '',
})

const labForm = reactive({ lab_procedure_code: [], priority: 'ROUTINE' as LabPriority, specimen_type: '' })
const imagingForm = reactive({ imaging_procedure_code: '', clinical_indication: '' })
const pharmacyForm = reactive({ item_id: '', quantity: 1, unit_price: 0, notes: '' })
const appointmentForm = reactive<AppointmentQuickOrderForm>(createBlankAppointmentQuickOrderForm())
const billingForm = reactive({ description: 'Consultation', quantity: 1, unit_price: 500, payment_mode: 'CASH' as PaymentMode })
const recordForm = reactive({ record_type: 'ENCOUNTER' as RecordType, file_name: 'encounter-note.pdf', purpose: '' })

const activityCategories = computed(() => buildActivityCategories(summaryData.value))
const orderMetrics = computed(() => activityCategories.value.map(({ name, count }) => ({ name, count })))
const activeActivityCategory = computed(() => activityCategories.value.find((category) => category.name === activeActivityName.value) ?? activityCategories.value[0])

const orderTitle = computed(() => ({
  lab: 'Create lab request',
  imaging: 'Create imaging request',
  pharmacy: 'Medicine dispensing request',
  appointment: 'Create appointment request',
  billing: 'Create billing transaction',
  record: 'Create medical record',
}[activeOrder.value]))

const orderDescription = computed(() => activeOrder.value === 'appointment'
  ? 'This appointment will be scheduled for the current patient.'
  : 'This order will be linked to the current encounter.')

async function loadSummary() {
  await encounterService.fetchSummary(encounterId.value)
  fillSoapForm()
}

async function loadInventory() {
  const res = await api.api<PharmacyItem[]>(api.tenantPath('/pharmacy/inventory'), { params: { per_page: 100 } })
  if (res.success) {
    inventory.value = res.data
  }
}

async function saveSoap() {
  if (!summaryData.value) {
    return
  }

  const res = await encounterService.updateEncounter(encounterId.value, {
    chief_complaint: optional(soapForm.chief_complaint),
    history_of_present_illness: optional(soapForm.history_of_present_illness),
    vital_signs: {
      bp: optional(soapForm.bp),
      hr: numberOrUndefined(soapForm.hr),
      rr: numberOrUndefined(soapForm.rr),
      temp: numberOrUndefined(soapForm.temp),
      o2sat: numberOrUndefined(soapForm.o2sat),
      weight: numberOrUndefined(soapForm.weight),
    },
    physical_examination: optional(soapForm.physical_examination) ? { notes: soapForm.physical_examination.trim() } : undefined,
    review_of_systems: optional(soapForm.review_of_systems) ? { notes: soapForm.review_of_systems.trim() } : undefined,
    assessment: optional(soapForm.diagnosis)
      ? { diagnoses: [{ icd10_code: '', description: soapForm.diagnosis.trim(), type: 'PRIMARY' }] }
      : { diagnoses: [] },
    plan: {
      medications: textLines(soapForm.medications).map((name) => ({ name })),
    },
  })

  if (res.success) {
    successMessage.value = 'Encounter note saved.'
    await loadSummary()
  }
}

async function signCurrentEncounter() {
  const res = await encounterService.signEncounter(encounterId.value)
  if (res.success) {
    successMessage.value = 'Encounter signed.'
    await loadSummary()
    return
  }

  if (res.errors?.generated_lines?.length) {
    const shouldOverwrite = window.confirm('Signing will overwrite existing generated billing lines. Continue?')
    if (!shouldOverwrite) {
      return
    }

    const retry = await encounterService.signEncounter(encounterId.value, { overwrite_generated_lines: true })
    if (retry.success) {
      successMessage.value = 'Encounter signed.'
      await loadSummary()
    }
  }
}

function openOrder(order: QuickOrder) {
  activeOrder.value = order
  localOrderError.value = ''
  showOrderDialog.value = true
}

function openActivity(categoryName: ActivityCategoryName) {
  activeActivityName.value = categoryName
  showActivityDialog.value = true
}

function printPrescription() {
  launchPrint(`/${tenant.value}/encounters/${encounterId.value}/prescription-print`)
}

function printActivityItem(kind: ActivityPrintKind, id: string | number): void {
  launchPrint(printRouteFor(kind, id))
}

function printRouteFor(kind: ActivityPrintKind, id: string | number): string {
  const base = `/${tenant.value}`
  const routes: Record<string, string> = {
    appointment: `${base}/appointments/${id}/print`,
    lab: `${base}/lab/${id}/print`,
    imaging: `${base}/imaging/${id}/print`,
    pharmacy: `${base}/pharmacy/${id}/print`,
    billing: `${base}/billing/${id}/invoice-print`,
  }

  return routes[kind] ?? base
}

async function submitQuickOrder() {
  if (!summaryData.value) {
    return
  }

  localOrderError.value = ''
  const patient_id = summaryData.value.patient.id
  const encounter_id = summaryData.value.encounter.id
  let res: { success: boolean; message: string | null } | null = null

  if (activeOrder.value === 'lab') {
    if (labForm.lab_procedure_code.length == 0) {
      localOrderError.value = 'Lab procedure is required.'
      return
    }
    res = await encounterService.createLabOrder({
      patient_id,
      encounter_id,
      requesting_clinician_id: auth.user?.id,
      lab_procedure_code: labForm.lab_procedure_code,
      priority: labForm.priority,
      specimen_type: optional(labForm.specimen_type),
    })
  } else if (activeOrder.value === 'imaging') {
    if (!imagingForm.imaging_procedure_code) {
      localOrderError.value = 'Imaging procedure is required.'
      return
    }
    res = await encounterService.createImagingOrder({
      patient_id,
      encounter_id,
      requesting_clinician_id: auth.user?.id,
      imaging_procedure_code: imagingForm.imaging_procedure_code,
      clinical_indication: optional(imagingForm.clinical_indication),
      priority: 'ROUTINE',
    })
  } else if (activeOrder.value === 'pharmacy') {
    if (!pharmacyForm.item_id) {
      localOrderError.value = 'Medication is required.'
      return
    }
    const item = inventory.value.find((inventoryItem) => String(inventoryItem.id) === String(pharmacyForm.item_id))
    const unitPrice = Number(pharmacyForm.unit_price || item?.selling_price || 0)
    const quantity = Number(pharmacyForm.quantity || 1)
    res = await encounterService.createPharmacyDispense({
      patient_id,
      encounter_id,
      requesting_clinician_id: auth.user?.id ?? '',
      items: [{ item_id: pharmacyForm.item_id, quantity, unit_price: unitPrice }],
      total_amount: quantity * unitPrice,
      notes: optional(pharmacyForm.notes),
    })
    
    if(item)
      soapForm.medications += `\n#${pharmacyForm.quantity} ${item.generic_name} (${item.brand_name}) ${item.strength} ${item.dosage_form} - ${pharmacyForm.notes}`
    saveSoap()
  } else if (activeOrder.value === 'appointment') {
    try {
      res = await encounterService.createAppointment(buildAppointmentPayload(summaryData.value, appointmentForm))
    } catch (error: any) {
      localOrderError.value = error.message || 'Failed to create appointment request.'
      return
    }
  } else if (activeOrder.value === 'billing') {
    const quantity = Number(billingForm.quantity || 1)
    const unitPrice = Number(billingForm.unit_price || 0)
    const total = quantity * unitPrice
    if (!billingForm.description.trim() || total <= 0) {
      localOrderError.value = 'Description and amount are required.'
      return
    }
    res = await encounterService.createBillingTransaction({
      patient_id,
      encounter_id,
      line_items: [{ description: billingForm.description.trim(), quantity, unit_price: unitPrice, discount: 0, total }],
      subtotal: total,
      discount_total: 0,
      vat_amount: 0,
      grand_total: total,
      payment_mode: billingForm.payment_mode,
      amount_paid: 0,
      balance: total,
      status: 'PENDING',
    })
  } else {
    res = await encounterService.createMedicalRecord({
      patient_id,
      record_type: recordForm.record_type,
      reference_id: encounter_id,
      file_name: optional(recordForm.file_name),
      purpose: optional(recordForm.purpose),
    })
  }

  if (res && !res.success) {
    localOrderError.value = res.message || 'Request failed.'
  }

  if (res?.success) {
    showOrderDialog.value = false
    successMessage.value = res.message || (activeOrder.value === 'appointment' ? 'Appointment request created.' : 'Linked order created.')
    if (activeOrder.value === 'appointment') {
      resetAppointmentForm()
      return
    }
    await loadSummary()
  }
}

function resetAppointmentForm() {
  Object.assign(appointmentForm, createBlankAppointmentQuickOrderForm())
}

function fillSoapForm() {
  const encounter = summaryData.value?.encounter
  if (!encounter) {
    return
  }

  soapForm.chief_complaint = encounter.chief_complaint ?? ''
  soapForm.history_of_present_illness = encounter.history_of_present_illness ?? ''
  soapForm.bp = encounter.vital_signs?.bp ?? ''
  soapForm.hr = stringifyNumber(encounter.vital_signs?.hr)
  soapForm.rr = stringifyNumber(encounter.vital_signs?.rr)
  soapForm.temp = stringifyNumber(encounter.vital_signs?.temp)
  soapForm.o2sat = stringifyNumber(encounter.vital_signs?.o2sat)
  soapForm.weight = stringifyNumber(encounter.vital_signs?.weight)
  soapForm.physical_examination = String(encounter.physical_examination?.notes ?? '')
  soapForm.review_of_systems = String(encounter.review_of_systems?.notes ?? '')
  soapForm.diagnosis = encounter.assessment?.diagnoses?.map((diagnosis) => diagnosis.description).join('\n') ?? ''
  const medications = Array.isArray(encounter.plan?.medications) ? encounter.plan.medications : []
  soapForm.medications = medications.map((item: any) => item?.name ?? String(item)).join('\n')
}

function fieldErrors(field: string): string[] {
  return encounterService.validationErrors.value?.[field] ?? []
}

function patientName(patient: { full_name?: string; first_name?: string; middle_name?: string; last_name?: string }): string {
  return patient.full_name || [patient.first_name, patient.middle_name, patient.last_name].filter(Boolean).join(' ')
}

function optional(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

function textLines(value: string): string[] {
  return value.split('\n').map((line) => line.trim()).filter(Boolean)
}

function numberOrUndefined(value: string): number | undefined {
  const parsed = Number(value)
  return Number.isFinite(parsed) && value.trim() !== '' ? parsed : undefined
}

function stringifyNumber(value?: number): string {
  return value === undefined || value === null ? '' : String(value)
}

function formatDate(value?: string): string {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('en-PH', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(value))
}

function formatDateTime(value?: string): string {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

watch(() => pharmacyForm.item_id, (itemId) => {
  const item = inventory.value.find((inventoryItem) => String(inventoryItem.id) === String(itemId))
  if (item) {
    pharmacyForm.unit_price = Number(item.selling_price)
  }
})

onMounted(async () => {
  await Promise.all([
    loadSummary(),
    loadInventory(),
    catalog.fetchOptions('appointment_type'),
    catalog.fetchOptions('lab_procedure'),
    catalog.fetchOptions('imaging_procedure'),
  ])
  appointmentForm.appointment_type_code = catalog.libraryOptions.value.appointment_type[0]?.code ?? ''
  labForm.lab_procedure_code = []
  imagingForm.imaging_procedure_code = catalog.libraryOptions.value.imaging_procedure[0]?.code ?? ''
})
</script>

<style scoped>
.field-input {
  @apply h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-70;
}
</style>
