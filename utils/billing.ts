import type { BillingLineItem, BillingProcessPaymentForm, BillingQuickOrderForm, BillingStatus, Patient, PaymentModeRecord } from '~/types'

export interface BillingTotals {
  subtotal: number
  discountTotal: number
  vatAmount: number
  grandTotal: number
  amountPaid: number
  balance: number
  changeAmount: number
}

export function blankBillingLineItem(): BillingLineItem {
  return { description: '', quantity: 1, unit_price: 0, discount: 0, total: 0 }
}

export function lineTotal(item: BillingLineItem): number {
  return Math.max(0, toNumber(item.quantity) * toNumber(item.unit_price))
}

export function calculateBillingTotals(form: Pick<BillingQuickOrderForm, 'line_items' | 'amount_paid' | 'vat_amount' | 'discount_total'>): BillingTotals {
  const subtotal = form.line_items.reduce((sum, item) => sum + (toNumber(item.quantity) * toNumber(item.unit_price)), 0)
  const discountTotal = Math.min(Math.max(0, toNumber(form.discount_total)), subtotal + toNumber(form.vat_amount))
  const vatAmount = toNumber(form.vat_amount)
  const grandTotal = Math.max(0, subtotal - discountTotal + vatAmount)
  const amountPaid = toNumber(form.amount_paid)

  return {
    subtotal,
    discountTotal,
    vatAmount,
    grandTotal,
    amountPaid,
    balance: Math.max(0, grandTotal - amountPaid),
    changeAmount: Math.max(0, amountPaid - grandTotal),
  }
}

export function billingStatusPreview(totals: Pick<BillingTotals, 'grandTotal' | 'amountPaid' | 'balance'>): BillingStatus {
  if (totals.amountPaid <= 0 && totals.grandTotal > 0) {
    return 'PENDING'
  }

  if (totals.balance > 0) {
    return 'PARTIAL'
  }

  return 'PAID'
}

export function buildBillingPayload(form: BillingQuickOrderForm, paymentModes: PaymentModeRecord[] = []): BillingQuickOrderForm {
  const lineItems = form.line_items
    .map((item) => ({
      ...item,
      description: item.description.trim(),
      quantity: toNumber(item.quantity),
      unit_price: toNumber(item.unit_price),
      discount: 0,
      total: lineTotal(item),
    }))
    .filter((item) => item.description.length > 0)

  const totals = calculateBillingTotals({
    ...form,
    line_items: lineItems,
  })

  const hasPayment = totals.amountPaid > 0
  const selectedMode = hasPayment ? form.payment_mode : undefined
  const requiresReference = paymentModeRequiresReference(selectedMode, paymentModes)

  return {
    patient_id: form.patient_id,
    encounter_id: optionalId(form.encounter_id),
    payment_mode: selectedMode,
    amount_paid: totals.amountPaid,
    vat_amount: totals.vatAmount,
    or_number: requiresReference ? optionalString(form.or_number) : undefined,
    payee_name: hasPayment ? optionalString(form.payee_name) : undefined,
    payee_address: hasPayment ? optionalString(form.payee_address) : undefined,
    line_items: lineItems,
    subtotal: totals.subtotal,
    discount_total: totals.discountTotal,
    grand_total: totals.grandTotal,
    balance: totals.balance,
    change_amount: totals.changeAmount,
    status: billingStatusPreview(totals),
  }
}

export function buildProcessPaymentPayload(form: BillingProcessPaymentForm, paymentModes: PaymentModeRecord[] = []): BillingProcessPaymentForm {
  const requiresReference = paymentModeRequiresReference(form.payment_mode, paymentModes)

  return {
    payment_amount: toNumber(form.payment_amount),
    or_number: requiresReference ? optionalString(form.or_number) : undefined,
    payee_name: form.payee_name.trim(),
    payee_address: optionalString(form.payee_address),
    payment_mode: form.payment_mode,
  }
}

export function defaultPayeeName(patient?: Patient | null): string {
  if (!patient) {
    return ''
  }

  return patient.full_name || [patient.first_name, patient.middle_name, patient.last_name].filter(Boolean).join(' ')
}

export function defaultPayeeAddress(patient?: Patient | null): string {
  if (!patient?.address) {
    return ''
  }

  return [
    patient.address.street,
    patient.address.city,
    patient.address.province,
    patient.address.country,
  ].filter(Boolean).join(', ')
}

export function toNumber(value: unknown): number {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

function optionalString(value?: string): string | undefined {
  const trimmed = value?.trim() ?? ''
  return trimmed.length > 0 ? trimmed : undefined
}

function optionalId(value?: string | number): string | number | undefined {
  if (typeof value === 'number') {
    return value
  }

  return optionalString(value)
}

export function paymentModeRequiresReference(code: string | undefined, paymentModes: PaymentModeRecord[] = []): boolean {
  return paymentModes.find((mode) => mode.code === code)?.add_reference_number ?? false
}
