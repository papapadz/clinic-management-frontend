import { describe, expect, it } from 'vitest'
import type { BillingQuickOrderForm, PaymentModeRecord } from '~/types'
import {
  billingStatusPreview,
  buildProcessPaymentPayload,
  buildBillingPayload,
  calculateBillingTotals,
  defaultPayeeAddress,
  defaultPayeeName,
  lineTotal,
} from './billing'

describe('billing helpers', () => {
  const paymentModes: PaymentModeRecord[] = [
    { code: 'CASH', name: 'Cash', add_reference_number: false, is_active: true, sort_order: 10 },
    { code: 'GCASH', name: 'GCash', add_reference_number: true, is_active: true, sort_order: 30 },
  ]

  it('calculates line totals and aggregate bill totals with a bill-level discount', () => {
    const form: BillingQuickOrderForm = {
      patient_id: '42',
      encounter_id: '',
      payment_mode: 'CASH',
      amount_paid: 500,
      vat_amount: 30,
      line_items: [
        { description: 'Consultation', quantity: 1, unit_price: 700, discount: 100, total: 0 },
        { description: 'Nebulization', quantity: 2, unit_price: 250, discount: 50, total: 0 },
      ],
      discount_total: 150,
    }

    expect(lineTotal(form.line_items[0])).toBe(700)
    expect(calculateBillingTotals(form)).toEqual({
      subtotal: 1200,
      discountTotal: 150,
      vatAmount: 30,
      grandTotal: 1080,
      amountPaid: 500,
      balance: 580,
      changeAmount: 0,
    })
    expect(billingStatusPreview(calculateBillingTotals(form))).toBe('PARTIAL')
  })

  it('marks unpaid, fully paid, and overpaid totals with stable status previews', () => {
    expect(billingStatusPreview({ grandTotal: 750, amountPaid: 0, balance: 750 })).toBe('PENDING')
    expect(billingStatusPreview({ grandTotal: 750, amountPaid: 750, balance: 0 })).toBe('PAID')
    expect(billingStatusPreview({ grandTotal: 750, amountPaid: 1000, balance: 0 })).toBe('PAID')
  })

  it('builds a backend payload with clean optional fields and computed totals', () => {
    const payload = buildBillingPayload({
      patient_id: '42',
      encounter_id: '',
      payment_mode: 'GCASH',
      amount_paid: 1000,
      vat_amount: 0,
      or_number: ' OR-1001 ',
      line_items: [
        { description: ' Consultation ', quantity: 1, unit_price: 600, discount: 25, total: 0 },
        { description: '   ', quantity: 1, unit_price: 999, discount: 0, total: 0 },
      ],
      discount_total: 50,
    }, paymentModes)

    expect(payload).toEqual({
      patient_id: '42',
      encounter_id: undefined,
      payment_mode: 'GCASH',
      amount_paid: 1000,
      vat_amount: 0,
      or_number: 'OR-1001',
      line_items: [
        { description: 'Consultation', quantity: 1, unit_price: 600, discount: 0, total: 600 },
      ],
      subtotal: 600,
      discount_total: 50,
      grand_total: 550,
      balance: 0,
      change_amount: 450,
      status: 'PAID',
    })
  })

  it('clears payment details for unpaid bills and non-reference payment modes', () => {
    expect(buildBillingPayload({
      patient_id: '42',
      payment_mode: 'CASH',
      amount_paid: 0,
      or_number: 'STALE',
      payee_name: 'Payee',
      payee_address: 'Address',
      line_items: [{ description: 'Consultation', quantity: 1, unit_price: 600, discount: 0, total: 0 }],
    }, paymentModes)).toMatchObject({
      payment_mode: undefined,
      or_number: undefined,
      payee_name: undefined,
      payee_address: undefined,
      status: 'PENDING',
    })

    expect(buildBillingPayload({
      patient_id: '42',
      payment_mode: 'CASH',
      amount_paid: 600,
      or_number: 'STALE',
      payee_name: 'Payee',
      payee_address: 'Address',
      line_items: [{ description: 'Consultation', quantity: 1, unit_price: 600, discount: 0, total: 0 }],
    }, paymentModes)).toMatchObject({
      payment_mode: 'CASH',
      or_number: undefined,
      payee_name: 'Payee',
      payee_address: 'Address',
    })
  })

  it('defaults process payee details from the transaction patient', () => {
    const patient = {
      id: '42',
      patient_code: 'DEMO-000001',
      first_name: 'Juan',
      middle_name: 'Santos',
      last_name: 'Dela Cruz',
      full_name: 'Juan Santos Dela Cruz',
      dob: '1988-04-12',
      gender: 'Male' as const,
      address: { street: '123 Mabini Street', city: 'Manila', province: 'NCR', country: 'Philippines' },
      is_active: true,
      registered_at: '2026-06-02T00:00:00Z',
      created_at: '2026-06-02T00:00:00Z',
      updated_at: '2026-06-02T00:00:00Z',
    }

    expect(defaultPayeeName(patient)).toBe('Juan Santos Dela Cruz')
    expect(defaultPayeeAddress(patient)).toBe('123 Mabini Street, Manila, NCR, Philippines')
  })

  it('builds a clean process payment payload', () => {
    expect(buildProcessPaymentPayload({
      payment_amount: '400',
      or_number: ' OR-1001 ',
      payee_name: ' Juan Santos Dela Cruz ',
      payee_address: ' 123 Mabini Street ',
      payment_mode: 'GCASH',
    }, paymentModes)).toEqual({
      payment_amount: 400,
      or_number: 'OR-1001',
      payee_name: 'Juan Santos Dela Cruz',
      payee_address: '123 Mabini Street',
      payment_mode: 'GCASH',
    })

    expect(buildProcessPaymentPayload({
      payment_amount: '400',
      or_number: 'STALE',
      payee_name: ' Juan Santos Dela Cruz ',
      payee_address: ' 123 Mabini Street ',
      payment_mode: 'CASH',
    }, paymentModes)).toEqual({
      payment_amount: 400,
      or_number: undefined,
      payee_name: 'Juan Santos Dela Cruz',
      payee_address: '123 Mabini Street',
      payment_mode: 'CASH',
    })
  })
})
