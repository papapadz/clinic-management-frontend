export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const successStatuses = new Set([
  'ACTIVE',
  'PAID',
  'COMPLETED',
  'RESULTED',
  'VALIDATED',
  'RELEASED',
  'CONFIRMED',
  'RESTOCK',
])

const warningStatuses = new Set([
  'PENDING',
  'PARTIAL',
  'REQUESTED',
  'COLLECTED',
  'IN_PROGRESS',
  'SCHEDULED',
  'URGENT',
  'DISPENSING',
  'ADJUSTMENT',
])

const dangerStatuses = new Set([
  'INACTIVE',
  'VOIDED',
  'REFUNDED',
  'CANCELLED',
  'NO_SHOW',
  'STAT',
  'WASTE',
])

const infoStatuses = new Set([
  'CHECKED_IN',
  'ROUTINE',
  'RETURN',
])

export function normalizeStatus(value?: string | boolean | null): string {
  if (typeof value === 'boolean') {
    return value ? 'Active' : 'Inactive'
  }

  if (!value) {
    return 'Unknown'
  }

  return String(value)
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
}

export function getStatusTone(value?: string | boolean | null): StatusTone {
  const key = typeof value === 'boolean'
    ? value ? 'ACTIVE' : 'INACTIVE'
    : String(value ?? '').trim().toUpperCase()

  if (successStatuses.has(key)) {
    return 'success'
  }

  if (warningStatuses.has(key)) {
    return 'warning'
  }

  if (dangerStatuses.has(key)) {
    return 'danger'
  }

  if (infoStatuses.has(key)) {
    return 'info'
  }

  return 'neutral'
}
