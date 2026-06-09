import { describe, expect, it, vi } from 'vitest'
import { printDocumentPathFor } from './usePrintDocuments'

vi.mock('~/composables/useApi', () => ({ useApi: vi.fn() }))

describe('printDocumentPathFor', () => {
  it('returns the default lab print path', () => {
    expect(printDocumentPathFor('lab', 42)).toBe('/lab/requests/42/print')
  })

  it('returns the default imaging print path', () => {
    expect(printDocumentPathFor('imaging', 7)).toBe('/imaging/requests/7/print')
  })

  it('returns the encounter-linked lab print path', () => {
    expect(printDocumentPathFor('lab', 42, { encounterLinked: true })).toBe('/lab/requests/42/encounter-print')
  })

  it('returns the encounter-linked imaging print path', () => {
    expect(printDocumentPathFor('imaging', 7, { encounterLinked: true })).toBe('/imaging/requests/7/encounter-print')
  })

  it('returns default lab path when encounterLinked is false', () => {
    expect(printDocumentPathFor('lab', 42, { encounterLinked: false })).toBe('/lab/requests/42/print')
  })

  it('returns default imaging path when encounterLinked is false', () => {
    expect(printDocumentPathFor('imaging', 7, { encounterLinked: false })).toBe('/imaging/requests/7/print')
  })

  it('non-diagnostic kinds are unaffected by encounterLinked option', () => {
    expect(printDocumentPathFor('appointment', 1, { encounterLinked: true })).toBe('/appointments/1/print')
    expect(printDocumentPathFor('pharmacy', 2, { encounterLinked: true })).toBe('/pharmacy/transactions/2/print')
    expect(printDocumentPathFor('prescription', 3, { encounterLinked: true })).toBe('/encounters/3/prescription-print')
    expect(printDocumentPathFor('billing', 4, { encounterLinked: true })).toBe('/billing/transactions/4/invoice-print')
  })
})
