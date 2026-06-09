import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from './auth'
import type { AuthTokenResponse } from '~/types'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('normalizes role and permission objects to name strings', () => {
    const auth = useAuthStore()

    auth.setAuth({
      token: 'token',
      expires_at: '2026-05-26T00:00:00.000Z',
      user: {
        id: '1',
        name: 'Demo Admin',
        email: 'admin@example.com',
        tenant_id: 'tenant-1',
        roles: [{ name: 'admin' }, { guard_name: 'web' }, 'clinician'],
        permissions: [{ name: 'patients.viewAny' }, '', 'reports.view'],
      },
    } as unknown as AuthTokenResponse)

    expect(auth.user?.roles).toEqual(['admin', 'clinician'])
    expect(auth.user?.permissions).toEqual(['patients.viewAny', 'reports.view'])
  })

  it('prefers top-level role and permission name arrays from the login response', () => {
    const auth = useAuthStore()

    auth.setAuth({
      token: 'token',
      expires_at: '2026-05-26T00:00:00.000Z',
      user: {
        id: '1',
        name: 'Demo Admin',
        email: 'admin@example.com',
        tenant_id: 'tenant-1',
        roles: [{ name: 'legacy_role' }],
        permissions: [{ name: 'legacy.permission' }],
      },
      roles: ['admin'],
      permissions: ['patients.viewAny'],
    } as unknown as AuthTokenResponse)

    expect(auth.user?.roles).toEqual(['admin'])
    expect(auth.user?.permissions).toEqual(['patients.viewAny'])
  })
})
