import { ref } from 'vue'
import type { PharmacyDispenseForm, PharmacyTransaction } from '~/types'
import { useApi } from '~/composables/useApi'

export function usePharmacy() {
  const transactions = ref<PharmacyTransaction[]>([])
  const transaction = ref<PharmacyTransaction | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const validationErrors = ref<Record<string, string[]> | null>(null)
  const api = useApi()

  async function fetchTransactions(params: Record<string, any> = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<PharmacyTransaction[]>(api.tenantPath('/pharmacy/transactions'), { params })
      if (res.success) {
        transactions.value = res.data
      } else {
        error.value = res.message || 'Failed to fetch pharmacy transactions'
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch pharmacy transactions'
    } finally {
      loading.value = false
    }
  }

  async function fetchTransaction(id: string | number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<PharmacyTransaction>(api.tenantPath(`/pharmacy/transactions/${id}`))
      if (res.success) {
        transaction.value = res.data
      } else {
        error.value = res.message || 'Failed to fetch pharmacy transaction'
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function dispense(data: PharmacyDispenseForm) {
    saving.value = true
    error.value = null
    validationErrors.value = null
    try {
      const res = await api.api<PharmacyTransaction>(api.tenantPath('/pharmacy/dispense'), {
        method: 'POST',
        body: data,
      })
      if (res.success) {
        transaction.value = res.data
        await fetchTransactions()
      } else {
        validationErrors.value = res.errors
        error.value = res.message || 'Failed to dispense medication'
      }
      return res
    } finally {
      saving.value = false
    }
  }

  return { transactions, transaction, loading, saving, error, validationErrors, fetchTransactions, fetchTransaction, dispense }
}
