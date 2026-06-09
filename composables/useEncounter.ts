import { ref } from 'vue'
import type {
  BillingQuickOrderForm,
  BillingTransaction,
  Encounter,
  EncounterForm,
  EncounterSummary,
  ImagingQuickOrderForm,
  ImagingRequest,
  LabQuickOrderForm,
  LabRequest,
  MedicalRecord,
  MedicalRecordQuickForm,
  PaginationMeta,
  Appointment,
  AppointmentForm,
  PharmacyDispenseForm,
  PharmacyTransaction,
} from '~/types'
import { useApi } from '~/composables/useApi'

interface EncounterListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
}

interface SignEncounterOptions {
  overwrite_generated_lines?: boolean
}

export function useEncounter() {
  const encounters = ref<Encounter[]>([])
  const summary = ref<EncounterSummary | null>(null)
  const meta = ref<PaginationMeta | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const validationErrors = ref<Record<string, string[]> | null>(null)
  const api = useApi()

  async function fetchPatientEncounters(patientId: string | number, params: EncounterListParams = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<Encounter[]>(api.tenantPath(`/patients/${patientId}/encounters`), { params })
      if (res.success) {
        encounters.value = res.data
        meta.value = res.meta ?? null
      } else {
        error.value = res.message || 'Failed to fetch encounters'
      }
      return res
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch encounters'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchSummary(encounterId: string | number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<EncounterSummary>(api.tenantPath(`/encounters/${encounterId}/summary`))
      if (res.success) {
        summary.value = res.data
      } else {
        error.value = res.message || 'Failed to fetch encounter summary'
      }
      return res
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch encounter summary'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createEncounter(patientId: string | number, data: Omit<EncounterForm, 'patient_id'>) {
    return submit<Encounter>(api.tenantPath(`/patients/${patientId}/encounters`), 'POST', {
      ...data,
      patient_id: patientId,
    })
  }

  async function updateEncounter(encounterId: string | number, data: Partial<EncounterForm>) {
    return submit<Encounter>(api.tenantPath(`/encounters/${encounterId}`), 'PATCH', data)
  }

  async function signEncounter(encounterId: string | number, options: SignEncounterOptions = {}) {
    return submit<Encounter>(api.tenantPath(`/encounters/${encounterId}/sign`), 'POST', options)
  }

  async function createLabOrder(data: LabQuickOrderForm) {
    return submit<LabRequest>(api.tenantPath('/lab/requests'), 'POST', data)
  }

  async function createImagingOrder(data: ImagingQuickOrderForm) {
    return submit<ImagingRequest>(api.tenantPath('/imaging/requests'), 'POST', data)
  }

  async function createPharmacyDispense(data: PharmacyDispenseForm) {
    return submit<PharmacyTransaction>(api.tenantPath('/pharmacy/dispense'), 'POST', data)
  }

  async function createAppointment(data: AppointmentForm) {
    return submit<Appointment>(api.tenantPath('/appointments'), 'POST', data)
  }

  async function createBillingTransaction(data: BillingQuickOrderForm) {
    return submit<BillingTransaction>(api.tenantPath('/billing/transactions'), 'POST', data)
  }

  async function createMedicalRecord(data: MedicalRecordQuickForm) {
    return submit<MedicalRecord>(api.tenantPath('/records'), 'POST', data)
  }

  async function submit<T>(path: string, method: 'POST' | 'PATCH', body: unknown) {
    saving.value = true
    error.value = null
    validationErrors.value = null
    try {
      const res = await api.api<T>(path, { method, body: body as Record<string, any> })
      if (!res.success) {
        validationErrors.value = res.errors
        error.value = res.message || 'Request failed'
      }
      return res
    } catch (e: any) {
      error.value = e.message || 'Request failed'
      throw e
    } finally {
      saving.value = false
    }
  }

  return {
    encounters,
    summary,
    meta,
    loading,
    saving,
    error,
    validationErrors,
    fetchPatientEncounters,
    fetchSummary,
    createEncounter,
    updateEncounter,
    signEncounter,
    createLabOrder,
    createImagingOrder,
    createPharmacyDispense,
    createAppointment,
    createBillingTransaction,
    createMedicalRecord,
  }
}
