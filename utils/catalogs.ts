import type { LibraryForm, LibraryKey } from '~/types'

export interface CatalogTab {
  key: LibraryKey | 'vat_rates' | 'pharmacy_inventory' | 'payment_modes'
  label: string
}

const librarySegments: Record<LibraryKey, string> = {
  appointment_type: 'appointment-types',
  encounter_type: 'encounter-types',
  lab_procedure: 'lab-procedures',
  imaging_procedure: 'imaging-procedures',
}

export const libraryTabs: CatalogTab[] = [
  { key: 'appointment_type', label: 'Appointment types' },
  { key: 'encounter_type', label: 'Encounter types' },
  { key: 'lab_procedure', label: 'Lab procedures' },
  { key: 'imaging_procedure', label: 'Imaging procedures' },
]

export function catalogPath(library: LibraryKey, suffix = ''): string {
  const path = `/settings/catalogs/${librarySegments[library]}`
  return suffix ? `${path}/${suffix}` : path
}

export function catalogTabsForRoles(roles: string[]): CatalogTab[] {
  const canManage = roles.includes('admin') || roles.includes('super_admin')
  if (!canManage) {
    return []
  }

  return [
    ...libraryTabs,
    { key: 'vat_rates', label: 'VAT rates' },
    { key: 'pharmacy_inventory', label: 'Pharmacy inventory' },
    ...(roles.includes('super_admin') ? [{ key: 'payment_modes', label: 'Global payment modes' } satisfies CatalogTab] : []),
  ]
}

export function suggestLibraryCode(name: string): string {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 50)
}

export function normalizeLibraryForm(form: LibraryForm): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    code: suggestLibraryCode(form.code),
    name: form.name.trim(),
    description: form.description?.trim() ?? '',
    price: Number(form.price || 0),
    sort_order: Number(form.sort_order || 0),
    is_active: Boolean(form.is_active),
  }

  if (form.library === 'lab_procedure') {
    payload.loinc_code = form.metadata.loinc_code ?? ''
    payload.specimen_type = form.metadata.specimen_type ?? ''
    payload.panel_items = form.metadata.panel_items ?? []
  }

  if (form.library === 'imaging_procedure') {
    payload.modality = form.metadata.modality ?? ''
    payload.body_part = form.metadata.body_part ?? ''
  }

  return payload
}
