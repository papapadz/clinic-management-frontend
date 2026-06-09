import { describe, expect, it } from 'vitest'
import {
  buildPharmacyDispensePayload,
  patientIdentity,
  staffIdentity,
} from './clinicalDisplay'

describe('clinical display helpers', () => {
  it('renders patient hospital number and name together', () => {
    expect(patientIdentity({
      patient_code: 'HN-000001',
      full_name: 'Juan Dela Cruz',
    })).toBe('HN-000001 - Juan Dela Cruz')
  })

  it('renders staff employee ID and canonical staff name together', () => {
    expect(staffIdentity({
      name: 'Clara Reyes',
      person_affiliation: { employee_id: 'EMP-DR-001' },
    })).toBe('EMP-DR-001 - Clara Reyes')
  })

  it('builds pharmacy dispense payload with requesting doctor and item totals', () => {
    expect(buildPharmacyDispensePayload({
      patient_id: '10',
      encounter_id: '',
      requesting_clinician_id: '20',
      pharmacist_id: '30',
      notes: 'After meals',
      items: [
        { item_id: '1', quantity: 2, unit_price: 5 },
        { item_id: '2', quantity: 3, unit_price: 4 },
      ],
    })).toEqual({
      patient_id: '10',
      requesting_clinician_id: '20',
      pharmacist_id: '30',
      notes: 'After meals',
      items: [
        { item_id: '1', quantity: 2, unit_price: 5 },
        { item_id: '2', quantity: 3, unit_price: 4 },
      ],
      total_amount: 22,
    })
  })
})
