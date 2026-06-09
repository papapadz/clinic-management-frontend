import { ref } from 'vue'
import type { BillingProcessPaymentForm, BillingQuickOrderForm, BillingTransaction, PaginationMeta, PaymentModeRecord, VatRate } from '~/types'
import { useApi } from '~/composables/useApi'

export function useBilling() {
  const transactions = ref<BillingTransaction[]>([])
  const paymentModes = ref<PaymentModeRecord[]>([])
  const vatRates = ref<VatRate[]>([])
  const meta = ref<PaginationMeta | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const validationErrors = ref<Record<string, string[]> | null>(null)
  const api = useApi()

  async function fetchTransactions(params: Record<string, any> = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<BillingTransaction[]>(api.tenantPath('/billing/transactions'), { params })
      if (res.success) {
        transactions.value = res.data
        meta.value = res.meta ?? null
      } else {
        error.value = res.message || 'Failed to fetch billing transactions'
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch billing transactions'
    } finally {
      loading.value = false
    }
  }

  async function createTransaction(data: BillingQuickOrderForm) {
    return submit(api.tenantPath('/billing/transactions'), 'POST', data)
  }

  async function updateTransaction(id: string | number, data: Partial<BillingQuickOrderForm>) {
    return submit(api.tenantPath(`/billing/transactions/${id}`), 'PATCH', data)
  }

  async function processTransaction(id: string | number, data: BillingProcessPaymentForm) {
    return submit(api.tenantPath(`/billing/${id}/process`), 'POST', data)
  }

  async function voidTransaction(id: string | number, voidReason: string) {
    return submit(api.tenantPath(`/billing/${id}/void`), 'POST', { void_reason: voidReason })
  }

  async function fetchPaymentModes(includeInactive = false) {
    const res = await api.api<PaymentModeRecord[]>(api.tenantPath('/billing/payment-modes'), {
      params: { include_inactive: includeInactive ? 1 : undefined },
    })
    if (res.success) {
      paymentModes.value = res.data
    }
    return res
  }

  async function fetchVatRates() {
    const res = await api.api<VatRate[]>(api.tenantPath('/billing/vat-rates'))
    if (res.success) {
      vatRates.value = res.data
    }
    return res
  }

  async function submit(path: string, method: 'POST' | 'PATCH', body: Record<string, any>) {
    saving.value = true
    error.value = null
    validationErrors.value = null
    try {
      const res = await api.api<BillingTransaction>(path, { method, body })
      if (!res.success) {
        validationErrors.value = res.errors
        error.value = res.message || 'Billing request failed'
      }
      return res
    } catch (e: any) {
      error.value = e.message || 'Billing request failed'
      throw e
    } finally {
      saving.value = false
    }
  }

  return {
    transactions,
    paymentModes,
    vatRates,
    meta,
    loading,
    saving,
    error,
    validationErrors,
    fetchTransactions,
    fetchPaymentModes,
    fetchVatRates,
    createTransaction,
    updateTransaction,
    processTransaction,
    voidTransaction,
  }
}
