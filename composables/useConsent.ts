import { ref } from 'vue'
import type { ConsentGrant, ConsentRequest, ConsentValidationResult } from '~/types'
import { useApi } from '~/composables/useApi'

export function useConsent() {
  const requests = ref<ConsentRequest[]>([])
  const activeGrant = ref<ConsentGrant | null>(null)
  const validation = ref<ConsentValidationResult | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const api = useApi()

  async function requestConsent(data: {
    patient_id: string | number
    patient_did: string
    clinic_id: string
    scope: string[]
    actions: Array<'read' | 'append'>
    purpose: string
    duration_hours?: number
    requester_context?: Record<string, unknown>
  }) {
    return run(async () => {
      const res = await api.api<ConsentRequest>(api.tenantPath('/fabric/consent-requests'), {
        method: 'POST',
        body: data,
      })
      if (res.success) requests.value.unshift(res.data)
      return res
    }, 'Failed to request consent')
  }

  async function fetchConsentStatus(requestId: string) {
    return run(async () => {
      const res = await api.api<ConsentRequest>(api.tenantPath(`/fabric/consent-requests/${requestId}`))
      if (res.success && res.data.grant) activeGrant.value = res.data.grant
      return res
    }, 'Failed to fetch consent status')
  }

  async function validateConsent(data: {
    patient_did: string
    scope: string
    action: 'read' | 'append'
    purpose: string
    staff_actor_id?: string
    reference_type?: string
    reference_id?: string
  }) {
    return run(async () => {
      const res = await api.api<ConsentValidationResult>(api.tenantPath('/fabric/consent/validate'), {
        method: 'POST',
        body: data,
      })
      validation.value = res.data
      return res
    }, 'Failed to validate consent')
  }

  async function revokeConsent(consentId: string, reason?: string) {
    return run(async () => {
      const res = await api.api<ConsentGrant>(api.tenantPath(`/fabric/consent-grants/${consentId}/revoke`), {
        method: 'POST',
        body: { reason },
      })
      if (res.success) activeGrant.value = res.data
      return res
    }, 'Failed to revoke consent')
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
    requests,
    activeGrant,
    validation,
    loading,
    error,
    requestConsent,
    fetchConsentStatus,
    validateConsent,
    revokeConsent,
  }
}
