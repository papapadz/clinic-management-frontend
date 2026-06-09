import { ref } from 'vue'
import type { PrintableDocument } from '~/types'
import { useApi } from '~/composables/useApi'

export type PrintableDocumentKind = 'appointment' | 'lab' | 'imaging' | 'pharmacy' | 'prescription' | 'billing'

export interface PrintDocumentOptions {
  encounterLinked?: boolean
}

export function usePrintDocuments() {
  const document = ref<PrintableDocument | null>(null)
  const documents = ref<PrintableDocument[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const api = useApi()

  async function fetchPrintDocument(kind: PrintableDocumentKind, id: string | number, options?: PrintDocumentOptions) {
    loading.value = true
    error.value = null

    try {
      const path = printDocumentPathFor(kind, id, options)
      if (options?.encounterLinked) {
        const res = await api.api<PrintableDocument[]>(api.tenantPath(path))
        if (res.success) {
          documents.value = res.data
          document.value = res.data[0] ?? null
        } else {
          error.value = res.message || 'Failed to load printable document'
        }
        return res
      } else {
        const res = await api.api<PrintableDocument>(api.tenantPath(path))
        if (res.success) {
          document.value = res.data
          documents.value = [res.data]
        } else {
          error.value = res.message || 'Failed to load printable document'
        }
        return res
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to load printable document'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { document, documents, loading, error, fetchPrintDocument }
}

export function printDocumentPathFor(kind: PrintableDocumentKind, id: string | number, options?: PrintDocumentOptions): string {
  switch (kind) {
    case 'appointment':
      return `/appointments/${id}/print`
    case 'lab':
      return options?.encounterLinked ? `/lab/requests/${id}/encounter-print` : `/lab/requests/${id}/print`
    case 'imaging':
      return options?.encounterLinked ? `/imaging/requests/${id}/encounter-print` : `/imaging/requests/${id}/print`
    case 'pharmacy':
      return `/pharmacy/transactions/${id}/print`
    case 'prescription':
      return `/encounters/${id}/prescription-print`
    case 'billing':
      return `/billing/transactions/${id}/invoice-print`
  }
}
