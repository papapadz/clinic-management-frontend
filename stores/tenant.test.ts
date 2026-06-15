import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTenantStore } from './tenant'

describe('useTenantStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('stores default clinic branding from clinic profile responses', () => {
    const tenantStore = useTenantStore()

    tenantStore.setTenant({
      id: 'tenant-1',
      name: 'Acme Health Group',
      slug: 'clinic-one',
      is_active: true,
      created_at: '2026-06-09T00:00:00.000Z',
    })
    tenantStore.setClinicProfile({
      tenant: {
        id: 'tenant-1',
        name: 'Acme Health Network',
        slug: 'clinic-one',
        status: 'active',
      },
      default_clinic: {
        id: 7,
        name: 'Main Branch',
        logo_url: '/storage/logo.png',
        theme: { primary: '#0F766E', secondary: '#F8FAFC', accent: '#F59E0B' },
      },
    })

    expect(tenantStore.currentTenant?.name).toBe('Acme Health Network')
    expect(tenantStore.defaultClinic?.name).toBe('Main Branch')
    expect(tenantStore.defaultClinic?.theme?.primary).toBe('#0F766E')
  })

  it('clears default clinic branding with the tenant', () => {
    const tenantStore = useTenantStore()

    tenantStore.setClinicProfile({
      tenant: { id: 'tenant-1', name: 'Acme', slug: 'clinic-one', status: 'active' },
      default_clinic: { id: 7, name: 'Main Branch' },
    })
    tenantStore.clearTenant()

    expect(tenantStore.currentTenant).toBeNull()
    expect(tenantStore.defaultClinic).toBeNull()
  })
})
