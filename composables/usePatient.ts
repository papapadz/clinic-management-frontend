import { ref } from 'vue'
import type { Patient, PatientForm, PaginationMeta } from '~/types'
import { useApi } from '~/composables/useApi'

interface PatientListParams {
  page?: number
  per_page?: number
  search?: string
}

export function usePatient() {
  const patients = ref<Patient[]>([])
  const meta = ref<PaginationMeta | null>(null)
  const loading = ref(false)
  const creating = ref(false)
  const error = ref<string | null>(null)
  const validationErrors = ref<Record<string, string[]> | null>(null)
  const api = useApi()

  async function fetchPatients(params: PatientListParams = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<Patient[]>(api.tenantPath('/patients'), { params })
      if (res.success) {
        patients.value = res.data
        meta.value = res.meta ?? null
      } else {
        error.value = res.message || 'Failed to fetch patients'
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch patients'
    } finally {
      loading.value = false
    }
  }

  async function createPatient(data: PatientForm) {
    creating.value = true
    error.value = null
    validationErrors.value = null
    try {
      const res = await api.api<Patient>(api.tenantPath('/patients'), {
        method: 'POST',
        body: data,
      })
      if (res.success) {
        return res
      }

      validationErrors.value = res.errors
      error.value = res.message || 'Failed to create patient'
      return res
    } catch (e: any) {
      error.value = e.message || 'Failed to create patient'
      throw e
    } finally {
      creating.value = false
    }
  }

  return {
    patients,
    meta,
    loading,
    creating,
    error,
    validationErrors,
    fetchPatients,
    createPatient,
  }
}
