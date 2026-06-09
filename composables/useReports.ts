import { ref } from 'vue'
import type { ReportParams, ReportType } from '~/types'
import { useApi } from '~/composables/useApi'
import { normalizeReportResult, type NormalizedReport } from '~/utils/reports'

interface ReportApiResult {
  type: ReportType
  date_from?: string | null
  date_to?: string | null
  format?: string
  results?: Record<string, any> | null
}

export function useReports() {
  const report = ref<NormalizedReport | null>(null)
  const rawReport = ref<ReportApiResult | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const api = useApi()

  async function fetchReport(params: ReportParams) {
    loading.value = true
    error.value = null
    try {
      const res = await api.api<ReportApiResult>(api.tenantPath('/reports'), { params })
      if (res.success) {
        rawReport.value = res.data
        report.value = normalizeReportResult(params.type, res.data?.results)
      } else {
        error.value = res.message || 'Failed to fetch report'
      }
      return res
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch report'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    report,
    rawReport,
    loading,
    error,
    fetchReport,
  }
}
