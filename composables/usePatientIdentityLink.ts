import { ref } from 'vue'
import type { PatientIdentityLink } from '~/types'
import { useApi } from '~/composables/useApi'

export function usePatientIdentityLink() {
  const links = ref<PatientIdentityLink[]>([])
  const currentLink = ref<PatientIdentityLink | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const api = useApi()

  async function fetchLinks(params: Record<string, unknown> = {}) {
    return run(async () => {
      const res = await api.api<PatientIdentityLink[]>(api.tenantPath('/fabric/identity-links'), { params })
      if (res.success) links.value = res.data
      return res
    }, 'Failed to fetch identity links')
  }

  async function linkPatient(patientId: string | number, data: {
    patient_did: string
    public_key?: string
    metadata?: Record<string, unknown>
  }) {
    return run(async () => {
      const res = await api.api<PatientIdentityLink>(api.tenantPath(`/fabric/patients/${patientId}/identity-link`), {
        method: 'POST',
        body: data,
      })
      if (res.success) currentLink.value = res.data
      return res
    }, 'Failed to link patient identity')
  }

  async function fetchPatientDid(patientId: string | number) {
    return run(async () => {
      const res = await api.api<PatientIdentityLink>(api.tenantPath(`/fabric/patients/${patientId}/did`))
      if (res.success) currentLink.value = res.data
      return res
    }, 'Failed to fetch patient DID')
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
    links,
    currentLink,
    loading,
    error,
    fetchLinks,
    linkPatient,
    fetchPatientDid,
  }
}
