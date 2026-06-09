import { describe, expect, it } from 'vitest'
import { getStatusTone } from './status'

describe('getStatusTone', () => {
  it('maps clinic workflow statuses to stable UI tones', () => {
    expect(getStatusTone('PAID')).toBe('success')
    expect(getStatusTone('STAT')).toBe('danger')
    expect(getStatusTone('URGENT')).toBe('warning')
    expect(getStatusTone('VOIDED')).toBe('danger')
    expect(getStatusTone('CHECKED_IN')).toBe('info')
    expect(getStatusTone('unknown')).toBe('neutral')
  })
})
