import { ref } from 'vue'
import type { LibraryForm, LibraryKey, LibraryRecord, PaginationMeta, PaymentModeRecord, PharmacyItem, VatRate } from '~/types'
import { useApi } from '~/composables/useApi'
import { catalogPath, normalizeLibraryForm } from '~/utils/catalogs'

export function useCatalogs() {
  const libraryItems = ref<LibraryRecord[]>([])
  const libraryOptions = ref<Record<LibraryKey, LibraryRecord[]>>({
    appointment_type: [],
    encounter_type: [],
    lab_procedure: [],
    imaging_procedure: [],
  })
  const vatRates = ref<VatRate[]>([])
  const pharmacyItems = ref<PharmacyItem[]>([])
  const paymentModes = ref<PaymentModeRecord[]>([])
  const meta = ref<PaginationMeta | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const validationErrors = ref<Record<string, string[]> | null>(null)
  const api = useApi()

  async function fetchLibrary(library: LibraryKey, params: Record<string, any> = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<LibraryRecord[]>(api.tenantPath(catalogPath(library)), { params })
      if (res.success) {
        libraryItems.value = res.data
        meta.value = res.meta ?? null
      } else {
        error.value = res.message || 'Failed to load catalog items'
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function fetchOptions(library: LibraryKey) {
    const res = await api.api<LibraryRecord[]>(api.tenantPath(catalogPath(library, 'options')))
    if (res.success) {
      libraryOptions.value[library] = res.data
    }
    return res
  }

  async function saveLibraryItem(form: LibraryForm, id?: string | number) {
    const path = id ? `${catalogPath(form.library)}/${id}` : catalogPath(form.library)
    return submit<LibraryRecord>(api.tenantPath(path), id ? 'PATCH' : 'POST', normalizeLibraryForm(form))
  }

  async function deactivateLibraryItem(library: LibraryKey, id: string | number) {
    return submit<LibraryRecord>(api.tenantPath(`${catalogPath(library)}/${id}/deactivate`), 'POST', {})
  }

  async function deleteLibraryItem(library: LibraryKey, id: string | number) {
    return submit<null>(api.tenantPath(`${catalogPath(library)}/${id}`), 'DELETE', {})
  }

  async function restoreLibraryItem(library: LibraryKey, id: string | number) {
    return submit<LibraryRecord>(api.tenantPath(`${catalogPath(library)}/${id}/restore`), 'POST', {})
  }

  async function fetchVatRates() {
    const res = await api.api<VatRate[]>(api.tenantPath('/billing/vat-rates'))
    if (res.success) {
      vatRates.value = res.data
    }
    return res
  }

  async function fetchPharmacyItems(params: Record<string, any> = {}) {
    const res = await api.api<PharmacyItem[]>(api.tenantPath('/pharmacy/inventory'), { params })
    if (res.success) {
      pharmacyItems.value = res.data
    }
    return res
  }

  async function fetchPaymentModes() {
    const res = await api.api<PaymentModeRecord[]>(api.tenantPath('/billing/payment-modes'), { params: { include_inactive: 1 } })
    if (res.success) {
      paymentModes.value = res.data
    }
    return res
  }

  async function submit<T>(path: string, method: 'POST' | 'PATCH' | 'DELETE', body: Record<string, unknown>) {
    saving.value = true
    error.value = null
    validationErrors.value = null
    try {
      const res = await api.api<T>(path, { method, body })
      if (!res.success) {
        validationErrors.value = res.errors
        error.value = res.message || 'Catalog request failed'
      }
      return res
    } finally {
      saving.value = false
    }
  }

  return {
    libraryItems,
    libraryOptions,
    vatRates,
    pharmacyItems,
    paymentModes,
    meta,
    loading,
    saving,
    error,
    validationErrors,
    fetchLibrary,
    fetchOptions,
    saveLibraryItem,
    deactivateLibraryItem,
    deleteLibraryItem,
    restoreLibraryItem,
    fetchVatRates,
    fetchPharmacyItems,
    fetchPaymentModes,
  }
}
