import { ref } from 'vue'
import type { LabQuickOrderForm, LabRequest } from '~/types'
import { useApi } from '~/composables/useApi'

export function useLab() {
  const requests = ref<LabRequest[]>([])
  const request = ref<LabRequest | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const validationErrors = ref<Record<string, string[]> | null>(null)
  const api = useApi()

  async function fetchRequests(params: Record<string, any> = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<LabRequest[]>(api.tenantPath('/lab/requests'), { params })
      if (res.success) {
        requests.value = res.data
      } else {
        error.value = res.message || 'Failed to fetch lab requests'
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch lab requests'
    } finally {
      loading.value = false
    }
  }

  async function fetchRequest(id: string | number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<LabRequest>(api.tenantPath(`/lab/requests/${id}`))
      if (res.success) {
        request.value = res.data
      } else {
        error.value = res.message || 'Failed to fetch lab request'
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function createRequest(data: LabQuickOrderForm) {
    return submit(api.tenantPath('/lab/requests'), 'POST', data)
  }

  async function updateRequest(id: string | number, data: Partial<LabRequest>) {
    return submit(api.tenantPath(`/lab/requests/${id}`), 'PATCH', data)
  }

  async function recordResults(id: string | number, data: Partial<LabRequest>) {
    return submit(api.tenantPath(`/lab/requests/${id}/results`), 'POST', data)
  }

  async function submit(path: string, method: 'POST' | 'PATCH', body: Record<string, any>) {
    saving.value = true
    error.value = null
    validationErrors.value = null
    try {
      const res = await api.api<LabRequest>(path, { method, body })
      if (res.success) {
        request.value = res.data
      } else {
        validationErrors.value = res.errors
        error.value = res.message || 'Lab request failed'
      }
      return res
    } finally {
      saving.value = false
    }
  }

  return { requests, request, loading, saving, error, validationErrors, fetchRequests, fetchRequest, createRequest, updateRequest, recordResults }
}
