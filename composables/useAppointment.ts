import { ref } from 'vue'
import type { Appointment, AppointmentForm } from '~/types'
import { useApi } from '~/composables/useApi'

export function useAppointment() {
  const appointments = ref<Appointment[]>([])
  const appointment = ref<Appointment | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const validationErrors = ref<Record<string, string[]> | null>(null)
  const api = useApi()

  async function fetchAppointments(params: Record<string, any> = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<Appointment[]>(api.tenantPath('/appointments'), { params })
      if (res.success) {
        appointments.value = res.data
      } else {
        error.value = res.message || 'Failed to fetch appointments'
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch appointments'
    } finally {
      loading.value = false
    }
  }

  async function createAppointment(data: AppointmentForm) {
    saving.value = true
    error.value = null
    validationErrors.value = null
    try {
      const res = await api.api<Appointment>(api.tenantPath('/appointments'), {
        method: 'POST',
        body: data,
      })
      if (res.success) {
        await fetchAppointments()
      } else {
        validationErrors.value = res.errors
        error.value = res.message || 'Failed to create appointment'
      }
      return res
    } catch (e: any) {
      error.value = e.message || 'Failed to create appointment'
      throw e
    } finally {
      saving.value = false
    }
  }

  async function fetchAppointment(id: string | number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<Appointment>(api.tenantPath(`/appointments/${id}`))
      if (res.success) {
        appointment.value = res.data
      } else {
        error.value = res.message || 'Failed to fetch appointment'
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function updateAppointment(id: string | number, data: Partial<AppointmentForm>) {
    return submit(id, 'PATCH', data)
  }

  async function checkInAppointment(id: string | number) {
    saving.value = true
    error.value = null
    try {
      const res = await api.api<Appointment>(api.tenantPath(`/appointments/${id}/check-in`), {
        method: 'POST',
        body: {},
      })
      if (res.success) {
        appointment.value = res.data
      } else {
        error.value = res.message || 'Failed to check in appointment'
      }
      return res
    } finally {
      saving.value = false
    }
  }

  async function submit(id: string | number, method: 'PATCH', body: Record<string, any>) {
    saving.value = true
    error.value = null
    validationErrors.value = null
    try {
      const res = await api.api<Appointment>(api.tenantPath(`/appointments/${id}`), { method, body })
      if (res.success) {
        appointment.value = res.data
      } else {
        validationErrors.value = res.errors
        error.value = res.message || 'Failed to update appointment'
      }
      return res
    } finally {
      saving.value = false
    }
  }

  return {
    appointments,
    appointment,
    loading,
    saving,
    error,
    validationErrors,
    fetchAppointments,
    createAppointment,
    fetchAppointment,
    updateAppointment,
    checkInAppointment,
  }
}
