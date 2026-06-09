import { ref } from 'vue'
import type { ImagingQuickOrderForm, ImagingRequest } from '~/types'
import { useApi } from '~/composables/useApi'

export function useImaging() {
  const requests = ref<ImagingRequest[]>([])
  const request = ref<ImagingRequest | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const validationErrors = ref<Record<string, string[]> | null>(null)
  const api = useApi()

  async function fetchRequests(params: Record<string, any> = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<ImagingRequest[]>(api.tenantPath('/imaging/requests'), { params })
      if (res.success) {
        requests.value = res.data
      } else {
        error.value = res.message || 'Failed to fetch imaging requests'
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch imaging requests'
    } finally {
      loading.value = false
    }
  }

  async function fetchRequest(id: string | number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<ImagingRequest>(api.tenantPath(`/imaging/requests/${id}`))
      if (res.success) {
        request.value = res.data
      } else {
        error.value = res.message || 'Failed to fetch imaging request'
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function createRequest(data: ImagingQuickOrderForm) {
    return submit(api.tenantPath('/imaging/requests'), 'POST', data)
  }

  async function updateRequest(id: string | number, data: Partial<ImagingRequest>) {
    return submit(api.tenantPath(`/imaging/requests/${id}`), 'PATCH', data)
  }

  async function submit(path: string, method: 'POST' | 'PATCH', body: Record<string, any>) {
    saving.value = true
    error.value = null
    validationErrors.value = null
    try {
      const res = await api.api<ImagingRequest>(path, { method, body })
      if (res.success) {
        request.value = res.data
      } else {
        validationErrors.value = res.errors
        error.value = res.message || 'Imaging request failed'
      }
      return res
    } finally {
      saving.value = false
    }
  }

  return { requests, request, loading, saving, error, validationErrors, fetchRequests, fetchRequest, createRequest, updateRequest }
}
