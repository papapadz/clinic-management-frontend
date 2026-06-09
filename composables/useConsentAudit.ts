import { ref } from 'vue'
import type { ConsentAccessAudit } from '~/types'
import { useApi } from '~/composables/useApi'

export function useConsentAudit() {
  const audits = ref<ConsentAccessAudit[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const api = useApi()

  async function fetchAudits(params: Record<string, unknown> = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<ConsentAccessAudit[]>(api.tenantPath('/fabric/audits'), { params })
      if (res.success) {
        audits.value = res.data
      } else {
        error.value = res.message || 'Failed to fetch consent audits'
      }
      return res
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch consent audits'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    audits,
    loading,
    error,
    fetchAudits,
  }
}
