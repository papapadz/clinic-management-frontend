import { describe, expect, it } from 'vitest'
import type { ImagingRequest, LabRequest } from '~/types'
import {
  diagnosticPrintUrl,
  diagnosticRequestDisplayName,
  isEncounterLinkedRequest,
  sortDiagnosticRequestsByDisplayName,
} from './diagnosticPrint'

describe('diagnostic print helpers', () => {
  it('uses the first lab test panel name and falls back to the request ID', () => {
    expect(diagnosticRequestDisplayName('lab', { id: '12', test_panels: [{ name: 'CBC' }] } as LabRequest)).toBe('CBC')
    expect(diagnosticRequestDisplayName('lab', { id: '13', test_panels: [] } as unknown as LabRequest)).toBe('Request 13')
  })

  it('uses the trimmed imaging modality and body part and falls back to the request ID', () => {
    expect(diagnosticRequestDisplayName('imaging', { id: '21', modality: ' XRAY ', body_part: ' Chest ' } as ImagingRequest)).toBe('XRAY Chest')
    expect(diagnosticRequestDisplayName('imaging', { id: '22', modality: '', body_part: ' ' } as ImagingRequest)).toBe('Request 22')
  })

  it('sorts diagnostic requests case-insensitively by display name', () => {
    const sorted = sortDiagnosticRequestsByDisplayName('lab', [
      { id: '2', test_panels: [{ name: 'zinc' }] },
      { id: '3', test_panels: [{ name: 'Albumin' }] },
      { id: '1', test_panels: [{ name: 'cbc' }] },
    ] as LabRequest[])

    expect(sorted.map((request) => request.id)).toEqual(['3', '1', '2'])
  })

  it('builds diagnostic batch print URLs preserving sorted IDs', () => {
    expect(diagnosticPrintUrl('lab', 'demo-clinic', ['3', '1', '2'])).toBe('/demo-clinic/lab/batch-print?ids=3%2C1%2C2')
    expect(diagnosticPrintUrl('imaging', 'demo-clinic', ['7'])).toBe('/demo-clinic/imaging/batch-print?ids=7')
  })

  it('detects encounter-linked requests', () => {
    expect(isEncounterLinkedRequest({ encounter_id: 10 })).toBe(true)
    expect(isEncounterLinkedRequest({ encounter_id: null })).toBe(false)
    expect(isEncounterLinkedRequest({})).toBe(false)
  })
})
