import { ref } from 'vue'
import type { User } from '~/types'
import { useApi } from '~/composables/useApi'

export function useStaffOptions() {
  const staff = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const api = useApi()

  async function fetchStaff(params: Record<string, any> = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<User[]>(api.tenantPath('/staff/options'), { params })
      if (res.success) {
        staff.value = res.data
      } else {
        error.value = res.message || 'Failed to load staff'
      }
      return res
    } catch (e: any) {
      error.value = e.message || 'Failed to load staff'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { staff, loading, error, fetchStaff }
}
