import type { AppointmentForm, EncounterSummary, PharmacyTransactionItem } from '~/types'

export type ActivityCategoryName = 'Appointment' | 'Lab' | 'Imaging' | 'Pharmacy' | 'Billing' | 'Records'
export type ActivityPrintKind = 'appointment' | 'lab' | 'imaging' | 'pharmacy' | 'billing'

export interface AppointmentQuickOrderForm {
  appointment_date: string
  time_slot: string
  appointment_type_code: string
  reason: string
  notes: string
}

export interface ActivityDetailItem {
  title: string
  detail: string
  print?: {
    kind: ActivityPrintKind
    id: string | number
    label: string
  }
}

export interface ActivityCategory {
  name: ActivityCategoryName
  count: number
  emptyMessage: string
  items: ActivityDetailItem[]
}

export function createBlankAppointmentQuickOrderForm(): AppointmentQuickOrderForm {
  return {
    appointment_date: '',
    time_slot: '',
    appointment_type_code: '',
    reason: '',
    notes: '',
  }
}

export function buildAppointmentPayload(summary: EncounterSummary, form: AppointmentQuickOrderForm): AppointmentForm {
  const appointmentDate = form.appointment_date.trim()

  if (!appointmentDate) {
    throw new Error('Appointment date is required.')
  }

  return {
    patient_id: summary.patient.id,
    clinician_id: summary.clinician?.id,
    appointment_date: appointmentDate,
    time_slot: form.time_slot.trim(),
    appointment_type: '',
    appointment_type_code: form.appointment_type_code,
    reason: optionalString(form.reason),
    notes: optionalString(form.notes),
    status: 'SCHEDULED',
  }
}

export function buildActivityCategories(summary: EncounterSummary | null | undefined): ActivityCategory[] {
  const appointment = summary?.appointment
  const labRequests = summary?.lab_requests ?? []
  const imagingRequests = summary?.imaging_requests ?? []
  const pharmacyTransactions = summary?.pharmacy_transactions ?? []
  const billingTransactions = summary?.billing_transactions ?? []
  const medicalRecords = summary?.medical_records ?? []

  return [
    {
      name: 'Appointment',
      count: appointment ? 1 : 0,
      emptyMessage: 'No Appointment activity',
      items: appointment
        ? [{
            title: compactDetail(appointment.appointment_type, appointment.appointment_date),
            detail: compactDetail(appointment.time_slot, appointment.status),
            print: { kind: 'appointment', id: appointment.id, label: 'Print appointment' },
          }]
        : [],
    },
    {
      name: 'Lab',
      count: labRequests.length,
      emptyMessage: 'No Lab activity',
      items: labRequests.map((item) => ({
        title: panelNames(item.test_panels),
        detail: compactDetail(item.priority, item.status),
        print: { kind: 'lab', id: item.id, label: 'Print lab request' },
      })),
    },
    {
      name: 'Imaging',
      count: imagingRequests.length,
      emptyMessage: 'No Imaging activity',
      items: imagingRequests.map((item) => ({
        title: [item.modality, item.body_part].filter(Boolean).join(' ') || '-',
        detail: compactDetail(item.priority, item.status),
        print: { kind: 'imaging', id: item.id, label: 'Print imaging request' },
      })),
    },
    {
      name: 'Pharmacy',
      count: pharmacyTransactions.length,
      emptyMessage: 'No Pharmacy activity',
      items: pharmacyTransactions.map((item) => ({
        title: itemSummary(item.items),
        detail: compactDetail(item.transaction_type, formatMoney(item.total_amount)),
        print: { kind: 'pharmacy', id: item.id, label: 'Print dispensing slip' },
      })),
    },
    {
      name: 'Billing',
      count: billingTransactions.length,
      emptyMessage: 'No Billing activity',
      items: billingTransactions.map((item) => ({
        title: item.transaction_number,
        detail: compactDetail(item.status, formatMoney(item.grand_total)),
        print: { kind: 'billing', id: item.id, label: 'Print invoice' },
      })),
    },
    {
      name: 'Records',
      count: medicalRecords.length,
      emptyMessage: 'No Records activity',
      items: medicalRecords.map((item) => ({
        title: item.file_name || item.record_type,
        detail: compactDetail(item.record_type, item.is_released ? 'Released' : 'Unreleased'),
      })),
    },
  ]
}

function panelNames(panels: Array<{ name?: string }> = []): string {
  return panels.map((panel) => panel.name).filter(Boolean).join(', ') || '-'
}

function itemSummary(items: PharmacyTransactionItem[] = []): string {
  return items.map((item) => `${item.item?.generic_name || item.item_id} x ${item.quantity}`).join(', ') || '-'
}

function compactDetail(...parts: Array<string | number | undefined | null>): string {
  return parts.filter((part) => part !== undefined && part !== null && String(part).trim() !== '').join(' - ') || '-'
}

function optionalString(value?: string): string | undefined {
  const trimmed = value?.trim() ?? ''
  return trimmed.length > 0 ? trimmed : undefined
}

function formatMoney(value?: number): string {
  return `PHP ${Number(value ?? 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
