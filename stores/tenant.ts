import { defineStore } from 'pinia'
import type { Tenant } from '~/types'

interface State {
  currentTenant: Tenant | null
  tenants: Tenant[]
  loading: boolean
}

export const useTenantStore = defineStore('tenant', {
  state: (): State => ({
    currentTenant: null,
    tenants: [],
    loading: false,
  }),
  actions: {
    setTenant(tenant: Tenant) {
      this.currentTenant = tenant
    },
    setTenants(tenants: Tenant[]) {
      this.tenants = tenants
    },
    clearTenant() {
      this.currentTenant = null
    },
  },
  persist: true,
})