import type { PrintableDocument, PrintableField, PrintableLineItem } from '~/types'

export function printableSubtitle(document: PrintableDocument): string {
  return [document.facility.branch_name, document.facility.address, document.facility.contact_number]
    .filter(Boolean)
    .join(' | ')
}

export function printableLineItemColumns(items: PrintableLineItem[]): PrintableField[] {
  const keys = new Set<string>()

  items.forEach((item) => {
    Object.entries(item).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        keys.add(key)
      }
    })
  })

  return Array.from(keys).map((key) => ({
    label: labelize(key),
    value: key,
  }))
}

export function printableValue(value: unknown): string {
  if (value === undefined || value === null || value === '') return '-'
  if (typeof value === 'number') return Number.isInteger(value) ? String(value) : value.toFixed(2)
  return String(value)
}

function labelize(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())
}
