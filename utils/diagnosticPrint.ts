import type { ImagingRequest, LabRequest } from '~/types'

export type DiagnosticPrintKind = 'lab' | 'imaging'
export type DiagnosticRequest = LabRequest | ImagingRequest

export function diagnosticRequestDisplayName(kind: DiagnosticPrintKind, request: DiagnosticRequest): string {
  if (kind === 'lab') {
    const panelName = (request as LabRequest).test_panels?.[0]?.name?.trim()
    return panelName || requestFallbackName(request)
  }

  const imaging = request as ImagingRequest
  const name = [imaging.modality, imaging.body_part]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ')

  return name || requestFallbackName(request)
}

export function sortDiagnosticRequestsByDisplayName<T extends DiagnosticRequest>(kind: DiagnosticPrintKind, requests: T[]): T[] {
  return [...requests].sort((left, right) => {
    return diagnosticRequestDisplayName(kind, left).localeCompare(
      diagnosticRequestDisplayName(kind, right),
      undefined,
      { sensitivity: 'base' },
    )
  })
}

export function diagnosticPrintUrl(kind: DiagnosticPrintKind, tenant: string, ids: Array<string | number>): string {
  const encodedIds = encodeURIComponent(ids.join(','))
  return `/${tenant}/${kind}/batch-print?ids=${encodedIds}`
}

export function isEncounterLinkedRequest(request: { encounter_id?: string | number | null }): boolean {
  return request.encounter_id !== undefined && request.encounter_id !== null && request.encounter_id !== ''
}

function requestFallbackName(request: { id: string | number }): string {
  return `Request ${request.id}`
}
