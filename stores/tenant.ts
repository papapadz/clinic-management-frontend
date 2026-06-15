import { defineStore } from 'pinia'
import type { ClinicProfileResponse, DefaultClinicProfile, Tenant } from '~/types'

interface State {
  currentTenant: Tenant | null
  defaultClinic: DefaultClinicProfile | null
  tenants: Tenant[]
  loading: boolean
}

export const useTenantStore = defineStore('tenant', {
  state: (): State => ({
    currentTenant: null,
    defaultClinic: null,
    tenants: [],
    loading: false,
  }),
  actions: {
    setTenant(tenant: Tenant) {
      this.currentTenant = tenant
    },
    setClinicProfile(profile: ClinicProfileResponse) {
      this.currentTenant = {
        ...(this.currentTenant ?? {
          id: profile.tenant.id,
          name: profile.tenant.name,
          slug: profile.tenant.slug,
          is_active: profile.tenant.status === 'active',
          created_at: '',
        }),
        id: profile.tenant.id,
        name: profile.tenant.name,
        slug: profile.tenant.slug,
        is_active: profile.tenant.status === 'active',
      }
      this.defaultClinic = profile.default_clinic
    },
    setTenants(tenants: Tenant[]) {
      this.tenants = tenants
    },
    clearTenant() {
      this.currentTenant = null
      this.defaultClinic = null
    },
  },
  persist: true,
})
