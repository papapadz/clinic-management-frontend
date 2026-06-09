import { describe, expect, it } from 'vitest'
import { normalizeReportResult } from './reports'

describe('normalizeReportResult', () => {
  it('turns revenue report data into summary, chart, and table rows', () => {
    const normalized = normalizeReportResult('revenue', {
      total: 12500,
      by_status: [
        { status: 'PAID', count: 7, total: 9000 },
        { status: 'PARTIAL', count: 3, total: 3500 },
      ],
    })

    expect(normalized.summary).toEqual([
      { label: 'Revenue', value: 'PHP 12,500.00', helper: 'Paid and partial transactions', tone: 'success' },
      { label: 'Statuses', value: '2', helper: 'Transaction status groups', tone: 'primary' },
    ])
    expect(normalized.chartRows).toEqual([
      { label: 'Paid', value: 9000, detail: '7 transactions', tone: 'success' },
      { label: 'Partial', value: 3500, detail: '3 transactions', tone: 'warning' },
    ])
    expect(normalized.tableRows).toEqual([
      { label: 'Paid', value: 'PHP 9,000.00', detail: '7 transactions' },
      { label: 'Partial', value: 'PHP 3,500.00', detail: '3 transactions' },
    ])
  })

  it('returns stable empty rows for missing report data', () => {
    const normalized = normalizeReportResult('daily_census', null)

    expect(normalized.summary).toEqual([
      { label: 'Patients', value: '0', helper: 'Registered patients', tone: 'primary' },
      { label: 'Encounters', value: '0', helper: 'Clinical encounters', tone: 'success' },
      { label: 'Appointments', value: '0', helper: 'Scheduled visits', tone: 'warning' },
    ])
    expect(normalized.chartRows.every((row) => row.value === 0)).toBe(true)
    expect(normalized.tableRows).toHaveLength(3)
  })
})
