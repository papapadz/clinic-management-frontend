import { describe, expect, it } from 'vitest'
import type { EncounterSummary } from '~/types'
import {
  buildActivityCategories,
  buildAppointmentPayload,
  createBlankAppointmentQuickOrderForm,
} from './encounterQuickOrders'

const summary = {
  patient: { id: 'patient-1' },
  clinician: { id: 42 },
  appointment: { id: 'appt-1', appointment_type: 'Follow up', appointment_date: '2026-06-15', time_slot: '9:00 AM', status: 'SCHEDULED' },
  lab_requests: [
    { id: 'lab-1', test_panels: [{ name: 'CBC' }], priority: 'STAT', status: 'REQUESTED' },
  ],
  imaging_requests: [
    { id: 'img-1', modality: 'XRAY', body_part: 'Chest', priority: 'ROUTINE', status: 'REQUESTED' },
  ],
  pharmacy_transactions: [
    { id: 'rx-1', transaction_type: 'DISPENSING', total_amount: 120, items: [{ item_id: 'med-1', quantity: 2 }] },
  ],
  billing_transactions: [
    { id: 'bill-1', transaction_number: 'BILL-001', status: 'PENDING', grand_total: 500 },
  ],
  medical_records: [
    { id: 'record-1', record_type: 'ENCOUNTER', file_name: 'note.pdf', is_released: false },
  ],
} as unknown as EncounterSummary

describe('encounter quick order helpers', () => {
  it('builds a scheduled appointment payload from the encounter patient and clinician', () => {
    const form = createBlankAppointmentQuickOrderForm()
    form.appointment_date = '2026-06-15'
    form.time_slot = '9:00 AM'
    form.appointment_type_code = 'FOLLOW_UP'
    form.reason = ' Blood pressure review '
    form.notes = ' Bring logbook '

    expect(buildAppointmentPayload(summary, form)).toEqual({
      patient_id: 'patient-1',
      clinician_id: 42,
      appointment_date: '2026-06-15',
      time_slot: '9:00 AM',
      appointment_type: '',
      appointment_type_code: 'FOLLOW_UP',
      reason: 'Blood pressure review',
      notes: 'Bring logbook',
      status: 'SCHEDULED',
    })
  })

  it('requires appointment date before creating the payload', () => {
    expect(() => buildAppointmentPayload(summary, createBlankAppointmentQuickOrderForm())).toThrow('Appointment date is required.')
  })

  it('omits clinician_id when the encounter has no clinician', () => {
    const form = createBlankAppointmentQuickOrderForm()
    form.appointment_date = '2026-06-15'

    expect(buildAppointmentPayload({ ...summary, clinician: null }, form)).toEqual({
      patient_id: 'patient-1',
      appointment_date: '2026-06-15',
      time_slot: '',
      appointment_type: '',
      appointment_type_code: '',
      reason: undefined,
      notes: undefined,
      status: 'SCHEDULED',
    })
  })

  it('maps all linked activity categories to summary arrays and compact details', () => {
    const categories = buildActivityCategories(summary)

    expect(categories.map((category) => category.name)).toEqual(['Appointment', 'Lab', 'Imaging', 'Pharmacy', 'Billing', 'Records'])
    expect(categories.map((category) => category.count)).toEqual([1, 1, 1, 1, 1, 1])
    expect(categories.map((category) => category.emptyMessage)).toEqual([
      'No Appointment activity',
      'No Lab activity',
      'No Imaging activity',
      'No Pharmacy activity',
      'No Billing activity',
      'No Records activity',
    ])
    expect(categories.map((category) => category.items[0])).toEqual([
      { title: 'Follow up - 2026-06-15', detail: '9:00 AM - SCHEDULED', print: { kind: 'appointment', id: 'appt-1', label: 'Print appointment' } },
      { title: 'CBC', detail: 'STAT - REQUESTED', print: { kind: 'lab', id: 'lab-1', label: 'Print lab request' } },
      { title: 'XRAY Chest', detail: 'ROUTINE - REQUESTED', print: { kind: 'imaging', id: 'img-1', label: 'Print imaging request' } },
      { title: 'med-1 x 2', detail: 'DISPENSING - PHP 120.00', print: { kind: 'pharmacy', id: 'rx-1', label: 'Print dispensing slip' } },
      { title: 'BILL-001', detail: 'PENDING - PHP 500.00', print: { kind: 'billing', id: 'bill-1', label: 'Print invoice' } },
      { title: 'note.pdf', detail: 'ENCOUNTER - Unreleased' },
    ])
  })
})
