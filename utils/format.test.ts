import { describe, expect, it, vi } from 'vitest'
import { formatLocalDateTimeInput } from './format'

describe('formatLocalDateTimeInput', () => {
  it('formats the current local time for datetime-local inputs', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 8, 9, 7, 45))

    expect(formatLocalDateTimeInput()).toBe('2026-06-08T09:07')

    vi.useRealTimers()
  })
})
