import type { Patient, PharmacyDispenseForm, PharmacyTransactionItem, User } from '~/types'

interface DisplayPatient extends Partial<Patient> {
  patient_code?: string
  full_name?: string
}

interface DisplayStaff extends Partial<User> {
  name?: string
}

export interface PharmacyDispenseDraft {
  patient_id: string | number
  encounter_id?: string | number
  requesting_clinician_id: string | number
  pharmacist_id?: string | number
  notes?: string
  items: PharmacyTransactionItem[]
}

export function patientIdentity(patient?: DisplayPatient | null, fallback?: string | number): string {
  const code = patient?.patient_code
  const name = patient?.full_name

  return compactParts(code, name) || stringifyFallback(fallback)
}

export function staffIdentity(user?: DisplayStaff | null, fallback?: string | number): string {
  const employeeId = user?.person_affiliation?.employee_id
  const name = user?.name || user?.person?.full_name

  return compactParts(employeeId, name) || stringifyFallback(fallback)
}

export function buildPharmacyDispensePayload(draft: PharmacyDispenseDraft): PharmacyDispenseForm {
  const items = draft.items.map((item) => ({
    ...item,
    quantity: Number(item.quantity),
    unit_price: Number(item.unit_price ?? 0),
  }))

  return stripEmpty({
    patient_id: draft.patient_id,
    encounter_id: draft.encounter_id,
    requesting_clinician_id: draft.requesting_clinician_id,
    pharmacist_id: draft.pharmacist_id,
    notes: draft.notes?.trim(),
    items,
    total_amount: items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0),
  }) as PharmacyDispenseForm
}

function compactParts(...parts: Array<string | undefined | null>): string {
  return parts.filter((part) => part && part.trim().length > 0).join(' - ')
}

function stringifyFallback(value?: string | number): string {
  return value === undefined || value === null || value === '' ? '-' : String(value)
}

function stripEmpty<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== null && entry !== ''),
  ) as Partial<T>
}
