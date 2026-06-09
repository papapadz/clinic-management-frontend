import { ref } from 'vue'
import type { RecordAnchor } from '~/types'
import { useApi } from '~/composables/useApi'

export function useRecordAnchors() {
  const anchors = ref<RecordAnchor[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const api = useApi()

  async function fetchAnchors(params: Record<string, unknown> = {}) {
    return run(async () => {
      const res = await api.api<RecordAnchor[]>(api.tenantPath('/fabric/record-anchors'), { params })
      if (res.success) anchors.value = res.data
      return res
    }, 'Failed to fetch record anchors')
  }

  async function anchorRecord(data: {
    patient_did: string
    consent_id?: string
    record_type: string
    reference_id: string
    fhir_resource_type?: string
    encrypted_payload: string
    encrypted_hash: string
    patient_status?: string
  }) {
    return run(async () => {
      const res = await api.api<RecordAnchor>(api.tenantPath('/fabric/record-anchors'), {
        method: 'POST',
        body: data,
      })
      if (res.success) anchors.value.unshift(res.data)
      return res
    }, 'Failed to anchor record')
  }

  async function fetchPayload(anchorId: string) {
    return run(async () => {
      return await api.api<{
        record_anchor_id: string
        encrypted_payload: string
        encrypted_hash: string
      }>(api.tenantPath(`/fabric/record-anchors/${anchorId}/payload`))
    }, 'Failed to fetch record payload')
  }

  async function run<T>(operation: () => Promise<T>, fallback: string): Promise<T> {
    loading.value = true
    error.value = null
    try {
      return await operation()
    } catch (e: any) {
      error.value = e.message || fallback
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    anchors,
    loading,
    error,
    fetchAnchors,
    anchorRecord,
    fetchPayload,
  }
}
