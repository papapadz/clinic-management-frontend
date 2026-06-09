import type { ReportType } from '~/types'

export type ReportTone = 'primary' | 'success' | 'warning' | 'danger'

export interface ReportSummaryItem {
  label: string
  value: string
  helper: string
  tone: ReportTone
}

export interface ReportChartRow {
  label: string
  value: number
  detail: string
  tone: ReportTone
}

export interface ReportTableRow {
  label: string
  value: string
  detail: string
}

export interface NormalizedReport {
  summary: ReportSummaryItem[]
  chartRows: ReportChartRow[]
  tableRows: ReportTableRow[]
}

type RawReportData = Record<string, any> | null | undefined

export function normalizeReportResult(type: ReportType, results: RawReportData): NormalizedReport {
  const data = results ?? {}

  switch (type) {
    case 'revenue':
      return normalizeRevenue(data)
    case 'lab_tat':
    case 'lab_turnaround':
      return normalizeLabTurnaround(data)
    case 'appointments':
    case 'appointment_analytics':
      return normalizeAppointments(data)
    case 'inventory_valuation':
      return normalizeInventory(data)
    case 'daily_census':
    default:
      return normalizeDailyCensus(data)
  }
}

function normalizeRevenue(data: Record<string, any>): NormalizedReport {
  const groups = Array.isArray(data.by_status) ? data.by_status : []

  return {
    summary: [
      { label: 'Revenue', value: money(data.total), helper: 'Paid and partial transactions', tone: 'success' },
      { label: 'Statuses', value: String(groups.length), helper: 'Transaction status groups', tone: 'primary' },
    ],
    chartRows: groups.map((group) => ({
      label: title(group.status),
      value: number(group.total),
      detail: `${number(group.count)} transactions`,
      tone: statusTone(group.status),
    })),
    tableRows: groups.map((group) => ({
      label: title(group.status),
      value: money(group.total),
      detail: `${number(group.count)} transactions`,
    })),
  }
}

function normalizeDailyCensus(data: Record<string, any>): NormalizedReport {
  const rows = [
    row('Patients', number(data.patients), 'Registered patients', 'primary'),
    row('Encounters', number(data.encounters), 'Clinical encounters', 'success'),
    row('Appointments', number(data.appointments), 'Scheduled visits', 'warning'),
  ]

  return fromRows(rows)
}

function normalizeLabTurnaround(data: Record<string, any>): NormalizedReport {
  const rows = [
    row('Total requests', number(data.total_requests), 'Lab requests in scope', 'primary'),
    row('Critical', number(data.critical), 'Critical result flags', 'danger'),
  ]

  return fromRows(rows)
}

function normalizeAppointments(data: Record<string, any>): NormalizedReport {
  const rows = [
    row('Total appointments', number(data.total), 'Booked visits', 'primary'),
    row('No-show', number(data.no_show), 'Patients who missed visits', 'warning'),
    row('Cancelled', number(data.cancelled), 'Cancelled visits', 'danger'),
  ]

  return fromRows(rows)
}

function normalizeInventory(data: Record<string, any>): NormalizedReport {
  return {
    summary: [
      { label: 'Items', value: String(number(data.items)), helper: 'Inventory SKUs', tone: 'primary' },
      { label: 'Stock value', value: money(data.stock_value), helper: 'Current stock cost', tone: 'success' },
      { label: 'Near expiry', value: String(number(data.near_expiry)), helper: 'Expiring within 90 days', tone: 'warning' },
    ],
    chartRows: [
      { label: 'Items', value: number(data.items), detail: 'Inventory SKUs', tone: 'primary' },
      { label: 'Near expiry', value: number(data.near_expiry), detail: 'Expiring within 90 days', tone: 'warning' },
    ],
    tableRows: [
      { label: 'Items', value: String(number(data.items)), detail: 'Inventory SKUs' },
      { label: 'Stock value', value: money(data.stock_value), detail: 'Current stock cost' },
      { label: 'Near expiry', value: String(number(data.near_expiry)), detail: 'Expiring within 90 days' },
    ],
  }
}

function fromRows(rows: ReturnType<typeof row>[]): NormalizedReport {
  return {
    summary: rows.map(({ label, value, detail, tone }) => ({
      label,
      value: String(value),
      helper: detail,
      tone,
    })),
    chartRows: rows,
    tableRows: rows.map(({ label, value, detail }) => ({
      label,
      value: String(value),
      detail,
    })),
  }
}

function row(label: string, value: number, detail: string, tone: ReportTone): ReportChartRow {
  return { label, value, detail, tone }
}

function number(value: unknown): number {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

function money(value: unknown): string {
  return `PHP ${number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function title(value: unknown): string {
  return String(value ?? 'Unknown')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function statusTone(status: unknown): ReportTone {
  switch (String(status ?? '').toUpperCase()) {
    case 'PAID':
      return 'success'
    case 'PARTIAL':
      return 'warning'
    case 'VOIDED':
      return 'danger'
    default:
      return 'primary'
  }
}
