/**
 * Core API response shape
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  meta?: PaginationMeta
  message: string | null
  errors: Record<string, any> | null
}

export interface PaginationMeta {
  page: number
  per_page: number
  total: number
  last_page: number
}

/**
 * Auth types
 */
export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface AuthUser {
  id: string
  name: string
  email: string
  roles: string[]
  permissions: string[]
  tenant_id: string
  avatar?: string
}

export interface AuthTokenResponse {
  token: string
  user: AuthUser
  roles?: string[]
  permissions?: string[]
  tenant?: Tenant
  expires_at: string
}

/**
 * Tenant
 */
export interface Tenant {
  id: string
  name: string
  slug: string
  address?: string
  phone?: string
  email?: string
  logo?: string
  settings?: Record<string, unknown>
  is_active: boolean
  created_at: string
}

/**
 * Patient
 */
export interface PatientAddress {
  street?: string
  city?: string
  province?: string
  zip?: string
  country?: string
}

export interface EmergencyContact {
  name?: string
  relationship?: string
  contact_number?: string
}

export interface Patient {
  id: string
  tenant_id?: string
  patient_code: string
  first_name: string
  middle_name?: string
  last_name: string
  full_name: string
  dob: string
  age?: number
  gender: 'Male' | 'Female' | 'Other'
  civil_status?: string
  nationality?: string
  religion?: string
  address?: PatientAddress
  contact_number?: string
  email?: string
  emergency_contact?: EmergencyContact
  philhealth_number?: string
  hmo_provider?: string
  hmo_id?: string
  blood_type?: string
  allergies?: string[]
  chronic_conditions?: string[]
  is_active: boolean
  registered_at: string
  created_at: string
  updated_at: string
}

export interface PatientForm {
  first_name: string
  middle_name?: string
  last_name: string
  dob: string
  gender: string
  civil_status?: string
  nationality?: string
  religion?: string
  address?: PatientAddress
  contact_number?: string
  email?: string
  emergency_contact?: EmergencyContact
  philhealth_number?: string
  hmo_provider?: string
  hmo_id?: string
  blood_type?: string
  allergies?: string[]
  chronic_conditions?: string[]
  is_active?: boolean
}

/**
 * Appointment
 */
export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'

export interface Appointment {
  id: string
  tenant_id?: string
  patient_id: string
  patient?: Patient
  clinician_id?: string | number
  clinician?: User
  appointment_date: string
  time_slot: string
  appointment_type: string
  reason?: string
  status: AppointmentStatus
  notes?: string
  cancellation_reason?: string
  rescheduled_from_id?: string
  created_at: string
  updated_at: string
}

export interface AppointmentForm {
  patient_id: string | number
  clinician_id?: string | number
  appointment_date: string
  time_slot: string
  appointment_type: string
  appointment_type_code?: string
  reason?: string
  notes?: string
  status?: AppointmentStatus
}

/**
 * Encounter
 */
export type EncounterType = string
export type EncounterStatus = 'DRAFT' | 'SIGNED' | 'LOCKED'

export interface VitalSigns {
  bp?: string
  hr?: number
  rr?: number
  temp?: number
  o2sat?: number
  height?: number
  weight?: number
  bmi?: number
}

export interface Diagnosis {
  icd10_code: string
  description: string
  type: 'PRIMARY' | 'SECONDARY'
}

export interface Encounter {
  id: string
  tenant_id?: string
  patient_id: string
  patient?: Patient
  clinician_id: string
  clinician?: User
  appointment_id?: string
  encounter_type: EncounterType
  chief_complaint?: string
  history_of_present_illness?: string
  vital_signs?: VitalSigns
  physical_examination?: Record<string, unknown>
  review_of_systems?: Record<string, unknown>
  assessment?: { diagnoses: Diagnosis[] }
  plan?: {
    medications?: unknown[]
    procedures?: unknown[]
    referrals?: unknown[]
  }
  encounter_date: string
  status: EncounterStatus
  signed_at?: string
  signed_by?: string
  created_at: string
  updated_at: string
}

/**
 * Pharmacy
 */
export interface PharmacyItem {
  id: string
  tenant_id?: string
  generic_name: string
  brand_name?: string
  dosage_form: string
  strength: string
  manufacturer?: string
  unit_of_measure: string
  unit_price: number
  selling_price: number
  current_stock: number
  reorder_level: number
  max_stock: number
  expiry_date?: string
  lot_number?: string
  is_controlled: boolean
  is_active: boolean
  rxnorm_code?: string
  created_at: string
  updated_at: string
}

export type PharmacyTransactionType = 'DISPENSING' | 'RETURN' | 'RESTOCK' | 'ADJUSTMENT' | 'WASTE'

export interface PharmacyTransactionItem {
  item_id: string
  item?: PharmacyItem
  quantity: number
  unit_price: number
  lot_number?: string
}

export interface PharmacyTransaction {
  id: string
  tenant_id?: string
  transaction_type: PharmacyTransactionType
  patient_id?: string
  patient?: Patient
  encounter_id?: string
  requesting_clinician_id?: string
  requesting_clinician?: User
  pharmacist_id: string
  pharmacist?: User
  items: PharmacyTransactionItem[]
  total_amount: number
  notes?: string
  transaction_date: string
  created_at: string
}

/**
 * Lab
 */
export type LabPriority = 'ROUTINE' | 'URGENT' | 'STAT'
export type LabStatus =
  | 'REQUESTED'
  | 'COLLECTED'
  | 'IN_PROGRESS'
  | 'RESULTED'
  | 'VALIDATED'
  | 'RELEASED'

export interface LabRequest {
  id: string
  tenant_id?: string
  patient_id: string
  patient?: Patient
  encounter_id?: string
  requesting_clinician_id: string
  requesting_clinician?: User
  test_panels: Array<{ loinc_code: string; name: string }>
  priority: LabPriority
  specimen_type?: string
  collection_date?: string
  status: LabStatus
  assigned_medtech_id?: string
  results?: Record<string, unknown>
  reference_ranges?: Record<string, unknown>
  validated_at?: string
  released_at?: string
  critical_flag: boolean
  created_at: string
  updated_at: string
}

/**
 * Imaging
 */
export type ImagingModality = string

export interface ImagingRequest {
  id: string
  tenant_id?: string
  patient_id: string
  patient?: Patient
  encounter_id?: string
  requesting_clinician_id: string
  requesting_clinician?: User
  modality: ImagingModality
  body_part: string
  clinical_indication?: string
  laterality?: string
  priority: LabPriority
  status: LabStatus
  assigned_technician_id?: string
  image_urls?: string[]
  radiologist_findings?: string
  impression?: string
  reported_at?: string
  created_at: string
  updated_at: string
}

/**
 * Billing
 */
export type PaymentMode = string

export interface PaymentModeRecord {
  id?: string | number
  code: PaymentMode
  name: string
  add_reference_number: boolean
  is_active: boolean
  sort_order: number
}

export interface VatRate {
  id?: string | number
  tenant_id?: string
  name: string
  percentage: string | number
  is_default: boolean
  is_active: boolean
  sort_order: number
}

export type BillingStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'VOIDED' | 'REFUNDED'

export interface BillingLineItem {
  service_id?: string
  description: string
  quantity: number
  unit_price: number
  discount: number
  total: number
}

export interface BillingTransaction {
  id: string
  tenant_id?: string
  patient_id: string
  patient?: Patient
  encounter_id?: string
  transaction_number: string
  transaction_date: string
  line_items: BillingLineItem[]
  subtotal: number
  discount_total: number
  vat_amount: number
  grand_total: number
  payment_mode?: PaymentMode
  amount_paid: number
  change_amount: number
  balance: number
  status: BillingStatus
  cashier_id: string
  voided_by?: string
  void_reason?: string
  or_number?: string
  payee_name?: string
  payee_address?: string
  created_at: string
  updated_at: string
}

export type LibraryKey = 'appointment_type' | 'encounter_type' | 'lab_procedure' | 'imaging_procedure'

export interface LibraryRecord {
  id?: string | number
  tenant_id?: string
  library: LibraryKey
  code: string
  name: string
  description?: string
  price: string | number
  metadata: {
    loinc_code?: string
    specimen_type?: string
    panel_items?: string[]
    modality?: string
    body_part?: string
  }
  is_active: boolean
  sort_order: number
  deleted_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface LibraryForm {
  library: LibraryKey
  code: string
  name: string
  description?: string
  price: string | number
  metadata: LibraryRecord['metadata']
  is_active: boolean
  sort_order: string | number
}

/**
 * Medical Record
 */
export type RecordType =
  | 'ENCOUNTER'
  | 'LAB'
  | 'IMAGING'
  | 'PRESCRIPTION'
  | 'CERT'
  | 'REFERRAL'

export interface MedicalRecord {
  id: string
  tenant_id?: string
  patient_id: string
  patient?: Patient
  record_type: RecordType
  reference_id?: string
  file_path?: string
  file_name?: string
  file_size?: number
  mime_type?: string
  is_released: boolean
  released_at?: string
  released_to?: string
  purpose?: string
  authorized_by?: string
  digital_signature_hash?: string
  created_at: string
  updated_at: string
}

export interface EncounterForm {
  patient_id: string | number
  clinician_id?: string | number
  appointment_id?: string | number
  encounter_type?: EncounterType
  encounter_type_code?: string
  chief_complaint?: string
  history_of_present_illness?: string
  vital_signs?: VitalSigns
  physical_examination?: Record<string, unknown>
  review_of_systems?: Record<string, unknown>
  assessment?: { diagnoses: Diagnosis[] }
  plan?: {
    medications?: unknown[]
    procedures?: unknown[]
    referrals?: unknown[]
  }
  encounter_date?: string
  status?: EncounterStatus
}

export interface EncounterSummary {
  encounter: Encounter
  patient: Patient
  clinician?: User | null
  appointment?: Appointment | null
  lab_requests: LabRequest[]
  imaging_requests: ImagingRequest[]
  pharmacy_transactions: PharmacyTransaction[]
  billing_transactions: BillingTransaction[]
  medical_records: MedicalRecord[]
}

export interface LabQuickOrderForm {
  patient_id: string | number
  encounter_id?: string | number
  requesting_clinician_id?: string | number
  lab_procedure_code?: string[]
  test_panels?: Array<{ loinc_code?: string; name: string }>
  priority?: LabPriority
  specimen_type?: string
}

export interface ImagingQuickOrderForm {
  patient_id: string | number
  encounter_id?: string | number
  requesting_clinician_id?: string | number
  imaging_procedure_code?: string
  modality?: ImagingModality
  body_part?: string
  clinical_indication?: string
  laterality?: string
  priority?: LabPriority
}

export interface PharmacyDispenseForm {
  patient_id: string | number
  encounter_id?: string | number
  requesting_clinician_id: string | number
  pharmacist_id?: string | number
  items: PharmacyTransactionItem[]
  total_amount?: number
  notes?: string
}

export interface BillingQuickOrderForm {
  patient_id: string | number
  encounter_id?: string | number
  line_items: BillingLineItem[]
  subtotal?: number
  discount_total?: number
  vat_amount?: number
  grand_total?: number
  payment_mode?: PaymentMode
  amount_paid?: number
  change_amount?: number
  balance?: number
  status?: BillingStatus
  or_number?: string
  payee_name?: string
  payee_address?: string
}

export interface BillingProcessPaymentForm {
  payment_amount: string | number
  or_number?: string
  payee_name: string
  payee_address?: string
  payment_mode: PaymentMode
}

/**
 * Printable documents
 */
export interface PrintableFacility {
  tenant_name?: string | null
  branch_name?: string | null
  address?: string | null
  contact_number?: string | null
  email?: string | null
}

export interface PrintablePatient {
  id?: string | number | null
  patient_code?: string | null
  full_name?: string | null
  dob?: string | null
  gender?: string | null
  contact_number?: string | null
  address?: string | null
}

export interface PrintableField {
  label: string
  value: string
}

export interface PrintableSection {
  title: string
  fields: PrintableField[]
}

export interface PrintableLineItem {
  [key: string]: string | number | null | undefined
}

export interface PrintableSignatureLine {
  label: string
}

export interface PrintableDocument {
  title: string
  document_number: string
  generated_at: string
  facility: PrintableFacility
  patient: PrintablePatient
  staff: PrintableField[]
  dates: PrintableField[]
  sections: PrintableSection[]
  line_items: PrintableLineItem[]
  totals: PrintableField[]
  signature_lines: PrintableSignatureLine[]
}

export interface MedicalRecordQuickForm {
  patient_id: string | number
  record_type: RecordType
  reference_id?: string | number
  file_name?: string
  file_path?: string
  file_size?: number
  mime_type?: string
  released_to?: string
  is_released?: boolean
  purpose?: string
  digital_signature_hash?: string
}

/**
 * Patient App / Fabric Bridge
 */
export type ConsentStatus = 'pending' | 'granted' | 'denied' | 'expired' | 'revoked'
export type ConsentAction = 'read' | 'append'
export type IdentityLinkStatus = 'linked' | 'pending' | 'revoked'

export interface PatientIdentityLink {
  id: string
  tenant_id: string
  patient_id: string
  patient_did: string
  public_key?: string
  status: IdentityLinkStatus
  metadata?: Record<string, unknown>
  linked_at?: string
  revoked_at?: string
  created_at: string
  updated_at: string
}

export interface ConsentRequest {
  id: string
  tenant_id: string
  patient_id?: string
  patient_did: string
  clinic_id?: string
  scope: string[]
  actions: ConsentAction[]
  purpose: string
  duration_hours: number
  requester_context?: Record<string, unknown>
  status: ConsentStatus
  ledger_tx_id?: string
  expires_at?: string
  responded_at?: string
  denial_reason?: string
  grant?: ConsentGrant
  created_at: string
  updated_at: string
}

export interface ConsentGrant {
  id: string
  tenant_id: string
  consent_request_id?: string
  patient_id?: string
  patient_did: string
  granted_scope: string[]
  actions: ConsentAction[]
  purpose?: string
  conditions?: Record<string, unknown>
  status: ConsentStatus
  ledger_tx_id?: string
  granted_at?: string
  expires_at?: string
  revoked_at?: string
  revocation_reason?: string
  created_at: string
  updated_at: string
}

export interface ConsentValidationResult {
  valid: boolean
  consent_id?: string
  ledger_tx_id?: string
  reason?: string
}

export interface RecordAnchor {
  id: string
  tenant_id: string
  patient_id?: string
  patient_did: string
  consent_grant_id?: string
  record_type: string
  reference_id: string
  fhir_resource_type?: string
  encrypted_hash: string
  payload_url?: string
  ledger_tx_id?: string
  patient_status: string
  anchored_at?: string
  created_at: string
  updated_at: string
}

export interface ConsentAccessAudit {
  id: string
  tenant_id: string
  user_id?: string
  patient_did: string
  action: ConsentAction | string
  outcome: 'granted' | 'denied' | string
  scope?: string
  consent_grant_id?: string
  reference_type?: string
  reference_id?: string
  reason?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

/**
 * User / Role
 */
export interface User {
  id: string
  name: string
  email: string
  roles: string[]
  permissions: string[]
  tenant_id?: string
  person?: {
    first_name: string
    middle_name?: string
    last_name: string
    full_name?: string
  }
  person_affiliation?: {
    employee_id: string
    person?: {
      first_name: string
      middle_name?: string
      last_name: string
      full_name?: string
    }
  }
  is_active?: boolean
  created_at: string
}

export interface Role {
  id: number
  name: string
  guard_name: string
  permissions: string[]
}

/**
 * Report
 */
export type ReportType =
  | 'daily_census'
  | 'revenue'
  | 'prescriptions'
  | 'lab_tat'
  | 'lab_turnaround'
  | 'appointments'
  | 'appointment_analytics'
  | 'inventory_valuation'
  | 'doctor_productivity'
  | 'philhealth_hmo'
  | 'audit_trail'

export interface ReportParams {
  type: ReportType
  date_from?: string
  date_to?: string
  format?: 'json' | 'pdf' | 'excel' | 'csv'
}

/**
 * Audit Log
 */
export interface AuditLog {
  id: string
  user_id: string
  user?: User
  tenant_id?: string
  event: 'created' | 'updated' | 'deleted'
  auditable_type: string
  auditable_id: string
  old_values?: Record<string, unknown>
  new_values?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  created_at: string
}
