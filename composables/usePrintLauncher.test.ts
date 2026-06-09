import { describe, expect, it } from 'vitest'
import { buildAutoPrintUrl, buildEmbeddedPrintUrl } from './usePrintLauncher'

describe('buildAutoPrintUrl', () => {
  it('appends autoprint=1 to a path without query', () => {
    expect(buildAutoPrintUrl('/demo-clinic/lab/1/print')).toBe('/demo-clinic/lab/1/print?autoprint=1')
  })

  it('appends autoprint=1 with & when query already exists', () => {
    expect(buildAutoPrintUrl('/demo-clinic/lab/1/print?foo=bar')).toBe('/demo-clinic/lab/1/print?foo=bar&autoprint=1')
  })
})

describe('buildEmbeddedPrintUrl', () => {
  it('appends embedded=1 to a path without query', () => {
    expect(buildEmbeddedPrintUrl('/demo-clinic/imaging/1/print')).toBe('/demo-clinic/imaging/1/print?embedded=1')
  })

  it('appends embedded=1 with & when query already exists', () => {
    expect(buildEmbeddedPrintUrl('/demo-clinic/imaging/1/print?foo=bar')).toBe('/demo-clinic/imaging/1/print?foo=bar&embedded=1')
  })
})
