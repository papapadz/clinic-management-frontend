import { describe, expect, it } from 'vitest'
import {
  catalogPath,
  catalogTabsForRoles,
  normalizeLibraryForm,
  suggestLibraryCode,
} from './catalogs'

describe('catalog helpers', () => {
  it('builds tenant catalog collection paths', () => {
    expect(catalogPath('lab_procedure')).toBe('/settings/catalogs/lab-procedures')
    expect(catalogPath('imaging_procedure', 'options')).toBe('/settings/catalogs/imaging-procedures/options')
  })

  it('shows global payment modes only to super admins', () => {
    expect(catalogTabsForRoles(['admin']).map((tab) => tab.key)).toContain('vat_rates')
    expect(catalogTabsForRoles(['admin']).map((tab) => tab.key)).not.toContain('payment_modes')
    expect(catalogTabsForRoles(['super_admin']).map((tab) => tab.key)).toContain('payment_modes')
  })

  it('normalizes library forms into API payloads', () => {
    expect(normalizeLibraryForm({
      library: 'imaging_procedure',
      code: 'chest xray',
      name: 'Chest X-ray',
      price: '250.50',
      sort_order: '20',
      is_active: true,
      metadata: { modality: 'XRAY', body_part: 'Chest' },
    })).toEqual({
      code: 'CHEST_XRAY',
      name: 'Chest X-ray',
      description: '',
      price: 250.5,
      sort_order: 20,
      is_active: true,
      modality: 'XRAY',
      body_part: 'Chest',
    })
  })

  it('suggests uppercase underscore codes from names', () => {
    expect(suggestLibraryCode('Follow-up visit')).toBe('FOLLOW_UP_VISIT')
  })
})
