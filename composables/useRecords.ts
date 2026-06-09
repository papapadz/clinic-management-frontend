import { ref } from 'vue'
import type { MedicalRecord, MedicalRecordQuickForm, PaginationMeta } from '~/types'
import { useApi } from '~/composables/useApi'

export function useRecords() {
  const records = ref<MedicalRecord[]>([])
  const meta = ref<PaginationMeta | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const validationErrors = ref<Record<string, string[]> | null>(null)
  const api = useApi()

  async function fetchRecords(params: Record<string, any> = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<MedicalRecord[]>(api.tenantPath('/records'), { params })
      if (res.success) {
        records.value = res.data
        meta.value = res.meta ?? null
      } else {
        error.value = res.message || 'Failed to fetch medical records'
      }
      return res
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch medical records'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createRecord(data: MedicalRecordQuickForm) {
    return submit(api.tenantPath('/records'), 'POST', data)
  }

  async function releaseRecord(id: string | number, data: { released_to: string, purpose?: string }) {
    return submit(api.tenantPath(`/records/${id}/release`), 'POST', data)
  }

  async function submit(path: string, method: 'POST' | 'PATCH', body: Record<string, any>) {
    saving.value = true
    error.value = null
    validationErrors.value = null
    try {
      const res = await api.api<MedicalRecord>(path, { method, body })
      if (!res.success) {
        validationErrors.value = res.errors
        error.value = res.message || 'Record request failed'
      }
      return res
    } catch (e: any) {
      error.value = e.message || 'Record request failed'
      throw e
    } finally {
      saving.value = false
    }
  }

  return {
    records,
    meta,
    loading,
    saving,
    error,
    validationErrors,
    fetchRecords,
    createRecord,
    releaseRecord,
  }
}
