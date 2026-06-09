import { describe, expect, it } from 'vitest'
import { printableLineItemColumns, printableSubtitle, printableValue } from './printableDocument'
import type { PrintableDocument } from '~/types'

describe('printableDocument utilities', () => {
  it('builds a readable tenant and branch subtitle', () => {
    const document = {
      facility: {
        tenant_name: 'Acme Health Group',
        branch_name: 'Main Branch',
        address: '123 Mabini Street',
        contact_number: '02-555-0100',
      },
    } as PrintableDocument

    expect(printableSubtitle(document)).toBe('Main Branch | 123 Mabini Street | 02-555-0100')
  })

  it('derives line item columns from populated item keys', () => {
    expect(printableLineItemColumns([
      { description: 'Consultation', quantity: 1, unit_price: 500, empty: '' },
    ])).toEqual([
      { label: 'Description', value: 'description' },
      { label: 'Quantity', value: 'quantity' },
      { label: 'Unit Price', value: 'unit_price' },
    ])
  })

  it('formats blank, integer, and decimal values for print cells', () => {
    expect(printableValue(null)).toBe('-')
    expect(printableValue(10)).toBe('10')
    expect(printableValue(10.5)).toBe('10.50')
  })
})
